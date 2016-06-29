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
    var _SEL_BUTTON             = "[role='button']";
    
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
        _hookMediator();
    }
    
    /**
     * Mediator abonnieren.
     * Meldet Funktionen beim Mediator an.
     */
    function _hookMediator() {
        Mediator.hook(CFG.CNL.VIEW_LOAD, _create)
                .hook(CFG.CNL.VIEW_RESTORE, _restore)
                .hook(CFG.CNL.TERMS_SERVE, _update)
                .hook(CFG.CNL.NAVBAR_ACTION, _cancel);
    }
    
    /**
     * Klick-Events binden.
     * Bindet Klick-Funktionen an interne jQuery-Objekte.
     */
    function _bindEvents() {
        if ((_$start instanceof $) && (_$finish instanceof $)) {
            _$start.add(_$finish).on(CFG.EVT.CLICK, _SEL_BUTTON, _start);
        }
    }
    
    /**
     * Quiz erzeugen.
     * Erzeugt das Quiz anhand eines Mediator-Events; fügt das Quiz
     * mittels Template ein, initialisiert die Elemente des Quiz
     * und teilt dem Mediator weitere Events mit.
     * @param {Object} data Übergebene Daten des Mediators
     */
    function _create(data) {
        if ((typeof data !== typeof undefined) &&
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
            }, function() {
                
                // Modulvariablen initialisieren
                _$slider      = $(_SEL_SLIDER);
                _$start       = $(_SEL_START);
                _$finish      = $(_SEL_FINISH);
                _$progressbar = $(_SEL_PROGRESSBAR);
                _indexStart   = parseInt(_$start.data(_DATA_SLIDE));
                _indexFinish  = parseInt(_$finish.data(_DATA_SLIDE));
                
                // Funktionen ausführen
                _resetProgress();
                _bindEvents();
                _setSlide(_indexStart);
                
                // Wörterbuch und Fortschritt anfragen, View einblenden
                Mediator.send(CFG.CNL.VIEW_SHOW)
                        .send(CFG.CNL.TERMS_REQUEST);
            });
        }
    }
    
    /**
     * Quiz starten.
     * Startet das Quiz anhand eines Klick-Events; bewegt den Slider
     * zur ersten Frage, aktiviert den ersten Schritt und sendet
     * eine Mediator-Nachricht an andere Module.
     * @param {Object} event Ausgelöstes Event
     */
    function _start(event) {
        Mediator.send(CFG.CNL.QUIZ_START, { act: CFG.ACT.QUIZ_START });
        event.preventDefault();
        _setSlide(_indexStart + 1);
        _setStep(1);
    }
    
    /**
     * Aktuellen Slide setzen.
     * Aktualisiert den aktiven Slide des Quiz-Sliders;
     * rendert den Slider anschließend neu.
     * @param {Number} slide Nummer des neuen Slides
     */
    function _setSlide(slide) {
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
        _setStep(0);
    }
    
    /**
     * Fortschritt setzen.
     * Setzt den Status eines Schrittes des Quizes;
     * rendert anschließend die Fortschrittsleiste.
     * @param {Number} step Nummer des Quiz-Schrittes
     * @param {String} status Neuer Status des Schrittes
     *
    function _setProgress(step, status) {
        if ((typeof step            === typeof 0) &&
            (typeof status          === typeof CFG.STR.EMPTY) &&
            (typeof _progress[step] !== typeof undefined)) {
            _progress[step] = status;
            _renderProgressbar();
        }
    }*/
    
    /**
     * Aktuellen Schritt setzen.
     * Setzt das Quiz auf den gegebenen Schritt; rendert die
     * Fortschrittsleiste neu.
     * @param {Number} step Neuer Quiz-Schritt
     */
    function _setStep(step) {
        if (typeof step === typeof 0) {
            _currentStep = Math.max(Math.min(step, CFG.QUIZ.QUESTIONS), 0);
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
     * @param {Object} data Daten des Events
     */
    function _update(data) {
        if ((typeof data         !== typeof undefined) &&
            (typeof data.data    !== typeof undefined) &&
            (typeof data.caption !== typeof undefined)) {
            _dataCaption = data.caption;
            _dataTerms = data.data;
        }
    }
    
    /**
     * Standard-Konfiguration wiederherstellen.
     * Stellt die Standard-Konfiguration des Quizes anhand
     * einer Mediator-Nachricht wieder her.
     * @param {String} panel Name des View-Panels
     */
    function _restore(panel) {
        if ((typeof panel   !== typeof undefined) &&
            (CFG.VIEW[panel] === CFG.VIEW.QUIZ)) {
            _resetAll();
        }
    }
    
    /**
     * Quiz abbrechen.
     * Bricht das Quiz anhand einer Mediator-Nachricht ab.
     * @param {Object} data Übermittelte Daten
     */
    function _cancel(data) {
        if ((typeof data     !== typeof undefined) &&
            (typeof data.act !== typeof undefined) &&
            (data.act        === CFG.ACT.QUIZ_CANCEL)) {
            _resetAll();
        }
    }
    
    /**
     * Alles zurücksetzen.
     * Setzt alle Kompenenten und Daten vom Quiz zurück.
     */
    function _resetAll() {
        Mediator.send(CFG.CNL.QUIZ_END).send(CFG.CNL.VIEW_HIDE);
        setTimeout(function() {
            _setSlide(_indexStart);
            _resetProgress();
            setTimeout(function() {
                Mediator.send(CFG.CNL.VIEW_SHOW);
            }, CFG.TIME.DELAY);
        }, CFG.TIME.ANIMATION);
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();