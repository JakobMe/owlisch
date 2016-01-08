/*
 * Main-Javascript.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
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
    var EVENT_FOCUS             = "focus";
    var EVENT_SUBMIT            = "submit";
    var EVENT_LOADEDDATA        = "loadeddata";
    
    // Konstanen: Attribute
    var ATTR_HREF               = "href";
    var ATTR_TITLE              = "title";
    var ATTR_DATA_TAB           = "data-tab";
    var ATTR_DATA_STEP          = "data-step";
    var ATTR_DATA_LEVEL         = "data-level";
    var ATTR_DATA_CHOICE        = "data-choice";
    var ATTR_DATA_SOLUTION      = "data-solution";
    var ATTR_DATA_SORT          = "data-sort";
    var ATTR_DATA_DIR           = "data-dir";
    var ATTR_WIDTH              = "width";
    var ATTR_DISABLED           = "readonly";
    
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
    var ID_TITLE_LEFT           = "#bar-title-left";
    var ID_TABS_INDICATOR       = "#bar-tabs-indicator";
    var ID_DICTIONARY_SLIDER    = "#dictionary-slider";
    var ID_DICTIONARY_SORT      = "#dictionary-sort";
    var ID_CONTENT_DICTIONARY   = "#content-dictionary";
    var ID_CONTENT_INNER        = "#content-inner";
    var ID_CONTENT              = "#content";
    var ID_VIEWPORT             = "#viewport-inner";
    
    // Konstanten: Selektoren
    var SEL_I                   = "i";
    var SEL_BODY                = "body";
    var SEL_BODY_HTML           = "body, html";
    var SEL_QUIZ_CHOICES        = ".quiz-choices";
    var SEL_QUIZ_STEP           = ".quiz-progress-step";
    var SEL_QUIZ_STEP_CURRENT   = ".quiz-progress-step.current";
    var SEL_QUIZ_STEP_SUCCESS   = ".quiz-progress-step.success";
    var SEL_QUIZ_SLIDE          = ".quiz-slide.slide-";
    var SEL_QUIZ_SOLVE          = ".quiz-slide.current .quiz-solve";
    var SEL_QUIZ_SOLUTION       = ".quiz-slide.current .quiz-solution";
    var SEL_BUTTON_NEXT         = ".quiz-slide.current .quiz-next";
    var SEL_LEVEL               = ".quiz-slide.current .quiz-info-level";
    var SEL_INPUT_CHOICES       = ".quiz-slide.current .quiz-input-choices";
    var SEL_AUDIO_PLAY          = ".quiz-info-audio-play";
    var SEL_AUDIO               = ".quiz-info-audio";
    var SEL_QUIZ_INPUT_TEXT     = ".quiz-input-text";
    var SEL_INPUT_TEXT          = ".input-text";
    var SEL_INPUT_CHOICE        = ".input-choice";
    var SEL_CHOICE              = ".choice-";
    var SEL_SLIDE               = ".slide-";
    var SEL_INPUT_CHARS         = ".quiz-input-characters";
    var SEL_INPUT_CURRENT       = ".input-character.current";
    var SEL_INPUT_DELETE        = ".input-delete";
    var SEL_DICTIONARY_WORD     = ".dictionary-word";
    var SEL_DICTIONARY_SORT     = "#dictionary-sort .sort";
    var SEL_BUTTON              = ".button";
    var SEL_RIGHT               = ".right";
    var SEL_TAB                 = ".bar-tabs-tab";
    var SEL_TITLE_BUTTON        = ".bar-title-button";
    var SEL_NAV_BUTTON          = ".nav-button";
    var SEL_STATISTICS          = ".statistics";
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
    var CLASS_LOADING           = "loading";
    var CLASS_QUIZ_NEXT         = "quiz-next";
    var CLASS_FINISHED          = "finished";
    var CLASS_LOCKED            = "locked";
    var CLASS_AUTOFOCUS         = "autofocus";
    var CLASS_GROW              = "grow";
    var CLASS_TAB               = "tab-";
    var CLASS_SLIDE             = "slide-";
    var CLASS_LEVEL             = "level-";
    var CLASS_ICON_BACK         = "fa-chevron-left";
    var CLASS_ICON_SORT         = "fa-sort";
    
    // Konstanten: AJAX-Werte
    var AJAX_PATH               = "view/";
    var AJAX_PHP                = ".php";
    var AJAX_SORT_ALPHA         = "alpha";
    var AJAX_SORT_ASC           = "asc";
    
    // Konstanten: String
    var STR_EMPTY               = "";
    var STR_SPACE               = " ";
    var STR_HASH                = "#";
    var STR_PERCENT             = "%";
    var STR_UNDEFINED           = "undefined";
    var STR_BOOLEAN             = "boolean";
    var STR_END                 = "beenden";
    
    // Konstanten: Views
    var VIEW_QUIZ               = "#quiz";
    var VIEW_HOME               = "#home";
    var VIEW_PROGRESS           = "#progress";
    var VIEW_DICTIONARY         = "#dictionary";
    var VIEW_SORT               = "#sort";
    var VIEW_WORD               = "#word";

    // Konstanten: Zeiten
    var TIME_ANIMATION          = 300;
    var TIME_ANIMATION_HALF     = TIME_ANIMATION / 2;
    var TIME_ANIMATION_LONG     = TIME_ANIMATION * 1.5;
    var TIME_ANIMATION_LONGER   = TIME_ANIMATION * 2;
    
    // Chaches initialisieren
    var cacheView = [];
    var cacheDictionary = [];
    
    /**
     * Funktion: Quiz-Slider verschieben.
     * Verschiebt den Quiz-Slider auf die gegebene Position,
     * indem eine entsprechende Klasse hinzugefügt wird.
     * @param {integer} slide Nummer des Ziel-Slides
     */
    function moveQuizSlider(slide) {
        
        // Neuen Slide definieren
        var newSlide = $(SEL_QUIZ_SLIDE + slide);
        
        // Aktuelle Klasse für nächsten Slide setzen
        newSlide.addClass(CLASS_CURRENT).siblings().removeClass(CLASS_CURRENT);
        
        // Falls Slide-Zahl gültig ist
        if (slide !== undefined) {
            
            // Slieder verschieben
            $(ID_QUIZ_SLIDER).removeClass().addClass(CLASS_SLIDE + slide);
            
            // Autofokus
            setTimeout(function() {    
                if (newSlide.hasClass(CLASS_AUTOFOCUS)) {
                    $(SEL_QUIZ_SLIDE + slide + STR_SPACE + SEL_INPUT_TEXT)
                        .focus();
                }
            }, TIME_ANIMATION_LONG);
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
        if (typeof answer === STR_BOOLEAN) {
            
            // Antwort setzen, Lösungs-Button ausblenden
            answerRight = answer;
            $(SEL_QUIZ_SOLVE).addClass(CLASS_HIDDEN);
            $(SEL_INPUT_CHOICES).addClass(CLASS_LOCKED);
            
            // Lösung zeigen
            $(SEL_QUIZ_SOLUTION).addClass(
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
                moveQuizSlider(1);
                $(ID_QUIZ_STEPS).children(SEL_QUIZ_STEP).first()
                                .addClass(CLASS_CURRENT);
            }, TIME_ANIMATION);
            
        // Falls Quiz bereits läuft
        } else {
            
            // Nächsten Schritt ermitteln
            var stepNext = stepCurrent.next(SEL_QUIZ_STEP);
            var stepNextNumber = stepNext.attr(ATTR_DATA_STEP);
            
            // Aktuellen Schritt lösen, nächsten Schritt aktivieren
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
                                .css(ATTR_WIDTH, percentRight + STR_PERCENT);
                
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
                
                // Ergebnisleiste
                setTimeout(function() {
                    $(ID_RESULT_BAR).addClass(CLASS_GROW);
                }, TIME_ANIMATION_LONGER);
                
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
     * @param {function} callback (optionale) Callback-Funktion
     * @param {object} params (optionale) POST-Parameter für Ajax
     * @return {boolean} false bei AJAX-Fehler, sonst true
     */
    function changeView(view, callback, params) {
        
        // Linken Titel-Button zurücksetzen
        resetTitleButtonLeft();
        
        // Wenn View Wörterbuch ist, Sortier-Button setzen
        if (view === VIEW_DICTIONARY) {
            if ($(ID_TITLE_RIGHT).attr(ATTR_HREF) !== VIEW_SORT) {
                setTitleButton(
                    $(ID_TITLE_RIGHT), STR_EMPTY, VIEW_SORT,
                    CLASS_ICON_SORT, false
                );
            }
            
        // Ansonsten rechten Titel-Button zurücksetzen
        } else {
            resetTitleButtonRight();
        }

        // Wenn erstes Zeichen eine Raute ist, entfernen
        if (view.charAt(0) === STR_HASH) {
            view = view.substring(1);
        }
        
        // Wenn keine Parameter angegeben sind, Standard definieren
        if (typeof params === STR_UNDEFINED) {
            params = { post: STR_EMPTY };
        }
        
        // Inhalt ausblenden
        $(ID_CONTENT).addClass(CLASS_HIDDEN);
        
        // Warten
        setTimeout(function() {
            
            // Wenn View bereits im Cache ist
            if (typeof cacheView[view] !== STR_UNDEFINED) {

                // Inhalt laden
                $(ID_CONTENT_INNER).html(cacheView[view])
                                   .promise().done(function() {
                                   
                    // Inhalt einblenden, Callback
                    $(ID_CONTENT).removeClass(CLASS_HIDDEN);
                    if ($.isFunction(callback)) { callback(); }
                });
                
            // Wenn View zum ersten Mal geladen wird
            } else {
                
                // Dateipfad zusammensetzen
                var file = AJAX_PATH + view + AJAX_PHP;
        
                // Inhalt laden
                $(ID_CONTENT_INNER).load(file, params, function(response) {

                    // Inhalt einblenden, Callback
                    $(ID_CONTENT).removeClass(CLASS_HIDDEN);
                    if ($.isFunction(callback)) { callback(); }
                    
                    // Falls Datei noch nicht gecached ist, cachen
                    if (typeof cacheView[view] === STR_UNDEFINED) {
                        cacheView[view] = response;
                    }
                });
            }
        }, TIME_ANIMATION);
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
        
        // Button ausblenden
        button.addClass(CLASS_LOCKED);
        
        // Auf Animation warten
        setTimeout(function() {
            
            // Button Link, Text und Icon setzen
            button.attr(ATTR_HREF, href);
            button.children(SEL_TITLE_BUTTON).text(text);
            button.children(SEL_I).removeClass().addClass(CLASS_FA).addClass(icon);
            
            // Button entsperren/einblenden
            if (locked === false) { button.removeClass(CLASS_LOCKED); }
            
        }, TIME_ANIMATION);
    }
    
    /**
     * Funktion: Rechten Titel-Button zurücksetzen.
     * Setzt den rechten Titel-Button auf leere Werte zurück und sperrt ihn.
     */
    function resetTitleButtonRight() {
        setTitleButton(
            $(ID_TITLE_RIGHT), STR_EMPTY,
            STR_EMPTY, STR_EMPTY, true
        );
    }
    
    /**
     * Funktion: Linken Titel-Button zurücksetzen.
     * Setzt den linken Titel-Button auf leere Werte zurück und sperrt ihn.
     */
    function resetTitleButtonLeft() {
        setTitleButton(
            $(ID_TITLE_LEFT), STR_EMPTY,
            STR_EMPTY, STR_EMPTY, true
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
            $(ID_TITLE_RIGHT), STR_END, VIEW_QUIZ,
            STR_EMPTY, false
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
                        inputCurrent.text(STR_EMPTY);
                        inputCharacters.removeClass(CLASS_FULL);
                        
                        // Auswahl-Button entsperren
                        button.siblings(
                            SEL_CHOICE + inputCurrent.attr(ATTR_DATA_CHOICE)
                        ).removeClass(CLASS_LOCKED);
                        
                    // Ansonsten
                    } else {
                        
                        // Input löschen, nach links verschieben
                        inputCurrent.removeClass(CLASS_CURRENT);
                        inputPrev.text(STR_EMPTY).addClass(CLASS_CURRENT);
                        
                        // Auswahl-Button entsperren
                        button.siblings(
                            SEL_CHOICE + inputPrev.attr(ATTR_DATA_CHOICE)
                        ).removeClass(CLASS_LOCKED);
                        
                        // Button sperren, wenn erster Input gelöscht wurde
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
                var solutionWord = solution.attr(ATTR_DATA_SOLUTION).trim();
                var solutionUser = STR_EMPTY;
                
                // Wenn Lösung ein Text-Input ist
                if (solution.is(SEL_QUIZ_INPUT_TEXT)) {
                    
                    // Nutzerlösung aus Input ermitteln
                    solutionUser = solution.children().val().trim();
                    if (solutionUser !== STR_EMPTY) {
                        solution.children().attr(ATTR_DISABLED, ATTR_DISABLED);
                    }
                    
                // Wenn Lösung eine Buchstaben-Eingabe ist
                } else {
                    
                    // Nutzerlösung zusammenstellen
                    solution.children().each(function() {
                        solutionUser += $(this).text().trim();
                    });
                }
                
                // Ergebnis zeigen (wenn nicht leer)
                if (solutionUser !== STR_EMPTY) {
                    revealResult(
                        solutionWord.toUpperCase() ===
                        solutionUser.toUpperCase() ? true : false
                    );
                }
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
     * Beim Abschicken eines Quiz-Formulars.
     * Verhindert das Standardverhalten des Formulars,
     * prüft das eingegebene Wort und zeigt das Ergebnis an.
     */
    $(SEL_BODY).on(EVENT_SUBMIT, SEL_QUIZ_INPUT_TEXT, function(event) {
        
        // Ergebnis ermitteln
        var solution = $(this);
        var solutionWord = solution.attr(ATTR_DATA_SOLUTION).trim();
        var solutionUser = solution.children().val().trim();
        
        // Wenn Lösung nicht leer ist
        if (solutionUser !== STR_EMPTY) {
            
            // Input deaktivieren
            solution.children().blur().attr(ATTR_DISABLED, ATTR_DISABLED);
            
            // Ergebnis zeigen
            revealResult(
                solutionWord.toUpperCase() ===
                solutionUser.toUpperCase() ? true : false
            );
        }
        
        // Event verhindern
        event.preventDefault();
        return false; 
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
        
        // Wenn Audio noch nicht geladen wurde, Klasse hinzufügen
        if (audio.readyState !== 4) { button.addClass(CLASS_LOADING); }
        
        // Wenn Audio beendet wurde, Markierung entfernen
        audio.addEventListener(EVENT_ENDED, function() {
            button.removeClass(CLASS_CURRENT);
        });
        
        // Wenn Audio geladen wurde, Klasse entfernen
        audio.addEventListener(EVENT_LOADEDDATA, function() {
            button.removeClass(CLASS_LOADING);
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
        
        // Tab, Titel, View und Callback definieren
        var tab = $(this);
        var title = $(ID_TITLE);
        var view = $(this).attr(ATTR_HREF);
        var callback = null;
        var params = null;
        
        // Titel setzen
        title.addClass(CLASS_HIDDEN);
        setTimeout(function() {
            title.text(tab.attr(ATTR_TITLE))
                 .removeClass(CLASS_HIDDEN);
        }, TIME_ANIMATION);
        
        // Tab-Indikator verschieben
        $(ID_TABS_INDICATOR).removeClass().addClass(
            CLASS_TAB + tab.attr(ATTR_DATA_TAB)
        );
        
        // Tab aktivieren
        tab.addClass(CLASS_CURRENT).siblings().removeClass(CLASS_CURRENT);
        
        // Post-Parameter beim Wörterbuch-Tab setzen (Sortierung)
        if (view === VIEW_DICTIONARY) {
            params = { sort: AJAX_SORT_ALPHA, dir: AJAX_SORT_ASC };
        }
        
        // Callback-Funktion beim Fortschritts-Tab setzen
        if (view === VIEW_PROGRESS) {
            callback = function() {
                setTimeout(function() {
                    $(SEL_STATISTICS).addClass(CLASS_GROW);
                }, TIME_ANIMATION);
            };
        }
        
        // View ändern
        changeView(view, callback, params);
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
                }, TIME_ANIMATION_HALF);
                
            // Wenn View "#dictionary" ist
            } else if (view === VIEW_DICTIONARY) {
                
                // Zurück-Button zurücksetzen
                resetTitleButtonLeft();
                
                // Sortier-Button setzen
                setTitleButton(
                    $(ID_TITLE_RIGHT), STR_EMPTY, VIEW_SORT,
                    CLASS_ICON_SORT, false
                );
                
                // Slider verschieben, Scroll-Container zurücksetzen
                $(ID_DICTIONARY_SLIDER)
                    .removeClass().addClass(CLASS_SLIDE + 0)
                    .children(SEL_SLIDE + 1).removeClass(CLASS_CURRENT)
                    .siblings(SEL_SLIDE + 0).addClass(CLASS_CURRENT);
                
                // Wörterbuch-Inhalt löschen
                setTimeout(function() {
                    $(ID_CONTENT_DICTIONARY).html(STR_EMPTY);
                }, TIME_ANIMATION);
            
            // Wenn View "Sortieren" ist
            } else if (view === VIEW_SORT) {
                
                // Sortier-Overlay ein-/ausblenden
                $(ID_DICTIONARY_SORT).toggleClass(CLASS_HIDDEN);
            }
        }
    });
    
    /*
     * Bei Klick auf Wörterbuch-Sortierung.
     * Ermittelt die gewählte Sortierung (Alphabetisch/Stufe & Auf-/Absteigend)
     * und lädt die View mit diesen Parametern neu.
     */
    $(SEL_BODY).on(EVENT_CLICK, SEL_DICTIONARY_SORT, function() {

        // Wörterbuch-View aus dem Cache löschen
        delete cacheView[VIEW_DICTIONARY.substring(1)];
        
        // Wörterbuch-View mit gewählten Parametern neu laden
        changeView(
            VIEW_DICTIONARY, null,
            {
                sort: $(this).attr(ATTR_DATA_SORT),
                dir: $(this).attr(ATTR_DATA_DIR)
            }
        );
    });
    
    /*
     * Bei Klick auf Wörterbuch-Wort.
     * Versucht, das Wort aus dem Cache oder per AJAX aus einer
     * Datei zu laden; bewegt den Wörterbuch-Slider nach rechts.
     */
    $(SEL_BODY).on(EVENT_CLICK, SEL_DICTIONARY_WORD, function(event) {
        
        // Standardverhalten unterdrücken
        event.preventDefault();
        
        // Wort ermitteln
        var word = $(this).attr(ATTR_HREF).substring(1);
        var file = AJAX_PATH + VIEW_WORD.substring(1) + AJAX_PHP;
        
        // Action-Button entfernen
        resetTitleButtonRight();
        
        // Zurück-Button setzen
        setTitleButton(
            $(ID_TITLE_LEFT), STR_EMPTY, VIEW_DICTIONARY,
            CLASS_ICON_BACK, false
        );
        
        // Slider bewegen
        $(ID_DICTIONARY_SLIDER)
            .removeClass().addClass(CLASS_SLIDE + 1)
            .children(SEL_SLIDE + 0).removeClass(CLASS_CURRENT)
            .siblings(SEL_SLIDE + 1).addClass(CLASS_CURRENT);
        
        // Warten
        setTimeout(function() {
            
            // Inhalt ausblenden
            $(ID_CONTENT).addClass(CLASS_HIDDEN);
            
            // Warten
            setTimeout(function() {
                
                // Wenn das Wort bereits im Cache ist
                if (typeof cacheDictionary[word] !== STR_UNDEFINED) {
        
                    // Inhalt laden
                    $(ID_CONTENT_DICTIONARY).html(cacheDictionary[word])
                                            .promise().done(function() {
                        
                        // Inhalt einblenden
                        $(ID_CONTENT).removeClass(CLASS_HIDDEN);
                    });
                
                // Wenn das Wort zum ersten Mal geladen wird
                } else {
                    
                    // Wort laden
                    $(ID_CONTENT_DICTIONARY).load(
                        file, { word: word }, function(response) {
                        
                        // Falls Datei noch nicht gecached ist
                        if (typeof cacheDictionary[word] === STR_UNDEFINED) {
                            cacheDictionary[word] = response;
                        }
                        
                        // Inhalt einblenden
                        $(ID_CONTENT).removeClass(CLASS_HIDDEN);
                    });
                }
            }, TIME_ANIMATION_HALF);
        }, TIME_ANIMATION_HALF);
    });
    
    /*
     * Beim Fokussieren eines Quiz-Inputs.
     * Verhindert das normale Scroll-Verhalten vom Browser
     * beim Fokussieren von Inputs.
     */
    $(SEL_BODY).on(EVENT_FOCUS, SEL_QUIZ_INPUT_TEXT, function() {
        if (window.navigator.standalone) {
            setTimeout(function() {
                $(SEL_BODY_HTML).animate(
                    { scrollTop: 0 },
                    TIME_ANIMATION_HALF
                );
                return false;
            }, 1);
        }
    });
    
    /**
     * Bei Klick auf den Body.
     * Blendet bestimmte Elemente (z.B: Wörterbuch-Sortierung) unter
     * bestimmten Bedingungen aus, sobald etwas geklickt wird.
     */
    $(SEL_BODY).click(function(event) {
        
        // Geklicktes Element ermitteln
        var clicked = $(event.target);

        // Falls Element nicht Sortier-Button ist, Sortierung ausblenden
        if ((!clicked.add(clicked.parents()).is(ID_TITLE_RIGHT)) &&
            ($(ID_DICTIONARY_SORT).length > 0)) {
            if (!$(ID_DICTIONARY_SORT).hasClass(CLASS_HIDDEN)) {
                $(ID_DICTIONARY_SORT).addClass(CLASS_HIDDEN);
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

        // FastClick aktivieren
        FastClick.attach(document.body);
        
        // Falls die Seite als iOS Webapp ausgeführt wird
        if (window.navigator.standalone) {
            $(SEL_BODY).addClass(CLASS_WEBAPP);
        }
        
        // Startseite laden
        changeView(VIEW_HOME);
    });
    
});