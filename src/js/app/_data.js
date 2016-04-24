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
    var _dictionaryAlias        = CFG.DICTIONARY.ALIAS;
    var _dictionaryCaption      = CFG.STR.EMPTY;
    var _dictionaryData         = [];
    var _dictionaryList         = [];
    var _dictionarySize         = 0;
    var _progressData           = [];
    var _progressList           = [];
    var _progressSize           = 0;
    
    /**
     * SaveGame initialisieren.
     * Startet Funktionen, um den Anfangszustand des SaveGames herzustellen.
     */
    function init() {
        
        // Funktionen ausführen
        _bindEvents();
        _loadProgress();
        _loadDictionary();
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        $(window).on(CFG.EVT.REQUEST_DICTIONARY, _serveDictionary);
        $(window).on(CFG.EVT.REQUEST_PROGRESS, _serveProgress);
        $(window).on(CFG.EVT.UPDATE_PROGRESS, _updateProgress);
    }
    
    /**
     * Fortschritt laden.
     * Setzt den bisherigen Fortschritt.
     */
    function _loadProgress() {
        
        // Fortschritt-Daten setzen
        _progressData = {
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
        
        // !TODO: _loadProgress() LocalStorage
    }
    
    /**
     * Wörterbuch-Datei laden.
     * Lädt die Datei zum eingestellten Wörterbuch und
     * speichert die Daten in einer lokalen Variable.
     */
    function _loadDictionary() {
        
        // Pfad zur Wörterbuch-Datei zusammensetzen
        var dictionaryPath = CFG.DICTIONARY.PATH_DATA + _dictionaryAlias +
                             CFG.STR.SLASH + _dictionaryAlias +
                             CFG.DICTIONARY.TYPE_DATA;
        
        // AJAX Get-Anfrage zur Datei
        $.getJSON(dictionaryPath, function(dictionary) {
            if ((typeof dictionary.caption === typeof CFG.STR.EMPTY) &&
                $.isArray(dictionary.terms)) {
                _dictionaryCaption = dictionary.caption;
                _dictionaryData = dictionary.terms;
                _dictionarySize = dictionary.terms.length;
            }
        });

        // Listen aktualisieren
        _updateLists();
    }
    
    /**
     * Begriff-Listen aktualisieren.
     * Aktualisiert die Begriff-Listen für den Fortschritt und das
     * gesamte Wörterbuch anhand der zuvor geladenen Wörterbuch-Daten
     * und den aktuellen Fortschritts-Daten.
     */
    function _updateLists() {
        
        // Listen zurücksetzen
        _dictionaryList = [];
        _progressList   = [];
        
        // Alle Begriffe des Wörterbuches iterieren
        $.each(_dictionaryData, function(i, item) {
            
            // Level und Fehlschläge ermitteln
            var progress = (_progressData[item.alias] || { lvl: 0, fail: 0 });
            var lvl = Math.min(Math.max(progress.lvl, 0), CFG.QUIZ.LVL_MAX);
            var fail = Math.max(progress.fail, 0);
            
            // Wort um Werte erweitern und zu Listen hinzufügen
            $.extend(item, { lvl: lvl, fail: fail });
            _dictionaryList.push(item);
            if (lvl > 0) { _progressList.push(item); }
        });
        
        // Fortschritt-Größe aktualisieren
        _progressSize = Object.keys(_progressData).length;
        
        // Updates bereitstellen
        _serveDictionary();
        _serveProgress();
    }
    
    /**
     * Fortschritt speichern.
     * Speichert den zuvor aktualisierten Fortschritt als
     * JSON-String im LocalStorage.
     */
    function _saveProgress() {
        
        // !TODO: _saveProgress() LocalStorage
    }
    
    /**
     * Fortschitt aktualisieren.
     * Setzt das neue Level und die Anzahl der Fehlschläge
     * für einen bestimmten Begriff beim entsprechenden Event.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _updateProgress(event, data) {
        if ((typeof data !== typeof undefined) &&
            (typeof data.alias !== typeof undefined) &&
            (typeof data.lvl !== typeof undefined) &&
            (typeof data.fail !== typeof undefined)) {
            _progressData[data.alias] = {
                lvl: data.lvl,
                fail: data.fail
            };
            _saveProgress();
            _updateLists();
        }
    }
    
    /**
     * Fortschritt-Liste bereitstellen.
     * Liefert die Fortschritt-Liste in einem Event.
     */
    function _serveProgress() {
        $(window).trigger(CFG.EVT.SERVE_PROGRESS, {
            caption: _dictionaryCaption,
            list: _progressList,
            size: _progressSize
        });
    }
    
    /**
     * Wörterbuch-Liste bereitstellen.
     * Liefert die Wörterbuch-Liste in einem Event.
     */
    function _serveDictionary() {
        $(window).trigger(CFG.EVT.SERVE_DICTIONARY, {
            caption : _dictionaryCaption,
            list: _dictionaryList,
            size: _dictionarySize
        });
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();