/**
 * Viewport-Modul.
 * Steuert die TabBar der App.
 * @author Jakob Metzger
 */
var Viewport = (function() {
    
    // Konstanten
    var _SEL_VIEWPORT       = "[role='application']";
    var _B                  = "viewport";
    var _E                  = "app";
    var _M                  = "visible";
    
    // Private Variablen und DOM-Elemente
    var _isVisible;
    var _$viewport;
    
    /**
     * Modul initialisieren.
     * Setzt die Standard-Anfangswerte des Moduls, bindet alle Events,
     * sucht nach den benötigten DOM-Elementen und rendert das Modul.
     * @param {Object} options Optionale Einstellungen beim Initialisieren
     * @returns {Object} Modul-Objekt
     */
    function init(options) {
        
        // Standard-Optionen definieren und ergänzen
        var defaults = { isVisible: false };
        $.extend(defaults, options || {});
        
        // Modulvariablen initialisieren
        _$viewport = $(_SEL_VIEWPORT);
        _isVisible = defaults.isVisible;
        
        // Funktionen ausführen
        setTimeout(function() { _show(); }, GLOBALS.TIME.LONGER);
        
        // Modul Return
        return this;
    }
    
    /**
     * Modul rendern.
     * Rendert alle Elemente des Moduls anhand der intern
     * gesetzten aktuellen Variablen.
     */
    function _render() {
        _$viewport.setMod(_B, _E, _M, _isVisible);
    }
    
    /**
     * Modul zeigen.
     * Blendet das Modul ein und rendert es neu.
     */
    function _show() {
        _isVisible = true;
        _render();
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();