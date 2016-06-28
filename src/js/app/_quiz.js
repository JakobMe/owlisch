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
    var _SEL_PROGRESSBAR        = "#quiz-progressbar";
    var _SEL_STEP               = "[role='checkbox']";
    
    // Template-Namen
    var _TMPL_QUIZ              = "quiz";
    
    // BEM-Konstanten
    var _B_SLIDER               = "slider";
    var _B_PROGRESSBAR          = "progressbar";
    var _M_IS                   = "is";
    var _E_STEP                 = "step";
    var _M_SKIPPED              = "skipped";
    var _M_ERROR                = "error";
    var _M_SUCCESS              = "success";
    var _M_CURRENT              = "current";
    
    // Data-Attribut-Konstanten
    var _DATA_SLIDE             = "slide";
    
    // Sonstige Konstanten
    var _NUM_SLIDES_BEFORE      = 1;
    var _NUM_SLIDES_AFTER       = 1;
    
    // Private Variablen
    var _indexStart             = 0;
    var _indexFinish            = 0;
    var _currentSlide           = 0;
    var _currentStep            = 0;
    var _progress               = [];
    var _dataTerms              = [];
    var _dataCaption            = CFG.STR.EMPTY;
    
    // DOM-Elemente
    var _$slider                = null;
    var _$start                 = null;
    var _$finish                = null;
    var _$progressbar           = null;
    
    /**
     * Statistik initialisieren.
     * Startet Funktionen, um den Anfangszustand der Statistik herzustellen.
     */
    function init() {
        _bindEvents();
    }
    
    /**
     * Statistik initialisieren.
     * Initialisiert die DOM-Elemente und internen Variablen
     * des Statistik-Moduls, sobald sie bereitstehen.
     */
    function _initQuiz() {
        
        // Modulvariablen initialisieren
        _$slider      = $(_SEL_SLIDER);
        _$start       = $(_SEL_START);
        _$finish      = $(_SEL_FINISH);
        _$progressbar = $(_SEL_PROGRESSBAR);
        _indexStart   = parseInt(_$start.data(_DATA_SLIDE));
        _indexFinish  = parseInt(_$finish.data(_DATA_SLIDE));
        
        // Funktionen ausführen
        _resetProgress();
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
        $(window).on(CFG.EVT.SERVE_TERMS, _updateData);
    }
    
    /**
     * Quiz erzeugen.
     * Erzeugt anhand eines Mustache-Templates den Inhalt des
     * Quiz-Panels; initialisiert das Quiz anschließend.
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
            Template.render(data.target, _TMPL_QUIZ, {
                slides    : slides,
                questions : questions,
                caption   : _dataCaption,
                size      : slides - extra
            }, _initQuiz);
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
     * Fortschritt zurücksetzen.
     * Setzt den aktuellen Fortschritt des Quizes zurück.
     */
    function _resetProgress() {
        for (var i = 1; i <= CFG.QUIZ.QUESTIONS; i++) {
            _progress[i] = CFG.STR.EMPTY;
        }
        _currentStep = 0;
        _renderProgressbar();
    }
    
    /**
     * Fortschritt setzen.
     * Setzt den Status eines Schrittes des Quizes;
     * rendert anschließend die Fortschrittsleiste.
     * @param {Number} step Nummer des Quiz-Schrittes
     * @param {String} status Neuer Status des Schrittes
     */
    function setProgress(step, status) {
        if ((typeof step            === typeof 0) &&
            (typeof status          === typeof CFG.STR.EMPTY) &&
            (typeof _progress[step] !== typeof undefined)) {
            _progress[step] = status;
            _renderProgressbar();
        }
    }
    
    /**
     * Fortschrittsleiste rendern.
     * Rendert alle Schritte der Fortschrittsleiste anhand 
     * des aktuellen Fortschrittes.
     */
    function _renderProgressbar() {
        if (_$progressbar instanceof $) {
            $.each(_$progressbar.find(_SEL_STEP), function(i, step) {
                
                // Status ermitteln
                var current = (i + 1 === _currentStep);
                var skipped = (_progress[i + 1] === _M_SKIPPED);
                var success = (_progress[i + 1] === _M_SUCCESS);
                var error   = (_progress[i + 1] === _M_ERROR);
                
                // Fortschritts-Schritte rendern
                $(step).setMod(_B_PROGRESSBAR, _E_STEP, _M_CURRENT, current)
                       .setMod(_B_PROGRESSBAR, _E_STEP, _M_SKIPPED, skipped)
                       .setMod(_B_PROGRESSBAR, _E_STEP, _M_SUCCESS, success)
                       .setMod(_B_PROGRESSBAR, _E_STEP, _M_ERROR, error);
            });
        }
    }
    
    /**
     * Wörterbuch-Daten aktualisieren.
     * Aktualisiert die interne Kopie der Wörterbuch-Daten des Quizes
     * anhand eines ausgelösten Events.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _updateData(event, data) {
        if ((typeof data         !== typeof undefined) &&
            (typeof data.data    !== typeof undefined) &&
            (typeof data.caption !== typeof undefined)) {
            _dataCaption = data.caption;
            _dataTerms = data.data;
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
    return {
        init        : init,
        setProgress : setProgress
    };
    
})();