/*
 * Auf Dokument warten.
 * Warten, bis das Dokument vollständig geladen ist, bevor
 * Funktionen ausgeführt und Module initialisiert werden.
 */
$(document).ready(function() {
    
    // BEM-Syntax anpassen
    $.BEMsyntax({
        elem:      GLOBAL.BEM.ELEMDIV,
        modBefore: GLOBAL.BEM.MODDIV,
        modKeyVal: GLOBAL.BEM.MODKEY
    });
    
    // Module initialisieren
    TabBar.init();
    TitleBar.init({ title: "OWLisch" });
    Viewport.init();
    
    // Viewport initialisieren
    setTimeout(function() {
        Viewport.show();
    }, GLOBAL.TIME.LONGER);
    
});