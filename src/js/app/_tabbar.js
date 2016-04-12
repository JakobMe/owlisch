/**
 * Tab-Bar-Modul.
 * Steuert die Tab-Bar der App.
 * @author Jakob Metzger
 */
var TabBar = (function() {
    
    // Selektor-Konstanten
    var _SEL_TABBAR         = "[role='tablist']";
    var _SEL_TABS           = "[role='tab']";
    
    // BEM-Konstanten
    var _B                  = "tab-bar";
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
     * Modul initialisieren.
     * Setzt die Standard-Anfangswerte des Moduls, bindet alle Events,
     * sucht nach den benötigten DOM-Elementen und rendert das Modul.
     * @param {Object} options Optionale Einstellungen beim Initialisieren
     * @returns {Object} Modul-Objekt
     */
    function init(options) {
        
        // Standard-Optionen definieren
        var defaults = {
            isHidden        : false,
            initialTab      : 0,
            viewFunction    : function(view) { window.console.log(view); }
        };
        
        // Standard-Optionen ergänzen/überschreiben
        $.extend(defaults, options || {});
        
        // Modulvariablen initialisieren
        _$tabbar            = $(_SEL_TABBAR);
        _$tabs              = _$tabbar.find(_SEL_TABS);
        _tabNumber          = _$tabs.length - 1;
        _isHidden           = defaults.isHidden;
        
        // Funktionen ausführen
        _setFunction(defaults.viewFunction);
        _bindEvents();
        _setTab(defaults.initialTab);
        
        // Modul Return
        return this;
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        _$tabbar.on(GLOBALS.EVENT.CLICK, _SEL_TABS, _setTab);
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
     * Aktiven Tab setzen.
     * Setzt den aktiven Tab anhand eines (Klick)-Events oder eines
     * übergebenen Tab-Indexes; falls der Index gültig ist, wird dieser
     * als aktiver Index gesetzt und die Tabbar wird gerendert.
     * @param {Object|number} tab Klick-Event vom Tab oder Tab-Index
     */
    function _setTab(tab) {
        
        // Variablen initialisieren
        var i = -1;
        var view = null;
        
        // Tab-Index ermitteln
        if (typeof tab === GLOBALS.TYPE.NUMBER) {
            i = tab;
        } else if (tab.target) {
            i = $(tab.target).closest(_SEL_TABS).index();
        }
        
        // Ziel-View ermitteln
        view = _$tabs.eq(i).data(GLOBALS.DATA.VIEW);
        
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
    }
    
    /**
     * View-Funktion setzen.
     * Setzt die Funktion, die beim Aktivieren
     * eines Tabs ausgelöst werden soll.
     * @param {Object} func Funktion
     */
    function _setFunction(func) {
        if ($.isFunction(func)) {
            _viewFunction = func;
        }
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
    
    // Öffentliches Interface
    return {
        init : init,
        hide : hide,
        show : show
    };
    
})();