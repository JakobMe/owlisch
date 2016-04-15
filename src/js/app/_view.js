/**
 * View-Modul.
 * Steuert die TabBar der App.
 * @author Jakob Metzger
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
            TITLE           : "Wort der Woche",
            ICON            : "home"
        },
        DICTIONARY: {
            NAME            : "dictionary",
            LABEL           : "Wörterbuch",
            TITLE           : "Wörterbuch",
            ICON            : "book"
        },
        QUIZ: {
            NAME            : "quiz",
            LABEL           : "Quiz",
            TITLE           : "Quiz",
            ICON            : "lightbulb-o"
        },
        PROGRESS: {
            NAME            : "progress",
            LABEL           : "Fortschritt",
            TITLE           : "Fortschritt",
            ICON            : "bar-chart"
        },
        HELP: {
            NAME            : "help",
            LABEL           : "Hilfe",
            TITLE           : "Hilfe",
            ICON            : "question-circle"
        }
    };
    
    // Private Variablen
    var _isVisible;
    var _isWebapp;
    var _isFullscreen;
    var _currentPanel;
    var _panelIsExpired;
    var _panelList;
    
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
        _currentPanel       = null;
        _panelList          = [];
        _panelIsExpired     = {};
        
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
        
        // Template laden und Panels rendern
        var template = $(_SEL_TMPL).html();
        var rendered = Mustache.render(template, panels);
        _$content.html(rendered);
        
        // Panel-Liste speichern
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
        });
    }
    
    /**
     * Navigation-Bar der View setzen.
     * Setzt die verknüpfte Navigation-Bar anhand des aktuellen
     * Panel-Namens; setzt Titel, Buttons und Suche.
     */
    function _setNavbar() {
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
     * Aktuelles View-Panel setzen.
     * Wenn der übergebene Panel-Name gültig ist, wird die View
     * erst ausgeblendet, dann wird das Tab-Panel gewechselt,
     * die Navigation-Bar eingestellt und die View wieder eingeblendet.
     * @param {string} panel Name des neuen View-Panels
     * @returns {Object} Modul-Objekt
     */
    function setPanel(panel) {
        if (typeof _$panels[panel] !== CONF.TYPE.UNDEF) {
            _currentPanel = panel;
            _setNavbar();
            _hide();
            setTimeout(function() { _show(); }, CONF.TIME.SHORT);
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