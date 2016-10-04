/**
 * Steuert die View der App; erstellt beim Initialisieren alle View-Panels
 * die im CFG-Modul angegeben sind, ermöglich das Ein-/Ausblenden der View,
 * löst über den Mediator die Erstellung der View-Inhalte aus, falls diese
 * leer sind und reagiert auf Änderungen der View, z.B. durch das Keyboard
 * oder das Starten/Beenden des Quiz.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @license MIT
 * @requires Mediator
 * @requires Template
 * @module View
 */
var View = (function() {

    // Selektor-Konstanten
    var _SEL_MAIN               = "[data-view='main']";
    var _SEL_PANEL              = "[data-view='panel']";
    var _SEL_CONTENT            = "[data-view='content']";

    // Template-Namen
    var _TMPL_VIEW              = "view";

    // BEM-Konstanten
    var _B                      = "view";
    var _E_CONTENT              = "content";
    var _E_PANEL                = "panel";
    var _M_VISIBLE              = "visible";
    var _M_FULLSCREEN           = "fullscreen";
    var _M_WEBAPP               = "webapp";
    var _M_CURRENT              = "current";

    // Data-Konstanten
    var _DATA_PANEL             = "panel";

    // Private Variablen
    var _currentPanel           = null;
    var _isQuiz                 = false;
    var _isVisible              = false;
    var _isFullscreen           = false;
    var _isWebapp               = (CFG.WEBAPP.IOS || CFG.WEBAPP.CORDOVA);

    // DOM-Elemente
    var _$view                  = $(_SEL_MAIN);
    var _$content               = null;
    var _$panels                = {};

    /**
     * Initialisiert das View-Modul; erstellt alle View-Panels, bindet Events
     * und abonniert den Mediator, indem andere Funktionen ausgeführt werden.
     * @access public
     * @function init
     */
    function init() {
        _create();
        _bindEvents();
        _subMediator();
    }

    /**
     * Bindet Funktionen an Events.
     * @access private
     * @function _bindEvents
     */
    function _bindEvents() {
        window.addEventListener(CFG.EVT.KEYBOARD_SHOW, _enableFullscreen);
        window.addEventListener(CFG.EVT.KEYBOARD_HIDE, _disableFullscreen);
    }

    /**
     * Abonniert interne Funktionen beim Mediator.
     * @access private
     * @function _subMediator
     */
    function _subMediator() {
        Mediator.sub(CFG.CNL.VIEW_SHOW, _show)
                .sub(CFG.CNL.VIEW_HIDE, _hide)
                .sub(CFG.CNL.VIEW_SET, _setView)
                .sub(CFG.CNL.QUIZ_END, _disableQuiz)
                .sub(CFG.CNL.QUIZ_START, _enableQuiz);
    }

    /**
     * Generiert für jedes im CFG-Modul definierte Panel anhand des gesetzten
     * Templates ein HTML-Panel im Content-Bereich; initialisiert die Elemente
     * der View und leitet die Panel-Daten über den Mediator weiter;
     * rendert die View anschließend.
     * @access private
     * @function _create
     */
    function _create() {

        // Panel-Array erzeugen
        var panels = [];
        $.each(CFG.VIEW, function(alias, props) {
            var panelProps = { alias: alias, icon: alias.toLowerCase() };
            $.each(props, function(prop, value) {
                panelProps[prop.toLowerCase()] = value;
            });
            panels.push(panelProps);
        });

        // Template laden, Elemente initialisieren
        Template.render(_$view, _TMPL_VIEW, panels, function() {
            _$content = _$view.find(_SEL_CONTENT);
            _$view.find(_SEL_PANEL).each(function() {
                _$panels[$(this).data(_DATA_PANEL)] = $(this);
            });
            Mediator.pub(CFG.CNL.VIEW_INIT, panels);
            _render();
        });
    }

    /**
     * Rendert alle Elemente der View anhand der intern
     * gesetzten aktuellen Variablen.
     * @access private
     * @function _render
     */
    function _render() {

        // View und Content rendern
        _$view.setMod(_B, _M_WEBAPP, _isWebapp);
        _$view.setMod(_B, _M_FULLSCREEN, _isFullscreen);
        _$content.setMod(_B, _E_CONTENT, _M_VISIBLE, _isVisible);

        // View-Panels (de-)aktivieren
        if (!_isVisible) {
            setTimeout(function() {
                _renderPanels();
            }, CFG.TIME.ANIMATION);
        } else {
            _renderPanels();
        }
    }

    /**
     * Rendert alle View-Panels; blendet sie ein oder aus.
     * @access private
     * @function _renderPanels
     */
    function _renderPanels() {
        $.each(_$panels, function(name, $panel) {
            $panel.setMod(_B, _E_PANEL, _M_CURRENT, (name === _currentPanel));
        });
    }

    /**
     * Setzt das aktuelle View-Panel anhand eines Mediator-Events;
     * entscheidet, ob sich das Panel geändert hat oder nicht;
     * teilt dem Mediator die Änderung mit und rendert die View.
     * @access private
     * @param {String} panel Name des neuen Panels
     * @function _setView
     */
    function _setView(panel) {
        if ((typeof panel !== typeof undefined) &&
            (_$panels[panel] instanceof $)) {

            // Wenn Panel neu ist
            if (panel !== _currentPanel) {

                // Panel ändern, Änderung bekanntmachen
                Mediator.pub(
                    CFG.CNL.VIEW_CHANGE,
                    { panelOld: _currentPanel, panelNew: panel }
                );
                _currentPanel = panel;

                // Ausblenden, gegebenenfalls laden, einblenden
                _hide();
                setTimeout(function() {
                    if (_$panels[panel].children().length === 0 ) {
                        Mediator.pub(CFG.CNL.VIEW_LOAD, {
                            panel: panel, target: _$panels[panel]
                        });
                    } else { _show(); }
                }, CFG.TIME.ANIMATION);

            // Panel gegebenenfalls wiederherstellen
            } else {
                Mediator.pub(CFG.CNL.VIEW_RESTORE, _currentPanel);
            }
        }
    }

    /**
     * Blendet die View aus.
     * @access private
     * @function _hide
     */
    function _hide() {
        _isVisible = false;
        _render();
    }

    /**
     * Blendet die View ein.
     * @access private
     * @function _show
     */
    function _show() {
        _isVisible = true;
        _render();
    }

    /**
     * Aktiviert die volle Höhe für die View.
     * @access private
     * @function _enableFullscreen
     */
    function _enableFullscreen() {
        _isFullscreen = true;
        _render();
    }

    /**
     * Deaktiviert die volle Höhe für die View, wenn Quiz inaktiv ist.
     * @access private
     * @function _disableFullscreen
     */
    function _disableFullscreen() {
        if (!_isQuiz) {
            _isFullscreen = false;
            _render();
        }
    }

    /**
     * Notiert, dass das Quiz aktiv ist; aktiviert Fullscreen.
     * @access private
     * @function _enableQuiz
     */
    function _enableQuiz() {
        _isQuiz = true;
        _enableFullscreen();
    }

    /**
     * Notiert, dass Quiz inaktiv ist; deaktiviert Fullscreen.
     * @access private
     * @function _disableQuiz
     */
    function _disableQuiz() {
        _isQuiz = false;
        _disableFullscreen();
    }

    // Öffentliches Interface
    return { init: init };

})();
