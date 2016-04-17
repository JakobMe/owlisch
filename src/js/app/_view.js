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
    
    // Panel-Konstanten
    var _PANELS = {
        START: {
            NAME            : "start",
            LABEL           : "Start",
            TITLE           : "Wort der Woche"
        },
        DICTIONARY: {
            NAME            : "dictionary",
            LABEL           : "Wörterbuch",
            TITLE           : "Wörterbuch"
        },
        QUIZ: {
            NAME            : "quiz",
            LABEL           : "Quiz",
            TITLE           : "Quiz"
        },
        PROGRESS: {
            NAME            : "progress",
            LABEL           : "Fortschritt",
            TITLE           : "Fortschritt"
        },
        HELP: {
            NAME            : "help",
            LABEL           : "Hilfe",
            TITLE           : "Hilfe"
        }
    };
    
    // Private Variablen
    var _isVisible;
    var _isWebapp;
    var _isFullscreen;
    var _currentPanel;
    var _panelIsExpired;
    var _panelHasContent;
    var _panelList;
    var _tmplViewpanels;
    
    // DOM-Elemente
    var _$view;
    var _$content;
    var _$panels;
    
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
            isVisible       : false,
            isFullscreen    : false
        };
        
        // Optionen ergänzen
        $.extend(defaults, options || {});
        
        // Modulvariablen initialisieren
        _$panels            = {};
        _$view              = $(_SEL_VIEW);
        _$content           = _$view.find(_SEL_CONTENT);
        _isVisible          = defaults.isVisible;
        _isFullscreen       = defaults.isFullscreen;
        _isWebapp           = (CONF.WEBAPP.IOS || CONF.WEBAPP.CORDOVA);
        _tmplViewpanels     = $(_SEL_TMPL).html();
        _currentPanel       = null;
        _panelList          = [];
        _panelIsExpired     = {};
        _panelHasContent    = {};
        
        // Templates parsen
        Mustache.parse(_tmplViewpanels);
        
        // Funktionen ausführen
        _initPanels();
        _render();
        
        // Modul Return
        return this;
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
     * Mustache-Templates ein HTML-Panel im Content-Bereich.
     */
    function _createPanels() {
        
        // Panel-Array initialisieren
        var panels = [];
        
        // Aus definierten Panels eine Liste für Mustache generieren
        for (var panel in _PANELS) {
            if (_PANELS.hasOwnProperty(panel)) {
                var props = {};
                for (var prop in _PANELS[panel]) {
                    if (_PANELS[panel].hasOwnProperty(prop)) {
                        props[prop.toLowerCase()] = _PANELS[panel][prop];
                    }
                }
                panels.push(props);
            }
        }
        
        // Template füllen und in Content laden, Liste speichern
        _$content.html(Mustache.render(_tmplViewpanels, panels));
        _panelList = panels;
    }
    
    /**
     * View-Panels initialisieren.
     * Rendert die View-Panels und setzt anschließend
     */
    function _initPanels() {
        
        // Zunächst Panels erzeugen
        _createPanels();
        
        // Alle Panels iterieren
        _$view.find(_SEL_PANELS).each(function() {
            
            // Gefundenes View-Panel initialisieren
            var $panel = $(this);
            var panelName = $panel.data(CONF.DATA.PANEL);
            
            // Panel zur Panel-Liste hinzufügen
            _$panels[panelName] = $panel;
            _panelIsExpired[panelName] = true;
            _panelHasContent[panelName] = false;
        });
    }
    
    /**
     * Navigation-Bar der View setzen.
     * Setzt die verknüpfte Navigation-Bar anhand des aktuellen
     * Panel-Namens; setzt Titel, Buttons und Suche.
     */
    function _setNavigationBar() {
        if ((typeof NavigationBar !== CONF.TYPE.UNDEF) &&
            (NavigationBar !== null)) {
            
            // Neue Werte initialisieren
            var newTitle = CONF.STR.EMPTY;
            var newSearch = false;
            var newIconLeft = null;
            var newIconRight = null;
            var newActionLeft = null;
            var newActionRight = null;
            
            // Sonderfall: Wörterbuch
            if (_currentPanel === _PANELS.DICTIONARY.NAME) {
                newSearch = true;
                newIconLeft = NavigationBar.ICON.SEARCH;
                newIconRight = NavigationBar.ICON.SORT;
                newActionLeft = NavigationBar.ACTION.SEARCH;
                newActionRight = NavigationBar.ACTION.SORT;
            }
            
            // Neuen Titel setzen
            if (_$panels[_currentPanel] instanceof jQuery) {
                newTitle = _$panels[_currentPanel].data(CONF.DATA.TITLE);
            }
            
            // Navigation-Bar setzen
            NavigationBar.setAll(
                newTitle, newActionLeft,
                newIconLeft, newActionRight,
                newIconRight, newSearch
            );
        }
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
     * @returns {Object} Modul-Objekt
     */
    function enableFullscreen() {
        _isFullscreen = true;
        _render();
        return this;
    }
    
    /**
     * Fullscreen deaktivieren.
     * Deaktiviert die volle Höhe für das Modul.
     * @returns {Object} Modul-Objekt
     */
    function disableFullscreen() {
        _isFullscreen = false;
        _render();
        return this;
    }
    
    /**
     * Panel-Inhalt erstellen.
     * Erstellt den Inhalt des angegebenen Panels in
     * Abhängigkeit des Panels.
     * @param {string} panel Name des Panels
     */
    function _createPanelContent(panel, callback) {
        
        // Panel-Validität und Funktion initialisieren
        var panelValid = false;
        
        // Anhand des Panels entscheiden
        switch (panel) {
            
            // Wörterbuch
            case _PANELS.DICTIONARY.NAME:
                Dictionary.init({ $target: _$panels[panel] });
                panelValid = true;
                break;
            
            // TODO: Andere Panels konfigurieren
        }
        
        // Panel-Inhalt erzeugen und wahr setzen
        _panelHasContent[panel] = panelValid;
        
        // Callback
        if ($.isFunction(callback)) { callback(); }
    }
    
    /**
     * Panel-Inhalt aktualisieren.
     * Aktualisiert den Inhalt des angegebenen Panels in
     * Abhänigkeit des Panels.
     * @param {string} panel Name des Panels
     */
    function _updatePanelContent(panel, callback) {
        panel = null;
        // TODO: Update-Logik schreiben
        
        // Callback
        if ($.isFunction(callback)) { callback(); }
    }
    
    /**
     * Aktuelles View-Panel setzen.
     * Wenn der übergebene Panel-Name gültig ist, wird die View
     * erst ausgeblendet, dann wird das Tab-Panel gewechselt,
     * die Navigation-Bar eingestellt und die View wieder eingeblendet.
     * @param {string} panel Name des neuen View-Panels
     * @returns {Object} Modul-Objekt
     */
    function setPanel(panel) {
        if (_$panels[panel] instanceof jQuery) {
            
            // Panel setzen, Navigation-Bar setzen und View ausblenden
            _currentPanel = panel;
            _setNavigationBar();
            _hide();
            
            // Panel gegebenenfalls aktualisieren, View einblenden
            setTimeout(function() {
                if (!_panelHasContent[_currentPanel]) {
                    _createPanelContent(_currentPanel, _show);
                } else if (_panelIsExpired[_currentPanel]) {
                    _updatePanelContent(_currentPanel, _show);
                } else {
                    _show();
                }
            }, CONF.TIME.SHORT);
        }
        return this;
    }
    
    /**
     * Panel-Liste zurückgeben.
     * Gibt die intern zusammengestellte Panel-Liste nach außen.
     */
    function getPanelList() {
        return _panelList;
    }
    
    // Öffentliches Interface
    return {
        init                : init,
        enableFullscreen    : enableFullscreen,
        disableFullscreen   : disableFullscreen,
        setPanel            : setPanel,
        getPanelList        : getPanelList
    };
    
})();