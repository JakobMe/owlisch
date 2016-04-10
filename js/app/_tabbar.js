/**
 * TabBar-Modul.
 * Steuert die TabBar der App.
 * @author Jakob Metzger
 */
var TabBar = (function() {
    
    // Selektor-Konstanten
    var _SEL_TABBAR         = "[role='tablist']";
    var _SEL_TABS           = "[role='tab']";
    
    // BEM-Konstanten
    var _B                  = "tabbar";
    var _E                  = "tab";
    var _M_ACTIVE           = "active";
    var _M_HIDDEN           = "hidden";
    var _M_TAB              = "tab";
    
    // Private Variablen
    var _tabActive;
    var _tabNumber;
    var _isHidden;
    var _viewFunction;
    
    // DOM-Elemente
    var _$tabbar;
    var _$tabs;
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        _$tabbar.on(GLOBALS.EVENT.CLICK, _SEL_TABS, setTab);
    }
    
    /**
     * Modul rendern.
     * Rendert alle Elemente des Moduls anhand der intern
     * gesetzten aktuellen Variablen.
     */
    function _render() {
        
        // Aktiven Tab setzen
        _$tabs.eq(_tabActive).setMod(_B, _E, _M_ACTIVE, true)
              .siblings().setMod(_B, _E, _M_ACTIVE, false);
        
        // TabBar ein-/ausblenden
        _$tabbar.setMod(_B, _M_HIDDEN, _isHidden);
        
        // Aktiven Tab notieren (Statusleiste bewegen)
        _$tabbar.setMod(_B, _M_TAB, _tabActive);
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
            isHidden: false,
            initialTab: 0,
            viewFunction: function(view) { window.console.log(view); }
        };
        
        // Standard-Optionen ergänzen/überschreiben
        $.extend(defaults, options || {});
        
        // DOM-Elemente initialisieren
        _$tabbar = $(_SEL_TABBAR);
        _$tabs = _$tabbar.find(_SEL_TABS);
        
        // Startwerte setzen
        _tabNumber = _$tabs.length - 1;
        _isHidden = defaults.isHidden;
        
        // View-Funktion setzen
        if ($.isFunction(defaults.viewFunction)) {
            _viewFunction = defaults.viewFunction;
        }
        
        // Ersten aktiven Tab setzen
        setTab(defaults.initialTab);
        
        // Events binden
        _bindEvents();
        
        // Modul Return
        return this;
    }
    
    /**
     * Aktiven Tab setzen.
     * Setzt den aktiven Tab anhand eines (Klick)-Events oder eines
     * übergebenen Tab-Indexes; falls der Index gültig ist, wird dieser
     * als aktiver Index gesetzt und die Tabbar wird gerendert.
     * @param {Object|Number} tab Klick-Event vom Tab oder Tab-Index
     * @returns {Object} Modul-Objekt
     */
    function setTab(tab) {
        
        // Variablen initialisieren
        var i = -1;
        var view = null;
        
        // Tab-Index und View ermitteln
        if (typeof tab === GLOBALS.TYPE.NUMBER) {
            i = tab;
        } else if (typeof tab === GLOBALS.TYPE.OBJECT) {
            var $tab = $(tab.target).closest(_SEL_TABS);
            i = $tab.index();
            view = $tab.data(GLOBALS.DATA.VIEW);
        }
        
        // Tab-Index prüfen und setzen
        if ((i >= 0) && (i <= _tabNumber)) {
            _tabActive = i;
            
            // View prüfen und Funktion auslösen
            if ((view !== null) &&
                (view.length > 0) &&
                ($.isFunction(_viewFunction))) {
                _viewFunction(view);
            }
        }
        
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
        _isHidden = true;
        _render();
        return this;
    }
    
    /**
     * Modul zeigen.
     * Blendet das Modul ein und rendert es neu.
     * @returns {Object} Modul-Objekt
     */
    function show() {
        _isHidden = false;
        _render();
        return this;
    }
    
    /**
     * View-Funktion setzen.
     * Setzt die Funktion, die beim Aktivieren eines Tabs
     * ausgelöst werden soll.
     * @param {Object} func Funktion
     * @returns {Object} Modul-Objekt
     */
    function setFunction(func) {
        if ($.isFunction(func)) {
            _viewFunction = func;
        }
        return this;
    }
    
    // Öffentliches Interface
    return {
        init:           init,
        hide:           hide,
        show:           show,
        setTab:         setTab,
        setFunction:    setFunction
    };
    
})();