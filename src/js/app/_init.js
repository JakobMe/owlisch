/**
 * App initialisieren.
 */
var App = {

    // App-Konstruktor
    init: function() {
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/)) {
            document.addEventListener(
                GLOBALS.EVENT.DEVICEREADY,
                this.onDeviceReady, false
            );
        } else {
            this.onDeviceReady();
        }
    },
    
    // Initialisieren
    onDeviceReady: function() {
        
        // BEM-Syntax anpassen
        $.BEMsyntax({
            elem            : GLOBALS.BEM.ELEMDIV,
            modBefore       : GLOBALS.BEM.MODDIV,
            modKeyVal       : GLOBALS.BEM.MODKEY
        });
        
        // Viewport
        Viewport.init();
        
        // View
        View.init();
        
        // Tab-Bar
        TabBar.init({
            viewFunction    : View.setView
        });
        
        // Navigation-Bar
        NavigationBar.init({
            title           : "OWLisch",
            leftIcon        : NavigationBar.ICON.SEARCH,
            leftAction      : NavigationBar.ACTION.SEARCH
        });
        
        // Viewport initialisieren
        setTimeout(function() {
            Viewport.show();
        }, GLOBALS.TIME.LONGER);
    }
};

// App initialisieren
App.init();