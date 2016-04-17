/**
 * Navigation-Bar-Modul.
 * Steuert die Navigation-Bar der App.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var NavigationBar = (function() {
    
    /*global CONF: true*/
    /*global Dictionary: true*/
    
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
    
    // Data-Attibut-Konstanten
    var _DATA_ACTION        = "data-action";
    
    // Icon-Konstanten
    var ICON = {
        NONE                : "none",
        SEARCH              : "search",
        SORT                : "sort",
        BACK                : "back",
        CANCEL              : "cancel",
        SKIP                : "skip"
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
    var _searchWasActive;
    var _buttonsAreDisabled;
    var _availableActions;
    var _availableIcons;
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
        _isWebapp           = (CONF.WEBAPP.IOS || CONF.WEBAPP.CORDOVA);
        _searchIsActive     = false;
        _searchWasActive    = false;
        _buttonsAreDisabled = false;
        _availableActions   = [];
        _availableIcons     = [];
        
        // Funktionen ausführen
        _initActionsIcons();
        _bindEvents();
        _render();
        
        // Modul Return
        return this;
    }
    
    /**
     * Aktionen und Icons initialisieren.
     * Iteriert alle definierten Icons und Aktionen und fügt
     * sie zu den entsprechenden Modul-Variablen hinzu.
     */
    function _initActionsIcons() {
        
        // Verfügbare Aktionen setzen
        $.each(ACTION, function(index, action) {
            _availableActions.push(action);
        });
        
        // Verfügbare Icons setzen
        $.each(ICON, function(index, icon) {
            _availableIcons.push(icon);
        });
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        _$navbar.on(CONF.EVENT.CLICK, _SEL_BUTTONS, _buttonAction);
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
            if ((icon === null) || (icon === CONF.STR.EMPTY) ||
                (action === null) || (action === CONF.STR.EMPTY)) {
                
                // Button deaktivieren
                $button.setMod(_B, _E_BUTTON, _M_ICON, ICON.NONE);
                $button.attr(_DATA_ACTION, CONF.STR.EMPTY);
                
            // Falls beides korrekt gesetzt ist
            } else {
                
                // Icon und Aktion setzen, Button einblenden
                $button.setMod(_B, _E_BUTTON, _M_DISABLED, false);
                $button.setMod(_B, _E_BUTTON, _M_ICON, icon);
                $button.attr(_DATA_ACTION, action);
            }
            
            // Buttons wieder aktivieren
            setTimeout(function() {
                _buttonsAreDisabled = false;
            }, CONF.TIME.STANDARD);
            
        }, CONF.TIME.SHORT);
    }
    
    /**
     * Titel rendern.
     * Rendert den Titel der Titelleiste anhand des
     * aktuell gesetzten Titels neu.
     */
    function _renderTitle() {
        
        // Titel ausblenden, setzen, einblenden
        _$title.setMod(_B, _E_TITLE, _M_HIDDEN, true);
        setTimeout(function() {
            _$title.text(_title);
            _$title.setMod(_B, _E_TITLE, _M_HIDDEN, false);
        }, CONF.TIME.SHORT);
    }
    
    /**
     * Suche rendern.
     * Rendert die Suche anhand der gesetzten Eigenschaften des Moduls.
     */
    function _renderSearch() {
        
        // Wenn Suche aktiv ist oder abgebrochen wird
        if ((_actionLeft === ACTION.SEARCH) || _searchIsActive) {
            
            // Suche ein-/ausblenden, Button anpassen
            var icon = (_searchIsActive) ? ICON.CANCEL : ICON.SEARCH;
            setButtonLeft(ACTION.SEARCH, icon);
            _$navbar.setMod(_B, _M_SEARCH, _searchIsActive);
            
            // Suche fokussieren
            if (_searchIsActive && !_searchWasActive) {
                setTimeout(function() {
                    _$search.focus();
                }, CONF.TIME.MEDIUM);
            }
            
        // Ansonsten Suche ausblenden
        } else { _$navbar.setMod(_B, _M_SEARCH, false); }
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
     * Button-Aktion: Suche.
     * Suche (de-)aktivieren, Wörterbuch-Dropdown ausblenden.
     */
    function _buttonActionSearch() {
        
        // Suche aktivieren/deaktivieren
        if (_searchIsActive) {
            _searchWasActive = false;
            _disableSearch();
        } else {
            _enableSearch();
        }
        
        // Wörterbuch-Dropdown gegebenenfalls ausblenden
        if (Dictionary.dropdownIsOpened()) {
            setButtonRight(ACTION.SORT, ICON.SORT);
            Dictionary.hideDropdown();
        }
    }
    
    /**
     * Button-Aktion: Sortieren.
     * Blendet das Wörterbuch-Dropdown ein/aus.
     */
    function _buttonActionSort() {
        
        // Wörterbuch-Dropdown ein-/ausblenden
        if (Dictionary.dropdownIsOpened()) {
            setButtonRight(ACTION.SORT, ICON.SORT);
            Dictionary.hideDropdown();
        } else {
            setButtonRight(ACTION.SORT, ICON.CANCEL);
            Dictionary.showDropdown();
        }
    }
    
    /**
     * Button-Aktion ausführen.
     * Führt anhand des Events des geklickten Buttons und
     * der dazu gesetzten Aktion eine bestimmte Funktion aus.
     * @param {Object} event Event des geklickten Buttons
     */
    function _buttonAction(event) {
        if (!_buttonsAreDisabled && event.target) {
            
            // Button und Aktion initialisieren
            var action;
            var $button = $(event.target).closest(_SEL_BUTTONS);
            
            // Aktion bestimmen
            if ($button.is(_$buttonLeft)) { action = _actionLeft; }
            else if ($button.is(_$buttonRight)) { action = _actionRight; }
            
            // Funktion entsprechend der Aktion ausführen
            switch (action) {
                case ACTION.SEARCH:     _buttonActionSearch();  break;
                case ACTION.SORT:       _buttonActionSort();    break;
                case ACTION.SKIP:                               break;
                case ACTION.CANCEL:                             break;
                case ACTION.BACK:                               break;
            }
        }
    }
    
    /**
     * Suche aktivieren.
     * Setzt die Suche auf aktiviert und blendet sie ein.
     */
    function _enableSearch() {
        _searchIsActive = true;
        _renderSearch();
    }
    
    /**
     * Suche deaktivieren.
     * Setzt die Suche auf deaktiviert und blendet sie aus.
     */
    function _disableSearch() {
        _searchIsActive = false;
        _renderSearch();
    }
    
    /**
     * Button-Eigenschaften setzen.
     * Setzt die Aktion und das Icon eines gegebenen Buttons.
     * @param {Object} $button Ziel-Button
     * @param {string} action Name der Button-Aktion
     * @param {string} icon Name des Button-Icons
     */
    function _setButton($button, action, icon) {

        // Falls Icon oder Aktion null sind, beide null setzen
        if (action === null || icon === null) { action = null; icon = null; }
        
        // Falls Aktion und Icon valide sind, setzen
        if ((action === null && icon === null) ||
            (($.inArray(action, _availableActions) >= 0) &&
             ($.inArray(icon, _availableIcons) >= 0))) {
            
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
     */
    function setButtonLeft(action, icon) {
        _setButton(_$buttonLeft, action, icon);
    }
    
    /**
     * Button-Eigenschaften Rechts setzen.
     * Setzt die Aktion und das Icon des rechten Titel-Buttons.
     * @param {string} action Name der Button-Aktion
     * @param {string} icon Name des Button-Icons
     */
    function setButtonRight(action, icon) {
        _setButton(_$buttonRight, action, icon);
    }
    
    /**
     * Titel setzen.
     * Setzt den Titel der Titelleiste, falls er nicht leer ist,
     * und rendert ihn gegebenenfalls neu.
     * @param {string} title Neuer Titel
     */
    function _setTitle(title) {
        if ((title !== null) && (title !== CONF.STR.EMPTY)) {
            _title = title;
            _renderTitle();
        }
    }
    
    /**
     * Such-Status setzen.
     * Deaktiviert oder aktiviert die Suche in Abhängigkeit vom
     * aktuellen und vergangenen Status der Suche.
     * @param {boolean} checkPast Letzten Such-Status berücksichtigen
     */
    function _setSearch(checkPast) {
        if (checkPast === true) {
            if (_searchWasActive) {
                _enableSearch();
                _searchWasActive = false;
            } else {
                _disableSearch();
            }
        } else {
            if (_searchIsActive) { _searchWasActive = true; }
            _disableSearch();
        }
    }
    
    /**
     * Alle Eigenschaften der Navigation-Bar setzen.
     * Setzte das Icon und die Aktion der Buttons, den Titel
     * und den Such-Status der Navigation-Bar.
     * @param {string} title Neuer Titel
     * @param {string} iconLeft Neues Icon links
     * @param {string} actionLeft Neue Aktion links
     * @param {string} iconRight Neues Icon rechts
     * @param {string} actionRight Neue Aktion rechts
     * @param {boolean} checkPast Letzten Such-Status berücksichtigen
     * @returns {Object} Modul-Objekt
     */
    function setAll(title, actionLeft, iconLeft,
                    actionRight, iconRight, checkPast) {
        
        // Alle Komponenten setzen
        _setTitle(title);
        setButtonLeft(actionLeft, iconLeft);
        setButtonRight(actionRight, iconRight);
        _setSearch(checkPast);
        return this;
    }
    
    // Öffentliches Interface
    return {
        init            : init,
        setAll          : setAll,
        setButtonLeft   : setButtonLeft,
        setButtonRight  : setButtonRight,
        ICON            : ICON,
        ACTION          : ACTION
    };
    
})();