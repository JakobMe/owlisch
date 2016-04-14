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
    
    // Panel-Konstanten
    var _PANELS = {
        START               : "start",
        DICTIONARY          : "dictionary",
        QUIZ                : "quiz",
        PROGRESS            : "progress",
        HELP                : "help"
    };
    
    // Private Variablen
    var _isVisible;
    var _isWebapp;
    var _isFullscreen;
    var _currentPanel;
    var _panelIsExpired;
    
    // DOM-Elemente
    var _$view;
    var _$content;
    var _$panels;
    
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
        _$panels            = {};
        _$view              = $(_SEL_VIEW);
        _$content           = _$view.find(_SEL_CONTENT);
        _isVisible          = defaults.isVisible;
        _isFullscreen       = defaults.isFullscreen;
        _isWebapp           = (CONF.WEBAPP.IOS || CONF.WEBAPP.CORDOVA);
        _currentPanel       = null;
        _panelIsExpired     = {};
        
        // Funktionen ausführen
        _initPanels();
        _render();
        
        // Modul Return
        return this;
    }
    
    /**
     * Modul rendern.
     * Rendert alle Elemente des Moduls anhand der intern
     * gesetzten aktuellen Variablen.
     * @param {boolean} hide Ausblenden ja/nein
     */
    function _render(hide) {
        
        // View und Content rendern
        _$view.setMod(_B, _M_WEBAPP, _isWebapp);
        _$view.setMod(_B, _M_FULLSCREEN, _isFullscreen);
        _$content.setMod(_B, _E_CONTENT, _M_VISIBLE, _isVisible);
        
        // View-Panels (de-)aktivieren
        if (hide !== true) {
            $.each(_$panels, function(name, $panel) {
                $panel.setMod(
                    _B, _E_PANEL, _M_CURRENT,
                    (name === _currentPanel)
                );
            });
        }
    }
    
    /**
     * View-Panels initialisieren.
     * Durchsucht den DOM nach View-Panels und fügt sie
     * der internen View-Liste hinzu, wenn sie mit den intern
     * definierten Views übereinstimmen.
     */
    function _initPanels() {
        _$view.find(_SEL_PANELS).each(function() {
            
            // Gefundenes View-Panel initialisieren
            var $panel = $(this);
            var panelName = $panel.data(CONF.DATA.PANEL);
            
            // Prüfen, ob das View-Panel valide ist und setzen
            for (var name in _PANELS) {
                if (_PANELS.hasOwnProperty(name)) {
                    if (_PANELS[name] === panelName) {
                        _$panels[panelName] = $panel;
                        _panelIsExpired[panelName] = true;
                        break;
                    }
                }
            }
        });
    }
    
    /**
     * Navigation-Bar der View setzen.
     * Setzt die verknüpfte Navigation-Bar anhand des aktuellen
     * Panel-Namens; setzt Titel, Buttons und Suche.
     */
    function _setNavbar() {
        if ((typeof NavigationBar !== CONF.TYPE.UNDEF) &&
            (NavigationBar !== null)) {
            
            // Neue Werte initialisieren
            var newTitle = CONF.STR.EMPTY;
            var newSearch = false;
            var newIconLeft = null;
            var newIconRight = null;
            var newActionLeft = null;
            var newActionRight = null;
            
            // Sonderfall: Wörterbuch
            if (_currentPanel === _PANELS.DICTIONARY) {
                newSearch = true;
                newIconLeft = NavigationBar.ICON.SEARCH;
                newIconRight = NavigationBar.ICON.SORT;
                newActionLeft = NavigationBar.ACTION.SEARCH;
                newActionRight = NavigationBar.ACTION.SORT;
            }
            
            // Neuen Titel setzen
            if (_$panels[_currentPanel] instanceof jQuery) {
                newTitle = _$panels[_currentPanel].data(CONF.DATA.TITLE);
            }
            
            // Navigation-Bar setzen
            NavigationBar.setAll(
                newTitle, newActionLeft,
                newIconLeft, newActionRight,
                newIconRight, newSearch
            );
        }
    }
    
    /**
     * Modul verbergen.
     * Blendet das Modul aus und rendert es neu.
     */
    function _hide() {
        _isVisible = false;
        _render(true);
    }
    
    /**
     * Modul zeigen.
     * Blendet das Modul ein und rendert es neu.
     */
    function _show() {
        _isVisible = true;
        _render();
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
     * Aktuelles View-Panel setzen.
     * Wenn der übergebene Panel-Name gültig ist, wird die View
     * erst ausgeblendet, dann wird das Tab-Panel gewechselt,
     * die Navigation-Bar eingestellt und die View wieder eingeblendet.
     * @param {string} panel Name des neuen View-Panels
     * @returns {Object} Modul-Objekt
     */
    function setPanel(panel) {
        if (typeof _$panels[panel] !== CONF.TYPE.UNDEF) {
            _currentPanel = panel;
            _setNavbar();
            _hide();
            setTimeout(function() { _show(); }, CONF.TIME.SHORT);
        }
        return this;
    }
    
    // Öffentliches Interface
    return {
        init                : init,
        enableFullscreen    : enableFullscreen,
        disableFullscreen   : disableFullscreen,
        setPanel            : setPanel
    };
    
})();