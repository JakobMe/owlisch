/**
 * View-Modul.
 * Steuert die TabBar der App.
 * @author Jakob Metzger
 */
var View = (function() {
    
    // Selektor-Konstanten
    var _SEL_VIEW           = "[role='main']";
    var _SEL_CONTENT        = "[role='article']";
    var _SEL_PANELS         = "[role='tabpanel']";
    
    // BEM-Konstanten
    var _B                  = "view";
    var _E_CONTENT          = "content";
    var _E_PANEL            = "panel";
    var _M_VISIBLE          = "visible";
    var _M_FULLSCREEN       = "fullscreen";
    var _M_WEBAPP           = "webapp";
    var _M_CURRENT          = "current";
    
    // Private Variablen und DOM-Elemente
    var _isVisible;
    var _isWebapp;
    var _isFullscreen;
    var _currentView;
    var _views;
    
    // DOM-Elemente
    var _$view;
    var _$content;
    
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
            isVisible       : false,
            isFullscreen    : false
        };
        
        // Optionen ergänzen
        $.extend(defaults, options || {});
        
        // Modulvariablen initialisieren
        _$view              = $(_SEL_VIEW);
        _$content           = _$view.find(_SEL_CONTENT);
        _isVisible          = defaults.isVisible;
        _isFullscreen       = defaults.isFullscreen;
        _isWebapp           = (GLOBALS.WEBAPP.IOS || GLOBALS.WEBAPP.CORDOVA);
        _currentView        = null;
        _views              = {};
        
        // Funktionen ausführen
        _initViews();
        _render();
        
        // Modul Return
        return this;
    }
    
    /**
     * Modul rendern.
     * Rendert alle Elemente des Moduls anhand der intern
     * gesetzten aktuellen Variablen.
     */
    function _render() {
        
        // View und Content rendern
        _$view.setMod(_B, _M_WEBAPP, _isWebapp);
        _$view.setMod(_B, _M_FULLSCREEN, _isFullscreen);
        _$content.setMod(_B, _E_CONTENT, _M_VISIBLE, _isVisible);
        
        // Panels (de-)aktivieren
        $.each(_views, function(name, $panel) {
            $panel.setMod(_B, _E_PANEL, _M_CURRENT, (name === _currentView));
        });
    }
    
    /**
     * Views initialisieren.
     * Durchsucht den DOM nach View-Panels und fügt sie
     * der internen View-Liste hinzu.
     */
    function _initViews() {
        _$view.find(_SEL_PANELS).each(function() {
            _views[$(this).data(GLOBALS.DATA.VIEW)] = $(this);
        });
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
    
    /**
     * Aktuelle View setzen.
     * Wenn der übergebene View-Name gültig ist, wird die View
     * erst ausgeblendet, dann wird das Tab-Panel gewechselt und
     * die View wieder eingeblendet.
     * @param {string} view Name der neuen View
     * @returns {Object} Modul-Objekt
     */
    function setView(view) {
        if (typeof _views[view] !== GLOBALS.TYPE.UNDEF) {
            hide();
            setTimeout(function() {
                _currentView = view;
                _isVisible = true;
                _render();
            }, GLOBALS.TIME.STANDARD);
        }
        return this;
    }
    
    // Öffentliches Interface
    return {
        init                : init,
        hide                : hide,
        show                : show,
        enableFullscreen    : enableFullscreen,
        disableFullscreen   : disableFullscreen,
        setView             : setView
    };
    
})();