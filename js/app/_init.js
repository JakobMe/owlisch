/*
 * Auf Dokument warten.
 * Warten, bis das Dokument vollständig geladen ist, bevor
 * Funktionen ausgeführt und Module initialisiert werden.
 */
$(document).ready(function() {
    
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
    NavigationBar.init();
    
    // Viewport initialisieren
    setTimeout(function() {
        Viewport.show();
        View.show();
    }, GLOBALS.TIME.LONGER);
    
});