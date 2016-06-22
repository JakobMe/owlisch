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
    var _SEL_SLIDER             = "#quiz-slider";
    var _SEL_START              = "#quiz-start";
    var _SEL_FINISH             = "#quiz-finish";
    var _SEL_TMPL_QUIZ          = "#tmpl-quiz";
    
    // BEM-Konstanten
    var _B_SLIDER               = "slider";
    var _M_IS                   = "is";
    
    // Data-Attribut-Konstanten
    var _DATA_SLIDE             = "slide";
    
    // Sonstige Konstanten
    var _NUM_SLIDES_BEFORE      = 1;
    var _NUM_SLIDES_AFTER       = 1;
    
    // Private Variablen
    var _indexStart             = 0;
    var _indexFinish            = 0;
    var _currentSlide           = 0;
    
    // Templates
    var _tmplQuiz               = $(_SEL_TMPL_QUIZ).html();
    
    // DOM-Elemente
    var _$slider                = null;
    var _$start                 = null;
    var _$finish                = null;
    
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
        _$slider     = $(_SEL_SLIDER);
        _$start      = _$slider.find(_SEL_START);
        _$finish     = _$slider.find(_SEL_FINISH); 
        _indexStart  = parseInt(_$start.data(_DATA_SLIDE));
        _indexFinish = parseInt(_$finish.data(_DATA_SLIDE));
        
        // Funktionen ausführen
        _setCurrentSlide(_indexStart);
        
        // Wörterbuch und Fortschritt anfragen, View einblenden
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
            
            // Daten zusammenstellen
            var extra     = _NUM_SLIDES_BEFORE + _NUM_SLIDES_AFTER;
            var slides    = extra + CFG.QUIZ.QUESTIONS;
            var questions = Helper.arrayFromNumber(slides).slice(
                _NUM_SLIDES_BEFORE, slides - _NUM_SLIDES_AFTER
            );
            
            // Template füllen, Callback ausführen
            data.target.html(Mustache.render(_tmplQuiz,
                { slides: slides, questions: questions }
                )).promise().done(function() { _initQuiz(); });
        }
    }
    
    /**
     * Aktuellen Slide setzen.
     * Aktualisiert den aktiven Slide des Quiz-Sliders;
     * rendert den Slider anschließend neu.
     * @param {Number} slide Nummer des neuen Slides
     */
    function _setCurrentSlide(slide) {
        _currentSlide = slide;
        _renderSlider();
    }
    
    /**
     * Slider rendern.
     * Rendert den Wörterbuch-Slider anhand der intern gesetzt Variablen.
     */
    function _renderSlider() {
        _$slider.setMod(_B_SLIDER, _M_IS, _currentSlide);
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