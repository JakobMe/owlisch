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
    var _SEL_TABBAR         = "[role='tablist']";
    var _SEL_TABS           = "[role='tab']";
    var _SEL_TMPL           = "#tmpl-tablist";
    
    // BEM-Konstanten
    var _B                  = "tab-bar";
    var _E                  = "tab";
    var _M_ACTIVE           = "active";
    var _M_HIDDEN           = "hidden";
    var _M_TAB              = "tab";
    
    // Data-Attibut-Konstanten
    var _DATA_PANEL         = "panel";
    
    // Private Variablen
    var _tabActive;
    var _tabNumber;
    var _isHidden;
    var _tmplTablist;
    
    // DOM-Elemente
    var _$tabbar;
    var _$tabs;
    
    /**
     * Modul initialisieren.
     * Setzt die Standard-Anfangswerte des Moduls, bindet alle Events,
     * sucht nach den benötigten DOM-Elementen und rendert das Modul.
     */
    function init() {
        
        // Modulvariablen initialisieren
        _$tabbar            = $(_SEL_TABBAR);
        _tmplTablist        = $(_SEL_TMPL).html();
        _$tabs              = null;
        _isHidden           = false;
        _tabNumber          = -1;
        _tabActive          = 0;
        
        // Templates parsen
        Mustache.parse(_tmplTablist);
        
        // Funktionen ausführen
        _bindEvents();
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        _$tabbar.on(_C.EVT.CLICK, _SEL_TABS, _setTab);
        $(window).on(_C.EVT.CREATE_PANELS, _createTablist);
        window.addEventListener(_C.EVT.KEYBOARD_SHOW, _hide);
        window.addEventListener(_C.EVT.KEYBOARD_HIDE, _show);
    }
    
    /**
     * Modul rendern.
     * Rendert alle Elemente des Moduls anhand der intern
     * gesetzten aktuellen Variablen.
     */
    function _render() {
        _$tabbar.setMod(_B, _M_HIDDEN, _isHidden);
        _$tabbar.setMod(_B, _M_TAB, _tabActive);
        _$tabs.eq(_tabActive).setMod(_B, _E, _M_ACTIVE, true)
              .siblings().setMod(_B, _E, _M_ACTIVE, false);
    }
    
    /**
     * Tabliste generieren.
     * Generiert für jedes im Event übergebene Panel einen
     * entsprechenden Tab in der Tab-Bar und aktiviert den ersten Tab.
     */
    function _createTablist(event, data) {
        if (typeof data !== _C.TYPE.UNDEF) {
            if (typeof data.panels !== _C.TYPE.UNDEF) {
                _$tabbar.html(Mustache.render(_tmplTablist, data.panels))
                    .promise().done(function() {
                        _$tabs = _$tabbar.find(_SEL_TABS);
                        _tabNumber = _$tabs.length - 1;
                        _setTab(_tabActive);
                        $(window).trigger(_C.EVT.SHOW_VIEWPORT);
                    }
                );
            }
        }
    }
    
    /**
     * Aktiven Tab setzen.
     * Setzt den aktiven Tab anhand eines (Klick)-Events oder eines
     * übergebenen Tab-Indexes; falls der Index gültig ist, wird dieser
     * als aktiver Index gesetzt und die Tabbar wird gerendert.
     * @param {Object|number} tab Klick-Event vom Tab oder Tab-Index
     */
    function _setTab(tab) {
        
        // Variablen initialisieren, Tab-Index ermitteln
        var i = -1;
        var panel = null;
        if (typeof tab === _C.TYPE.NUM) { i = tab; }
        else if (tab.target) { i = $(tab.target).closest(_SEL_TABS).index(); }

        // Tab-Index prüfen, setzen und Event auslösen
        if ((i >= 0) && (i <= _tabNumber)) {
            _tabActive = i;
            panel = _$tabs.eq(i).data(_DATA_PANEL);
            if ((panel !== null) && (panel.length > 0)) {
                $(window).trigger(_C.EVT.SET_PANEL, { panel: panel });
            }
        }
        _render();
    }
    
    /**
     * Modul verbergen.
     * Blendet das Modul aus und rendert es neu.
     */
    function _hide() {
        _isHidden = true;
        _render();
    }
    
    /**
     * Modul zeigen.
     * Blendet das Modul ein und rendert es neu.
     */
    function _show() {
        _isHidden = false;
        _render();
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();