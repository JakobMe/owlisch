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
    var _dictionary;
    var _progress;
    var _listAll;
    var _listUser;
    var _sizeAll;
    var _sizeUser;
    
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
        _dictionary         = defaults.dictionary;
        _progress           = [];
        _listAll            = [];
        _listUser           = [];
        _sizeAll            = 0;
        _sizeUser           = 0;
        
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
        
        // Fortschritt setzen (Test)
        _progress = {
            "pinneken"          : [3,0],
            "anneeckeliegen"    : [1,0],
            "buetterken"        : [1,0],
            "doelmern"          : [2,0],
            "doenekens"         : [3,0],
            "fickerich"         : [1,0],
            "latuechte"         : [1,0],
            "pluedden"          : [2,0],
            "vermackeln"        : [3,0],
            "noehlen"           : [2,0],
            "angeschickert"     : [1,0],
            "beoemmeln"         : [3,0],
            "dittken"           : [1,0],
            "knuepp"            : [2,0],
            "noenkern"          : [3,0]
        };
    }
    
    /**
     * Wörterbuch-Datei laden.
     * Lädt die Datei zum eingestellten Wörterbuch und
     * erstellt daraus eine Wortliste.
     */
    function _loadDictionary() {
        
        // Pfad zur Wörterbuch-Datei zusammensetzen
        var dictionaryPath = CONF.DICTIONARY.PATH_DATA + _dictionary +
                             CONF.STR.SLASH + _dictionary +
                             CONF.DICTIONARY.TYPE_DATA;
        
        // AJAX Get-Anfrage zur Datei
        $.getJSON(dictionaryPath, function(data) {
            if ($.isArray(data.words)) {
                
                // Größe der Gesamt-Liste setzen
                _sizeAll = data.words.length;
                
                // Alle Wörter des Wörterbuches iterieren
                $.each(data.words, function(index, word) {
                    
                    // Zur Gesamt-Liste hinzufügen
                    _listAll.push(word);
                    
                    // Falls im gespeicherten Fortschritt korrekte Daten sind
                    if (typeof _progress[word.id][0] !== CONF.TYPE.UNDEF) {
                        if ((_progress[word.id][0] >= CONF.QUIZ.LVL_MIN) &&
                            (_progress[word.id][0] <= CONF.QUIZ.LVL_MAX)) {
                            
                            // Zur Benutzer-Liste hinzufügen
                            $.extend(word, { level: _progress[word.id][0] });
                            _listUser.push(word);
                        }
                    }
                });
                
                // Größe der Benutzer-Liste setzen
                _sizeUser = _listUser.length;
            }
        });
    }
    
    /**
     * Benutzer-Liste holen.
     * Gibt die Liste der Wörter des Benutzers zurück.
     * @returns {Array} Liste der Wörter
     */
    function getListUser() {
        return _listUser;
    }
    
    /**
     * Größe der Benutzer-Liste holen.
     * Gibt die Größe der Benutzer-Liste zurück.
     * @returns {integer} Größe der Liste
     */
    function getSizeUser() {
        return _sizeUser;
    }
    
    /**
     * Gesamt-Liste holen.
     * Gibt die Liste der Wörter des Wörterbuchs zurück.
     * @returns {Array} Liste der Wörter
     */
    function getListAll() {
        return _listAll;
    }
    
    /**
     * Größe der Gesamt-Liste holen.
     * Gibt die Größe der Gesamt-Liste zurück.
     * @returns {integer} Größe der Liste
     */
    function getSizeAll() {
        return _sizeAll;
    }
    
    // Öffentliches Interface
    return {
        init            : init,
        getListUser     : getListUser,
        getSizeUser     : getSizeUser,
        getListAll      : getListAll,
        getSizeAll      : getSizeAll
    };
    
})();