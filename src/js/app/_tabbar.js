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
    var _SEL_MAIN               = "[data-tabbar='main']";
    var _SEL_LIST               = "[data-tabbar='list']";
    var _SEL_TAB                = "[data-tabbar='tab']";
    
    // Template-Namen
    var _TMPL_TABBAR            = "tabbar";
    
    // BEM-Konstanten
    var _B                      = "tabbar";
    var _E_TAB                  = "tab";
    var _E_LIST                 = "list";
    var _M_ACTIVE               = "active";
    var _M_HIDDEN               = "hidden";
    var _M_DISABLED             = "disabled";
    var _M_TAB                  = "tab";
    
    // Data-Attibut-Konstanten
    var _DATA_PANEL             = "panel";
    
    // Private Variablen
    var _tabActive              = 0;
    var _tabNumber              = 0;
    var _isHidden               = false;
    var _isDisabled             = false;
    var _isLocked               = false;
    
    // DOM-Elemente
    var _$tabbar                = $(_SEL_MAIN);
    var _$list                  = null;
    var _$tabs                  = null;
    
    /**
     * Tab-Bar initialisieren.
     * Führt Funktionen aus, um die Tab-Bar in ihren Ausgangszustand
     * zu versetzen.
     */
    function init() {
        _bindEvents();
        _hookMediator();
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events.
     */
    function _bindEvents() {
        _$tabbar.on(CFG.EVT.CLICK, _SEL_TAB, _setTab);
        window.addEventListener(CFG.EVT.KEYBOARD_SHOW, _disable);
        window.addEventListener(CFG.EVT.KEYBOARD_HIDE, _enable);
    }
    
    /**
     * Mediator abonnieren.
     * Meldet Funktionen beim Mediator an.
     */
    function _hookMediator() {
        Mediator.hook(CFG.CNL.VIEW_INIT, _create)
                .hook(CFG.CNL.QUIZ_START, _hide)
                .hook(CFG.CNL.QUIZ_END, _show);
    }
    
    /**
     * Tab-Bar generieren.
     * Generiert für jedes angegebene Panel einen entsprechenden
     * Tab in der Tab-Bar und aktiviert den ersten Tab.
     * @param {Object} panels Existente Panels
     */
    function _create(panels) {
        if (typeof panels !== typeof undefined) {
            Template.render(_$tabbar, _TMPL_TABBAR, panels, function() {
                _$tabs = _$tabbar.find(_SEL_TAB);
                _$list = _$tabbar.find(_SEL_LIST);
                _tabNumber = _$tabs.length - 1;
                setTimeout(function() {
                    _$list.setMod(_B, _E_LIST, _M_HIDDEN, false);
                    _setTab(_tabActive);
                }, CFG.TIME.DELAY);
            });
        }
    }
    
    /**
     * Tab-Bar rendern.
     * Rendert alle Elemente der Tab-Bar anhand der intern
     * gesetzten aktuellen Variablen.
     */
    function _render() {
        
        // Status rendern
        _$tabbar.setMod(_B, _M_HIDDEN, _isHidden);
        _$tabbar.setMod(_B, _M_DISABLED, _isDisabled);
        _$tabbar.setMod(_B, _M_TAB, _tabActive);
        
        // Tabs aktivieren/deaktivieren
        _$tabs.eq(_tabActive).setMod(_B, _E_TAB, _M_ACTIVE, true)
                  .siblings().setMod(_B, _E_TAB, _M_ACTIVE, false);
    }
    
    /**
     * Aktiven Tab setzen.
     * Setzt den aktiven Tab anhand eines Klick-Events oder eines
     * übergebenen Tab-Indexes; rendert anschließend die Tab-Bar
     * und sendet das gewählte View-Panel über den Mediator.
     * @param {(Object|Number)} tab Klick-Event vom Tab oder Tab-Index
     */
    function _setTab(tab) {
        if (!_isLocked) {
            
            // Tabs sperren und entsperren
            _isLocked = true;
            setTimeout(function() {
                _isLocked = false;
            }, CFG.TIME.ANIMATION);
            
            // Aktiven Tab ermitteln
            _tabActive = Math.min(Math.max(
                (tab.target ? $(tab.target).closest(_SEL_TAB).index() : tab),
                0), _tabNumber);
    
            // Rendern, Mediator aufrufen
            _render();
            Mediator.send(
                CFG.CNL.VIEW_SET,
                _$tabs.eq(_tabActive).data(_DATA_PANEL)
            );
        }
    }
    
    /**
     * Tab-Bar ausblenden.
     * Blendet die Tab-Bar aus.
     */
    function _hide() {
        _isHidden = true;
        _isLocked = true;
        _render();
    }
    
    /**
     * Tab-Bar einblenden.
     * Blendet die Tab-Bar ein.
     */
    function _show() {
        _isHidden = false;
        _isLocked = false;
        _render();
    }
    
    /**
     * Tab-Bar deaktivieren.
     * Deaktiviert die Tab-Bar.
     */
    function _disable() {
        _isDisabled = true;
        _isLocked = true;
        _render();
    }
    
    /**
     * Tab-Bar aktivieren.
     * Aktiviert die Tab-Bar.
     */
    function _enable() {
        _isDisabled = false;
        _isLocked = false;
        _render();
    }
    
    // Öffentliches Interface
    return { init: init, };
    
})();