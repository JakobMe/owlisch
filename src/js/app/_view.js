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
    var _SEL_VIEW           = "[role='main']";
    var _SEL_CONTENT        = "[role='article']";
    var _SEL_PANELS         = "[role='tabpanel']";
    var _SEL_TMPL           = "#tmpl-viewpanels";
    
    // BEM-Konstanten
    var _B                  = "view";
    var _E_CONTENT          = "content";
    var _E_PANEL            = "panel";
    var _M_VISIBLE          = "visible";
    var _M_FULLSCREEN       = "fullscreen";
    var _M_WEBAPP           = "webapp";
    var _M_CURRENT          = "current";
    
    // Data-Konstanten
    var _DATA_PANEL         = "panel";
    
    // Private Variablen
    var _isVisible;
    var _isWebapp;
    var _isFullscreen;
    var _currentPanel;
    var _tmplViewpanels;
    
    // DOM-Elemente
    var _$view;
    var _$content;
    var _$panels;
    
    /**
     * Modul initialisieren.
     * Setzt die Standard-Anfangswerte des Moduls, bindet alle Events,
     * sucht nach den benötigten DOM-Elementen und rendert das Modul.
     */
    function init() {
        
        // Modulvariablen initialisieren
        _$view              = $(_SEL_VIEW);
        _$content           = _$view.find(_SEL_CONTENT);
        _$panels            = {};
        _isVisible          = false;
        _isFullscreen       = false;
        _isWebapp           = (_C.WEBAPP.IOS || _C.WEBAPP.CORDOVA);
        _tmplViewpanels     = $(_SEL_TMPL).html();
        _currentPanel       = null;
        
        // Templates parsen
        Mustache.parse(_tmplViewpanels);
        
        // Funktionen ausführen
        _bindEvents();
        _initPanels();
        _render();
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        $(window).on(_C.EVT.SET_PANEL, _setPanel);
        $(window).on(_C.EVT.SHOW_VIEW, _show);
        $(window).on(_C.EVT.HIDE_VIEW, _hide);
        window.addEventListener(_C.EVT.KEYBOARD_SHOW, _setFullscreen);
        window.addEventListener(_C.EVT.KEYBOARD_HIDE, _unsetFullscreen);
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
     * View-Panels generieren.
     * Generiert für jedes definierte Panel anhand des gesetzten
     * Mustache-Templates ein HTML-Panel im Content-Bereich und
     * löst anschließend ein Event mit den Panel-Daten aus.
     */
    function _createPanels(callback) {
        
        // Panel-Array erzeugen
        var panels = [];
        $.each(_C.VIEW, function(panel, props) {
            var panelProps = [];
            $.each(props, function(prop, value) {
                panelProps[prop.toLowerCase()] = value;
            });
            panels.push(panelProps);
        });
        
        // Template füllen und in Content laden, Event auslösen
        _$content.html(Mustache.render(_tmplViewpanels, panels))
            .promise().done(function() {
                if ($.isFunction(callback)) { callback(panels); }
            }
        );
    }
    
    /**
     * View-Panels initialisieren.
     * Generiert zunächst die Panels und speichert die
     * entsprechenden jQuery-Objekt lokal.
     */
    function _initPanels() {
        
        // Panels generieren
        _createPanels(function(panels) {
            
            // Panels initialisieren
            _$view.find(_SEL_PANELS).each(function() {
                _$panels[$(this).data(_DATA_PANEL)] = $(this);
            });
            
            // Event auslösen
            $(window).trigger(
                _C.EVT.CREATE_PANELS,
                { panels: panels }
            );
        });
    }
    
    /**
     * Aktuelles View-Panel setzen.
     * Setzt das aktuelle View-Panel anhand eines Events;
     * blendet die View erst aus und lädt anschließen den Panel-Inhalt.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _setPanel(event, data) {
        if (typeof data !== _C.TYPE.UNDEF) {
            if (typeof data.panel === _C.TYPE.STR) {
                if (_$panels[data.panel] instanceof jQuery) {
                    
                    // Navigation-Bar aktualisieren
                    $(window).trigger(
                        _C.EVT.UPDATE_NAVBAR,
                        { panelOld: _currentPanel, panelNew: data.panel }
                    );
                    
                    // Aktuelles Panel setzen, ausblenden
                    _currentPanel = data.panel;
                    _hide();

                    // Inhalt laden
                    setTimeout(function() {
                        _loadPanelContent();
                    }, _C.TIME.DEFAULT);
                }
            }
        }
    }
    
    /**
     * Panel-Inhalt laden.
     * Löst ein Event aus, um den Inhalt des aktuellen Panels
     * in das entsprechende jQuery-Objekt zu laden, falls es leer ist.
     */
    function _loadPanelContent() {
        
        // Wenn Panel leer ist, Inhalt mit Event laden
        if (_$panels[_currentPanel].children().length === 0 ) {
            $(window).trigger(
                _C.EVT.LOAD_PANEL_CONTENT, {
                    panel: _currentPanel,
                    target: _$panels[_currentPanel]
                }
            );
        
        // Ansonsten einblenden
        } else { _show(); }
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
     */
    function _setFullscreen() {
        _isFullscreen = true;
        _render();
    }
    
    /**
     * Fullscreen deaktivieren.
     * Deaktiviert die volle Höhe für das Modul.
     */
    function _unsetFullscreen() {
        _isFullscreen = false;
        _render();
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();