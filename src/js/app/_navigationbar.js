/**
 * Navigation-Bar-Modul.
 * Steuert die Navigation-Bar der App.
 * @author Jakob Metzger
 */
var NavigationBar = (function() {
    
    // Selektor-Konstanten
    var _SEL_TITLEBAR       = "[role='navigation']";
    var _SEL_BUTTONS        = "[role='button']";
    var _SEL_TITLE          = "[role='heading']";
    var _SEL_SEARCH         = "[role='search']";
    
    // BEM-Konstanten
    var _B                  = "navigation-bar";
    var _E_TITLE            = "title";
    var _E_BUTTON           = "button";
    var _M_HIDDEN           = "hidden";
    var _M_DISABLED         = "disabled";
    var _M_SEARCH           = "search";
    var _M_WEBAPP           = "webapp";
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
    var _iconLeft;
    var _iconRight;
    var _actionLeft;
    var _actionRight;
    var _searchIsActive;
    var _buttonsAreDisabled;
    var _isWebapp;
    
    // DOM-Elemente
    var _$navbar;
    var _$title;
    var _$buttonLeft;
    var _$buttonRight;
    var _$search;
    
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
            title           : null,
            actionLeft      : null,
            actionRight     : null,
            iconLeft        : null,
            iconRight       : null
        };
        
        // Standard-Optionen ergänzen/überschreiben
        $.extend(defaults, options || {});
        
        // Modulvariablen initialisieren
        _$navbar            = $(_SEL_TITLEBAR);
        _$buttonLeft        = _$navbar.find(_SEL_BUTTONS).first();
        _$buttonRight       = _$navbar.find(_SEL_BUTTONS).last();
        _$title             = _$navbar.find(_SEL_TITLE);
        _$search            = _$navbar.find(_SEL_SEARCH);
        _title              = defaults.title;
        _iconLeft           = defaults.iconLeft;
        _iconRight          = defaults.iconRight;
        _actionLeft         = defaults.actionLeft;
        _actionRight        = defaults.actionRight;
        _isWebapp           = (C.WEBAPP.IOS || C.WEBAPP.CORDOVA);
        _searchIsActive     = false;
        _buttonsAreDisabled = false;
        
        // Funktionen ausführen
        _bindEvents();
        _render();
        
        // Modul Return
        return this;
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        _$navbar.on(C.EVENT.CLICK, _SEL_BUTTONS, _buttonAction);
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
            icon = _iconLeft;
            action = _actionLeft;
        } else if ($button === _$buttonRight) {
            icon = _iconRight;
            action = _actionRight;
        } else {
            return false;
        }
        
        // Button ausblenden/deaktivieren
        _buttonsAreDisabled = true;
        $button.setMod(_B, _E_BUTTON, _M_DISABLED, true);
        
        // Auf Animation warten
        setTimeout(function() {
            
            // Falls Icon oder Aktion nicht gesetzt sind
            if ((icon === null) || (icon === C.STR.EMPTY) ||
                (action === null) || (action === C.STR.EMPTY)) {
                
                // Button deaktivieren
                $button.setMod(_B, _E_BUTTON, _M_ICON, ICON.NONE);
                $button.attr(C.ATTR.DATA_ACTION, C.STR.EMPTY);
                
            // Falls beides korrekt gesetzt ist
            } else {
                
                // Icon und Aktion setzen, Button einblenden
                $button.setMod(_B, _E_BUTTON, _M_DISABLED, false);
                $button.setMod(_B, _E_BUTTON, _M_ICON, icon);
                $button.attr(C.ATTR.DATA_ACTION, action);
            }
            
            // Buttons wieder aktivieren
            setTimeout(function() {
                _buttonsAreDisabled = false;
            }, C.TIME.STANDARD);
            
        }, C.TIME.SHORT);
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
            
        }, C.TIME.SHORT);
    }
    
    /**
     * Suche rendern.
     * Rendert die Suche anhand der gesetzten Eigenschaften des Moduls.
     */
    function _renderSearch() {
        if ((_actionLeft === ACTION.SEARCH) || _searchIsActive) {
            
            // Suche ein-/ausblenden, Button anpassen
            var icon = (_searchIsActive) ? ICON.CANCEL : ICON.SEARCH;
            setButtonLeft(ACTION.SEARCH, icon);
            _$navbar.setMod(_B, _M_SEARCH, _searchIsActive);
            
            // Suche fokussieren
            if (_searchIsActive) {
                setTimeout(function() {
                    _$search.focus();
                }, C.TIME.MEDIUM);
            }
        }
    }
    
    /**
     * Modul rendern.
     * Rendert alle Elemente des Moduls anhand der intern
     * gesetzten aktuellen Variablen.
     */
    function _render() {
        
        // Webapp setzen
        _$navbar.setMod(_B, _M_WEBAPP, _isWebapp);
        
        // Elemente rendern
        _renderButton(_$buttonLeft);
        _renderButton(_$buttonRight);
        _renderSearch();
        _renderTitle();
    }
    
    /**
     * Button-Aktion ausführen.
     * Führt anhand des gewählten Buttons und der dazu gesetzten
     * Aktion eine bestimmte Funktion aus.
     * @param {Object} $button Gewählter Button (Links/Rechts)
     */
    function _buttonAction(event) {
        if (!_buttonsAreDisabled) {
            
            // Button und Aktion initialisieren
            var action;
            var $button = $(event.target).closest(_SEL_BUTTONS);
            
            // Aktion bestimmen
            if ($button.is(_$buttonLeft)) { action = _actionLeft; }
            else if ($button.is(_$buttonRight)) { action = _actionRight; }
            
            // Aktion Switch
            switch (action) {
                
                // Aktion: Suche
                case ACTION.SEARCH:
                    
                    // Suche aktivieren/deaktivieren
                    if (_searchIsActive) { disableSearch(); }
                    else { enableSearch(); }
                    break;
                
                // TODO: Aktionen für andere Buttons
            }
        }
    }
    
    /**
     * Button-Eigenschaften setzen.
     * Setzt die Aktion und das Icon eines gegebenen Buttons.
     * @param {Object} $button Ziel-Button
     * @param {string} action Name der Button-Aktion
     * @param {string} icon Name des Button-Icons
     */
    function _setButton($button, action, icon) {
        
        // Validität initialisieren
        var validAction = false;
        var validIcon = false;
        
        // Falls Icon oder Aktion null sind
        if ((action === null) || (icon === null)) {
            
            // Deaktivieren und validieren
            action = null;
            icon = null;
            validAction = true;
            validIcon = true;
            
        // Ansonsten Icon und Aktion überprüfen
        } else {
            
            // Aktion überprüfen
            $.each(ACTION, function(index, value) {
                if (action === value) { validAction = true; return false; }
            });
            
            // Icon überprüfen
            $.each(ICON, function(index, value) {
                if (icon === value) { validIcon = true; return false; }
            });
        }
        
        // Falls Icon und Aktion valide sind
        if (validAction && validIcon) {
            
            // Aktion und Icon anhand des Buttons setzen, rendern
            if ($button === _$buttonLeft) {
                _actionLeft = action;
                _iconLeft = icon;
            } else if ($button === _$buttonRight) {
                _actionRight = action;
                _iconRight = icon;
            } else {
                return false;
            }
            _renderButton($button);
        }
    }
    
    /**
     * Button-Eigenschaften Links setzen.
     * Setzt die Aktion und das Icon des linken Titel-Buttons.
     * @param {string} action Name der Button-Aktion
     * @param {string} icon Name des Button-Icons
     * @returns {Object} Modul-Objekt
     */
    function setButtonLeft(action, icon) {
        _setButton(_$buttonLeft, action, icon);
        return this;
    }
    
    /**
     * Button-Eigenschaften Rechts setzen.
     * Setzt die Aktion und das Icon des rechten Titel-Buttons.
     * @param {string} action Name der Button-Aktion
     * @param {string} icon Name des Button-Icons
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
     * @param {string} title Neuer Titel
     * @returns {Object} Modul-Objekt
     */
    function setTitle(title) {
        if ((title !== null) && (title !== C.STR.EMPTY)) {
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
        _searchIsActive = true;
        _renderSearch();
        return this;
    }
    
    /**
     * Suche deaktivieren.
     * Setzt die Suche auf deaktiviert und blendet sie aus.
     * @returns {Object} Modul-Objekt
     */
    function disableSearch() {
        _searchIsActive = false;
        _renderSearch();
        return this;
    }
    
    // Öffentliches Interface
    return {
        init            : init,
        setTitle        : setTitle,
        setButtonLeft   : setButtonLeft,
        setButtonRight  : setButtonRight,
        enableSearch    : enableSearch,
        disableSearch   : disableSearch,
        ICON            : ICON,
        ACTION          : ACTION
    };
    
})();