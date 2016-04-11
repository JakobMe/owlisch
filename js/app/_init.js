/**
 * App initialisieren.
 */
var App = {

    // App-Konstruktor
    initialize: function() {
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/)) {
            document.addEventListener(
                GLOBALS.EVENT.DEVREADY,
                this.onReady, false
            );
        } else {
            this.onReady();
        }
    },
    
    // Initialisieren
    onReady: function() {
        
        // BEM-Syntax anpassen
        $.BEMsyntax({
            elem:      GLOBALS.BEM.ELEMDIV,
            modBefore: GLOBALS.BEM.MODDIV,
            modKeyVal: GLOBALS.BEM.MODKEY
        });
        
        // Module initialisieren
        Viewport.init();
        View.init();
        TabBar.init();
        NavigationBar.init().enableSearch();
        
        // Viewport initialisieren
        setTimeout(function() {
            Viewport.show();
            View.show();
        }, GLOBALS.TIME.LONGER);
    }
};

// App initialisieren
App.initialize();