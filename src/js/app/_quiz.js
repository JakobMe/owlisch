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
    var _SEL_CHART              = ".chart";
    
    // Template-Namen
    var _TMPL_QUIZ              = "quiz";
    var _TMPL_FINISH            = "quiz-finish";
    
    // BEM-Konstanten
    var _B_SLIDER               = "slider";
    var _B_PROGRESSBAR          = "progressbar";
    var _B_CHART                = "chart";
    var _E_STEP                 = "step";
    var _M_IS                   = "is";
    var _M_SKIPPED              = "skipped";
    var _M_ERROR                = "error";
    var _M_SUCCESS              = "success";
    var _M_CURRENT              = "current";
    var _M_GROW                 = "grow";
    
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
                .hook(CFG.CNL.NAVBAR_ACTION, _navbarAction);
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

                // Funktionen ausführen
                _initDom();
                _resetProgress();
                _bindEvents();
                _setSlider(_indexStart);
                
                // Wörterbuch und Fortschritt anfragen, View einblenden
                Mediator.send(CFG.CNL.VIEW_SHOW)
                        .send(CFG.CNL.TERMS_REQUEST);
            });
        }
    }
    
    /**
     * DOM-Komponenten initialisieren.
     * Initialisiert alle DOM-Elemente des Quizes.
     */
    function _initDom() {
        _$slider      = $(_SEL_SLIDER);
        _$start       = $(_SEL_START);
        _$finish      = $(_SEL_FINISH);
        _$progressbar = $(_SEL_PROGRESSBAR);
        _indexStart   = parseInt(_$start.data(_DATA_SLIDE));
        _indexFinish  = parseInt(_$finish.data(_DATA_SLIDE));
    }
    
    /**
     * Slider rendern.
     * Rendert den Wörterbuch-Slider anhand der intern gesetzt Variablen.
     */
    function _renderSlider() {
        _$slider.setMod(_B_SLIDER, _M_IS, _currentSlide);
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
     * Aktuellen Slide setzen.
     * Aktualisiert den aktiven Slide des Quiz-Sliders;
     * rendert den Slider anschließend neu.
     * @param {Number} slide Nummer des neuen Slides
     */
    function _setSlider(slide) {
        _currentSlide = Math.max(Math.min(slide, _indexFinish), _indexStart);
        _renderSlider();
    }
    
    /**
     * Fortschritt setzen.
     * Setzt den Status eines Schrittes des Quizes;
     * rendert anschließend die Fortschrittsleiste.
     * @param {Number} step Nummer des Quiz-Schrittes
     * @param {String} status Neuer Status des Schrittes
     */
    function _setProgress(step, status) {
        if ((typeof step            === typeof 0) &&
            (typeof status          === typeof CFG.STR.EMPTY) &&
            (typeof _progress[step] !== typeof undefined)) {
            _progress[step] = status;
            _renderProgressbar();
        }
    }
    
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
     * Schritt überspringen.
     * Markiert den aktuellen Schritt als übersprungen,
     * fährt zum nächsten Schritt vor.
     */
    function _skipStep() {
        _setProgress(_currentStep, _M_SKIPPED);
        _nextStep();
    }
    
    /**
     * Nächsten Schritt einleiten.
     * Markiert den nächsten Schritt als aktiv, bewegt den Slider weiter.
     */
    function _nextStep() {
        var next = _currentStep + 1;
        if (next > CFG.QUIZ.QUESTIONS) { _finish(); }
        _setSlider(_currentSlide + 1);
        _setStep(next);
    }
    
    /**
     * Quiz starten.
     * Startet das Quiz anhand eines Klick-Events; bewegt den Slider
     * zur ersten Frage, aktiviert den ersten Schritt und sendet
     * eine Mediator-Nachricht an andere Module.
     * @param {Object} event Ausgelöstes Event
     */
    function _start(event) {
        if (typeof event !== typeof undefined) { event.preventDefault(); }
        if (_currentStep !== 0) {
            _resetAll(true);
        } else {
            Mediator.send(CFG.CNL.QUIZ_START, { act: CFG.ACT.QUIZ_START });
            _resetProgress();
            _setSlider(_indexStart + 1);
            _setStep(1);
        }
    }
    
    /**
     * Quiz beenden.
     * Berechnet das Endergebnis vom Quiz, ermittelt die entsprechende
     * Bewertung aus der Konfiguration, rendert den Abschluss und
     * sendet das Ergebnis an andere Module.
     */
    function _finish() {
        
        // Ergebnis ermitteln
        var result = 0;
        var skipped = 0;
        $.each(_progress, function(i, status) {
            if (status === _M_SUCCESS) { result++; }
            if (status === _M_SKIPPED) { skipped++; }
        });
        
        // Bewertung ermitteln
        var rating  = CFG.RATING.BAD;
        var percent = Helper.calcPercent(result, CFG.QUIZ.QUESTIONS);
        $.each(CFG.RATING, function(i, val) {
            if ((percent        >= val.PERCENT) &&
                (rating.PERCENT <= val.PERCENT)) {
                 rating          = val;
            }
        });
        
        // Rendern und Ergebnis senden
        _renderFinish(result, skipped, rating);
        Mediator.send(CFG.CNL.QUIZ_END, { act: CFG.ACT.QUIZ_CANCEL })
                .send(CFG.CNL.SCORES_UPDATE, result);
    }
    
    /**
     * Quiz-Ende rendern.
     * Rendert das Quiz-Ende mit einem Mustache-Template; fügt
     * alle Ergebnisse des Quizes ein und animiert abschließend
     * das Ergebnis-Diagramm.
     * @param {Number} result Anzahl er richtigen Fragen
     * @param {Number} skipped Anzahl der übersprungenen Fragen
     * @param {Object} rating Bewertungs-Objekt
     */
    function _renderFinish(result, skipped, rating) {
        Template.render(_$finish, _TMPL_FINISH, {
            skipped   : skipped,
            noskip    : skipped === 0,
            result    : result,
            zero      : result === 0,
            single    : result === 1,
            rating    : rating.LABEL,
            icon      : rating.ICON,
            percent   : Helper.calcPercent(result, CFG.QUIZ.QUESTIONS),
            questions : Helper.arrayFromNumber(CFG.QUIZ.QUESTIONS)
        }, setTimeout(function() {
            _$finish.find(_SEL_CHART).setMod(_B_CHART, _M_GROW, true);
        }, CFG.TIME.ANIMATION));
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
        if ((typeof panel    !== typeof undefined) &&
            (CFG.VIEW[panel] === CFG.VIEW.QUIZ) &&
            (_currentStep    !== 0)) {
            _resetAll();
        }
    }
    
    /**
     * Navigation-Bar Aktion ausführen.
     * Entscheided anhand einer Mediator-Nachricht, welche
     * Aktion beim Klick eines Navigation-Bar-Buttons ausgeführt wird.
     * @param {Object} data Übermittelte Daten
     */
    function _navbarAction(data) {
        if ((typeof data     !== typeof undefined) &&
            (typeof data.act !== typeof undefined)) {
            switch (data.act) {
                case CFG.ACT.QUIZ_CANCEL: _resetAll(); break;
                case CFG.ACT.QUIZ_SKIP:   _skipStep(); break;
            }
        }
    }

    /**
     * Alles zurücksetzen.
     * Setzt alle Kompenenten und Daten vom Quiz zurück.
     */
    function _resetAll(restart) {
        Mediator.send(CFG.CNL.QUIZ_END).send(CFG.CNL.VIEW_HIDE);
        setTimeout(function() {
            _setSlider(_indexStart);
            _resetProgress();
            if (restart === true) { _start(); }
            setTimeout(function() {
                Mediator.send(CFG.CNL.VIEW_SHOW);
            }, CFG.TIME.DELAY);
        }, CFG.TIME.ANIMATION);
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();