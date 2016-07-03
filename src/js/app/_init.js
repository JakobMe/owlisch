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
            elem      : CFG.BEM.ELEMDIV,
            modBefore : CFG.BEM.MODDIV,
            modKeyVal : CFG.BEM.MODKEY
        });
        
        // Komponenten initialisieren
        Template.init();
        Data.init();
        Dictionary.init();
        Statistics.init();
        Quiz.init();
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