/**
 * Data-Modul.
 * Steuert den Spielstand und die Wörterbuch-Daten.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var Data = (function() {
    
    // Private Variablen
    var _dictionaryAlias        = CFG.STR.EMPTY;
    var _dictionaryCaption      = CFG.STR.EMPTY;
    var _dataScores             = [];
    var _dataTerms              = [];
    var _dataProgress           = {};
    var _sizeScores             = 0;
    var _sizeTerms              = 0;
    var _sizeProgress           = 0;
    
    /**
     * Daten initialisieren.
     * Startet Funktionen, um den Anfangszustand des Data-Moduls herzustellen.
     */
    function init() {
        _hookMediator();
        _loadDataStored();
    }
    
    /**
     * Mediator abonnieren.
     * Meldet Funktionen beim Mediator an.
     */
    function _hookMediator() {
        Mediator.hook(CFG.CNL.TERMS_REQUEST, _serveDataTerms)
                .hook(CFG.CNL.TERMS_UPDATE, _updateDataTerm)
                .hook(CFG.CNL.SCORES_REQUEST, _serveDataScores)
                .hook(CFG.CNL.SCORES_UPDATE, _updateDataScore);
    }
    
    /**
     * Gespeicherte Daten initialisieren.
     * Erstellt einen leeren Standard-Datensatz im LocalStorage.
     */
    function _initDataStored() {
        var dataInitial = { dictionary: CFG.DATA.ALIAS };
        dataInitial[CFG.DATA.ALIAS] = { progress: {}, scores: [] };
        localStorage.setItem(CFG.DATA.STORE, JSON.stringify(dataInitial));
        _loadDataStored();
    }
    
    /**
     * Gespeicherte Daten laden.
     * Lädt alle gespeicherten Daten aus dem LocalStorage.
     */
    function _loadDataStored() {
        
        // Daten aus dem LocalStorage laden
        var dataStored = JSON.parse(localStorage.getItem(CFG.DATA.STORE));
        if (dataStored === null) { _initDataStored(); return false; }
        
        // Daten setzen
        _dictionaryAlias = dataStored.dictionary;
        _dataProgress = dataStored[_dictionaryAlias].progress;
        _dataScores = dataStored[_dictionaryAlias].scores;
        _sizeScores = _dataScores.length;
        
        // Wörterbuch-Daten laden
        _loadDataDictionary();
    }
    
    /**
     * Wörterbuch-Datei laden.
     * Lädt die Datei zum eingestellten Wörterbuch und
     * speichert die Daten in einer lokalen Variable.
     */
    function _loadDataDictionary() {
        
        // Pfad zur Wörterbuch-Datei zusammensetzen
        var file = CFG.DATA.PATH_DATA + _dictionaryAlias +
                   CFG.STR.SLASH + _dictionaryAlias + CFG.DATA.TYPE_DATA;
        
        // AJAX Get-Anfrage zur Datei, im Anschluss Dateien prüfen
        $.getJSON(file, function(data) {
            if ((typeof data.caption === typeof CFG.STR.EMPTY) &&
                $.isArray(data.terms)) {
                _dictionaryCaption = data.caption;
                _dataTerms = data.terms;
                _sizeTerms = data.terms.length;
            }
        }).done(function() { _checkDictionaryFiles(); });
    }
    
    /**
     * Datei überprüfen.
     * Überprüft die Existenz einer gegebenen Datei.
     * @param {String} file Dateipfad
     * @returns {Object} AJAX-Antwort
     */
    function _checkFile(file) {
        return $.ajax({
            url  : file,
            type : CFG.AJAX.HEAD
        });
    }
    
    /**
     * Dateien eines Begriffes prüfen.
     * Prüft mittels AJAX-Anfragen, ob ein gegebener Begriff
     * über Audio- und/oder Bild-Dateien verfügt; erweitert die
     * Wörterbuch-Daten um den Datei-Status.
     * @param {string} alias Kürzel des Begriffes
     * @returns {Object} AJAX-Objekte der Anfragen
     */
    function _checkTermFiles(alias) {
        if (typeof alias === typeof CFG.STR.EMPTY) {
        
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
     * Wörterbuch nach Existenz von Dateien überprüfen.
     * Prüft alle Begriffe des Wörterbuches nach der Existenz von
     * zugehörigen Audio- und Bild-Dateien; aktualisiert anschließend
     * die Begriff-Daten.
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
     * Begriff-Daten aufbereiten.
     * Verknüpft alle Daten der Wörterbuch-Begriffe mit den
     * gespeicherten Fortschritts-Daten; stellt die aktuellen Daten
     * über Events zur Verfügung.
     */
    function _processDataTerms() {

        // Daten aktualisieren
        _sizeProgress = 0;
        $.each(_dataTerms, function(i, item) {
            $.extend(item, (_dataProgress[item.alias] || { lvl: 0, fail: 0 }));
            if (item.lvl > 0) { _sizeProgress++; }
        });
        
        // Daten bereitstellen
        _serveDataTerms();
        _serveDataScores();
    }
    
    /**
     * Daten speichern.
     * Speichert alle aktuellen Daten als JSON-String im LocalStorage.
     */
    function _storeData() {
        
        // Gespeicherte Daten um aktuelle Daten erweitern
        var dataStored = JSON.parse(localStorage.getItem(CFG.DATA.STORE));
        dataStored.dictionary = _dictionaryAlias;
        dataStored[_dictionaryAlias].progress = _dataProgress;
        dataStored[_dictionaryAlias].scores = _dataScores;
        
        // Daten speichern
        localStorage.setItem(CFG.DATA.STORE, JSON.stringify(dataStored));
    }
    
    /**
     * Begriff-Daten aktualisieren.
     * Setzt das neue Level und die Anzahl der Fehlschläge
     * für einen bestimmten Begriff beim entsprechenden Event.
     * @param {Object} data Daten des Events
     */
    function _updateDataTerm(data) {
        if ((typeof data       !== typeof undefined) &&
            (typeof data.alias !== typeof undefined) &&
            (typeof data.lvl   !== typeof undefined) &&
            (typeof data.fail  !== typeof undefined)) {
            setDataTerm(data.alias, data.lvl, data.fail);
        }
    }
    
    /**
     * Begriff-Daten setzen.
     * Setzt den Fortschritt für einen bestimmten Begriff;
     * aktualisiert die Stufe und die Fehlschläge des Begriffs,
     * speichert den Fortschritt und aktualisiert die Begriff-Daten.
     * @param {String} alias Alias des Begriffs
     * @param {Number} lvl Neue Stufe des Begriffs
     * @param {Number} fail Neue Fehlschläge des Begriffs
     */
    function setDataTerm(alias, lvl, fail) {
        if ((typeof lvl  === typeof 0) &&
            (typeof fail === typeof 0)) {
            
            // Minimum und Maximum für Level ermitteln
            var min = CFG.QUIZ.LEVELS[0];
            var max = CFG.QUIZ.LEVELS.length;
            
            // Fortschritts-Daten aktualisieren
            _dataProgress[alias] = {
                lvl  : Math.max(Math.min(lvl, max), min),
                fail : Math.max(fail, 0)
            };
            
            // Speichern und Listen aktualisieren
            _storeData();
            _processDataTerms();
        }
    }
    
    /**
     * Die letzten Spiele aktualisieren.
     * Ergänzt die Liste der letzten Spieleergebnisse um ein bestimmtes
     * Ergebnis bei einer Mediator-Nachricht.
     * @param {Number} score Neues Ergebnis
     */
    function _updateDataScore(score) {
        if (typeof score === typeof 0) { addDataScore(score); }
    }
    
    /**
     * Die letzten Spiele setzen.
     * Fügt einen neuen Wert zur Liste der letzten Spiele hinzu;
     * kürzt die Liste wieder auf die Maximallänge, speichert sie
     * und stellt sie zur Verfügung.
     * @param {Number} result Neues Quiz-Ergebnis
     */
    function addDataScore(score) {
        if (typeof score === typeof 0) {
            
            // Neuen Wert korrigieren, Startindex für Kürzung berechnen
            var value = Math.max(Math.min(score, CFG.QUIZ.QUESTIONS), 0);
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
     * Die letzten Spiele löschen.
     * Entfernt alle Daten der letzten Spiele.
     */
    function clearDataScores() {
        _dataScores = [];
        _storeData();
        _serveDataScores();
    }
    
    /**
     * Fortschritt-Liste löschen.
     * Entfernt alle Daten des Wörterbuch-Fortschritts.
     */
    function clearDataTerms() {
        _dataProgress = {};
        _storeData();
        _processDataTerms();
    }
    
    /**
     * Fortschritt-Liste bereitstellen.
     * Liefert die Fortschritt-Liste in einem Event.
     */
    function _serveDataTerms() {
        Mediator.send(CFG.CNL.TERMS_SERVE, {
            caption : _dictionaryCaption,
            data    : _dataTerms,
            solved  : _sizeProgress,
            size    : _sizeTerms
        });
    }
    
    /**
     * Die letzten Spieleergebnisse bereitstellen.
     * Liefert die Ergebnisse der letzten Spiele in einem Event.
     */
    function _serveDataScores() {
        Mediator.send(CFG.CNL.SCORES_SERVE, {
            data : _dataScores,
            size : _sizeScores
        });
    }
    
    // Öffentliches Interface
    return {
        init            : init,
        setDataTerm     : setDataTerm,
        addDataScore    : addDataScore,
        clearDataTerms  : clearDataTerms,
        clearDataScores : clearDataScores
    };
    
})();