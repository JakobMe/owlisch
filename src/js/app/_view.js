/**
 * View-Modul.
 * Steuert die View der App.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
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
    var _isVisible              = false;
    var _isFullscreen           = false;
    var _isWebapp               = (CFG.WEBAPP.IOS || CFG.WEBAPP.CORDOVA);
    
    // DOM-Elemente
    var _$view                  = $(_SEL_MAIN);
    var _$content               = null;
    var _$panels                = {};
    
    /**
     * View initialisieren.
     * Führt Funktionen aus, um den Ausgangszustand der View herzustellen.
     */
    function init() {
        _create();
        _bindEvents();
        _hookMediator();
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events.
     */
    function _bindEvents() {
        window.addEventListener(CFG.EVT.KEYBOARD_SHOW, _enableFullscreen);
        window.addEventListener(CFG.EVT.KEYBOARD_HIDE, _disableFullscreen);
    }
    
    /**
     * Mediator abonnieren.
     * Meldet Funktionen beim Mediator an.
     */
    function _hookMediator() {
        Mediator.hook(CFG.CNL.VIEW_SHOW, _show)
                .hook(CFG.CNL.VIEW_HIDE, _hide)
                .hook(CFG.CNL.VIEW_SET, _setView)
                .hook(CFG.CNL.QUIZ_END, _disableFullscreen)
                .hook(CFG.CNL.QUIZ_START, _enableFullscreen);
    }
    
    /**
     * View generieren.
     * Generiert für jedes definierte Panel anhand des gesetzten
     * Templates ein HTML-Panel im Content-Bereich; initialisiert
     * die Elemente der View und leitet die Panel-Daten über den
     * Mediator weiter; rendert die View.
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
            Mediator.send(CFG.CNL.VIEW_INIT, panels);
            _render();
        });
    }
    
    /**
     * View rendern.
     * Rendert alle Elemente der View anhand der intern
     * gesetzten aktuellen Variablen.
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
     * View-Panels rendern.
     * Rendert alle View-Panels; blendet sie ein oder aus.
     */
    function _renderPanels() {
        $.each(_$panels, function(name, $panel) {
            $panel.setMod(_B, _E_PANEL, _M_CURRENT, (name === _currentPanel));
        });
    }
    
    /**
     * Aktuelles View-Panel setzen.
     * Setzt das aktuelle View-Panel anhand eines Mediator-Events;
     * entscheidet, ob sich das Panel geändert hat oder nicht;
     * teilt dem Mediator die Änderung mit und rendert die View.
     * @param {String} panel Name des neuen Panels
     */
    function _setView(panel) {
        if ((typeof panel !== typeof undefined) &&
            (_$panels[panel] instanceof $)) {
            
            // Wenn Panel neu ist
            if (panel !== _currentPanel) {
                
                // Panel ändern, Änderung bekanntmachen
                Mediator.send(
                    CFG.CNL.VIEW_CHANGE,
                    { panelOld: _currentPanel, panelNew: panel }
                );
                _currentPanel = panel;
                
                // Ausblenden, gegebenenfalls laden, einblenden
                _hide();
                setTimeout(function() {
                    if (_$panels[panel].children().length === 0 ) {
                        Mediator.send(CFG.CNL.VIEW_LOAD, {
                            panel: panel, target: _$panels[panel]
                        });
                    } else { _show(); }
                }, CFG.TIME.ANIMATION);
                
            // Panel gegebenenfalls wiederherstellen
            } else {
                Mediator.send(CFG.CNL.VIEW_RESTORE, _currentPanel);
            }
        }
    }
    
    /**
     * View ausblenden.
     * Blendet die View aus.
     */
    function _hide() {
        _isVisible = false;
        _render();
    }
    
    /**
     * View einblenden.
     * Blendet die View ein.
     */
    function _show() {
        _isVisible = true;
        _render();
    }
    
    /**
     * Fullscreen aktivieren.
     * Aktiviert die volle Höhe für die View.
     */
    function _enableFullscreen() {
        _isFullscreen = true;
        _render();
    }
    
    /**
     * Fullscreen deaktivieren.
     * Deaktiviert die volle Höhe für die View.
     */
    function _disableFullscreen() {
        _isFullscreen = false;
        _render();
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();