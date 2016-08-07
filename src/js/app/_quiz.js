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
    var _SEL_INPUT              = "[data-quiz='input']";
    var _SEL_BACKSPACE          = "[data-quiz='backspace']";
    var _SEL_KEYBOARD           = "[data-quiz='keyboard']";
    var _SEL_LETTER             = "[data-quiz='letter']";
    var _SEL_SOLUTION           = "[data-quiz='solution']";
    var _SEL_SOLVE              = "[data-quiz='solve']";
    var _SEL_FORM               = "[data-quiz='form']";
    
    // Template-Namen
    var _TMPL_QUIZ              = "quiz";
    var _TMPL_FINISH            = "quiz-finish";
    var _TMPL_QUESTION          = "quiz-question";
    
    // BEM-Konstanten
    var _B_QUIZ                 = "quiz";
    var _B_STARS                = "stars";
    var _B_PROGRESSBAR          = "progressbar";
    var _B_CHART                = "chart";
    var _B_BUTTON               = "button";
    var _E_STEP                 = "step";
    var _E_ANSWERS              = "answers";
    var _E_ACTION               = "action";
    var _E_INPUT                = "input";
    var _E_SOLUTION             = "solution";
    var _M_IS                   = "is";
    var _M_ANIMATED             = "animated";
    var _M_SKIPPED              = "skipped";
    var _M_ERROR                = "error";
    var _M_SUCCESS              = "success";
    var _M_CURRENT              = "current";
    var _M_LOCKED               = "locked";
    var _M_HIDDEN               = "hidden";
    var _M_GROW                 = "grow";
    
    // Data-Attribut-Konstanten
    var _DATA_ANSWER            = "answer";
    var _DATA_LOCKED            = "locked";
    var _DATA_LETTER            = "letter";
    var _DATA_SOLUTION          = "solution";
    var _DATA_INPUT             = "input";
    var _DATA_CURRENT           = "current";
    
    // Sonstige Konstanten
    var _NUM_SLIDES_BEFORE      = 1;
    var _NUM_SLIDES_AFTER       = 1;
    var _NUM_CHARS_BREAK        = 10;
    var _ATTR_READONLY          = "readonly";
    
    // Private Variablen
    var _indexStart             = 0;
    var _indexFinish            = 0;
    var _currentStep            = 0;
    var _questions              = [];
    var _progress               = [];
    var _dataTerms              = [];
    var _dataConfig             = [];
    var _dataAlias              = "";
    var _dataCaption            = "";
    var _slider                 = null;
    
    // DOM-Elemente
    var _$quiz                  = null;
    var _$start                 = null;
    var _$finish                = null;
    var _$questions             = null;
    var _$currentQuestion       = null;
    var _$progressbar           = null;
    
    /**
     * Statistik initialisieren.
     * Startet Funktionen, um den Anfangszustand der Statistik herzustellen.
     */
    function init() {
        _subMediator();
    }
    
    /**
     * Mediator abonnieren.
     * Meldet Funktionen beim Mediator an.
     */
    function _subMediator() {
        Mediator.sub(CFG.CNL.VIEW_LOAD, _create)
                .sub(CFG.CNL.VIEW_RESTORE, _restore)
                .sub(CFG.CNL.TERMS_SERVE, _update)
                .sub(CFG.CNL.NAVBAR_ACTION, _navbarAction)
                .sub(CFG.CNL.CONFIG_SERVE, _setConfig);
    }
    
    /**
     * Klick-Events binden.
     * Bindet Klick-Funktionen an interne jQuery-Objekte.
     */
    function _bindEvents() {
        
        // Lösen-Button ein-/ausblenden
        window.addEventListener(CFG.EVT.KEYBOARD_SHOW, _hideSolve);
        window.addEventListener(CFG.EVT.KEYBOARD_HIDE, _showSolve);
        
        // Start-Buttons
        if ((_$start instanceof $) && (_$finish instanceof $)) {
            _$start.add(_$finish).on(CFG.EVT.CLICK, _SEL_BUTTON, _start);
        }
        
        // Frage-Funktionalitäten
        if (_$questions instanceof $) {
            _$questions.on(CFG.EVT.CLICK, _SEL_ANSWER, _evaluateAnswer)
                       .on(CFG.EVT.CLICK, _SEL_SOLVE, _evaluateInput)
                       .on(CFG.EVT.CLICK, _SEL_CONTINUE, _continue)
                       .on(CFG.EVT.CLICK, _SEL_BACKSPACE, _removeLetter)
                       .on(CFG.EVT.CLICK, _SEL_LETTER, _addLetter)
                       .on(CFG.EVT.SUBMIT, _SEL_FORM, _evaluateInput)
                       .on(CFG.EVT.TRANSITION, _focusInput);
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
            var questions = Util.arrFromNum(slides).slice(
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
                _slider.setSlide(_indexStart);
                
                // Wörterbuch und Fortschritt anfragen, View einblenden
                Mediator.pub(CFG.CNL.VIEW_SHOW)
                        .pub(CFG.CNL.TERMS_REQUEST)
                        .pub(CFG.CNL.CONFIG_REQUEST);
            });
        }
    }
    
    /**
     * DOM-Komponenten initialisieren.
     * Initialisiert alle DOM-Elemente des Quizes.
     */
    function _initDom() {
        _$quiz        = $(_SEL_SLIDER);
        _$progressbar = $(_SEL_PROGRESSBAR);
        _slider       = new Slider(_$quiz);
        _$start       = _$quiz.find(_SEL_START);
        _$finish      = _$quiz.find(_SEL_FINISH);
        _$questions   = _$quiz.find(_SEL_QUESTION);
        _indexStart   = _slider.getIndexOf(_SEL_START);
        _indexFinish  = _slider.getIndexOf(_SEL_FINISH);
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
     * Fortschritt setzen.
     * Setzt den Status eines Schrittes des Quizes;
     * rendert anschließend die Fortschrittsleiste.
     * @param {Number} step Nummer des Quiz-Schrittes
     * @param {String} status Neuer Status des Schrittes
     */
    function _setProgress(step, status) {
        if ((typeof step            === typeof 0) &&
            (typeof status          === typeof "") &&
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
            _currentStep = Util.limit(step, 0, CFG.QUIZ.QUESTIONS);
            _$currentQuestion = _$questions.eq(_currentStep - 1);
            _renderProgressbar();
        }
    }
    
    /**
     * Fortschritt zurücksetzen.
     * Setzt den aktuellen Fortschritt des Quizes zurück.
     */
    function _resetProgress() {
        for (var i = 1; i <= CFG.QUIZ.QUESTIONS; i++) {
            _progress[i] = "";
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
        _slider.setSlide(_slider.getSlide() + 1);
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
            Mediator.pub(CFG.CNL.QUIZ_START, { act: CFG.ACT.QUIZ_START });
            setTimeout(function() {
                _setProgressbarAnimation(true);
                _resetProgress();
                _pickQuestions();
                _processQuestions();
                _slider.setSlide(_indexStart + 1);
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
            var randomTerm = Util.getRandom(dataTemp);
            if (Util.getRandom(CFG.QUIZ.FAILS) <= randomTerm.fail) {
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
        var index = Util.limit(term.lvl, 0, _dataConfig.length - 1);
        while (config === null) {
            var type = Util.getRandom(_dataConfig[index]);
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
        var type, diff, answ, chars;
        $.each(_questions, function(i, term) {
            
            // Daten zusammenstellen
            type  = _pickQuestionType(term);
            answ  = _pickAnswers(term, type.answers, type.right, type.pictures);
            chars = _pickChars(type, answ);
            diff  = Util.limit(term.lvl, 0, CFG.QUIZ.DIFF.length - 1);
            
            // Frage einfügen
            Template.render(_$questions.eq(i), _TMPL_QUESTION, {
                answers    : answ,
                question   : (type.image ? CFG.LABEL.WHAT : CFG.LABEL.MEANING),
                image      : (type.image ? term.image : false),
                audio      : (type.audio ? term.audio : false),
                input      : (type.input ? answ[0].label : false),
                keyword    : (term[type.keyword] || CFG.LABEL.THIS),
                solve      : (chars || type.input),
                difficulty : CFG.QUIZ.DIFF[diff],
                levels     : CFG.QUIZ.LEVELS,
                lvl        : term.lvl,
                pictures   : type.pictures,
                buttons    : type.buttons,
                chars      : chars
            });
        });
    }
    
    /**
     * Zeichen auswählen.
     * Wählt anhand des gegebenen Frage-Typs und der Antworten
     * die Zeichen für die Ausgabe der Lösung aus; mischt die Zeichen
     * der Lösung durch und wandelt sie in Großbuchstaben um. Falls
     * der Typ oder die Antworten nicht stimmen, wird false zurückgegeben.
     * @param {Object} type Typ der Quiz-Frage
     * @param {Object[]} answer Antworten der Quiz-Frage
     * @returns {(Object|Boolean)} Konfiguration der Buchstaben oder false
     */
    function _pickChars(type, answer) {
        if ((typeof type.chars !== typeof undefined) && ($.isArray(answer)) &&
            (type.chars !== false) && (answer.length === 1)) {
            
            // Buchstaben mischen und in Großbuchstaben umwandeln
            var letters = [];
            $.each(Util.shuffle(answer[0].label.split("")),
                function(i, self) { letters.push(self.toUpperCase()); });
            
            // Konfiguration zurückgeben
            return {
                letters  : letters,
                solution : answer[0].label,
                width    : Util.calcPercent(1, letters.length, false),
                small    : (letters.length > _NUM_CHARS_BREAK)
            };
            
        // Ansonsten Buchstaben deaktivieren
        } else { return false; }
    }
    
    /**
     * Fragen leeren.
     * Entfernt sämtlichen Inhalt aus allen Fragen.
     * @param {Boolean} finish Quiz-Ende ebenfalls leeren
     */
    function _clearQuestions(finish) {
        _$questions.each(function() { $(this).html(""); });
        if (finish === true) { _$finish.html(""); }
    }
    
    /**
     * Antworten aussuchen.
     * Stellt für einen gegebenen Begriff zufällig Antworten zusammen.
     * @param {Object} term Begriff mit Antworten
     * @param {String} propAnswers Name der Antwort-Eigenschaft
     * @param {String} propRight Name der Korrektheit-Eigenschaft
     * @param {Boolean} pictures Antworten sind Bilder
     * @returns {Object[]} Liste der zusammengestellten Antworten
     */
    function _pickAnswers(term, propAnswers, propRight, pictures) {
        
        // Antworten zusammenstellen und mischen
        var answers = [{ label: term[propRight], correct: true }];
        if ($.isArray(term[propAnswers])) {
            var dataTemp = term[propAnswers].slice(0);
            while (answers.length < CFG.QUIZ.ANSWERS) {
                var randomAnswer = Util.getRandom(dataTemp);
                answers.push({ label: randomAnswer, correct: false });
                dataTemp.splice(dataTemp.indexOf(randomAnswer), 1);
            }
            Util.shuffle(answers);
        }
        
        // Bei Bildern das Label durch Bild-Pfad ersetzen
        if (pictures) {
            var path = CFG.DATA.PATH_DATA + _dataAlias + CFG.DATA.PATH_IMAGE;
            $.each(answers, function(i, answer) {
                answer.label = path + answer.label + CFG.DATA.TYPE_IMAGE;
            });
        }
        
        // Antworten zurückgeben
        return answers;
    }
    
    /**
     * Lösung verarbeiten.
     * Führt Funktionen aus, um eine gegebene Lösung in Abhängigkeit
     * ihrer Korrektheit zu verarbeiten; aktualisiert den Fortschritts-Balken,
     * aktualisiert die gespeicherten Daten und zeigt den Weiter-Button an.
     * @param {Boolean} correct Lösung ist korrekt
     */
    function _processSolution(correct) {
        if (typeof correct === typeof true) {
            _setProgress(_currentStep, correct ? _M_SUCCESS : _M_ERROR);
            _updateTerm(correct);
            _unlockContinue();
            _lockSkip();
        }
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
                _renderAnswers($answer, correct);
                _processSolution(correct);
            }
        }
    }
    
    /**
     * Input evaluieren.
     * Evaluiert bei einem Klick-Event das Input der aktuellen Quiz-Frage;
     * sperrt den Lösen-Button, rendert das Input anhand der Korrektheit
     * der eingegebenen Lösung neu und verarbeitet die Lösung.
     * @param {Object} event Ausgelöstes Event
     */
    function _evaluateInput(event) {
        if ((typeof event !== typeof undefined) && (event.target) &&
            (!$(event.target).closest(_SEL_SOLVE).data(_DATA_LOCKED))) {
            
            // Event verhindern
            event.preventDefault();
            
            // DOM-Elemente und Daten initialisieren
            var $input   = _$currentQuestion.find(_SEL_INPUT);
            var solution = $input.data(_DATA_SOLUTION).toUpperCase();
            var input    = $input.data(_DATA_INPUT);
                input    = (input !== undefined ? input : $input.val());
            var correct  = (input.toUpperCase() === solution);
            
            // Lösen sperren, Input aktualisiert, Lösung verarbeiten
            $input.blur();
            _lockSolve();
            _renderInput($input, correct);
            _processSolution(correct);
        }
    }
    
    /**
     * Buchstaben hinzufügen.
     * Fügt bei Klick-Event einen Buchstaben zum Quiz-Input der aktuellen
     * Frage hinzu; deaktiviert den gedrückten Button und aktualisiert
     * die Daten des Inputs.
     * @param {Object} event Ausgelöstes Event
     */
    function _addLetter(event) {
        if (typeof event !== typeof undefined) {
            var $btn = $(event.target).closest(_SEL_LETTER);
            if (!$btn.data(_DATA_LOCKED) &&
                !$btn.parents(_SEL_ANSWERS).data(_DATA_LOCKED)) {
                
                // Daten ermitteln, DOM-Elemente initialisieren
                var $char  = null;
                var $input = _$currentQuestion.find(_SEL_INPUT);
                var input  = $input.data(_DATA_INPUT);
                
                // Löschen entsperren
                _toggleBackspace(false);
                
                // Nach leerem Input suchen, Buchstabe einfügen
                $input.children().each(function(i) {
                    $char = $(this);
                    if ($char.text().length === 0) {
                        $char.text($btn.text());
                        $char.data(_DATA_LETTER, $btn.index());
                        $input.data(_DATA_INPUT, input + $btn.text());
                        $input.data(_DATA_CURRENT, i);
                        $btn.data(_DATA_LOCKED, true);
                        $btn.setMod(_B_BUTTON, _M_LOCKED, true);
                        return false;
                    }
                });
            }
        }
    }
    
    /**
     * Buchstaben entfernen.
     * Entfernt bei Klick-Event einen Buchstaben aus dem Quiz-Input der
     * aktuellen Frage; aktualisiert die Daten des Inputs und deaktiviert
     * gegebenenfalls den Backspace-Button.
     */
    function _removeLetter(event) {
        if (typeof event !== typeof undefined) {
            var $btn = $(event.target).closest(_SEL_BACKSPACE);
            if (!$btn.data(_DATA_LOCKED) &&
                !$btn.parents(_SEL_ANSWERS).data(_DATA_LOCKED)) {
                
                // DOM-Elemente und Daten initialisieren
                var $input   = _$currentQuestion.find(_SEL_INPUT);
                var current  = $input.data(_DATA_CURRENT);
                var $current = $input.children().eq(current);
                var letter   = $current.data(_DATA_LETTER);
                var input    = $input.data(_DATA_INPUT);
                
                // Elemente und Daten aktualisieren
                $current.text("").removeData(_DATA_LETTER);
                $input.data(_DATA_CURRENT, current - 1);
                $input.data(_DATA_INPUT, input.slice(0, -1));
                _$currentQuestion.find(_SEL_KEYBOARD).children().eq(letter)
                    .setMod(_B_BUTTON, _M_LOCKED, false)
                    .data(_DATA_LOCKED, false);
                
                // Backspace sperren, falls keine Buchstaben mehr
                if (current <= 0) { _toggleBackspace(true); }
            }
        }
    }
    
    /**
     * Backspace umschalten.
     * Sperrt oder entsperrt den Backspace-Button der aktuellen Frage.
     * @param {Boolean} locked Button sperren
     */
    function _toggleBackspace(locked) {
        if (typeof locked === typeof true) {
        _$currentQuestion.find(_SEL_BACKSPACE)
            .setMod(_B_BUTTON, _M_LOCKED, locked)
            .data(_DATA_LOCKED, locked);
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
            Mediator.pub(CFG.CNL.TERMS_UPDATE, {
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
            var $levels =  _$currentQuestion.find(_SEL_LEVEL);
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
        Mediator.pub(CFG.CNL.NAVBAR_ACTION, { act: CFG.ACT.QUIZ_SOLVE });
    }
    
    /**
     * Überspringen entsperren.
     * Sendet eine Nachricht über den Mediator, um den Überspringen-Button
     * zu aktivieren und somit das Überspringen möglich zu machen.
     */
    function _unlockSkip() {
        Mediator.pub(CFG.CNL.NAVBAR_ACTION, { act: CFG.ACT.QUIZ_START });
    }
    
    /**
     * Weiter-Button entsperren.
     * Entsperrt den Weiter-Button der aktuellen Frage, um es zu
     * ermöglichen, zur nächsten Frage fortzufahren.
     */
    function _unlockContinue() {
        setTimeout(function() {
            _$currentQuestion.find(_SEL_CONTINUE).data(_DATA_LOCKED, false)
                .setMod(_B_QUIZ, _E_ACTION, _M_LOCKED, false);
        }, CFG.TIME.DELAY);
    }
    
    /**
     * Lösen.Button entsperren.
     * Sperrt den Lösen-Button der aktuellen Frage.
     */
    function _lockSolve() {
        if (_$currentQuestion instanceof $) {
            _$currentQuestion.find(_SEL_SOLVE).data(_DATA_LOCKED, true)
                .setMod(_B_QUIZ, _E_ACTION, _M_LOCKED, true);
        }
    }
    
    /**
     * Lösen-Button ausblenden.
     * Blendet den Lösen-Button der aktuellen Quiz-Frage aus.
     */
    function _hideSolve() {
        if (_$currentQuestion instanceof $) {
            _$currentQuestion.find(_SEL_SOLVE).setMod(
                _B_QUIZ, _E_ACTION, _M_HIDDEN, true
            );
        }
    }
    
    /**
     * Lösen-Button einblenden.
     * Blendet den Lösen-Button der aktuellen Quiz-Frage ein.
     */
    function _showSolve() {
        if (_$currentQuestion instanceof $) {
            _$currentQuestion.find(_SEL_SOLVE).setMod(
                _B_QUIZ, _E_ACTION, _M_HIDDEN, false
            );
        }
    }
    
    /**
     * Input fokussieren.
     * Fokussiert das Input der aktuellen Quiz-Frage, falls vorhanden.
     */
    function _focusInput() {
        var $form = _$currentQuestion.find(_SEL_FORM);
        if ($form.length > 0) {
            setTimeout(function() {
                $form.find(_SEL_INPUT).focus();
            }, CFG.TIME.DELAY + CFG.TIME.ANIMATION);
        }
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
            $answer.setMod(_B_BUTTON, status, true).siblings().each(
                function() {
                    $(this).setMod(
                        _B_BUTTON, _M_SUCCESS,
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
     * Input rendern.
     * Rendert den übergebenen Input; aktualisiert seine Status-Klasse
     * und blendet die Lösung ein; sperrt das Input.
     * @param {Object} $answer DOM-Element des Inputs
     * @param {Boolean} correct Angabe, ob die Lösung korrekt ist
     */
    function _renderInput($input, correct) {
        if ($input instanceof $) {
                
            // Input modifizieren
            var status = (correct ? _M_SUCCESS : _M_ERROR);
            $input.setMod(_B_QUIZ, _E_INPUT, status, true)
                  .attr(_ATTR_READONLY, _ATTR_READONLY)
                  .parents(_SEL_ANSWERS).data(_DATA_LOCKED, true)
                  .setMod(_B_QUIZ, _E_ANSWERS, _M_LOCKED, true);
            
            // Lösung anzeigen
            _$currentQuestion.find(_SEL_SOLUTION)
                .setMod(_B_QUIZ, _E_SOLUTION, _M_LOCKED, false)
                .setMod(_B_QUIZ, _E_SOLUTION, status, true);
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
        var percent = Util.calcPercent(result, CFG.QUIZ.QUESTIONS);
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
            Mediator.pub(CFG.CNL.QUIZ_END, { act: CFG.ACT.QUIZ_CANCEL })
                    .pub(CFG.CNL.SCORES_UPDATE, result);
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
            percent   : Util.calcPercent(result, CFG.QUIZ.QUESTIONS),
            questions : Util.arrFromNum(CFG.QUIZ.QUESTIONS)
        }, setTimeout(function() {
            _$finish.find(_SEL_CHART).setMod(_B_CHART, _M_GROW, true);
        }, CFG.TIME.ANIMATION));
    }
    
    /**
     * Wörterbuch-Daten aktualisieren.
     * Aktualisiert die interne Kopie der Wörterbuch-Daten des Quizes
     * anhand einer Mediator-Nachricht.
     * @param {Object} data Übermittelte Daten
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
     * Wörterbuch-Konfiguration setzen.
     * Setzt die Konfiguration des Wörterbuches
     * anhand einer Mediator-Nachricht.
     * @param {*[]} data Übermittelte Daten
     */
    function _setConfig(data) {
        if ((typeof data       !== typeof undefined) &&
            (typeof data.alias === typeof "") &&
            ($.isArray(data.config))) {
            _dataConfig = data.config;
            _dataAlias  = data.alias;
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
        Mediator.pub(CFG.CNL.VIEW_HIDE);
        setTimeout(function() {
            Mediator.pub(CFG.CNL.QUIZ_END);
            _clearQuestions(true);
            _slider.setSlide(_indexStart);
            _resetProgress();
            if (restart === true) { _start(); }
            setTimeout(function() {
                Mediator.pub(CFG.CNL.VIEW_SHOW);
            }, CFG.TIME.DELAY);
        }, CFG.TIME.DELAY);
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();