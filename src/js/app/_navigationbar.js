/**
 * Navigation-Bar-Modul.
 * Steuert die Navigation-Bar der App.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
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
    
    // Private Variablen    
    var _title;
    var _buttonLeft;
    var _buttonRight;
    var _searchIsActive;
    var _searchWasActive;
    var _buttonsAreDisabled;
    var _isWebapp;
    
    // DOM-Elemente
    var _$navbar;
    var _$search;
    
    /**
     * Modul initialisieren.
     * Setzt die Standard-Anfangswerte des Moduls, bindet alle Events,
     * sucht nach den benötigten DOM-Elementen und rendert das Modul.
     */
    function init() {
        
        // Modulvariablen initialisieren
        _$navbar            = $(_SEL_TITLEBAR);
        _$search            = _$navbar.find(_SEL_SEARCH);
        _isWebapp           = (_C.WEBAPP.IOS || _C.WEBAPP.CORDOVA);
        _title              = {};
        _buttonLeft         = {};
        _buttonRight        = {};
        _searchIsActive     = false;
        _searchWasActive    = false;
        _buttonsAreDisabled = false;
        
        // Funktionen ausführen
        _initButtonsAndTitle();
        _bindEvents();
        _render();
    }
    
    /**
     * Buttons initialisieren.
     * Setzt die DOM-Elemente des Titels und des linken und rechten Buttons,
     * initialisiert die Aktionen und Icons auf null, den Titel auf leer.
     */
    function _initButtonsAndTitle() {
        var $buttons = _$navbar.find(_SEL_BUTTONS);
        _buttonLeft = { $button: $buttons.first(), action: null, icon: null };
        _buttonRight = { $button: $buttons.last(), action: null, icon: null };
        _title = { $title: _$navbar.find(_SEL_TITLE), str: _C.STR.EMPTY };
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        _$navbar.on(_C.EVT.CLICK, _SEL_BUTTONS, _buttonAction);
        $(window).on(_C.EVT.SET_PANEL, _setNavigationBar);
        $(window).on(_C.EVT.PRESSED_BUTTON, _buttonPressed);
    }
    
    /**
     * Modul rendern.
     * Rendert alle Elemente des Moduls anhand der intern
     * gesetzten aktuellen Variablen.
     */
    function _render() {
        _$navbar.setMod(_B, _M_WEBAPP, _isWebapp);
        _renderButton(_buttonLeft);
        _renderButton(_buttonRight);
        _renderSearch();
        _renderTitle();
    }
    
    /**
     * Button rendern.
     * Rendert einen gewählten Button (Links/Rechts) anhand seiner
     * gesetzten Eigenschaften (Aktion/Icon).
     * @param {Object} button Button-Objekt
     */
    function _renderButton(button) {
        
        // Button-Werte initialisieren
        var $button = (button.$button || null);
        var icon = (button.icon || null);
        var action = (button.action || null);
        
        // Falls Button vorhanden ist
        if ($button instanceof jQuery) {
            
            // Button ausblenden/deaktivieren
            _buttonsAreDisabled = true;
            $button.setMod(_B, _E_BUTTON, _M_DISABLED, true);
            
            // Button aktualisieren
            setTimeout(function() {
                if ((icon === null) || (action === null)) {
                    $button.setMod(_B, _E_BUTTON, _M_ICON, _C.ICON.NONE);
                } else {
                    $button.setMod(_B, _E_BUTTON, _M_DISABLED, false);
                    $button.setMod(_B, _E_BUTTON, _M_ICON, icon);
                }
                setTimeout(function() {
                    _buttonsAreDisabled = false;
                }, _C.TIME.DOUBLE);
            }, _C.TIME.DEFAULT);
        }
    }
    
    /**
     * Titel rendern.
     * Rendert den Titel der Titelleiste anhand des
     * aktuell gesetzten Titels neu.
     */
    function _renderTitle() {
        if (_title.$title instanceof jQuery) {
            
            // Titel ausblenden
            _title.$title.setMod(_B, _E_TITLE, _M_HIDDEN, true);
            
            // Titel setzen, einblenden
            setTimeout(function() {
                _title.$title.text(_title.str || _C.STR.EMPTY);
                _title.$title.setMod(_B, _E_TITLE, _M_HIDDEN, false);
            }, _C.TIME.DEFAULT);
        }
    }
    
    /**
     * Suche rendern.
     * Rendert die Suche anhand der gesetzten Eigenschaften des Moduls.
     */
    function _renderSearch() {
        if (_searchIsActive || _searchWasActive) {
            
            // Aktion und Icon initialisieren
            var icon   = (_searchIsActive) ? _C.ICON.CANCEL : _C.ICON.SEARCH;
            var action = (_searchIsActive) ? _C.ACT.SEARCH_HIDE :
                                             _C.ACT.SEARCH_SHOW;
            
            // Linken Button setzen, Suche ein-/ausblenden
            _setButton(_buttonLeft, action, icon);
            _$navbar.setMod(_B, _M_SEARCH, _searchIsActive);
            
            // Gegebenenfalls Suchfeld fokussieren
            if (_searchIsActive && !_searchWasActive) {
                setTimeout(
                    function() { _$search.focus(); },
                    _C.TIME.DOUBLE
                );
            }
        } else { _$navbar.setMod(_B, _M_SEARCH, false); }
    }
    
    /**
     * Klick auf Navigations-Button.
     * Führt bei einem Event auf einem der Navigation-Bar Buttons
     * Funktionen entsprechend der gesetzt Aktion für diesen Button aus.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _buttonPressed(event, data) {
        if (typeof data !== _C.TYPE.UNDEF) {
            if (typeof data.action !== _C.TYPE.UNDEF) {
                switch (data.action) {
                    
                    // Sortierung einblenden
                    case _C.ACT.SORT_SHOW:
                        _setButton(
                            _buttonRight,
                            _C.ACT.SORT_HIDE, _C.ICON.CANCEL
                        );
                        break;
                    
                    // Sortierung ausblenden
                    case _C.ACT.SORT_HIDE:
                        _setButton(
                            _buttonRight,
                            _C.ACT.SORT_SHOW, _C.ICON.SORT
                        );
                        break;
                    
                    // Suche einblenden
                    case _C.ACT.SEARCH_SHOW:
                        _enableSearch();
                        break;
                    
                    // Suche ausblenden
                    case _C.ACT.SEARCH_HIDE:
                        _disableSearch();
                        break;
                    
                    // !TODO: Switch Button-Aktionen
                }
            }
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
            
            // Button und Aktion initialisieren/bestimmen
            var action;
            var $button = $(event.target).closest(_SEL_BUTTONS);
            if ($button.is(_buttonLeft.$button)) {
                action = _buttonLeft.action;
            } else if ($button.is(_buttonRight.$button)) {
                action = _buttonRight.action;
            }
            
            // Event auslösen, wenn Aktion gültig ist
            $(window).trigger(
                _C.EVT.PRESSED_BUTTON,
                { action: action }
            );
        }
    }
    
    /**
     * Button-Eigenschaften setzen.
     * Setzt die Aktion und das Icon eines gegebenen Buttons.
     * @param {Object} button Button-Objekt
     * @param {string} action Name der Button-Aktion
     * @param {string} icon Name des Button-Icons
     */
    function _setButton(button, action, icon) {
        if (button.$button instanceof jQuery) {
            button.action = (action || null);
            button.icon = (icon || null);
            _renderButton(button);
        }
    }
    
    /**
     * Titel setzen.
     * Setzt den Titel der Titelleiste, falls er nicht leer ist,
     * und rendert ihn gegebenenfalls neu.
     * @param {string} title Neuer Titel
     */
    function _setTitle(title) {
        if ((title !== null) && (title !== _C.STR.EMPTY)) {
            _title.str = title;
            _renderTitle();
        }
    }
    
    /**
     * Suche aktivieren.
     * Setzt die Suche auf aktiviert und blendet sie ein.
     * @param {boolean} updateButtons Buttons entsprechend aktualisieren.
     */
    function _enableSearch(updateButtons) {
        _searchIsActive = true;
        _searchWasActive = false;
        if (updateButtons !== false) {
            _setButton(_buttonLeft, _C.ACT.SEARCH_HIDE, _C.ICON.CANCEL);
            if (_buttonRight.action !== _C.ACT.SORT_SHOW) {
                _setButton(_buttonRight, _C.ACT.SORT_SHOW, _C.ICON.SORT);
            }
        }
        _renderSearch();
    }
    
    /**
     * Suche deaktivieren.
     * Setzt die Suche auf deaktiviert und blendet sie aus.
     * @param {boolean} updateButtons Buttons entsprechend aktualisieren.
     */
    function _disableSearch(updateButtons) {
        _searchWasActive = _searchIsActive;
        _searchIsActive = false;
        if (updateButtons !== false) {
            _setButton(_buttonLeft, _C.ACT.SEARCH_SHOW, _C.ICON.SEARCH);
            if (_buttonRight.action !== _C.ACT.SORT_SHOW) {
                _setButton(_buttonRight, _C.ACT.SORT_SHOW, _C.ICON.SORT);
            }
        }
        _renderSearch();
    }
    
    /**
     * Navigation-Bar Gesamt-Zustand setzen.
     * Setzt anhand eines Events den Gesamt-Zustand der Navigation-Bar;
     * verschiedene Sonderfälle führen zu einem anderen Status.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _setNavigationBar(event, data) {
        if (typeof data !== _C.TYPE.UNDEF) {
            if (typeof data.panel === _C.TYPE.STR) {
                $.each(_C.VIEW, function(index, panel) {
                    if (panel.NAME === data.panel) {

                        // Sonderfall: Wörterbuch
                        if (panel.NAME === _C.VIEW.DICTIONARY.NAME) {
                            if (_searchWasActive) { _enableSearch(); }
                            else { _disableSearch(); }
                        
                        // Standard
                        } else {
                            _disableSearch(false);
                            _setButton(_buttonLeft, null, null);
                            _setButton(_buttonRight, null, null);
                        }
                        _setTitle(panel.TITLE);
                        return false;
                    }
                });
            }
        }
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();