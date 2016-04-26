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
            "noehlen"           : { lvl: 2, fail: 0 }/*,
            "angeschickert"     : { lvl: 1, fail: 0 },
            "beoemmeln"         : { lvl: 3, fail: 0 },
            "dittken"           : { lvl: 1, fail: 0 },
            "knuepp"            : { lvl: 2, fail: 0 },
            "noenkern"          : { lvl: 3, fail: 0 }*/
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
        var dictionaryPath =
            CFG.DATA.PATH_DATA + _dictionaryAlias + CFG.STR.SLASH +
            _dictionaryAlias + CFG.DATA.TYPE_DATA;
        
        // AJAX Get-Anfrage zur Datei, im Anschluss Dateien prüfen
        $.getJSON(dictionaryPath, function(data) {
            if ((typeof data.caption === typeof CFG.STR.EMPTY) &&
                $.isArray(data.terms)) {
                _dictionaryCaption = data.caption;
                _dictionaryData    = data.terms;
                _dictionarySize    = data.terms.length;
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
            url: file,
            type: CFG.AJAX.HEAD
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
            var pathData   = CFG.DATA.PATH_DATA + _dictionaryAlias;
            var pathAudio  = pathData + CFG.DATA.PATH_AUDIO;
            var pathImage  = pathData + CFG.DATA.PATH_IMAGE;
            var fileAudio  = pathAudio + alias + CFG.DATA.TYPE_AUDIO;
            var fileImage  = pathImage + alias + CFG.DATA.TYPE_IMAGE;
            
            // AJAX-Anfragen zurückgeben
            return {
                audio: _checkFile(fileAudio),
                image: _checkFile(fileImage)
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
        $.each(_dictionaryData, function(i, item) {
            $.each(_checkTermFiles(item.alias), function(type, check) {
                fileChecks.push(check);
                check.done(function() { _dictionaryData[i][type] = true; })
                     .fail(function() { _dictionaryData[i][type] = false; });
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
        
        // Listen zurücksetzen
        _dictionaryList = [];
        _progressList   = [];
        
        // Alle Begriffe des Wörterbuches iterieren
        $.each(_dictionaryData, function(i, item) {
            
            // Level und Fehlschläge ermitteln
            var progress = (_progressData[item.alias] || { lvl: 0, fail: 0 });
            var lvl = Math.min(Math.max(progress.lvl, 0), CFG.QUIZ.LVL_MAX);
            var fail = Math.max(progress.fail, 0);
            
            // Begriff um Werte erweitern, Listen aktualisieren
            $.extend(item, { lvl: lvl, fail: fail });
            if (lvl > 0) { _progressList.push(item); }
            _dictionaryList.push(item);
        });
        
        // Fortschritts-Größe aktualisieren, Begriff-Listen bereitstellen
        _progressSize = Object.keys(_progressData).length;
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