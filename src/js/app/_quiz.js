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
    var _SEL_SLIDER             = "[data-quiz='slider']";
    var _SEL_START              = "[data-quiz='start']";
    var _SEL_FINISH             = "[data-quiz='finish']";
    var _SEL_PROGRESSBAR        = "[data-quiz='progressbar']";
    var _SEL_STEP               = "[data-quiz='step']";
    var _SEL_BUTTON             = "[data-quiz='button']";
    var _SEL_QUESTION           = "[data-quiz='question']";
    var _SEL_CHART              = "[data-quiz='chart']";
    var _SEL_ANSWER             = "[data-quiz='answer']";
    var _SEL_ANSWERS            = "[data-quiz='answers']";
    var _SEL_LEVEL              = "[data-quiz='level']";
    var _SEL_CONTINUE           = "[data-quiz='continue']";
    
    // Template-Namen
    var _TMPL_QUIZ              = "quiz";
    var _TMPL_FINISH            = "quiz-finish";
    var _TMPL_QUESTION          = "quiz-question";
    
    // BEM-Konstanten
    var _B_QUIZ                 = "quiz";
    var _B_SLIDER               = "slider";
    var _B_STARS                = "stars";
    var _B_PROGRESSBAR          = "progressbar";
    var _B_CHART                = "chart";
    var _E_STEP                 = "step";
    var _E_BUTTON               = "button";
    var _E_ANSWERS              = "answers";
    var _E_CONTINUE             = "continue";
    var _M_IS                   = "is";
    var _M_ANIMATED             = "animated";
    var _M_SKIPPED              = "skipped";
    var _M_ERROR                = "error";
    var _M_SUCCESS              = "success";
    var _M_CURRENT              = "current";
    var _M_LOCKED               = "locked";
    var _M_GROW                 = "grow";
    
    // Data-Attribut-Konstanten
    var _DATA_SLIDE             = "slide";
    var _DATA_ANSWER            = "answer";
    var _DATA_LOCKED            = "locked";
    
    // Sonstige Konstanten
    var _NUM_SLIDES_BEFORE      = 1;
    var _NUM_SLIDES_AFTER       = 1;
    
    // Private Variablen
    var _indexStart             = 0;
    var _indexFinish            = 0;
    var _currentSlide           = 0;
    var _currentStep            = 0;
    var _questions              = [];
    var _progress               = [];
    var _dataTerms              = [];
    var _dataCaption            = CFG.STR.EMPTY;
    
    // DOM-Elemente
    var _$slider                = null;
    var _$start                 = null;
    var _$finish                = null;
    var _$questions             = null;
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
        if (_$questions instanceof $) {
            _$questions.on(CFG.EVT.CLICK, _SEL_ANSWER, _evaluateAnswer)
                       .on(CFG.EVT.CLICK, _SEL_CONTINUE, _continue);
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
        _$progressbar = $(_SEL_PROGRESSBAR);
        _$start       = _$slider.find(_SEL_START);
        _$finish      = _$slider.find(_SEL_FINISH);
        _$questions   = _$slider.find(_SEL_QUESTION);
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
     * Fortschritts-Balken-Animationen setzen.
     * Aktiviert oder deaktiviert die Animationen für die Icons
     * des Fortschritts-Balkens.
     * @param {Boolean} animated Animationen aktiviern oder deaktivieren
     */
    function _setProgressbarAnimation(animated) {
        if (typeof animated === typeof true) {
            _$progressbar.setMod(_B_PROGRESSBAR, _M_ANIMATED, animated);
        }
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
            setTimeout(function() {
                _setProgressbarAnimation(true);
                _resetProgress();
                _pickQuestions();
                _processQuestions();
                _setSlider(_indexStart + 1);
                _setStep(1);
            }, (typeof event === typeof undefined ? 0 : CFG.TIME.ANIMATION));
        }
    }
    
    /**
     * Fragen aussuchen.
     * Sucht zufällige Fragen für das Quiz aus; stellt sicher, dass
     * jeder Begriff nur einmal im Quiz auftaucht, gewichtet die
     * die Begriffe nach ihren bisherigen Fehlschlägen (je mehr
     * Fehlschläge, desto höher die Wahrscheinlichkeit).
     */
    function _pickQuestions() {
        _questions = [];
        var dataTemp = _dataTerms.slice(0);
        while (_questions.length < CFG.QUIZ.QUESTIONS) {
            var randomTerm = Helper.getRandomItem(dataTemp);
            if (Helper.getRandomItem(CFG.QUIZ.FAILS) <= randomTerm.fail) {
                dataTemp.splice(dataTemp.indexOf(randomTerm), 1);
                _questions.push(randomTerm);
            }
        }
    }
    
    /**
     * Frage-Typen auswählen.
     * Wählt anhand eines übergebenen Begriffs und den globalen Einstellungen
     * für die Quiz-Typen einen passenden Typen für die Frage zu diesem
     * Begriff aus; zieht die Stufe des Begriffs, das Vorhandensein
     * eines Bildes und die Vollständigkeit der Antwortmöglichkeiten
     * für die Auswahl hinzu.
     * @param {Object} term Begriff-Daten für den Frage-Typen
     */
    function _pickQuestionType(term) {
        var config = null;
        var index = Helper.limit(term.lvl, 0, CFG.QUIZ_TYPES.length - 1);
        while (config === null) {
            var type = Helper.getRandomItem(CFG.QUIZ_TYPES[index]);
            if (($.isArray(term[type.answers]) &&
                (term[type.answers].length < CFG.QUIZ.ANSWERS - 1)) ||
                (type.image && !term.image)) {
                continue;
            }
            config = $.extend({}, type);
        }
        return config;
    }
    
    /**
     * Fragen aufbereiten.
     * Ergänzt die ausgewählten Fragen um zusätzliche Daten für
     * die Darstellung und Funktionsweise des Quiz; rendert
     * die Fragen anschließend.
     */
    function _processQuestions() {
        $.each(_questions, function(i, term) {
            var type = _pickQuestionType(term);
            _renderQuestion(i, {
                answers    : _pickAnswers(term, type.answers, type.right),
                question   : (type.image ? CFG.LABEL.WHAT : CFG.LABEL.MEANING),
                image      : (type.image ? term.image : false),
                audio      : (type.audio ? term.audio : false),
                keyword    : (term[type.keyword] || CFG.LABEL.THIS),
                difficulty : CFG.QUIZ.DIFFICULTIES[term.lvl],
                levels     : CFG.QUIZ.LEVELS,
                lvl        : term.lvl,
                pictures   : type.pictures,
                buttons    : type.buttons,
                chars      : type.chars,
                input      : type.input
            });
        });
    }
    
    /**
     * Frage rendern.
     * Rendert eine Frage eines bestimmten Indexes anhand der übergebenen
     * Daten mit einem Mustache-Template.
     * @param {Number} i Index der Frage
     * @param {Object} data Daten der Frage
     */
    function _renderQuestion(i, data) {
        Template.render(_$questions.eq(i), _TMPL_QUESTION, data);
    }
    
    /**
     * Fragen leeren.
     * Entfernt sämtlichen Inhalt aus allen Fragen.
     * @param {Boolean} finish Quiz-Ende ebenfalls leeren
     */
    function _clearQuestions(finish) {
        _$questions.each(function() { $(this).html(CFG.STR.EMPTY); });
        if (finish === true) { _$finish.html(CFG.STR.EMPTY); }
    }
    
    /**
     * Antworten aussuchen.
     * Stellt für einen gegebenen Begriff zufällig Antworten zusammen.
     * @param {Object} term Begriff mit Antworten
     * @returns {Object[]} Liste der zusammengestellten Antworten
     */
    function _pickAnswers(term, propAnswers, propRight) {
        var answers = [{ label: term[propRight], correct: true }];
        if ($.isArray(term[propAnswers])) {
            var dataTemp = term[propAnswers].slice(0);
            while (answers.length < CFG.QUIZ.ANSWERS) {
                var randomAnswer = Helper.getRandomItem(dataTemp);
                answers.push({ label: randomAnswer, correct: false });
                dataTemp.splice(dataTemp.indexOf(randomAnswer), 1);
            }
            Helper.shuffleArray(answers);
        }
        return answers;
    }
    
    /**
     * Antwort evaluieren.
     * Prüft, ob eine geklickte Antwort richtig oder falsch ist; setzt den
     * aktuellen Fortschritt entsprechend und rendert alle Antworten.
     * @param {Object} event Ausgelöstes Klick-Event
     */
    function _evaluateAnswer(event) {
        if (typeof event !== typeof undefined) {
            var $answer = $(event.target).closest(_SEL_ANSWER);
            var correct = $answer.data(_DATA_ANSWER);
            if (!$answer.parents(_SEL_ANSWERS).data(_DATA_LOCKED)) {
                _setProgress(_currentStep, correct ? _M_SUCCESS : _M_ERROR);
                _renderAnswers($answer, correct);
                _updateTerm(correct);
                _unlockContinue();
                _lockSkip();
            }
        }
    }
    
    /**
     * Begriff aktualisieren.
     * Aktualisiert den Begriff der aktuellen Frage entsprechend
     * der Korrektheit der gegebenen Antwort über eine Mediator-Nachricht.
     * @param {Boolean} correct Angabe, ob der Begriff richtig erraten wurde
     */
    function _updateTerm(correct) {
        if (typeof correct === typeof true) {
            var term = $.extend({}, _questions[_currentStep - 1]);
            if (correct) { _renderLevel(term.lvl + 1); }
            Mediator.send(CFG.CNL.TERMS_UPDATE, {
                alias : term.alias,
                lvl   : (correct ? term.lvl + 1 : term.lvl),
                fail  : (correct ? term.fail - 1 : term.fail + 1)
            });
        }
    }
    
    /**
     * Level-Anzeige rendern.
     * Rendert die Level-Anzeige der aktuellen Frage anhand
     * des übergebenen Levels; aktualisiert die Anzahl der Sterne
     * und beachtet dabei das Level-Maximum.
     * @param {Boolean} level Neues Level
     */
    function _renderLevel(level) {
        if (typeof level === typeof 0) {
            var $levels =  _$questions.eq(_currentStep - 1).find(_SEL_LEVEL);
            var lvl = Math.min(CFG.QUIZ.LEVELS.length, level);
            if (level <= CFG.QUIZ.LEVELS.length) {
                $levels.setMod(_B_STARS, _M_ANIMATED, true)
                       .setMod(_B_STARS, _M_IS, lvl);
            }
        }
    }
    
    /**
     * Überspringen sperren.
     * Sendet eine Nachricht über den Mediator, um den Überspringen-Button
     * zu deaktivieren und somit das Überspringen unmöglich zu machen.
     */
    function _lockSkip() {
        Mediator.send(CFG.CNL.NAVBAR_ACTION, { act: CFG.ACT.QUIZ_SOLVE });
    }
    
    /**
     * Überspringen entsperren.
     * Sendet eine Nachricht über den Mediator, um den Überspringen-Button
     * zu aktivieren und somit das Überspringen möglich zu machen.
     */
    function _unlockSkip() {
        Mediator.send(CFG.CNL.NAVBAR_ACTION, { act: CFG.ACT.QUIZ_START });
    }
    
    /**
     * Weiter-Button entsperren.
     * Entsperrt den Weiter-Button der aktuellen Frage, um es zu
     * ermöglichen, zur nächsten Frage fortzufahren.
     */
    function _unlockContinue() {
        setTimeout(function() {
            _$questions.eq(_currentStep - 1)
                .find(_SEL_CONTINUE).data(_DATA_LOCKED, false)
                .setMod(_B_QUIZ, _E_CONTINUE, _M_LOCKED, false);
        }, CFG.TIME.DELAY);
    }
    
    /**
     * Quiz fortfahren.
     * Fährt zur nächsten Frage des Quiz fort, falls der Weiter-Button
     * nicht gesperrt ist; reagiert auf ein Klick-Event.
     * @param {Object} event Ausgelöstes Klick-Event.
     */
    function _continue(event) {
        if ((typeof event !== typeof undefined) && (event.target) &&
            (!$(event.target).closest(_SEL_CONTINUE).data(_DATA_LOCKED))) {
            _unlockSkip();
            _nextStep();
        }
    }
    
    /**
     * Antworten rendern.
     * Rendert die Antworten anhand einer ausgewählten Antwort;
     * aktualisiert die Status-Klasse aller benachbarten Antworten.
     * @param {Object} $answer DOM-Element der gewählten Antwort
     * @param {Boolean} correct Angabe, ob die Antwort korrekt ist
     */
    function _renderAnswers($answer, correct) {
        if ($answer instanceof $) {
            
            // Antworten modifizieren
            var status = (correct ? _M_SUCCESS : _M_ERROR);
            $answer.setMod(_B_QUIZ, _E_BUTTON, status, true).siblings().each(
                function() {
                    $(this).setMod(
                        _B_QUIZ, _E_BUTTON, _M_SUCCESS,
                        $(this).data(_DATA_ANSWER)
                    );
                }
            );
            
            // Antworten sperren
            $answer.parents(_SEL_ANSWERS)
                   .setMod(_B_QUIZ, _E_ANSWERS, _M_LOCKED, true)
                   .data(_DATA_LOCKED, true);
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
        _setProgressbarAnimation(false);
        _renderFinish(result, skipped, rating);
        setTimeout(function() {
            _clearQuestions();
            Mediator.send(CFG.CNL.QUIZ_END, { act: CFG.ACT.QUIZ_CANCEL })
                    .send(CFG.CNL.SCORES_UPDATE, result);
        }, CFG.TIME.DELAY);
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
     * @param {Boolean} [false] restart Quiz nach dem Zurücksetzen starten
     */
    function _resetAll(restart) {
        Mediator.send(CFG.CNL.VIEW_HIDE);
        setTimeout(function() {
            Mediator.send(CFG.CNL.QUIZ_END);
            _clearQuestions(true);
            _setSlider(_indexStart);
            _resetProgress();
            if (restart === true) { _start(); }
            setTimeout(function() {
                Mediator.send(CFG.CNL.VIEW_SHOW);
            }, CFG.TIME.DELAY);
        }, CFG.TIME.DELAY);
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();