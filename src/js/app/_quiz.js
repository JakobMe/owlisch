/**
 * Quiz-Modul.
 * Steuert das Quiz der App.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var Quiz = (function() {
    
    // Selektor-Konstanten
    var _SEL_QUIZ               = ".quiz";
    var _SEL_TMPL_QUIZ          = "#tmpl-quiz";
    
    // BEM-Konstanten
    
    // Private Variablen
    
    // Templates
    var _tmplQuiz               = $(_SEL_TMPL_QUIZ).html();
    
    // DOM-Elemente
    var _$quiz                  = null;
    
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
        Mustache.parse(_tmplQuiz);
    }
    
    /**
     * Statistik initialisieren.
     * Initialisiert die DOM-Elemente und internen Variablen
     * des Statistik-Moduls, sobald sie bereitstehen.
     */
    function _initQuiz() {
        
        // Modulvariablen initialisieren
        _$quiz = $(_SEL_QUIZ);         
        
        // Wörterbuch und Fortschritt anfragen, View einblenden
        $(window).trigger(CFG.EVT.REQUEST_DICTIONARY);
        $(window).trigger(CFG.EVT.REQUEST_TERMS);
        $(window).trigger(CFG.EVT.SHOW_VIEW);
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        $(window).on(CFG.EVT.LOAD_PANEL_CONTENT, _createQuiz);
        $(window).on(CFG.EVT.RESTORE_DEFAULT, _restoreDefault);
    }
    
    /**
     * Quiz erzeugen.
     * ...
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _createQuiz(event, data) {
        if ((typeof data          !== typeof undefined) &&
            (CFG.VIEW[data.panel] === CFG.VIEW.QUIZ) &&
            (data.target instanceof $)) {

            // Template füllen, Callback ausführen
            data.target.html(Mustache.render(_tmplQuiz))
                .promise().done(function() { _initQuiz(); });
        }
    }
    
    /**
     * Standard-Konfiguration wiederherstellen.
     * ...
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _restoreDefault(event, data) {
        if ((typeof data         !== typeof undefined) &&
            (typeof data.panel   !== typeof undefined) &&
            (CFG.VIEW[data.panel] === CFG.VIEW.QUIZ)) {
            
            // !TODO: _restoreDefault()
        }
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();