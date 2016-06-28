/**
 * Tab-Bar-Modul.
 * Steuert die Tab-Bar der App.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var TabBar = (function() {
    
    // Selektor-Konstanten
    var _SEL_TABS               = "[role='tab']";
    var _SEL_TABBAR             = "#tabbar";
    
    // Template-Namen
    var _TMPL_TABBAR            = "tabbar";
    
    // BEM-Konstanten
    var _B                      = "tabbar";
    var _E                      = "tab";
    var _M_ACTIVE               = "active";
    var _M_HIDDEN               = "hidden";
    var _M_DISABLED             = "disabled";
    var _M_TAB                  = "tab";
    
    // Data-Attibut-Konstanten
    var _DATA_PANEL             = "panel";
    
    // Private Variablen
    var _tabActive              = 0;
    var _tabNumber              = -1;
    var _isHidden               = false;
    var _isDisabled             = false;
    
    // DOM-Elemente
    var _$tabbar                = $(_SEL_TABBAR);
    var _$tabs                  = null;
    
    /**
     * Tab-Bar initialisieren.
     * Parst alle benötigten Templates und startet Funktionen,
     * um den Anfangszustand der Tab-Bar herzustellen.
     */
    function init() {
        _bindEvents();
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        _$tabbar.on(CFG.EVT.CLICK, _SEL_TABS, setTab);
        $(window).on(CFG.EVT.CREATE_PANELS, _createTablist);
        window.addEventListener(CFG.EVT.KEYBOARD_SHOW, disable);
        window.addEventListener(CFG.EVT.KEYBOARD_HIDE, enable);
    }
    
    /**
     * Modul rendern.
     * Rendert alle Elemente des Moduls anhand der intern
     * gesetzten aktuellen Variablen.
     */
    function _render() {
        _$tabbar.setMod(_B, _M_HIDDEN, _isHidden);
        _$tabbar.setMod(_B, _M_DISABLED, _isDisabled);
        _$tabbar.setMod(_B, _M_TAB, _tabActive);
        _$tabs.eq(_tabActive).setMod(_B, _E, _M_ACTIVE, true)
              .siblings().setMod(_B, _E, _M_ACTIVE, false);
    }
    
    /**
     * Tab-Liste generieren.
     * Generiert für jedes im Event übergebene Panel einen
     * entsprechenden Tab in der Tab-Bar und aktiviert den ersten Tab.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _createTablist(event, data) {
        if ((typeof data        !== typeof undefined) &&
            (typeof data.panels !== typeof undefined)) {
            Template.render(_$tabbar, _TMPL_TABBAR, data.panels, function() {
                _$tabs = _$tabbar.find(_SEL_TABS);
                _tabNumber = _$tabs.length - 1;
                setTab(_tabActive);
                $(window).trigger(CFG.EVT.SHOW_VIEWPORT);
            });
        }
    }
    
    /**
     * Aktiven Tab setzen.
     * Setzt den aktiven Tab anhand eines (Klick)-Events oder eines
     * übergebenen Tab-Indexes; falls der Index gültig ist, wird dieser
     * als aktiver Index gesetzt und die Tabbar wird gerendert.
     * @param {(Object|Number)} tab Klick-Event vom Tab oder Tab-Index
     */
    function setTab(tab) {
        
        // Variablen initialisieren, Tab-Index ermitteln
        var i     = -1;
        var panel = null;
        if (tab.target) { i = $(tab.target).closest(_SEL_TABS).index(); }
        else { i = parseInt(tab); }

        // Tab-Index prüfen, setzen und Event auslösen
        if ((i >= 0) && (i <= _tabNumber)) {
            _tabActive = i;
            panel = _$tabs.eq(i).data(_DATA_PANEL);
            if ((panel !== null) && (panel.length > 0)) {
                $(window).trigger(CFG.EVT.SET_PANEL, { panel: panel });
            }
        }
        _render();
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
    
    /**
     * Modul deaktivieren.
     * Deaktiviert das Modul aus und rendert es neu.
     */
    function disable() {
        _isDisabled = true;
        _render();
    }
    
    /**
     * Modul aktivieren.
     * Akiviert das Modul ein und rendert es neu.
     */
    function enable() {
        _isDisabled = false;
        _render();
    }
    
    // Öffentliches Interface
    return {
        init    : init,
        hide    : hide,
        show    : show,
        disable : disable,
        enable  : enable,
        setTab  : setTab
    };
    
})();