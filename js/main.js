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
    
    // Konstanten: IDs
    var ID_QUIZ_STEPS           = "#quiz-progress-steps";
    
    // Konstanten: Selektoren
    var SEL_BODY                = "body";
    var SEL_QUIZ_STEP           = ".quiz-progress-step";
    var SEL_QUIZ_STEP_CURRENT   = ".quiz-progress-step.current";
    var SEL_BUTTON              = ".button";
    
    // Konstanten: CSS-Klassen
    var CLASS_WEBAPP            = "webapp";
    var CLASS_CURRENT           = "current";
    var CLASS_SUCCESS           = "success";
    var CLASS_ERROR             = "error";
    var CLASS_SOLVED            = "solved";
    
    /**
     * Funktion: Quiz fortschreiten lassen.
     * Setzt das Quiz auf den nächsten Schritt und setzt Erfolg/Fehler.
     * @param {boolean} success Erfolg oder Fehler
     */
    function progressQuiz(success) {
        
        // Aktueller und nächster Schritt
        var stepCurrent = $(ID_QUIZ_STEPS).children(SEL_QUIZ_STEP_CURRENT);
        var stepNext = stepCurrent.next(SEL_QUIZ_STEP);
        
        // Aktuellen Schritt als gelöst markieren, nächsten Schritt aktivieren
        stepCurrent.removeClass(CLASS_CURRENT).addClass(CLASS_SOLVED);
        stepNext.addClass(CLASS_CURRENT);
        
        // Erfolg/Fehler setzen
        if (success === true) { stepCurrent.addClass(CLASS_SUCCESS); }
        else { stepCurrent.addClass(CLASS_ERROR); }
    }
    
    /*
     * Bei Klick auf Quit-Fortschritt Quiz zufällig weiter schalten.
     */
    $(SEL_BODY).on(EVENT_CLICK, SEL_BUTTON, function() {
        progressQuiz($(this).hasClass(CLASS_SUCCESS) ? true : false);
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