/**
 * App initialisieren.
 * Initialisiert alle Komponenten/Module der App.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var App = {
    
    // Initialisieren
    init: function() {
        
        // FastClick initialisieren
        FastClick.attach(document.body);
        
        // BEM-Syntax anpassen
        $.BEMsyntax({
            elem      : CFG.BEM.E_DELIMITER,
            modBefore : CFG.BEM.M_DELIMITER,
            modKeyVal : CFG.BEM.M_KEY
        });
        
        // Komponenten initialisieren
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
};

// App initialisieren
$(document).ready(function() {
    App.init();
});