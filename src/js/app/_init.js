/**
 * App initialisieren.
 * Initialisiert alle Komponenten/Module der App.
 */
var App = {

    // Initialisieren
    init: function() {
        
        // BEM-Syntax anpassen
        $.BEMsyntax({
            elem      : C.BEM.ELEMDIV,
            modBefore : C.BEM.MODDIV,
            modKeyVal : C.BEM.MODKEY
        });
        
        // Komponenten initialisieren
        NavigationBar.init();
        View.init({ navbar: NavigationBar });
        TabBar.init({ view: View });
        Viewport.init();
    }
};

// App initialisieren
$(document).ready(function() { App.init(); });