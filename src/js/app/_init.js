/**
 * App initialisieren.
 * Initialisiert alle Komponenten/Module der App.
 */
var App = {

    // Initialisieren
    init: function() {
        
        // FastClick initialisieren
        FastClick.attach(document.body);
        
        // BEM-Syntax anpassen
        $.BEMsyntax({
            elem      : CONF.BEM.ELEMDIV,
            modBefore : CONF.BEM.MODDIV,
            modKeyVal : CONF.BEM.MODKEY
        });
        
        // Komponenten initialisieren
        NavigationBar.init();
        View.init();
        TabBar.init();
        Viewport.init();
        
        // Wenn iOS-Keyboard geöffnet wird
        window.addEventListener(CONF.EVENT.KEYBOARD_SHOW, function() {
            TabBar.hide();
            View.enableFullscreen();
        });
        
        // Wenn iOS-Keyboard geschlossen wird
        window.addEventListener(CONF.EVENT.KEYBOARD_HIDE, function() {
            TabBar.show();
            View.disableFullscreen();
        });
    }
};

// App initialisieren
$(document).ready(function() { App.init(); });