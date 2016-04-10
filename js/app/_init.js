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
    
    // FastClick initialisieren
    FastClick.attach(document.body);
    
    // Module initialisieren
    TabBar.init();
    TitleBar.init({ title: "OWLisch" });
    Viewport.init();
    
    // Viewport initialisieren
    setTimeout(function() {
        Viewport.show();
    }, GLOBALS.TIME.LONGER);
    
});