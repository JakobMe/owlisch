/**
 * View-Modul.
 * Steuert die TabBar der App.
 * @author Jakob Metzger
 */
var View = (function() {
    
    // Selektor-Konstanten
    var _SEL_VIEW           = "[role='main']";
    var _SEL_ARTICLE        = "[role='article']";
    
    // BEM-Konstanten
    var _B                  = "view";
    var _E                  = "content";
    var _M_VISIBLE          = "visible";
    var _M_FULLSCREEN       = "fullscreen";
    var _M_WEBAPP           = "webapp";
    
    // Private Variablen und DOM-Elemente
    var _isVisible;
    var _isWebapp;
    var _isFullscreen;
    
    // DOM-Elemente
    var _$view;
    var _$content;
    
    /**
     * Modul rendern.
     * Rendert alle Elemente des Moduls anhand der intern
     * gesetzten aktuellen Variablen.
     */
    function _render() {
        _$view.setMod(_B, _M_WEBAPP, _isWebapp);
        _$view.setMod(_B, _M_FULLSCREEN, _isFullscreen);
        _$content.setMod(_B, _E, _M_VISIBLE, _isVisible);
    }
    
    /**
     * Modul initialisieren.
     * Setzt die Standard-Anfangswerte des Moduls, bindet alle Events,
     * sucht nach den benötigten DOM-Elementen und rendert das Modul.
     * @param {Object} options Optionale Einstellungen beim Initialisieren
     * @returns {Object} Modul-Objekt
     */
    function init(options) {
        
        // Standard-Optionen definieren
        var defaults = {
            isVisible: false,
            isFullscreen: false
        };
        
        // Optionen ergänzen
        $.extend(defaults, options || {});
        
        // DOM-Elemente und Startwerte initialisieren
        _$view = $(_SEL_VIEW);
        _$content = _$view.find(_SEL_ARTICLE);
        _isVisible = defaults.isVisible;
        _isFullscreen = defaults.isFullscreen;
        _isWebapp = (GLOBALS.WEBAPP.IOS || GLOBALS.WEBAPP.CORDOVA);
        
        // Rendern
        _render();
        
        // Modul Return
        return this;
    }
    
    /**
     * Modul verbergen.
     * Blendet das Modul aus und rendert es neu.
     * @returns {Object} Modul-Objekt
     */
    function hide() {
        _isVisible = false;
        _render();
        return this;
    }
    
    /**
     * Modul zeigen.
     * Blendet das Modul ein und rendert es neu.
     * @returns {Object} Modul-Objekt
     */
    function show() {
        _isVisible = true;
        _render();
        return this;
    }
    
    /**
     * Fullscreen aktivieren.
     * Aktiviert die volle Höhe für das Modul.
     * @returns {Object} Modul-Objekt
     */
    function enableFullscreen() {
        _isFullscreen = true;
        _render();
        return this;
    }
    
    /**
     * Fullscreen deaktivieren.
     * Deaktiviert die volle Höhe für das Modul.
     * @returns {Object} Modul-Objekt
     */
    function disableFullscreen() {
        _isFullscreen = false;
        _render();
        return this;
    }
    
    // Öffentliches Interface
    return {
        init:               init,
        hide:               hide,
        show:               show,
        enableFullscreen:   enableFullscreen,
        disableFullscreen:  disableFullscreen
    };
    
})();