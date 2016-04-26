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
        
        // AJAX-Asynchronität deaktivieren
        //$.ajaxSetup({ async: false });
        
        // FastClick initialisieren
        FastClick.attach(document.body);
        
        // BEM-Syntax anpassen
        $.BEMsyntax({
            elem      : CFG.BEM.ELEMDIV,
            modBefore : CFG.BEM.MODDIV,
            modKeyVal : CFG.BEM.MODKEY
        });
        
        // Komponenten initialisieren
        Data.init();
        Viewport.init();
        Dictionary.init();
        NavigationBar.init();
        TabBar.init();
        View.init();
    }
};

// App initialisieren
$(document).ready(function() { App.init(); });