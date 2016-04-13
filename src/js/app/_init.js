/**
 * App initialisieren.
 * Initialisiert alle Komponenten/Module der App.
 */
var App = {

    // Initialisieren
    init: function() {
        
        // BEM-Syntax anpassen
        $.BEMsyntax({
            elem      : GLOBALS.BEM.ELEMDIV,
            modBefore : GLOBALS.BEM.MODDIV,
            modKeyVal : GLOBALS.BEM.MODKEY
        });
        
        // Komponenten initialisieren
        NavigationBar.init();
        View.init({ navbar: NavigationBar });
        TabBar.init({ view: View });
        Viewport.init();
    }
};

// App initialisieren
$(document).ready(function() {
    App.init();
});
