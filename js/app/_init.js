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
    
    // TabBar initialisieren
    TabBar.init();
    TitleBar.init();
    
});