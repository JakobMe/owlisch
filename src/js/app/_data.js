/**
 * Lädt und verwaltet alle benötigten Daten für die App, bereitet die
 * Daten aus den Wörterbuch-Dateien auf, kann sie per Mediator an andere
 * Module senden und speichert über den Mediator empfangene Daten im
 * LocalStorage des Browsers.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @requires Util
 * @requires Mediator
 * @module Data
 */
var Data = (function() {
    
    // Selektor-Konstanten
    var _SEL_DELETE             = "[data-data='delete']";
    
    // Sonstige Konstanten
    var _CONFIRM_TRUE           = 1;
    
    // Private Variablen
    var _dictionaryAlias        = "";
    var _dictionaryCaption      = "";
    var _dataScores             = [];
    var _dataTerms              = [];
    var _dataConfig             = [];
    var _dataProgress           = {};
    var _dataFeatured           = {};
    var _dataDictionaries       = {};
    var _sizeScores             = 0;
    var _sizeTerms              = 0;
    var _sizeProgress           = 0;
    
    /**
     * Initialisiert das Data-Modul; bindet Events, abonniert den Mediator
     * und lädt alle benötigten Daten aus Dateien und dem LocalStorage,
     * indem andere Funktionen ausgeführt werden.
     * @access public
     * @function init
     */
    function init() {
        _bindEvents();
        _subMediator();
        _loadDataConfig();
        _loadDataStored();
    }
    
    /**
     * Abonniert interne Funktionen beim Mediator.
     * @access private
     * @function _subMediator
     */
    function _subMediator() {
        Mediator.sub(CFG.CNL.TERMS_REQUEST, _serveDataTerms)
                .sub(CFG.CNL.TERMS_UPDATE, _updateDataTerm)
                .sub(CFG.CNL.SCORES_REQUEST, _serveDataScores)
                .sub(CFG.CNL.SCORES_UPDATE, _updateDataScore)
                .sub(CFG.CNL.CONFIG_REQUEST, _serveDataConfig)
                .sub(CFG.CNL.FEATURED_REQUEST, _serveDataFeatured)
                .sub(CFG.CNL.DICTIONARY_REQUEST, _serveDataDictionaries);
    }
    
    /**
     * Bindet Funktionen an Events.
     * @access private
     * @function _bindEvents
     */
    function _bindEvents() {
        $(document).on(CFG.EVT.CLICK, _SEL_DELETE, _clearConfirm);
    }
    
    /**
     * Erstellt einen leeren Standard-Datensatz im LocalStorage.
     * @access private
     * @function _initDataStored
     */
    function _initDataStored() {
        var dataInitial = { dictionary: CFG.DATA.DEFAULT };
        dataInitial[CFG.DATA.DEFAULT] = {
            featured : {},
            progress : {},
            scores   : []
        };
        localStorage.setItem(CFG.DATA.STORE, JSON.stringify(dataInitial));
        _loadDataStored();
    }
    
    /**
     * Lädt alle gespeicherten Daten für das aktuelle Wörterbuch aus dem
     * LocalStorage; ruft _initDataStored auf, falls noch keine Daten
     * vorhanden sind.
     * @access private
     * @function _loadDataStored
     */
    function _loadDataStored() {
        
        // Daten aus dem LocalStorage laden
        var dataStored = JSON.parse(localStorage.getItem(CFG.DATA.STORE));
        if (dataStored === null) { _initDataStored(); return false; }
        
        // Daten setzen
        _dictionaryAlias = dataStored.dictionary;
        _dataProgress = dataStored[_dictionaryAlias].progress;
        _dataFeatured = dataStored[_dictionaryAlias].featured;
        _dataScores = dataStored[_dictionaryAlias].scores;
        _sizeScores = _dataScores.length;
        
        // Wörterbuch-Daten laden
        _loadDataTerms();
    }

    /**
     * Lädt die Datei mit der Konfiguration für die verfügbaren
     * Wörterbücher und den Einstellungen für das Quiz;
     * stellt die Daten per Mediator bereit.
     * @access private
     * @function _loadDataConfig
     */
    function _loadDataConfig() {
        
        // Pfad zur Config-Datei zusammensetzen
        var file = CFG.DATA.PATH_DATA + CFG.DATA.CONFIG + CFG.DATA.TYPE_DATA;
        
        // AJAX-Anfrage zur Config-Datei, anschließend Daten bereitstellen
        $.getJSON(file, function(data) {
            _dataDictionaries = data.dictionaries;
            _dataConfig = data.config;
        }).done(function() {
            _serveDataDictionaries();
            _serveDataConfig();
        });
    }
    
    /**
     * Lädt die Datei zum eingestellten Wörterbuch und speichert die Daten in
     * einer lokalen Variable; ruft weitere Funktionen auf, um die geladenen
     * Daten aufzubereiten.
     * @access private
     * @function _loadDataTerms
     */
    function _loadDataTerms() {
        
        // Pfad zur Wörterbuch-Datei zusammensetzen
        var file = CFG.DATA.PATH_DATA + _dictionaryAlias +
                   CFG.DATA.PATH_DELIMITER + _dictionaryAlias +
                   CFG.DATA.TYPE_DATA;
        
        // AJAX Get-Anfrage zur Datei, im Anschluss Dateien prüfen
        $.getJSON(file, function(data) {
            if ((typeof data.caption === typeof "") &&
                $.isArray(data.terms)) {
                _dictionaryCaption = data.caption;
                _dataTerms  = data.terms;
                _sizeTerms  = data.terms.length;
            }
        }).done(function() {
            _checkDictionaryFiles();
            _updateDataFeatured();
        });
    }
    
    /**
     * Überprüft die Existenz einer gegebenen Datei, indem eine
     * Ajax-Head-Anfrage zur Dateipfad gemacht wird.
     * @access private
     * @param {String} file Pfad zur Datei
     * @returns {Object} Ajax-Antwort
     * @function _checkFile
     */
    function _checkFile(file) {
        return $.ajax({
            url  : file,
            type : CFG.AJAX.HEAD
        });
    }
    
    /**
     * Prüft mittels Ajax-Anfragen per _checkFile, ob ein Begriff mit gegebenem
     * Alias über Audio- und/oder Bild-Dateien verfügt; erweitert die internen
     * Wörterbuch-Daten um den Datei-Status.
     * @access private
     * @param {String} alias Alias des Begriffes
     * @returns {Object} Ajax-Objekte der Anfragen für Audio- und Bild-Dateien
     * @function _checkTermFiles
     */
    function _checkTermFiles(alias) {
        if (typeof alias === typeof "") {
        
            // Pfade zusammensetzen, Datei-Status initialisieren
            var pathData  = CFG.DATA.PATH_DATA + _dictionaryAlias;
            var pathAudio = pathData + CFG.DATA.PATH_AUDIO;
            var pathImage = pathData + CFG.DATA.PATH_IMAGE;
            var fileAudio = pathAudio + alias + CFG.DATA.TYPE_AUDIO;
            var fileImage = pathImage + alias + CFG.DATA.TYPE_IMAGE;
            
            // AJAX-Anfragen zurückgeben
            return {
                audio : { check: _checkFile(fileAudio), file: fileAudio },
                image : { check: _checkFile(fileImage), file: fileImage }
            };
        }
    }
    
    /**
     * Prüft alle Begriffe des Wörterbuches nach der Existenz von zugehörigen
     * Audio- und Bild-Dateien; aktualisiert die Daten entsprechend und
     * bereitet sie im Anschluss mittels _processDataTerms auf.
     * @acces private
     * @function _checkDictionaryFiles
     */
    function _checkDictionaryFiles() {
        
        // Liste der anstehenden AJAX-Anfragen initialisieren
        var fileChecks = [];
        
        // Wörterbuch iterieren, Dateien überprüfen
        $.each(_dataTerms, function(i, item) {
            $.each(_checkTermFiles(item.alias), function(type, result) {
                fileChecks.push(result.check);
                result.check.done(function() { item[type] = result.file; })
                            .fail(function() { item[type] = false;       });
            });
        });
        
        // Begriff-Listen aktualisieren, sobald Dateien geprüft wurden
        $.when.apply($, fileChecks).always(function() {
            _processDataTerms();
        });
    }
    
    /**
     * Verknüpft alle Daten der Wörterbuch-Begriffe mit den
     * gespeicherten Fortschritts-Daten; stellt die aktuellen Daten
     * über den Mediator zur Verfügung.
     * @access private
     * @function _processDataTerms
     */
    function _processDataTerms() {

        // Daten aktualisieren
        _sizeProgress = 0;
        $.each(_dataTerms, function(i, item) {
            $.extend(item, (_dataProgress[item.alias] || {
                lvl  : CFG.QUIZ.LEVEL_NONE,
                fail : CFG.QUIZ.FAILS[0]
            }));
            if (item.lvl > CFG.QUIZ.LEVEL_NONE) { _sizeProgress++; }
        });
        
        // Daten bereitstellen
        _serveDataTerms();
        _serveDataScores();
    }
    
    /**
     * Speichert alle internen Daten des aktuellen Wörterbuches
     * als JSON-String im LocalStorage.
     * @acess private
     * @function _storeData
     */
    function _storeData() {
        
        // Gespeicherte Daten um aktuelle Daten erweitern
        var dataStored = JSON.parse(localStorage.getItem(CFG.DATA.STORE));
        dataStored.dictionary = _dictionaryAlias;
        dataStored[_dictionaryAlias].progress = _dataProgress;
        dataStored[_dictionaryAlias].scores = _dataScores;
        dataStored[_dictionaryAlias].featured = _dataFeatured;
        
        // Daten speichern
        localStorage.setItem(CFG.DATA.STORE, JSON.stringify(dataStored));
    }
    
    /**
     * Setzt das neue Level und die Anzahl der Fehlschläge
     * für einen bestimmten Begriff bei einer ausgelösten Mediator-Nachricht.
     * @access private
     * @param {Object} data Übermittelte Mediator-Daten
     * @function _updateDataTerm
     */
    function _updateDataTerm(data) {
        if ((typeof data       !== typeof undefined) &&
            (typeof data.alias !== typeof undefined) &&
            (typeof data.lvl   !== typeof undefined) &&
            (typeof data.fail  !== typeof undefined)) {
            _setDataTerm(data.alias, data.lvl, data.fail);
        }
    }
    
    /**
     * Setzt den Fortschritt für einen bestimmten Begriff; aktualisiert die
     * Stufe und die Fehlschläge des Begriffs, speichert den Fortschritt und
     * aktualisiert die Begriff-Daten mittels anderer Funktionen.
     * @access private
     * @param {String} alias Alias des Begriffs
     * @param {Number} lvl Neue Stufe des Begriffs
     * @param {Number} fail Neue Fehlschläge des Begriffs
     * @function _setDataTerm
     */
    function _setDataTerm(alias, lvl, fail) {
        if ((typeof lvl  === typeof 0) &&
            (typeof fail === typeof 0) &&
            (Util.findTerm(_dataTerms, alias) !== false)) {
            
            // Minimum und Maximum für Level und Fehlschläge ermitteln
            var maxFail = CFG.QUIZ.FAILS.length;
            var minFail = CFG.QUIZ.FAILS[0];
            var maxLvl  = CFG.QUIZ.LEVELS.length;
            var minLvl  = CFG.QUIZ.LEVEL_NONE;
            
            // Fortschritts-Daten aktualisieren
            _dataProgress[alias] = {
                lvl  : Util.limit(lvl, minLvl, maxLvl),
                fail : Util.limit(fail, minFail, maxFail)
            };
            
            // Speichern und Listen aktualisieren
            _storeData();
            _processDataTerms();
        }
    }

    /**
     * Fügt einen neuen Wert zur Liste der letzten Spiele hinzu;
     * kürzt die Liste wieder auf die Maximallänge, speichert sie
     * und stellt sie zur Verfügung.
     * @access private
     * @param {Number} result Neues Quiz-Ergebnis
     * @function _updateDataScore
     */
    function _updateDataScore(score) {
        if (typeof score === typeof 0) {
            
            // Neuen Wert korrigieren, Startindex für Kürzung berechnen
            var value = Util.limit(score, 0, CFG.QUIZ.QUESTIONS);
            var start = Math.max(_sizeScores + 1 - CFG.QUIZ.LASTGAMES, 0);
            
            // Neuen Wert hinzufügen, Liste kürzen, Länge speichern
            _dataScores.push(value);
            _dataScores = _dataScores.slice(start);
            _sizeScores = _dataScores.length;
            
            // Speichern und bereitstellen
            _storeData();
            _serveDataScores();
        }
    }
    
    /**
     * Prüft, ob ein gespeichertes Datum für den Begriff des Tages gesetzt ist;
     * vergleicht dieses Datum gegebenenfalls mit dem aktuellen und wählt einen
     * neuen zufälligen Begriff des Tages aus; stellt die Daten anschließend
     * mittels anderer Funktionen bereit.
     * @access private
     * @function _updateDataFeatured
     */
    function _updateDataFeatured() {
        if ($.isEmptyObject(_dataFeatured) ||
            (_dataFeatured.date < Util.getDate())) {
            _setDataFeatured();
        } else { _serveDataFeatured(); }
    }
    
    /**
     * Setzt einen neuen Begriff des Tages; wählt einen zufälligen Begriff aus,
     * falls keiner angegeben ist und setzt das aktuelle Datum; speichert die
     * Daten und stellt sie anschließend bereit.
     * @access private
     * @param {String} [alias] Begriff-Alias des Tages
     * @function _setDataFeatured
     */
    function _setDataFeatured(alias) {
        
        // Neuen Begriff des Tages ermitteln
        var term = Util.getRandom(_dataTerms).alias;
        if ((typeof alias === typeof "") &&
            (Util.findTerm(_dataTerms, alias) !== false)) {
            term = alias;
        }
        if (term === _dataFeatured.term) {
            _setDataFeatured();
            return false;
        }
        
        // Daten setzen
        _dataFeatured = {
            term : term,
            date : Util.getDate()
        };
        
        // Speichern und bereitstellen
        _storeData();
        _serveDataFeatured();
    }
    
    /**
     * Liefert die Fortschritt-Liste in einer Mediator-Nachricht.
     * @access private
     * @function _serveDataTerms
     */
    function _serveDataTerms() {
        Mediator.pub(CFG.CNL.TERMS_SERVE, {
            caption : _dictionaryCaption,
            data    : _dataTerms,
            solved  : _sizeProgress,
            size    : _sizeTerms
        });
    }
    
    /**
     * Liefert die Ergebnisse der letzten Spiele in einer Mediator-Nachricht.
     * @access private
     * @function _serveDataScores
     */
    function _serveDataScores() {
        Mediator.pub(CFG.CNL.SCORES_SERVE, {
            data : _dataScores,
            size : _sizeScores
        });
    }
    
    /**
     * Liefert die Konfiguration des Wörterbuches in einer Mediator-Nachricht.
     * @access private
     * @function _serveDataConfig
     */
    function _serveDataConfig() {
        Mediator.pub(CFG.CNL.CONFIG_SERVE, {
            alias  : _dictionaryAlias,
            config : _dataConfig
        });
    }
    
    /**
     * Liefert den zufälligen Begriff des Tages in einer Mediator-Nachricht.
     * @access private
     * @function _serveDataFeatured
     */
    function _serveDataFeatured() {
        Mediator.pub(CFG.CNL.FEATURED_SERVE, _dataFeatured.term);
    }
    
    /**
     * Liefert alle verfügbaren Wörterbucher in einer Mediator-Nachricht.
     * @access private
     * @function _serveDataDictionaries
     */
    function _serveDataDictionaries() {
        Mediator.pub(CFG.CNL.DICTIONARIES_SERVE, _dataDictionaries);
    }
    
    /**
     * Löschte alle Daten über die letzten Spiele und den Fortschritt,
     * speichert die Daten und stellt sie über den Mediator bereit,
     * zeigt eine Bestätigung als Alert an; wird nur ausgeführt, wenn
     * der Parameter 1 (bestätigt) oder undefined ist.
     * @access private
     * @param {Number} [confirm] Löschen bestätigt
     * @function _clearData
     */
    function _clearData(confirm) {
        if ((typeof confirm === typeof undefined) ||
            (confirm === _CONFIRM_TRUE)) {
            
            // Daten löschen und bereitstellen
            _dataScores = [];
            _dataProgress = {};
            _storeData();
            _serveDataScores();
            _processDataTerms();
            
            // Bestätigung anzeigen
            Util.dialog(
                CFG.DIALOG.ALERT, CFG.LABEL.DELETE_SUCCESS,
                undefined, CFG.OPTIONS.DELETE
            );
        }
    }
    
    /**
     * Ruft einen Bestätigungs-Dialog zum Löschen der Fortschritts-Daten auf;
     * verwendet die Cordova-API, falls vorhanden, ansonsten den
     * Standard-JavaScript-Dialog.
     * @access private
     * @function _clearConfirm
     */
    function _clearConfirm() {
        Util.dialog(
            CFG.DIALOG.CONFIRM, CFG.LABEL.DELETE_CONFIRM, _clearData,
            CFG.OPTIONS.DELETE, [CFG.LABEL.YES, CFG.LABEL.NO]
        );
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();