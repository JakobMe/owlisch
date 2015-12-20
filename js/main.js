/*
 * Main-Javascript.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2015 Jakob Metzger
 */

/*
 * Warten, bis das Dokument bereit ist.
 * Sämtliche Funktionalitäten erst ausführen, sobald das Dokument
 * vollständig geladen und bereit ist.
 */
$(document).ready(function() {
    
    // Konstanten: Events
    var EVENT_CLICK             = "click";
    var EVENT_ENDED             = "ended";
    
    // Konstanen: Attribute
    var ATTR_HREF               = "href";
    var ATTR_TITLE              = "title";
    var ATTR_DATA_TAB           = "data-tab";
    var ATTR_DATA_STEP          = "data-step";
    var ATTR_DATA_LEVEL         = "data-level";
    var ATTR_DATA_CHOICE        = "data-choice";
    var ATTR_DATA_SOLUTION      = "data-solution";
    var ATTR_WIDTH              = "width";
    
    // Konstanten: IDs
    var ID_QUIZ_STEPS           = "#quiz-progress-steps";
    var ID_QUIZ_SLIDER          = "#quiz-slider";
    var ID_QUIZ_START           = "#quiz-start";
    var ID_QUIZ_RESTART         = "#quiz-restart";
    var ID_RESULT_BAR           = "#result-bar";
    var ID_RESULT_RIGHT         = "#result-right";
    var ID_RESULT_TOTAL         = "#result-total";
    var ID_TITLE                = "#bar-title-text";
    var ID_TITLE_RIGHT          = "#bar-title-right";
    var ID_TABS_INDICATOR       = "#bar-tabs-indicator";
    var ID_CONTENT_INNER        = "#content-inner";
    var ID_CONTENT              = "#content";
    var ID_VIEWPORT             = "#viewport-inner";
    
    // Konstanten: Selektoren
    var SEL_I                   = "i";
    var SEL_BODY                = "body";
    var SEL_QUIZ_CHOICES        = ".quiz-choices";
    var SEL_QUIZ_STEP           = ".quiz-progress-step";
    var SEL_QUIZ_STEP_CURRENT   = ".quiz-progress-step.current";
    var SEL_QUIZ_STEP_SUCCESS   = ".quiz-progress-step.success";
    var SEL_QUIZ_SLIDE          = ".quiz-slide.slide-";
    var SEL_QUIZ_SOLVE          = ".quiz-slide.current .quiz-solve";
    var SEL_QUIZ_SOLUTION       = ".quiz-slide.current .quiz-solution";
    var SEL_QUIZ_SOLUTION_ICON  = ".quiz-slide.current .quiz-solution-icon";
    var SEL_BUTTON_NEXT         = ".quiz-slide.current .quiz-next";
    var SEL_LEVEL               = ".quiz-slide.current .quiz-info-level";
    var SEL_INPUT_CHOICES       = ".quiz-slide.current .quiz-input-choices";
    var SEL_AUDIO_PLAY          = ".quiz-info-audio-play";
    var SEL_AUDIO               = ".quiz-info-audio";
    var SEL_INPUT_CHOICE        = ".input-choice";
    var SEL_CHOICE              = ".choice-";
    var SEL_INPUT_CHARS         = ".quiz-input-characters";
    var SEL_INPUT_CURRENT       = ".input-character.current";
    var SEL_INPUT_DELETE        = ".input-delete";
    var SEL_BUTTON              = ".button";
    var SEL_RIGHT               = ".right";
    var SEL_TAB                 = ".bar-tabs-tab";
    var SEL_TITLE_BUTTON        = ".bar-title-button";
    var SEL_NAV_BUTTON          = ".nav-button";
    var SEL_LAST_CHILD          = ":last-child";
    var SEL_FIRST_CHILD         = ":first-child";
    
    // Konstanten: CSS-Klassen
    var CLASS_FA                = "fa";
    var CLASS_QUIZ              = "quiz";
    var CLASS_WEBAPP            = "webapp";
    var CLASS_CHOICE            = "choice";
    var CLASS_CURRENT           = "current";
    var CLASS_SUCCESS           = "success";
    var CLASS_ERROR             = "error";
    var CLASS_SOLVED            = "solved";
    var CLASS_RIGHT             = "right";
    var CLASS_FULL              = "full";
    var CLASS_HIDDEN            = "hidden";
    var CLASS_QUIZ_NEXT         = "quiz-next";
    var CLASS_FINISHED          = "finished";
    var CLASS_LOCKED            = "locked";
    var CLASS_TAB               = "tab-";
    var CLASS_SLIDE             = "slide-";
    var CLASS_LEVEL             = "level-";
    
    // Konstanten: AJAX-Werte
    var AJAX_EMPTY              = "";
    var AJAX_HASH               = "#";
    var AJAX_PERCENT            = "%";
    var AJAX_PATH               = "view/";
    var AJAX_HTML               = ".html";
    var AJAX_BOOLEAN            = "boolean";
    
    // Konstanten: Views
    var VIEW_QUIZ               = "#quiz";
    
    // Konstanten: Button-Beschriftungen
    var BTN_END                 = "beenden";
    
    /**
     * Funktion: Quiz-Slider verschieben.
     * Verschiebt den Quiz-Slider auf die gegebene Position,
     * indem eine entsprechende Klasse hinzugefügt wird.
     * @param {integer} slide Nummer des Ziel-Slides
     */
    function moveQuizSlider(slide) {
        
        // Aktuelle Klasse für nächsten Slide setzen
        $(SEL_QUIZ_SLIDE + slide).addClass(CLASS_CURRENT).siblings()
                                 .removeClass(CLASS_CURRENT);
        
        // Falls Slide-Zahl gültig ist, Slider verschieben
        if (slide !== undefined) {
            $(ID_QUIZ_SLIDER).removeClass()
                .addClass(CLASS_SLIDE + slide);
        }
    }
    
    /**
     * Funktion: Quiz-Antwort offenbaren.
     * Zeigt in Abhängigkeit der gewählten Antwort an, welche
     * Antworten des Quizes richtig oder falsch waren.
     * @param {object|boolean} answer Button der gewählten Antwort oder Bool
     */
    function revealResult(answer) {
        
        // Antwortstatus initialsieren
        var answerRight;
        
        // Wenn Antwort ein boolscher Wert ist
        if (typeof answer === AJAX_BOOLEAN) {
            
            // Antwort setzen, Lösungs-Button ausblenden
            answerRight = answer;
            $(SEL_QUIZ_SOLVE).addClass(CLASS_HIDDEN);
            $(SEL_INPUT_CHOICES).addClass(CLASS_LOCKED);
            
            // Lösung zeigen
            $(SEL_QUIZ_SOLUTION).add($(SEL_QUIZ_SOLUTION_ICON)).addClass(
                answerRight ? CLASS_SUCCESS : CLASS_ERROR
            );
            
        // Wenn Antwort ein Button ist
        } else {
            
            // Aktuelles Quiz blockieren, Antwort prüfen
            answer.parents(SEL_QUIZ_CHOICES).addClass(CLASS_LOCKED);
            answerRight = answer.hasClass(CLASS_RIGHT) ? true : false;
            
            // Wenn Antwort richtig ist
            if (answerRight) {
                
                // Erfolg setzen
                answer.addClass(CLASS_SUCCESS);
            
            // Wenn Antwort falsch ist
            } else {
                
                // Fehler und Erfolg setzen
                answer.addClass(CLASS_ERROR).siblings(SEL_RIGHT)
                      .addClass(CLASS_SUCCESS);
            }
        }

        // Weiter-Button anzeigen
        $(SEL_BUTTON_NEXT).removeClass(CLASS_HIDDEN);
        
        // Aktuellen und nächsten Schritt ermitteln
        var stepCurrent = $(ID_QUIZ_STEPS).children(SEL_QUIZ_STEP_CURRENT);
        var stepNextNumber = stepCurrent.next(SEL_QUIZ_STEP)
                                        .attr(ATTR_DATA_STEP);
        
        // Wenn die Antwort richtig ist
        if (answerRight) {
            
            // Erfolg setzen
            stepCurrent.addClass(CLASS_SUCCESS);
            
            // Level ermitteln
            var levelCurrent = parseInt($(SEL_LEVEL).attr(ATTR_DATA_LEVEL));
            var levelNext = Math.min(levelCurrent + 1, 3);
            
            // Level erhöhen
            $(SEL_LEVEL).removeClass(CLASS_LEVEL + levelCurrent)
                        .addClass(CLASS_LEVEL + levelNext);

        // Wenn die Antwort falsch ist
        } else {
            
            // Fehler setzen
            stepCurrent.addClass(CLASS_ERROR);
        }
        
        // Falls nächste Zahl existiert
        if (stepNextNumber === undefined) {
            
            // Quiz abschließen
            $(ID_QUIZ_STEPS).addClass(CLASS_FINISHED);            
        }
    }
    
    /**
     * Funktion: Quiz fortschreiten lassen.
     * Setzt das Quiz auf den nächsten Schritt und setzt Erfolg/Fehler.
     */
    function progressQuiz() {
        
        // Aktueller und nächster Schritt
        var slidesNumber = $(ID_QUIZ_SLIDER).children().length;
        var stepCurrent = $(ID_QUIZ_STEPS).children(SEL_QUIZ_STEP_CURRENT);
        
        // Falls Quiz noch nicht gestartet wurde
        if (stepCurrent.length <= 0) {
            
            // Quiz-Slider zur ersten Frage verschieben
            $(ID_VIEWPORT).addClass(CLASS_QUIZ);
            setTimeout(function() {
                $(ID_QUIZ_STEPS).children(SEL_QUIZ_STEP).first().addClass(CLASS_CURRENT);
                moveQuizSlider(1);
            }, 300);
            
        // Falls Quiz bereits läuft
        } else {
            
            // Nächsten Schritt ermitteln
            var stepNext = stepCurrent.next(SEL_QUIZ_STEP);
            var stepNextNumber = stepNext.attr(ATTR_DATA_STEP);
            
            // Aktuellen Schritt als gelöst markieren, nächsten Schritt aktivieren
            stepCurrent.removeClass(CLASS_CURRENT).addClass(CLASS_SOLVED);
            
            // Falls nächste Zahl existiert
            if (stepNextNumber !== undefined) {
                
                // Nächsten Schritt aktivieren, Quiz-Slider verschieben
                stepNext.addClass(CLASS_CURRENT);
                moveQuizSlider(stepNextNumber);
            
            // Falls Quiz am Ende ist
            } else {
                
                // Ergebniss zusammenzählen
                var steps = $(ID_QUIZ_STEPS);
                var stepsTotal = steps.children(SEL_QUIZ_STEP).length;
                var stepsRight = steps.children(SEL_QUIZ_STEP_SUCCESS).length;
                var percentRight = (stepsRight / stepsTotal) * 100;
                
                // Richtig-Leiste setzen
                $(ID_RESULT_BAR).removeClass(CLASS_HIDDEN)
                                .css(ATTR_WIDTH, percentRight + AJAX_PERCENT);
                
                // Zahlen setzen
                $(ID_RESULT_RIGHT).text(stepsRight);
                $(ID_RESULT_TOTAL).text(stepsTotal);
                
                // Wenn keine richtige Antwort, Leiste ausblenden        
                if (stepsRight === 0) {
                    $(ID_RESULT_BAR).addClass(CLASS_HIDDEN);
                }
                
                // Wenn alle richtigen Antworten, Leiste anpassen 
                if (stepsRight === stepsTotal) {
                    $(ID_RESULT_BAR).addClass(CLASS_FULL);
                }
                
                // Quiz beenden, zum letzten Slide gehen
                $(ID_VIEWPORT).removeClass(CLASS_QUIZ);
                moveQuizSlider(slidesNumber - 2);
                
                // "Beenden"-Button zurücksetzen
                resetTitleButtonRight();
            }
        }
    }
    
    /**
     * Funktion: View ändern.
     * Blendet den Inhalt aus, um per AJAX eine bestimmte
     * View zu laden; der Name der View muss mit dem Dateinamen
     * übereinstimmen. Blendet anschließend den Inhalt wieder ein.
     * @param {string} view Name der View
     * @return {boolean} false bei AJAX-Fehler, sonst true
     */
    function changeView(view, callback) {
        
        // Wenn erstes Zeichen eine Raute ist, entfernen
        if (view.charAt(0) === AJAX_HASH) {
            view = view.substring(1);
        }
        
        // Inhalt ausblenden
        $(ID_CONTENT).addClass(CLASS_HIDDEN);
        
        // Inhalt laden
        setTimeout(function() {
            $(ID_CONTENT_INNER).load(AJAX_PATH + view + AJAX_HTML, function() {
                setTimeout(function() {
                    
                    // Inhalt einblenden
                    $(ID_CONTENT).removeClass(CLASS_HIDDEN);
                    
                    // Callback
                    if ($.isFunction(callback)) {
                        callback();
                    }
                    
                }, 300);
            });
        }, 300);
    }
    
    /**
     * Funktion: Titel-Button setzen.
     * Setzt einen Link, Text und ein Icon für einen Titel-Button,
     * sperrt/entsperrt den Button.
     * @param {object} button jQuery-Objekt des Buttons
     * @param {string} text Button-Text
     * @param {string} href HREF-Attribut des Links
     * @param {string} icon FontAwesome Icon-Name
     * @param {boolean} locked Button sperren/entsperren
     */
    function setTitleButton(button, text, href, icon, locked) {
        
        // Button Link, Text und Icon setzen
        button.attr(ATTR_HREF, href);
        button.children(SEL_TITLE_BUTTON).text(text);
        button.children(SEL_I).removeClass().addClass(CLASS_FA).addClass(icon);
        
        // Button sperren/entsperren
        if (locked === true) { button.addClass(CLASS_LOCKED); }
        else if (locked === false) { button.removeClass(CLASS_LOCKED); }
    }
    
    /**
     * Funktion: Rechten Titel-Button zurücksetzen.
     * Setzt den rechten Titel-Button auf leere Werte zurück
     * und sperrt ihn.
     */
    function resetTitleButtonRight() {
        setTitleButton(
            $(ID_TITLE_RIGHT), AJAX_EMPTY,
            AJAX_EMPTY, AJAX_EMPTY, true
        );
    }
    
    /**
     * Funktion: Quiz starten.
     * Greift auf andere Funktionen zurück, um das Quiz
     * zu starten; setzt den "Beenden"-Button in der Titel-Leiste.
     */
    function startQuiz() {
        
        // Starten
        progressQuiz();
        
        // "Beenden"-Button aktivieren
        setTitleButton(
            $(ID_TITLE_RIGHT), BTN_END, VIEW_QUIZ,
            AJAX_EMPTY, false
        );
    }
    
    /**
     * Funktion: Buchstaben-Eingabe steuern.
     * Steuer die Buchstaben-Eingabe bei entsprechenden Quiz-Typen;
     * erlaubt das Eingeben von Buchstaben aus einer Auswahl und das
     * Löschen des zuletzt eingegebenen Buchstabens.
     * @param {object} button jQuery-Objekt des gedrückten Buttons
     */
    function controlCharacterInput(button) {
        
        // Wenn Eingabe nicht gesperrt ist
        if (!button.parent().hasClass(CLASS_LOCKED)) {
            
            // Buchstabe und aktuellen Input ermitteln
            var inputChar = button.text();
            var inputCharacters = button.parent().siblings(SEL_INPUT_CHARS);
            var inputCurrent = inputCharacters.children(SEL_INPUT_CURRENT);
            var inputNext = inputCurrent.next();
            var inputPrev = inputCurrent.prev();
            var inputChoice = button.attr(ATTR_DATA_CHOICE);
            
            // Wenn Button ein Input-Lösch-Button ist
            if (button.is($(SEL_INPUT_DELETE))) {
                
                // Falls überhaupt gelöscht werden kann
                if (inputPrev.length > 0) {
                    
                    // Wenn aktueller Input der letzte ist
                    if (inputCurrent.is(SEL_LAST_CHILD) &&
                        inputCharacters.hasClass(CLASS_FULL)) {
                        
                        // Input löschen, nach links verschieben
                        inputCurrent.text(AJAX_EMPTY);
                        inputCharacters.removeClass(CLASS_FULL);
                        
                        // Auswahl-Button entsperren
                        button.siblings(
                            SEL_CHOICE + inputCurrent.attr(ATTR_DATA_CHOICE)
                        ).removeClass(CLASS_LOCKED);
                        
                    // Ansonsten
                    } else {
                        
                        // Input löschen, nach links verschieben
                        inputCurrent.removeClass(CLASS_CURRENT);
                        inputPrev.text(AJAX_EMPTY).addClass(CLASS_CURRENT);
                        
                        // Auswahl-Button entsperren
                        button.siblings(
                            SEL_CHOICE + inputPrev.attr(ATTR_DATA_CHOICE)
                        ).removeClass(CLASS_LOCKED);
                        
                        // Löschen-Button sperren, wenn erster Input gelöscht wurde
                        if (inputPrev.is(SEL_FIRST_CHILD)) {
                            button.addClass(CLASS_LOCKED);
                        }
                    }
                }
                
            // Ansonsten
            } else {
    
                // Wenn Input nicht schon voll ist
                if (!inputCharacters.hasClass(CLASS_FULL)) {
                    
                    // Button sperren
                    button.addClass(CLASS_LOCKED).siblings(SEL_INPUT_DELETE)
                          .removeClass(CLASS_LOCKED);
                    
                    // Buchstaben ausfüllen, Input verschieben
                    inputCurrent.text(inputChar)
                        .attr(ATTR_DATA_CHOICE, inputChoice);
                    
                    // Wenn aktueller Input das letzte Feld ist
                    if (inputCurrent.is(SEL_LAST_CHILD)) {
                        inputCharacters.addClass(CLASS_FULL);
                    } else {
                        inputCurrent.removeClass(CLASS_CURRENT);
                        inputNext.addClass(CLASS_CURRENT);
                    }
                }
            }
        }
    }
    
    /*
     * Bei Klick auf Quiz-Buttons.
     * Entscheided anhand der Eigenschaften, ob das Quit ausgelöst werden,
     * begonnen werden oder fortgeführt werden soll.
     */
    $(SEL_BODY).on(EVENT_CLICK, SEL_BUTTON, function() {
        
        // Button definieren
        var button = $(this);
        
        // Falls Button ein Weiter-Button ist
        if (button.hasClass(CLASS_QUIZ_NEXT)) {
                
            // Quit fortführen
            progressQuiz();
            
        // Wenn Button kein Weiter-Button ist
        } else {
            
            // Wenn Antworten nicht blockiert sind, Frage auflösen
            if ((button.hasClass(CLASS_CHOICE)) &&
                (!button.parents(SEL_QUIZ_CHOICES).hasClass(CLASS_LOCKED))) {
                revealResult($(this));
            }
            
            // Falls Button ein Buchstaben-Input ist
            if ((button.is($(SEL_INPUT_CHOICE)) &&
                !button.hasClass(CLASS_LOCKED)) ||
                (button.is($(SEL_INPUT_DELETE)))) {
                
                // Input steuern
                controlCharacterInput(button);
            }
            
            // Wenn Button ein Quiz-Löse-Button ist
            if (button.is(SEL_QUIZ_SOLVE)) {
                
                // Lösung ermitteln, Nutzer-Lösung initialisieren
                var solution = $(SEL_QUIZ_SOLUTION);
                var solutionWord = solution.attr(ATTR_DATA_SOLUTION);
                var solutionUser = AJAX_EMPTY;
                
                // Nutzerlösung zusammenstellen
                solution.children().each(function() {
                    solutionUser += $(this).text();
                });

                // Ergebnis zeigen
                revealResult(
                    solutionWord.toUpperCase() ===
                    solutionUser.toUpperCase() ? true : false
                );
            }
            
            // Wenn Quiz gestartet wurde
            if (button.is($(ID_QUIZ_START))) {
                startQuiz();
            }
            
            // Wenn Quiz neu gestartet wurde
            if (button.is($(ID_QUIZ_RESTART))) {
                
                // Quiz laden, zur ersten Frage springen
                changeView(VIEW_QUIZ, function() {
                    startQuiz();
                });
            }
        }
        
    });
    
    /*
     * Bei Klick auf "Audio abspielen".
     * Spielt eine Audio-Datei ab, wenn der entsprechende
     * Button geklickt wird.
     */
    $(SEL_BODY).on(EVENT_CLICK, SEL_AUDIO_PLAY, function() {
        
        // Button und Audio definieren
        var button = $(this);
        var audio = $(this).siblings(SEL_AUDIO).get(0);
        
        // Button markieren, Audio abspielen
        button.addClass(CLASS_CURRENT);
        audio.play();
        
        // Wenn Audio beendet wurde, Markierung entfernen
        audio.addEventListener(EVENT_ENDED, function() {
            button.removeClass(CLASS_CURRENT);
        });
        
    });
    
    /*
     * Bei Klick auf Tab.
     * Setzt den App-Titel und lädt den entsprechenden Inhalt,
     * wenn ein Tab in der Tab-Leiste geklickt wird.
     */
    $(SEL_TAB).click(function(event) {
        
        // Event aufhalten
        event.preventDefault();
        
        // Titel und neuen Inhalt setzen
        $(ID_TITLE).text($(this).attr(ATTR_TITLE));
        changeView($(this).attr(ATTR_HREF).substring(1));
        
        // Tab-Indikator verschieben
        $(ID_TABS_INDICATOR).removeClass().addClass(
            CLASS_TAB + $(this).attr(ATTR_DATA_TAB)
        );
        
        // Tab aktivieren
        $(this).addClass(CLASS_CURRENT).siblings().removeClass(CLASS_CURRENT);
        
    });
    
    /*
     * Bei Klick auf Navigations-Button (Titel-Leiste).
     * Prüft, ob Button gesperrt ist und ändert die View entsprechend
     * der Attribute des Buttons.
     */
    $(SEL_NAV_BUTTON).click(function(event) {
        
        // Event aufhalten
        event.preventDefault();
        
        // Wenn Button nicht gesperrt ist
        if (!$(this).hasClass(CLASS_LOCKED)) {
            
            // View ermitteln
            var view = $(this).attr(ATTR_HREF);
            
            // Wenn View "#quiz" ist
            if (view === VIEW_QUIZ) {
                
                // View ändern
                changeView(view.substring(1));
                
                // Button zurücksetzen
                resetTitleButtonRight();
                
                // Viewport Quiz-Modus deaktivieren
                setTimeout(function() {
                    $(ID_VIEWPORT).removeClass(CLASS_QUIZ);
                }, 300);
            }
        }
        
    });
    
    /*
     * Sobald das Fenster geladen wurde.
     * Auf das Laden des Fensters warten, bevor Funktionen
     * aufgerufen werden, die beim Seitenaufruf die Seitenstruktur
     * beeinflussen.
     */
    $(window).load(function() {
        
        $(function() {
            FastClick.attach(document.body);
        });
        
        // Falls die Seite als iOS Webapp ausgeführt wird
        if (window.navigator.standalone) {
            $(SEL_BODY).addClass(CLASS_WEBAPP);
        }
    
    });
    
});