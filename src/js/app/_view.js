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
    var _SEL_PANELS             = "[role='tabpanel']";
    var _SEL_VIEW               = "#view-container";
    var _SEL_CONTENT            = "#view-content";
    
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
    var _$view                  = $(_SEL_VIEW);
    var _$content               = null;
    var _$panels                = {};
    
    /**
     * View initialisieren.
     * Parst alle benötigten Templates und startet Funktionen,
     * um den Anfangszustand der View herzustellen.
     */
    function init() {
        _initPanels();
        _bindEvents();
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        $(window).on(CFG.EVT.SET_PANEL, _setPanel);
        $(window).on(CFG.EVT.SHOW_VIEW, show);
        $(window).on(CFG.EVT.HIDE_VIEW, hide);
        window.addEventListener(CFG.EVT.KEYBOARD_SHOW, enableFullscreen);
        window.addEventListener(CFG.EVT.KEYBOARD_HIDE, disableFullscreen);
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
        setTimeout(function() {
            $.each(_$panels, function(name, $panel) {
                $panel.setMod(
                    _B, _E_PANEL, _M_CURRENT,
                    (name === _currentPanel)
                );
            });
        }, (_isVisible ? 0 : CFG.TIME.ANIMATION));
    }
    
    /**
     * View-Panels generieren.
     * Generiert für jedes definierte Panel anhand des gesetzten
     * Mustache-Templates ein HTML-Panel im Content-Bereich und
     * löst anschließend ein Event mit den Panel-Daten aus.
     * @param {Function} callback Funktion, die im Anschluss ausgeführt wird
     */
    function _createPanels(callback) {
        
        // Panel-Array erzeugen
        var panels = [];
        $.each(CFG.VIEW, function(alias, props) {
            var panelProps = { alias: alias, icon: alias.toLowerCase() };
            $.each(props, function(prop, value) {
                panelProps[prop.toLowerCase()] = value;
            });
            panels.push(panelProps);
        });
        
        // Template laden, Callback
        Template.render(_$view, _TMPL_VIEW, panels, function() {
            if ($.isFunction(callback)) { callback(panels); }
        });
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
            
            // Inhalt initialisieren, Event auslösen, rendern
            _$content = _$view.find(_SEL_CONTENT);
            $(window).trigger(CFG.EVT.CREATE_PANELS, { panels: panels });
            _render();
        });
    }
    
    /**
     * Aktuelles View-Panel setzen.
     * Setzt das aktuelle View-Panel anhand eines Events;
     * entscheidet, ob sich das Panel geändert hat oder nicht.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _setPanel(event, data) {
        if ((typeof data          !== typeof undefined) &&
            (typeof data.panel    !== typeof undefined) &&
            (_$panels[data.panel] instanceof $)) {
            
            // Wenn Panel sich nicht geändert hat, Wiederherstellung auslösen
            if (data.panel === _currentPanel) {
                $(window).trigger(
                    CFG.EVT.RESTORE_DEFAULT,
                    { panel: _currentPanel }
                );
            
            // Ansonsten Panel ändern
            } else { _changePanel(data.panel); }
        }
    }
    
    /**
     * Aktuelles View-Panel ändern.
     * Ändern das aktuelle View-Panel anhand eines Panel-Namens;
     * blendet die View erst aus und lädt anschließen den Panel-Inhalt.
     * @param {String} panel Name des neuen Panels
     */
    function _changePanel(panel) {
        
        // Navigation-Bar aktualisieren
        $(window).trigger(
            CFG.EVT.UPDATE_NAVBAR,
            { panelOld: _currentPanel, panelNew: panel }
        );
        
        // Aktuelles Panel setzen, ausblenden
        _currentPanel = panel;
        hide();

        // Inhalt laden
        setTimeout(function() {
            _loadPanelContent();
        }, CFG.TIME.ANIMATION);
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
                CFG.EVT.LOAD_PANEL_CONTENT, {
                    panel: _currentPanel,
                    target: _$panels[_currentPanel]
                }
            );
        
        // Ansonsten einblenden
        } else { show(); }
    }
    
    /**
     * Modul verbergen.
     * Blendet das Modul aus und rendert es neu.
     */
    function hide() {
        _isVisible = false;
        _render();
    }
    
    /**
     * Modul zeigen.
     * Blendet das Modul ein und rendert es neu.
     */
    function show() {
        _isVisible = true;
        _render();
    }
    
    /**
     * Fullscreen aktivieren.
     * Aktiviert die volle Höhe für das Modul.
     */
    function enableFullscreen() {
        _isFullscreen = true;
        _render();
    }
    
    /**
     * Fullscreen deaktivieren.
     * Deaktiviert die volle Höhe für das Modul.
     */
    function disableFullscreen() {
        _isFullscreen = false;
        _render();
    }
    
    // Öffentliches Interface
    return {
        init              : init,
        show              : show,
        hide              : hide,
        enableFullscreen  : enableFullscreen,
        disableFullscreen : disableFullscreen
    };
    
})();