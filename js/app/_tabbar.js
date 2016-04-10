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
    
    // DOM-Elemente
    var _$tabbar;
    var _$tabs;
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        _$tabbar.on(GLOBAL.EVENT.CLICK, _SEL_TABS, setTab);
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
        if (_isHidden) { _$tabbar.setMod(_B, _M_HIDDEN, true); }
        else { _$tabbar.setMod(_B, _M_HIDDEN, false); }
        
        // Aktiven Tab notieren (Statusleiste bewegen)
        _$tabbar.setMod(_B, _M_TAB, _tabActive);
    }
    
    /**
     * Modul initialisieren.
     * Setzt die Standard-Anfangswerte des Moduls, bindet alle Events,
     * sucht nach den benötigten DOM-Elementen und rendert das Modul.
     * @param {Number} tab Index des aktiven Tabs.
     */
    function init(tab) {
        
        // DOM-Elemente initialisieren
        _$tabbar = $(_SEL_TABBAR);
        _$tabs = _$tabbar.find(_SEL_TABS);
        
        // Startwerte setzen
        _tabNumber = _$tabs.length - 1;
        _isHidden = false;
        
        // Ersten aktiven Tab setzen
        if (typeof tab === GLOBAL.TYPE.UNDEF) { tab = 0; }
        setTab(tab);
        
        // Events binden
        _bindEvents();
    }
    
    /**
     * Aktiven Tab setzen.
     * Setzt den aktiven Tab anhand eines (Klick)-Events oder eines
     * übergebenen Tab-Indexes; falls der Index gültig ist, wird dieser
     * als aktiver Index gesetzt und die Tabbar wird gerendert.
     * @param {Object|Number} tab Klick-Event vom Tab oder Tab-Index
     * @returns {Boolean} Erfolg/Misserfolg der Aktion 
     */
    function setTab(tab) {
        
        // Variablen initialisieren
        var i;
        var success = false;
        
        // Tab-Index ermitteln
        if (typeof tab === GLOBAL.TYPE.NUMBER) { i = tab; }
        else { i = $(tab.target).closest(_SEL_TABS).index(); }
        
        // Tab-Index prüfen und setzen
        if ((i >= 0) && (i <= _tabNumber)) {
            _tabActive = i;
            success = true;
        }
        
        // Rendern
        _render();
        
        // Return
        return success;
    }
    
    /**
     * Modul verbergen.
     * Blendet das Modul aus und rendert es neu.
     */
    function hide() {
        _isHidden = true;
        _render();
    }
    
    /**
     * Modul zeigen.
     * Blendet das Modul ein und rendert es neu.
     */
    function show() {
        _isHidden = false;
        _render();
    }
    
    // Öffentliches Interface
    return {
        init:   init,
        setTab: setTab,
        hide:   hide,
        show:   show
    };
    
})();