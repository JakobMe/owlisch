/**
 * SaveGame-Modul.
 * Steuer den Spielstand und die Wörterbuch-Daten.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var SaveGame = (function() {
    
    /*global CONF: true*/
    
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
     * @param {Object} options Optionale Einstellungen beim Initialisieren
     * @returns {Object} Modul-Objekt
     */
    function init(options) {
        
        // Standard-Optionen definieren und ergänzen
        var defaults = { dictionary: CONF.DICTIONARY.ID };
        $.extend(defaults, options || {});
        
        // Modulvariablen initialisieren
        _dictionaryId       = defaults.dictionary;
        _dictionaryData     = [];
        _dictionaryList     = [];
        _dictionarySize     = 0;
        _progressData       = [];
        _progressList       = [];
        _progressSize       = 0;
        
        // Funktionen ausführen
        _loadProgress();
        _loadDictionary();
        
        // Modul Return
        return this;
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
        var dictionaryPath = CONF.DICTIONARY.PATH_DATA + _dictionaryId +
                             CONF.STR.SLASH + _dictionaryId +
                             CONF.DICTIONARY.TYPE_DATA;
        
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
            var lvl = Math.min(Math.max(progress.lvl, 0), CONF.QUIZ.LVL_MAX);
            var fail = Math.max(progress.fail, 0);
            
            // Wort um Werte erweitern und zu Listen hinzufügen
            $.extend(word, { lvl: lvl, fail: fail });
            _dictionaryList.push(word);
            if (lvl > 0) { _progressList.push(word); }
        });
        
        // Fortschritt-Größe aktualisieren
        _progressSize = Object.keys(_progressData).length;
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
     * für die gegebene Wort-ID.
     * @param {string} id ID des Wortes
     * @param {integer} lvl Neues Level des Wortes
     * @param {integer} fail Neue Anzahl der Fehlschläge des Wortes
     * @returns {Object} Modul-Objekt  
     */
    function updateProgress(id, lvl, fail) {
        _progressData[id] = { lvl: lvl, fail: fail };
        _saveProgress();
        _updateLists();
        return this;
    }
    
    /**
     * Fortschritt-Liste holen.
     * Gibt die Liste der Wörter des Benutzers zurück.
     * @returns {Array} Liste der Wörter
     */
    function getProgressList() {
        return _progressList;
    }
    
    /**
     * Größe der Fortschritt-Liste holen.
     * Gibt die Größe der Benutzer-Liste zurück.
     * @returns {integer} Größe der Liste
     */
    function getProgressSize() {
        return _progressSize;
    }
    
    /**
     * Wörterbuch-Liste holen.
     * Gibt die Liste der Wörter des Wörterbuchs zurück.
     * @returns {Array} Liste der Wörter
     */
    function getDictionaryList() {
        return _dictionaryList;
    }
    
    /**
     * Größe der Wörterbuch-Liste holen.
     * Gibt die Größe der Gesamt-Liste zurück.
     * @returns {integer} Größe der Liste
     */
    function getDictionarySize() {
        return _dictionarySize;
    }
    
    // Öffentliches Interface
    return {
        init                : init,
        getProgressList     : getProgressList,
        getProgressSize     : getProgressSize,
        getDictionaryList   : getDictionaryList,
        getDictionarySize   : getDictionarySize,
        updateProgress      : updateProgress
    };
    
})();