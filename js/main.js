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
    
    // Konstanten: IDs
    var ID_QUIZ_STEPS           = "#quiz-progress-steps";
    var ID_TITLE                = "#bar-title-text";
    var ID_TABS_INDICATOR       = "#bar-tabs-indicator";
    var ID_CONTENT_INNER        = "#content-inner";
    var ID_CONTENT              = "#content";
    
    // Konstanten: Selektoren
    var SEL_BODY                = "body";
    var SEL_QUIZ_STEP           = ".quiz-progress-step";
    var SEL_QUIZ_STEP_CURRENT   = ".quiz-progress-step.current";
    var SEL_BUTTON              = ".button";
    var SEL_TAB                 = ".bar-tabs-tab";
    
    // Konstanten: CSS-Klassen
    var CLASS_WEBAPP            = "webapp";
    var CLASS_CURRENT           = "current";
    var CLASS_SUCCESS           = "success";
    var CLASS_ERROR             = "error";
    var CLASS_SOLVED            = "solved";
    var CLASS_HIDDEN            = "hidden";
    var CLASS_TAB               = "tab-";
    
    // Konstanten: AJAX-Werte
    var AJAX_EMPTY              = "";
    var AJAX_ERROR              = "error";
    var AJAX_LOAD               = "php/load.php";
    var AJAX_POST               = "post";
    
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
            
        }, 200);
    }
    
    /*
     * Bei Klick auf Quit-Fortschritt Quiz zufällig weiter schalten.
     */
    $(SEL_BODY).on(EVENT_CLICK, SEL_BUTTON, function() {
        progressQuiz($(this).hasClass(CLASS_SUCCESS) ? true : false);
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