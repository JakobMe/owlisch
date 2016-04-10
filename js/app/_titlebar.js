/**
 * TitleBar-Modul.
 * Steuert die TitleBar der App.
 * @author Jakob Metzger
 */
var TitleBar = (function() {
    
    // Selektor-Konstanten
    var _SEL_TITLEBAR       = "[role='navigation']";
    var _SEL_BUTTONS        = "[role='button']";
    var _SEL_TITLE          = "[role='heading']";
    var _SEL_SEARCH         = "[role='search']";
    
    // BEM-Konstanten
    var _B                  = "titlebar";
    var _E_TITLE            = "title";
    var _E_BUTTON           = "button";
    var _M_HIDDEN           = "hidden";
    var _M_DISABLED         = "disabled";
    var _M_SEARCH           = "search";
    var _M_ICON             = "icon";
    
    // Icon-Konstanten
    var ICON = {
        NONE                : "none",
        CANCEL              : "cancel",
        SKIP                : "skip",
        BACK                : "back",
        SEARCH              : "search",
        SORT                : "sort"
    };
    
    // Action-Konstanten
    var ACTION = {
        SEARCH              : "search",
        SORT                : "sort",
        BACK                : "back",
        CANCEL              : "cancel",
        SKIP                : "skip"
    };
    
    // Private Variablen    
    var _title;
    var _leftIcon;
    var _leftAction;
    var _rightIcon;
    var _rightAction;
    var _isSearch;
    
    // DOM-Elemente
    var _$titlebar;
    var _$title;
    var _$buttonLeft;
    var _$buttonRight;
    var _$search;
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        _$titlebar.on(GLOBAL.EVENT.CLICK, _SEL_BUTTONS, _buttonAction);
    }
    
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
            title: null,
            leftIcon: null,
            leftAction: null,
            rightIcon: null,
            rightAction: null,
            isSearch: false
        };
        
        // Standard-Optionen ergänzen/überschreiben
        $.extend(defaults, options || {});
        
        // DOM-Elemente initialisieren
        _$titlebar = $(_SEL_TITLEBAR);
        _$buttonLeft = _$titlebar.find(_SEL_BUTTONS).first();
        _$buttonRight = _$titlebar.find(_SEL_BUTTONS).last();
        _$title = _$titlebar.find(_SEL_TITLE);
        _$search = _$titlebar.find(_SEL_SEARCH);
        
        // Startwerte setzen
        _title = defaults.title;
        _leftIcon = defaults.leftIcon;
        _leftAction = defaults.leftAction;
        _rightIcon = defaults.rightIcon;
        _rightAction = defaults.rightAction;
        _isSearch = defaults.isSearch;
        
        // Events binden und rendern
        _bindEvents();
        _render();
        
        // Modul Return
        return this;
    }
    
    /**
     * Button-Aktion ausführen.
     * Führt anhand des gewählten Buttons und der dazu gesetzten
     * Aktion eine bestimmte Funktion aus.
     * @param {Object} $button Gewählter Button (Links/Rechts)
     */
    function _buttonAction(event) {
        
        // Button und Aktion initialisieren
        var action;
        var $button = $(event.target).closest(_SEL_BUTTONS);
        
        // Aktion bestimmen
        if ($button.is(_$buttonLeft)) { action = _leftAction; }
        else if ($button.is(_$buttonRight)) { action = _rightAction; }
        
        // Aktion Switch
        switch (action) {
            
            // Aktion: Suche
            case ACTION.SEARCH:
                
                // Suche aktivieren/deaktivieren
                if (_isSearch) { disableSearch(); }
                else { enableSearch(); }
                break;
                
            // Default
            default:
                window.console.log(action);
                break;
        }
    }
    
    /**
     * Button rendern.
     * Rendert einen gewählten Button (Links/Rechts) anhand seiner
     * gesetzten Eigenschaften (Aktion/Icon).
     * @param {Object} $button Button-Objekt
     * @returns {Object} Modul-Objekt
     */
    function _renderButton($button) {
        
        // Aktion und Icon initialisieren
        var action;
        var icon;
        
        // Aktion und Icon ermitteln
        if ($button === _$buttonLeft) {
            action = _leftAction;
            icon = _leftIcon;
        } else if ($button === _$buttonRight) {
            action = _rightAction;
            icon = _rightIcon;
        } else {
            return false;
        }
        
        // Button ausblenden
        $button.setMod(_B, _E_BUTTON, _M_DISABLED, true);
        
        // Auf Animation warten
        setTimeout(function() {
            
            // Falls Icon oder Aktion nicht gesetzt sind
            if ((icon === null) || (icon === GLOBAL.STR.EMPTY) ||
                (action === null) || (action === GLOBAL.STR.EMPTY)) {
                
                // Button deaktivieren
                $button.setMod(_B, _E_BUTTON, _M_ICON, ICON.NONE);
                $button.attr(GLOBAL.ATTR.DATA_ACTION, GLOBAL.STR.EMPTY);
                
            // Falls beides korrekt gesetzt ist
            } else {
                
                // Icon und Aktion setzen, Button einblenden
                $button.setMod(_B, _E_BUTTON, _M_DISABLED, false);
                $button.setMod(_B, _E_BUTTON, _M_ICON, icon);
                $button.attr(GLOBAL.ATTR.DATA_ACTION, action);
            }
        }, GLOBAL.TIME.SHORT);
    }
    
    /**
     * Titel rendern.
     * Rendert den Titel der Titelleiste anhand des
     * aktuell gesetzten Titels neu.
     */
    function _renderTitle() {
        
        // Titel ausblenden
        _$title.setMod(_B, _E_TITLE, _M_HIDDEN, true);
        
        // Auf Animation warten
        setTimeout(function() {
            
            // Titel setzen, einblenden
            _$title.text(_title);
            _$title.setMod(_B, _E_TITLE, _M_HIDDEN, false);
            
        }, GLOBAL.TIME.SHORT);
    }
    
    /**
     * Suche rendern.
     * Rendert die Suche anhand der gesetzten Eigenschaften des Moduls.
     */
    function _renderSearch() {
        if ((_leftAction === ACTION.SEARCH) || _isSearch) {
            
            // Suche ein-/ausblenden, Button anpassen
            var icon = (_isSearch) ? ICON.CANCEL : ICON.SEARCH;
            setButtonLeft(ACTION.SEARCH, icon);
            _$titlebar.setMod(_B, _M_SEARCH, _isSearch);
            
            // Suche fokussieren
            if (_isSearch) {
                setTimeout(function() {
                    _$search.focus();
                }, GLOBAL.TIME.MEDIUM);
            }
        }
    }
    
    /**
     * Modul rendern.
     * Rendert alle Elemente des Moduls anhand der intern
     * gesetzten aktuellen Variablen.
     */
    function _render() {
        _renderButton(_$buttonLeft);
        _renderButton(_$buttonRight);
        _renderSearch();
        _renderTitle();
    }
    
    /**
     * Button-Eigenschaften setzen.
     * Setzt die Aktion und das Icon eines gegebenen Buttons.
     * @param {Object} $button Ziel-Button
     * @param {String} action Name der Button-Aktion
     * @param {String} icon Name des Button-Icons
     * @returns {Object} Modul-Objekt
     */
    function _setButton($button, action, icon) {
        if ($button === _$buttonLeft) {
            _leftAction = action;
            _leftIcon = icon;
        } else if ($button === _$buttonRight) {
            _rightAction = action;
            _rightIcon = icon;
        } else {
            return false;
        }
        _renderButton($button);
        return this;
    }
    
    /**
     * Button-Eigenschaften Links setzen.
     * Setzt die Aktion und das Icon des linken Titel-Buttons.
     * @param {String} action Name der Button-Aktion
     * @param {String} icon Name des Button-Icons
     * @returns {Object} Modul-Objekt
     */
    function setButtonLeft(action, icon) {
        _setButton(_$buttonLeft, action, icon);
        return this;
    }
    
    /**
     * Button-Eigenschaften Rechts setzen.
     * Setzt die Aktion und das Icon des rechten Titel-Buttons.
     * @param {String} action Name der Button-Aktion
     * @param {String} icon Name des Button-Icons
     * @returns {Object} Modul-Objekt
     */
    function setButtonRight(action, icon) {
        _setButton(_$buttonRight, action, icon);
        return this;
    }
    
    /**
     * Titel setzen.
     * Setzt den Titel der Titelleiste, falls er nicht leer ist,
     * und rendert ihn gegebenenfalls neu.
     * @param {String} title Neuer Titel
     * @returns {Object} Modul-Objekt
     */
    function setTitle(title) {
        if ((title !== null) && (title !== GLOBAL.STR.EMPTY)) {
            _title = title;
            _renderTitle();
        }
        return this;
    }
    
    /**
     * Suche aktivieren.
     * Setzt die Suche auf aktiviert und blendet sie ein.
     * @returns {Object} Modul-Objekt
     */
    function enableSearch() {
        _isSearch = true;
        _renderSearch();
        return this;
    }
    
    /**
     * Suche deaktivieren.
     * Setzt die Suche auf deaktiviert und blendet sie aus.
     * @returns {Object} Modul-Objekt
     */
    function disableSearch() {
        _isSearch = false;
        _renderSearch();
        return this;
    }
    
    // Öffentliches Interface
    return {
        init:           init,
        setTitle:       setTitle,
        setButtonLeft:  setButtonLeft,
        setButtonRight: setButtonRight,
        enableSearch:   enableSearch,
        disableSearch:  disableSearch,
        ICON:           ICON,
        ACTION:         ACTION
    };
    
})();