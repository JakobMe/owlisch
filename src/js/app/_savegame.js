/**
 * SaveGame-Modul.
 * Steuer den Spielstand und die Wörterbuch-Daten.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var SaveGame = (function() {
    
    // Private Variablen
    var _dictionaryId;
    var _dictionaryData;
    var _dictionarySize;
    var _dictionaryList;
    var _progressData;
    var _progressSize;
    var _progressList;
    
    /**
     * Modul initialisieren.
     * Setzt die Standard-Anfangswerte des Moduls, bindet alle Events,
     * sucht nach den benötigten DOM-Elementen und rendert das Modul.
     */
    function init() {
        
        // Modulvariablen initialisieren
        _dictionaryId       = _C.DICTIONARY.ID;
        _dictionaryData     = [];
        _dictionaryList     = [];
        _dictionarySize     = 0;
        _progressData       = [];
        _progressList       = [];
        _progressSize       = 0;
        
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
        $(window).on(_C.EVT.REQUEST_DICTIONARY, _serveDictionary);
        $(window).on(_C.EVT.REQUEST_PROGRESS, _serveProgress);
        $(window).on(_C.EVT.UPDATE_PROGRESS, _updateProgress);
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
        var dictionaryPath = _C.DICTIONARY.PATH_DATA + _dictionaryId +
                             _C.STR.SLASH + _dictionaryId +
                             _C.DICTIONARY.TYPE_DATA;
        
        // AJAX Get-Anfrage zur Datei
        $.getJSON(dictionaryPath, function(data) {
            if ($.isArray(data.words)) {
                _dictionaryData = data.words;
                _dictionarySize = data.words.length;
            }
        });

        // Listen aktualisieren
        _updateLists();
    }
    
    /**
     * Wort-Listen aktualisieren.
     * Aktualisiert die Wort-Listen für den Fortschritt und das
     * gesamte Wörterbuch anhand der zuvor geladenen Wörterbuch-Daten
     * und den aktuellen Fortschritts-Daten.
     */
    function _updateLists() {
        
        // Alle Wörter des Wörterbuches iterieren
        $.each(_dictionaryData, function(index, word) {
            
            // Level und Fehlschläge ermitteln
            var progress = (_progressData[word.id] || { lvl: 0, fail: 0 });
            var lvl = Math.min(Math.max(progress.lvl, 0), _C.QUIZ.LVL_MAX);
            var fail = Math.max(progress.fail, 0);
            
            // Wort um Werte erweitern und zu Listen hinzufügen
            $.extend(word, { lvl: lvl, fail: fail });
            _dictionaryList.push(word);
            if (lvl > 0) { _progressList.push(word); }
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
     * beim entsprechenden Event.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _updateProgress(event, data) {
        if (typeof data !== _C.TYPE.UNDEF) {
            if ((typeof data.id !== _C.TYPE.UNDEF) &&
                (typeof data.lvl !== _C.TYPE.UNDEF) &&
                (typeof data.fail !== _C.TYPE.UNDEF)) {
                _progressData[data.id] = {
                    lvl: data.lvl,
                    fail: data.fail
                };
                _saveProgress();
                _updateLists();
            }
        }
    }
    
    /**
     * Fortschritt-Liste bereitstellen.
     * Liefert die Fortschritt-Liste in einem Event.
     */
    function _serveProgress() {
        $(window).trigger(_C.EVT.SERVE_PROGRESS, {
            list: _progressList,
            size: _progressSize
        });
    }
    
    /**
     * Wörterbuch-Liste bereitstellen.
     * Liefert die Wörterbuch-Liste in einem Event.
     */
    function _serveDictionary() {
        $(window).trigger(_C.EVT.SERVE_DICTIONARY, {
            list: _dictionaryList,
            size: _dictionarySize
        });
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();