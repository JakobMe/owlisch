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
    var _dictionaryAlias        = CFG.DATA.ALIAS;
    var _dictionaryCaption      = CFG.STR.EMPTY;
    var _dataScores             = [];
    var _dataTerms              = [];
    var _dataSaved              = {};
    var _sizeScores             = 0;
    var _sizeTerms              = 0;
    var _sizeSolved             = 0;
    
    /**
     * Daten initialisieren.
     * Startet Funktionen, um den Anfangszustand des Data-Moduls herzustellen.
     */
    function init() {
        _bindEvents();
        _loadDataSaved();
        _loadDataDictionary();
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        $(window).on(CFG.EVT.REQUEST_TERMS, _serveDataTerms);
        $(window).on(CFG.EVT.REQUEST_SCORES, _serveDataScores);
        $(window).on(CFG.EVT.UPDATE_TERMS, _updateDataTerm);
        $(window).on(CFG.EVT.UPDATE_SCORES, _updateDataScore);
    }
    
    /**
     * Gespeicherte Daten laden.
     * Lädt alle gespeicherten Daten aus dem LocalStorage.
     */
    function _loadDataSaved() {
        
        // Fortschritt-Daten setzen
        _dataSaved = {
            "pinneken"          : { lvl: 3, fail: 0 },
            "anneeckeliegen"    : { lvl: 1, fail: 0 },
            "buetterken"        : { lvl: 1, fail: 0 },
            "doelmern"          : { lvl: 2, fail: 0 },
            "doenekens"         : { lvl: 3, fail: 0 },
            "fickerich"         : { lvl: 1, fail: 0 },
            "latuechte"         : { lvl: 1, fail: 0 },
            "pluedden"          : { lvl: 2, fail: 0 },
            "vermackeln"        : { lvl: 3, fail: 0 },
            "noehlen"           : { lvl: 2, fail: 0 },
            "angeschickert"     : { lvl: 1, fail: 0 },
            "beoemmeln"         : { lvl: 3, fail: 0 },
            "dittken"           : { lvl: 1, fail: 0 },
            "knuepp"            : { lvl: 2, fail: 0 },
            "noenkern"          : { lvl: 3, fail: 0 }
        };
        
        // Letzten Spiele setzen
        _dataScores = [1, 2, 0, 3, 5, 4, 8, 7, 10, 9];
        _sizeScores = _dataScores.length;
        
        // !TODO: _loadDataSaved() LocalStorage
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
        _sizeSolved = 0;
        $.each(_dataTerms, function(i, item) {
            $.extend(item, (_dataSaved[item.alias] || { lvl: 0, fail: 0 }));
            if (item.lvl > 0) { _sizeSolved++; }
        });
        
        // Daten bereitstellen
        _serveDataTerms();
        _serveDataScores();
    }
    
    /**
     * Fortschritt speichern.
     * Speichert den zuvor aktualisierten Fortschritt als
     * JSON-String im LocalStorage.
     */
    function _saveDataTerms() {
        
        // !TODO: _saveDataTerms() LocalStorage
    }
    
    /**
     * Die letzten Spiele speichern.
     * Speichert die zuvor aktualisierten letzten Spieleregebnisse
     * als JSON-String im LocalStorage.
     */
    function _saveDataScores() {
        
        // !TODO: _saveDataScores() LocalStorage
    }
    
    /**
     * Begriff-Daten aktualisieren.
     * Setzt das neue Level und die Anzahl der Fehlschläge
     * für einen bestimmten Begriff beim entsprechenden Event.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _updateDataTerm(event, data) {
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
        if ((typeof _dataSaved[alias] !== typeof undefined) &&
            (typeof lvl               === typeof 0) &&
            (typeof fail              === typeof 0)) {
            
            // Minimum und Maximum für Level ermitteln
            var min = CFG.QUIZ.LEVELS[0];
            var max = CFG.QUIZ.LEVELS.length;
            
            // Fortschritts-Daten aktualisieren
            _dataSaved[alias] = {
                lvl  : Math.max(Math.min(lvl, max), min),
                fail : Math.max(fail, 0)
            };
            
            // Speichern und Listen aktualisieren
            _saveDataTerms();
            _processDataTerms();
        }
    }
    
    /**
     * Die letzten Spiele aktualisieren.
     * Ergänzt die Liste der letzten Spieleergebnisse um ein bestimmtes
     * Ergebnis beim entsprechenden Event.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _updateDataScore(event, data) {
        if ((typeof data        !== typeof undefined) &&
            (typeof data.result === typeof 0)) {
            addDataScore(data.result);
        }
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
            _saveDataScores();
            _serveDataScores();
        }
    }
    
    /**
     * Fortschritt-Liste bereitstellen.
     * Liefert die Fortschritt-Liste in einem Event.
     */
    function _serveDataTerms() {
        $(window).trigger(CFG.EVT.SERVE_TERMS, {
            caption : _dictionaryCaption,
            data    : _dataTerms,
            solved  : _sizeSolved,
            size    : _sizeTerms
        });
    }
    
    /**
     * Die letzten Spieleergebnisse bereitstellen.
     * Liefert die Ergebnisse der letzten Spiele in einem Event.
     */
    function _serveDataScores() {
        $(window).trigger(CFG.EVT.SERVE_SCORES, {
            data : _dataScores,
            size : _sizeScores
        });
    }
    
    // Öffentliches Interface
    return {
        init         : init,
        setDataTerm  : setDataTerm,
        addDataScore : addDataScore
    };
    
})();