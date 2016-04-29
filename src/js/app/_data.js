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
    var _alias                  = CFG.DATA.ALIAS;
    var _caption                = CFG.STR.EMPTY;
    var _savegame               = {};
    var _listDictionary         = [];
    var _listProgress           = [];
    var _sizeDictionary         = 0;
    var _sizeProgress           = 0;
    
    /**
     * SaveGame initialisieren.
     * Startet Funktionen, um den Anfangszustand des SaveGames herzustellen.
     */
    function init() {
        
        // Funktionen ausführen
        _bindEvents();
        _loadSavegame();
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
    function _loadSavegame() {
        
        // Fortschritt-Daten setzen
        _savegame = {
            "pinneken"          : { lvl: 3, fail: 0 },
            "anneeckeliegen"    : { lvl: 1, fail: 0 },
            "buetterken"        : { lvl: 1, fail: 0 },
            "doelmern"          : { lvl: 2, fail: 0 },
            "doenekens"         : { lvl: 3, fail: 0 },
            "fickerich"         : { lvl: 1, fail: 0 },
            "latuechte"         : { lvl: 1, fail: 0 },
            "pluedden"          : { lvl: 2, fail: 0 },
            "vermackeln"        : { lvl: 3, fail: 0 },
            "noehlen"           : { lvl: 2, fail: 0 }/*,
            "angeschickert"     : { lvl: 1, fail: 0 },
            "beoemmeln"         : { lvl: 3, fail: 0 },
            "dittken"           : { lvl: 1, fail: 0 },
            "knuepp"            : { lvl: 2, fail: 0 },
            "noenkern"          : { lvl: 3, fail: 0 }*/
        };
        
        // !TODO: _loadSavegame() LocalStorage
    }
    
    /**
     * Wörterbuch-Datei laden.
     * Lädt die Datei zum eingestellten Wörterbuch und
     * speichert die Daten in einer lokalen Variable.
     */
    function _loadDictionary() {
        
        // Pfad zur Wörterbuch-Datei zusammensetzen
        var file = CFG.DATA.PATH_DATA + _alias + CFG.STR.SLASH + _alias +
                   CFG.DATA.TYPE_DATA;
        
        // AJAX Get-Anfrage zur Datei, im Anschluss Dateien prüfen
        $.getJSON(file, function(data) {
            if ((typeof data.caption === typeof CFG.STR.EMPTY) &&
                $.isArray(data.terms)) {
                _caption        = data.caption;
                _listDictionary = data.terms;
                _sizeDictionary = data.terms.length;
            }
        }).done(function() { _checkDictionaryFiles(); });
    }
    
    /**
     * Datei überprüfen.
     * Überprüft die Existenz einer gegebenen Datei.
     * @param {string} file Dateipfad
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
            var pathData  = CFG.DATA.PATH_DATA + _alias;
            var pathAudio = pathData + CFG.DATA.PATH_AUDIO;
            var pathImage = pathData + CFG.DATA.PATH_IMAGE;
            var fileAudio = pathAudio + alias + CFG.DATA.TYPE_AUDIO;
            var fileImage = pathImage + alias + CFG.DATA.TYPE_IMAGE;
            
            // AJAX-Anfragen zurückgeben
            return {
                audio : _checkFile(fileAudio),
                image : _checkFile(fileImage)
            };
        }
    }
    
    /**
     * Wörterbuch nach Existenz von Dateien überprüfen.
     * Prüft alle Begriffe des Wörterbuches nach der Existenz von
     * zugehörigen Audio- und Bild-Dateien; aktualisiert anschließend
     * die Begriff-Listen.
     */
    function _checkDictionaryFiles() {
        
        // Liste der anstehenden AJAX-Anfragen initialisieren
        var fileChecks = [];
        
        // Wörterbuch iterieren, Dateien überprüfen
        $.each(_listDictionary, function(i, item) {
            $.each(_checkTermFiles(item.alias), function(type, check) {
                fileChecks.push(check);
                check.done(function() { item[type] = true; })
                     .fail(function() { item[type] = false; });
            });
        });
        
        // Begriff-Listen aktualisieren, sobald Dateien geprüft wurden
        $.when.apply($, fileChecks).always(function() {
            _updateLists();
        });
    }
    
    /**
     * Begriff-Listen aktualisieren.
     * Aktualisiert die Begriff-Listen für den Fortschritt und das
     * gesamte Wörterbuch anhand der zuvor geladenen Wörterbuch-Daten
     * und den aktuellen Fortschritts-Daten.
     */
    function _updateLists() {
        
        // Fortschritts-Liste zurücksetzen
        _listProgress   = [];
        
        // Alle Begriffe um Fortschritt erweitert, Listen aktualisieren
        $.each(_listDictionary, function(i, item) {
            $.extend(item, (_savegame[item.alias] || { lvl: 0, fail: 0 }));
            if (item.lvl > 0) { _listProgress.push(item); }
        });
        
        // Fortschritts-Größe aktualisieren, Begriff-Listen bereitstellen
        _sizeProgress = _listProgress.length;
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
        if ((typeof data       !== typeof undefined) &&
            (typeof data.alias !== typeof undefined) &&
            (typeof data.lvl   !== typeof undefined) &&
            (typeof data.fail  !== typeof undefined)) {
            
            // Fortschritts-Daten aktualisieren
            _savegame[data.alias] = {
                lvl  : Math.max(Math.min(data.lvl, CFG.QUIZ.LVL_MAX), 0),
                fail : Math.max(data.fail, 0)
            };
            
            // Speichern und Listen aktualisieren
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
            caption : _caption,
            list    : _listProgress,
            size    : _sizeProgress
        });
    }
    
    /**
     * Wörterbuch-Liste bereitstellen.
     * Liefert die Wörterbuch-Liste in einem Event.
     */
    function _serveDictionary() {
        $(window).trigger(CFG.EVT.SERVE_DICTIONARY, {
            caption : _caption,
            list    : _listDictionary,
            size    : _sizeDictionary
        });
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();