/**
 * Steuert die Tab-Bar der App; erstellt beim Initialisieren alle Tabs anhand
 * der View-Panels, die dem Modul per Mediator vom View-Modul übergeben werden,
 * ermöglicht das Wechseln des View-Panels per Klick auf die Tabs und das
 * Ein-/Ausblenden der Tab-Bar bei bestimmten Events und Mediator-Nachrichten.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @license MIT
 * @requires Util
 * @requires Mediator
 * @requires Template
 * @module TabBar
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
     * Initialisiert das TabBar-Modul; bindet Events und abonniert den
     * Mediator, indem andere Funktionen ausgeführt werden.
     * @access public
     * @function init
     */
    function init() {
        _bindEvents();
        _subMediator();
    }

    /**
     * Bindet Funktionen an Events.
     * @access private
     * @function _bindEvents
     */
    function _bindEvents() {
        _$tabbar.on(CFG.EVT.CLICK, _SEL_TAB, _setTab);
        window.addEventListener(CFG.EVT.KEYBOARD_SHOW, _disable);
        window.addEventListener(CFG.EVT.KEYBOARD_HIDE, _enable);
    }

    /**
     * Abonniert interne Funktionen beim Mediator.
     * @access private
     * @function _subMediator
     */
    function _subMediator() {
        Mediator.sub(CFG.CNL.VIEW_INIT, _create)
                .sub(CFG.CNL.QUIZ_START, _hide)
                .sub(CFG.CNL.QUIZ_END, _show);
    }

    /**
     * Tab-Bar generieren.
     * Generiert für jedes angegebene Panel einen entsprechenden
     * Tab in der Tab-Bar und aktiviert den ersten Tab.

     */
    /**
     * Generiert für jedes vom View-Modul übergebene Panel einen Tab,
     * indem das Tab-Bar-Template per Mustache mit den Panel-Daten geladen
     * und in die App eingefügt wird; aktiviert den ersten Tab.
     * @access private
     * @param {Object} panels Vom View-Modul übergebenes Panel-Objekt
     * @function _create
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
     * Rendert alle Elemente der Tab-Bar anhand der intern
     * gesetzten aktuellen Variablen.
     * @access private
     * @function _render
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
     * Setzt den aktiven Tab anhand eines Klick-Events oder eines
     * übergebenen Tab-Indexes; rendert anschließend die Tab-Bar
     * und sendet das gewählte View-Panel über den Mediator.
     * @access private
     * @param {(Object|Number)} tab Klick-Event vom Tab oder Tab-Index
     * @function _setTab
     */
    function _setTab(tab) {
        if (!_isLocked) {

            // Tabs sperren und entsperren
            _isLocked = true;
            setTimeout(function() {
                _isLocked = false;
            }, CFG.TIME.ANIMATION);

            // Aktiven Tab ermitteln
            _tabActive = Util.limit(
                (tab.target ? $(tab.target).closest(_SEL_TAB).index() : tab),
                0, _tabNumber
            );

            // Rendern, Mediator aufrufen
            _render();
            Mediator.pub(
                CFG.CNL.VIEW_SET,
                _$tabs.eq(_tabActive).data(_DATA_PANEL)
            );
        }
    }

    /**
     * Blendet die Tab-Bar aus.
     * @access private
     * @function _hide
     */
    function _hide() {
        _isHidden = true;
        _isLocked = true;
        _render();
    }

    /**
     * Blendet die Tab-Bar ein.
     * @access private
     * @function _show
     */
    function _show() {
        _isHidden = false;
        _isLocked = false;
        _render();
    }

    /**
     * Deaktiviert die Tab-Bar.
     * @access private
     * @function _disable
     */
    function _disable() {
        _isDisabled = true;
        _isLocked = true;
        _render();
    }

    /**
     * Aktiviert die Tab-Bar.
     * @access private
     * @function _enable
     */
    function _enable() {
        _isDisabled = false;
        _isLocked = false;
        _render();
    }

    // Öffentliches Interface
    return { init: init };

})();
