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
    var _listLastgames          = [];
    var _sizeDictionary         = 0;
    var _sizeProgress           = 0;
    var _sizeLastgames          = 0;
    
    /**
     * SaveGame initialisieren.
     * Startet Funktionen, um den Anfangszustand des SaveGames herzustellen.
     */
    function init() {
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
        $(window).on(CFG.EVT.REQUEST_LASTGAMES, _serveLastgames);
        $(window).on(CFG.EVT.UPDATE_PROGRESS, _updateProgress);
        $(window).on(CFG.EVT.UPDATE_LASTGAMES, _updateLastgames);
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
            "noehlen"           : { lvl: 2, fail: 0 },
            "angeschickert"     : { lvl: 1, fail: 0 },
            "beoemmeln"         : { lvl: 3, fail: 0 },
            "dittken"           : { lvl: 1, fail: 0 },
            "knuepp"            : { lvl: 2, fail: 0 },
            "noenkern"          : { lvl: 3, fail: 0 }
        };
        
        // Letzten Spiele setzen
        _listLastgames = [1, 2, 0, 3, 5, 4, 8, 7, 10, 9];
        _sizeLastgames = _listLastgames.length;
        
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
            var pathData  = CFG.DATA.PATH_DATA + _alias;
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
     * die Begriff-Listen.
     */
    function _checkDictionaryFiles() {
        
        // Liste der anstehenden AJAX-Anfragen initialisieren
        var fileChecks = [];
        
        // Wörterbuch iterieren, Dateien überprüfen
        $.each(_listDictionary, function(i, item) {
            $.each(_checkTermFiles(item.alias), function(type, result) {
                fileChecks.push(result.check);
                result.check.done(function() { item[type] = result.file; })
                            .fail(function() { item[type] = false;       });
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
        _serveLastgames();
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
     * Die letzten Spiele speichern.
     * Speichert die zuvor aktualisierten letzten Spieleregebnisse
     * als JSON-String im LocalStorage.
     */
    function _saveLastgames() {
        
        // !TODO: _saveLastgames() LocalStorage
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
            setProgress(data.alias, data.lvl, data.fail);
        }
    }
    
    /**
     * Fortschritt setzen.
     * Setzt den Fortschritt für einen bestimmten Begriff;
     * aktualisiert die Stufe und die Fehlschläge des Begriffs,
     * speichert den Fortschritt und aktualisiert die Listen.
     * @param {String} alias Alias des Begriffs
     * @param {Number} lvl Neue Stufe des Begriffs
     * @param {Number} fail Neue Fehlschläge des Begriffs
     */
    function setProgress(alias, lvl, fail) {
        if ((typeof _savegame[alias] !== typeof undefined) &&
            (typeof lvl              === typeof 0) &&
            (typeof fail             === typeof 0)) {
            
            // Minimum und Maximum für Level ermitteln
            var min = CFG.QUIZ.LEVELS[0];
            var max = CFG.QUIZ.LEVELS.length;
            
            // Fortschritts-Daten aktualisieren
            _savegame[alias] = {
                lvl  : Math.max(Math.min(lvl, max), min),
                fail : Math.max(fail, 0)
            };
            
            // Speichern und Listen aktualisieren
            _saveProgress();
            _updateLists();
        }
    }
    
    /**
     * Die letzten Spiele aktualisieren.
     * Ergänzt die Liste der letzten Spieleergebnisse um ein bestimmtes
     * Ergebnis beim entsprechenden Event.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _updateLastgames(event, data) {
        if ((typeof data        !== typeof undefined) &&
            (typeof data.result === typeof 0)) {
            setLastgames(data.result);
        }
    }
    
    /**
     * Die letzten Spiele setzen.
     * Fügt einen neuen Wert zur Liste der letzten Spiele hinzu;
     * kürzt die Liste wieder auf die Maximallänge, speichert sie
     * und stellt sie zur Verfügung.
     * @param {Number} result Neues Quiz-Ergebnis
     */
    function setLastgames(result) {
        if (typeof result === typeof 0) {
            
            // Neuen Wert korrigieren, Startindex für Kürzung berechnen
            var value = Math.max(Math.min(result, CFG.QUIZ.QUESTIONS), 0);
            var start = Math.max(_sizeLastgames + 1 - CFG.QUIZ.LASTGAMES, 0);
            
            // Neuen Wert hinzufügen, Liste kürzen, Länge speichern
            _listLastgames.push(value);
            _listLastgames = _listLastgames.slice(start);
            _sizeLastgames = _listLastgames.length;
            
            // Speichern und bereitstellen
            _saveLastgames();
            _serveLastgames();
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
            size    : _sizeProgress,
            max     : _sizeDictionary
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
    
    /**
     * Die letzten Spieleergebnisse bereitstellen.
     * Liefert die Ergebnisse der letzten Spiele in einem Event.
     */
    function _serveLastgames() {
        $(window).trigger(CFG.EVT.SERVE_LASTGAMES, {
            list : _listLastgames,
            size : _sizeLastgames
        });
    }
    
    // Öffentliches Interface
    return {
        init         : init,
        setProgress  : setProgress,
        setLastgames : setLastgames
    };
    
})();