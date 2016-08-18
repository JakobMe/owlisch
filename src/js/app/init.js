/**
 * Haupt-Modul der App; aktiviert FastClick, konfiguriert die Optionen für das
 * BEM-Helper-Plugin und initialisiert alle Module der App, initialisiert sich
 * selbst, sobald das Dokument bereit ist.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @license MIT
 * @requires Template
 * @requires Data
 * @requires Featured
 * @requires Dictionary
 * @requires Quiz
 * @requires Statistics
 * @requires More
 * @requires NavigationBar
 * @requires TabBar
 * @requires Play
 * @requires View
 * @module App
 */
var App = (function() {
    
    /**
     * Aktiviert FastClick, konfiguriert das BEM-Helpers-Plugin und
     * initialisiert alle Module der App in richtiger Reihenfolge.
     * @access public
     * @function init
     */
    function init() {
        
        // FastClick initialisieren
        FastClick.attach(document.body);
        
        // BEM-Syntax anpassen
        $.BEMsyntax({
            elem      : CFG.BEM.E_DELIMITER,
            modBefore : CFG.BEM.M_DELIMITER,
            modKeyVal : CFG.BEM.M_KEY
        });
        
        // Module initialisieren
        Template.init();
        Data.init();
        Featured.init();
        Dictionary.init();
        Quiz.init();
        Statistics.init();
        More.init();
        NavigationBar.init();
        TabBar.init();
        Play.init();
        View.init();
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();

// App initialisieren
$(document).ready(function() { App.init(); });