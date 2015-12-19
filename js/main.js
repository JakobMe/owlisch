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
    
    // Konstanen: Attribute
    var ATTR_HREF               = "href";
    var ATTR_TITLE              = "title";
    var ATTR_DATA_TAB           = "data-tab";
    var ATTR_DATA_STEP          = "data-step";
    var ATTR_DATA_LEVEL         = "data-level";
    
    // Konstanten: IDs
    var ID_QUIZ_PROGRESS        = "#quiz-progress";
    var ID_QUIZ_STEPS           = "#quiz-progress-steps";
    var ID_QUIZ_SLIDER          = "#quiz-slider";
    var ID_QUIZ_START           = "#quiz-start";
    var ID_TITLE                = "#bar-title-text";
    var ID_TABS_INDICATOR       = "#bar-tabs-indicator";
    var ID_CONTENT_INNER        = "#content-inner";
    var ID_CONTENT              = "#content";
    var ID_VIEWPORT             = "#viewport-inner";
    
    // Konstanten: Selektoren
    var SEL_BODY                = "body";
    var SEL_QUIZ_CHOICES        = ".quiz-choices";
    var SEL_QUIZ_STEP           = ".quiz-progress-step";
    var SEL_QUIZ_STEP_CURRENT   = ".quiz-progress-step.current";
    var SEL_QUIZ_SLIDE          = ".quiz-slide.slide-";
    var SEL_BUTTON_NEXT         = ".quiz-slide.current .quiz-next";
    var SEL_LEVEL               = ".quiz-slide.current .quiz-info-level";
    var SEL_BUTTON              = ".button";
    var SEL_RIGHT               = ".right";
    var SEL_TAB                 = ".bar-tabs-tab";
    
    // Konstanten: CSS-Klassen
    var CLASS_QUIZ              = "quiz";
    var CLASS_WEBAPP            = "webapp";
    var CLASS_CURRENT           = "current";
    var CLASS_SUCCESS           = "success";
    var CLASS_ERROR             = "error";
    var CLASS_SOLVED            = "solved";
    var CLASS_WAITING           = "waiting";
    var CLASS_RIGHT             = "right";
    var CLASS_HIDDEN            = "hidden";
    var CLASS_QUIZ_NEXT         = "quiz-next";
    var CLASS_FINISHED          = "finished";
    var CLASS_LOCKED            = "locked";
    var CLASS_TAB               = "tab-";
    var CLASS_SLIDE             = "slide-";
    var CLASS_LEVEL             = "level-";
    
    // Konstanten: AJAX-Werte
    var AJAX_EMPTY              = "";
    var AJAX_ERROR              = "error";
    var AJAX_LOAD               = "php/load.php";
    var AJAX_POST               = "post";
    
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
     * @param {object} answer jQuery-Objekt der gewählten Antwort
     */
    function revealResult(answer) {
        
        // Aktuelles Quiz blockieren, Weiter-Button anzeigen
        answer.parents(SEL_QUIZ_CHOICES).addClass(CLASS_LOCKED);
        $(SEL_BUTTON_NEXT).removeClass(CLASS_HIDDEN);
        
        // Prüfen, ob Antwort richtig ist
        var answerRight = answer.hasClass(CLASS_RIGHT) ? true : false;
        
        // Aktuellen und nächsten Schritt ermitteln
        var stepCurrent = $(ID_QUIZ_STEPS).children(SEL_QUIZ_STEP_CURRENT);
        var stepNextNumber = stepCurrent.next(SEL_QUIZ_STEP)
                                        .attr(ATTR_DATA_STEP);
        
        // Wenn die Antwort richtig ist, Erfolg setzen
        if (answerRight) {
            
            // Erfolg setzen
            stepCurrent.addClass(CLASS_SUCCESS);
            answer.addClass(CLASS_SUCCESS);
            
            // Level ermitteln
            var levelCurrent = parseInt($(SEL_LEVEL).attr(ATTR_DATA_LEVEL));
            var levelNext = Math.min(levelCurrent + 1, 3);
            
            // Level erhöhen
            $(SEL_LEVEL).removeClass(CLASS_LEVEL + levelCurrent)
                        .addClass(CLASS_LEVEL + levelNext);

        // Wenn die Antwort falsch ist, Fehler setzen
        } else {
            stepCurrent.addClass(CLASS_ERROR);
            answer.addClass(CLASS_ERROR).siblings(SEL_RIGHT)
                  .addClass(CLASS_SUCCESS);
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
            
            // Quiz-Slider verschieben
            if ($(ID_QUIZ_STEPS).hasClass(CLASS_FINISHED)) {
                $(ID_VIEWPORT).removeClass(CLASS_QUIZ);
                moveQuizSlider(slidesNumber - 1);
            } else {
                $(ID_VIEWPORT).addClass(CLASS_QUIZ);
                $(ID_QUIZ_STEPS).children(SEL_QUIZ_STEP).first().addClass(CLASS_CURRENT);
                moveQuizSlider(1);
            }
            
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
    function changeView(view) {
        
        // Inhalt ausblenden
        $(ID_CONTENT).addClass(CLASS_HIDDEN);
        
        // Kurz warten
        setTimeout(function() {
            
            // AJAX-Anfrage
            $.ajax({
                async: false,
                url: AJAX_LOAD,
                type: AJAX_POST,
                data: { file: view },
                success: function(content) {
                    
                    // Inhalt in Container laden
                    if (content !== AJAX_ERROR) {
                        $(ID_CONTENT_INNER).html(content);
                    } else {
                        $(ID_CONTENT_INNER).html(AJAX_EMPTY);
                    }
    
                    // Erfolg melden
                    return true;
                },
                error: function() {
                    
                    // Fehler melden
                    return false;
                    
                }
            });
            
            // Inhalt einblenden
            $(ID_CONTENT).removeClass(CLASS_HIDDEN);
            
        }, 300);
    }
    
    /*
     * Bei Klick auf Quiz-Buttons.
     * Entscheided anhand der Eigenschaften, ob das Quit ausgelöst werden,
     * begonnen werden oder fortgeführt werden soll.
     */
    $(SEL_BODY).on(EVENT_CLICK, SEL_BUTTON, function() {
        
        // Falls Button ein Weiter-Button ist
        if ($(this).hasClass(CLASS_QUIZ_NEXT)) {
            
            // Quit fortführen
            progressQuiz();
            
        // Wenn Button kein Weiter-Button ist
        } else {
            
            // Wenn Antworten nicht blockiert sind, lösen
            if (!$(this).parents(SEL_QUIZ_CHOICES).hasClass(CLASS_LOCKED)) {
                if ($(this).is($(ID_QUIZ_START))) {
                    $(ID_QUIZ_PROGRESS).removeClass(CLASS_WAITING);
                    progressQuiz();
                } else {
                    revealResult($(this));
                }
            }
        }
        
    });
    
    /*
     * Bei Klick auf Tab.
     * Setzt den App-Titel und lädt den entsprechenden Inhalt,
     * wenn ein Tab in der Tab-Leiste geklickt wird.
     */
    $(SEL_TAB).click(function() {
        
        // Titel und neuen Inhalt setzen
        $(ID_TITLE).text($(this).attr(ATTR_TITLE));
        changeView($(this).attr(ATTR_HREF).substring(1));
        
        // Tab-Indikator verschieben
        $(ID_TABS_INDICATOR).removeClass().addClass(
            CLASS_TAB + $(this).attr(ATTR_DATA_TAB)
        );
        
        //
        $(this).addClass(CLASS_CURRENT).siblings().removeClass(CLASS_CURRENT);
        
    });
    
    /*
     * Sobald das Fenster geladen wurde.
     * Auf das Laden des Fensters warten, bevor Funktionen
     * aufgerufen werden, die beim Seitenaufruf die Seitenstruktur
     * beeinflussen.
     */
    $(window).load(function() {
        
        // Falls die Seite als iOS Webapp ausgeführt wird
        if (window.navigator.standalone) {
            $(SEL_BODY).addClass(CLASS_WEBAPP);
        }
    
    });
    
});