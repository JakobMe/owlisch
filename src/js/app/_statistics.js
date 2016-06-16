/**
 * Statistik-Modul.
 * Steuert die Statistik der App.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var Statistics = (function() {
    
    // Selektor-Konstanten
    var _SEL_LASTGAMES          = "#statistics-lastgames";
    var _SEL_PROGRESS           = "#statistics-progress";
    var _SEL_DICTIONARY         = "#statistics-dictionary";
    var _SEL_TMPL_STATISTICS    = "#tmpl-statistics";
    var _SEL_TMPL_CHART         = "#tmpl-chart";
    
    // Private Variablen
    //var _listLastgames          = [];
    //var _listProgress           = [];
    //var _listDictionary         = [];
    
    // Templates
    var _tmplStatistics         = $(_SEL_TMPL_STATISTICS).html();
    var _tmplChart              = $(_SEL_TMPL_CHART).html();
    
    // DOM-Elemente
    var _$lastgames             = null;
    var _$progress              = null;
    var _$dictionary            = null;
    
    /**
     * Statistik initialisieren.
     * Startet Funktionen, um den Anfangszustand der Statistik herzustellen.
     */
    function init() {
        _parseTemplates();
        _bindEvents();
    }
    
    /**
     * Templates parsen.
     * Übergibt die Templates dieses Moduls an Mustache, um sie zu parsen.
     */
    function _parseTemplates() {
        Mustache.parse(_tmplStatistics);
        Mustache.parse(_tmplChart);
    }
    
    /**
     * Statistik initialisieren.
     * Initialisiert die DOM-Elemente und internen Variablen
     * des Statistik-Moduls, sobald sie bereitstehen.
     */
    function _initStatistics() {
        
        // Modulvariablen initialisieren
        _$lastgames  = $(_SEL_LASTGAMES);
        _$progress   = $(_SEL_PROGRESS);
        _$dictionary = $(_SEL_DICTIONARY);           
        
        // Letzte Spiele anfragen, View einblenden
        $(window).trigger(CFG.EVT.REQUEST_PROGRESS);
        $(window).trigger(CFG.EVT.REQUEST_DICTIONARY);
        $(window).trigger(CFG.EVT.REQUEST_LASTGAMES);
        $(window).trigger(CFG.EVT.SHOW_VIEW);
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        $(window).on(CFG.EVT.LOAD_PANEL_CONTENT, _createStatistics);
        //$(window).on(CFG.EVT.SERVE_PROGRESS, _updateProgress);
        //$(window).on(CFG.EVT.SERVE_DICTIONARY, _updateDictionary);
        //$(window).on(CFG.EVT.SERVE_LASTGAMES, _updateLastgames);
        //$(window).on(CFG.EVT.RESTORE_DEFAULT, _restoreDefault);
    }
    
    /**
     * Statistik erzeugen.
     * Erzeugt die Statistik mit Mustache in dem übergebenen
     * jQuery-Container und initialisiert die Statistik danach.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _createStatistics(event, data) {
        if ((typeof data          !== typeof undefined) &&
            (CFG.VIEW[data.panel] === CFG.VIEW.STATISTICS) &&
            (data.target instanceof $)) {

            // Template füllen, Callback ausführen
            data.target.html(Mustache.render(
                _tmplStatistics, { games: CFG.QUIZ.NUM_PROGRESS }
                )).promise().done(function() { _initStatistics(); });
        }
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();