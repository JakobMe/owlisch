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
    var _SEL_DROPDOWN       = "[role='menu']";
    var _SEL_SORT           = "[role='menuitem']";
    var _SEL_TMPL_DROPDOWN  = "#tmpl-dropdown";
    
    // BEM-Konstanten
    var _B_BAR              = "navigation-bar";
    var _B_DROPDOWN         = "dropdown";
    var _E_ITEM             = "item";
    var _E_TITLE            = "title";
    var _E_BUTTON           = "button";
    var _M_HIDDEN           = "hidden";
    var _M_DISABLED         = "disabled";
    var _M_SEARCH           = "search";
    var _M_WEBAPP           = "webapp";
    var _M_ICON             = "icon";    
    var _M_OPENED           = "opened";
    var _M_SELECTED         = "selected";
    
    // Data-Attibut-Konstanten
    var _DATA_SORT          = "sort";
    var _DATA_ORDER         = "order";
    
    // Private Variablen    
    var _title;
    var _buttonLeft;
    var _buttonRight;
    var _searchIsActive;
    var _buttonsAreDisabled;
    var _dropdownIsOpened;
    var _tmplDropdown;
    var _isWebapp;
    var _cache;
    
    // DOM-Elemente
    var _$navbar;
    var _$search;
    var _$dropdown;
    var _$sort;
    
    /**
     * Modul initialisieren.
     * Setzt die Standard-Anfangswerte des Moduls, bindet alle Events,
     * sucht nach den benötigten DOM-Elementen und rendert das Modul.
     */
    function init() {
        
        // Templates laden
        _tmplDropdown = $(_SEL_TMPL_DROPDOWN).html();
        Mustache.parse(_tmplDropdown);
        
        // Modulvariablen initialisieren
        _$navbar            = $(_SEL_TITLEBAR);
        _$search            = _$navbar.find(_SEL_SEARCH);
        _$dropdown          = _$navbar.find(_SEL_DROPDOWN);
        _isWebapp           = (_C.WEBAPP.IOS || _C.WEBAPP.CORDOVA);
        _cache              = {};
        _title              = {};
        _buttonLeft         = {};
        _buttonRight        = {};
        _searchIsActive     = false;
        _buttonsAreDisabled = false;
        _dropdownIsOpened   = false;
        
        // Funktionen ausführen
        _initNavigationBar();
        _render();
    }
    
    /**
     * Navigation-Bar initialisieren.
     * Ermittelt alle verfügbaren Sortier-Optionen, füllt das Dropdown-Menü
     * per Mustache-Template mit diesen Optionen und löst dann alle
     * weiteren Initialisierungs-Funktionen aus.
     */
    function _initNavigationBar() {
        
        // Verfügbare Sortierungen ermitteln
        var sorting = [];
        $.each(_C.SORTING.SORT, function(sort, sortProps) {
            $.each(_C.SORTING.ORDER, function(order, orderProps) {
                sorting.push({
                    optionSort  : sortProps.NAME,
                    optionOrder : orderProps.NAME,
                    labelSort   : sortProps.LABEL,
                    labelOrder  : orderProps.LABEL
                });
            });
        });
        
        // Template füllen, Callback ausführen
        _$dropdown.html(Mustache.render(_tmplDropdown, sorting))
            .promise().done(function() {
                _initComponents();
                _setDefaultCache();
                _bindEvents();
                _$sort.first().click();
            }
        );
    }
    
    /**
     * Buttons initialisieren.
     * Setzt die DOM-Elemente des Titels und des linken und rechten Buttons,
     * initialisiert die Aktionen und Icons auf null, den Titel auf leer.
     */
    function _initComponents() {
        var $buttons = _$navbar.find(_SEL_BUTTONS);
        _buttonLeft = { $button: $buttons.first(), action: null, icon: null };
        _buttonRight = { $button: $buttons.last(), action: null, icon: null };
        _title = { $title: _$navbar.find(_SEL_TITLE), str: _C.STR.EMPTY };
        _$sort = _$dropdown.find(_SEL_SORT);
    }
    
    /**
     * Standard-Konfiguration im Cache speichern.
     * Legt für jedes vorhandene View-Panel die Standard-Konfiguration
     * der Navigation-Bar im Cache fest.
     */
    function _setDefaultCache() {
        $.each(_C.VIEW, function(index, panel) {
            
            // Name und Titel des Panels ermitteln
            var name = panel.NAME;
            var title = panel.TITLE;
            
            // Cache für Panel setzen
            _cache[name] = {
                title               : $.extend({}, _title),
                buttonLeft          : $.extend({}, _buttonLeft),
                buttonRight         : $.extend({}, _buttonRight),
                dropdownIsOpened    : _dropdownIsOpened,
                searchIsActive      : _searchIsActive
            };
            
            // Titel setzen
            _cache[name].title.str = title;
            
            // Sonderfall: Wörterbuch
            if (name === _C.VIEW.DICTIONARY.NAME) {
                $.extend(_cache[name].buttonLeft, {
                    action  : _C.ACT.SEARCH_SHOW,
                    icon    : _C.ICON.SEARCH
                });
                $.extend(_cache[name].buttonRight, {
                    action  : _C.ACT.SORT_SHOW,
                    icon    : _C.ICON.SORT
                });
            }            
        });
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        _$sort.on(_C.EVT.CLICK, _renderDropdown);
        _$navbar.on(_C.EVT.CLICK, _SEL_BUTTONS, _buttonAction);
        $(window).on(_C.EVT.UPDATE_NAVBAR, _updateCache);
        $(window).on(_C.EVT.PRESSED_BUTTON, _buttonPressed);
    }
    
    /**
     * Modul rendern.
     * Rendert alle Elemente des Moduls anhand der intern
     * gesetzten aktuellen Variablen.
     */
    function _render() {
        _$navbar.setMod(_B_BAR, _M_WEBAPP, _isWebapp);
        _renderButton(_buttonLeft);
        _renderButton(_buttonRight);
        _renderDropdown();
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
            $button.setMod(_B_BAR, _E_BUTTON, _M_DISABLED, true);
            
            // Button aktualisieren
            setTimeout(function() {
                if ((icon === null) || (action === null)) {
                    $button.setMod(_B_BAR, _E_BUTTON, _M_ICON, _C.ICON.NONE);
                } else {
                    $button.setMod(_B_BAR, _E_BUTTON, _M_DISABLED, false);
                    $button.setMod(_B_BAR, _E_BUTTON, _M_ICON, icon);
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
            _title.$title.setMod(_B_BAR, _E_TITLE, _M_HIDDEN, true);
            setTimeout(function() {
                _title.$title.text(_title.str || _C.STR.EMPTY);
                _title.$title.setMod(_B_BAR, _E_TITLE, _M_HIDDEN, false);
            }, _C.TIME.DEFAULT);
        }
    }
    
    /**
     * Suche rendern.
     * Rendert die Suche anhand der gesetzten Eigenschaften des Moduls.
     */
    function _renderSearch() {
        _$navbar.setMod(_B_BAR, _M_SEARCH, _searchIsActive);
    }
    
    /**
     * Dropdown-Menü rendern.
     * Rendert das Dropdown-Menü anhand der aktuell gesetzte Eigenschaften
     * des Menüs (offen/geschlossen, aktiver Menüpunkt).
     */
    function _renderDropdown(event) {
        
        // Falls Funktion durch Klick-Event ausgelöst wurde
        if ((typeof event !== _C.TYPE.UNDEF) &&
            (event.target)) {
            
            // Geklickten Button aktivieren, Geschwister deaktivieren
            var $sort = $(event.target).closest(_SEL_SORT);
            var sort = $sort.data(_DATA_SORT);
            var order = $sort.data(_DATA_ORDER);
            $sort.setMod(_B_DROPDOWN, _E_ITEM, _M_SELECTED, true)
                .siblings().setMod(_B_DROPDOWN, _E_ITEM, _M_SELECTED, false);
            
            // Event auslösen
            $(window).trigger(
                _C.EVT.SORTED_LIST,
                { sort: sort, order: order }
            );
            
            // Dropdown ausblenden
            _hideDropdown();
        
        // Ansonsten Dropdown ein-/ausblenden
        } else {
            _$dropdown.setMod(_B_DROPDOWN, _M_OPENED, _dropdownIsOpened);
        }        
    }
    
    /**
     * Klick auf Navigations-Button.
     * Führt bei einem Event auf einem der Navigation-Bar Buttons
     * Funktionen entsprechend der gesetzt Aktion für diesen Button aus.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _buttonPressed(event, data) {
        if ((typeof data !== _C.TYPE.UNDEF) &&
            (typeof data.action !== _C.TYPE.UNDEF)) {
            switch (data.action) {
                
                // Sortierung einblenden
                case _C.ACT.SORT_SHOW:
                    _showDropdown();
                    break;
                
                // Sortierung ausblenden
                case _C.ACT.SORT_HIDE:
                    _hideDropdown();
                    break;
                
                // Suche einblenden
                case _C.ACT.SEARCH_SHOW:
                    setTimeout(function() {
                        _$search.focus();
                    }, _C.TIME.DOUBLE);
                    _hideDropdown();
                    _enableSearch();
                    break;
                
                // Suche ausblenden
                case _C.ACT.SEARCH_HIDE:
                    _hideDropdown();
                    _disableSearch();
                    break;
                
                // !TODO: Switch Button-Aktionen
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
            $(window).trigger(_C.EVT.PRESSED_BUTTON, { action: action });
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
     * Button Links setzen.
     * Setzt Aktion und Icon des linken Buttons.
     * @param {string} action Neue Aktion
     * @param {string} icon Neues Icon
     */
    function _setButtonLeft(action, icon) {
        _setButton(_buttonLeft, action, icon);
    }
    
    /**
     * Button Rechts setzen.
     * Setzt Aktion und Icon des rechten Buttons.
     * @param {string} action Neue Aktion
     * @param {string} icon Neues Icon
     */
    function _setButtonRight(action, icon) {
        _setButton(_buttonRight, action, icon);
    }
    
    /**
     * Suche aktivieren.
     * Setzt die Suche auf aktiviert und blendet sie ein.
     */
    function _enableSearch() {
        if (_searchIsActive === false) {
            _searchIsActive = true;
            _setButtonLeft(_C.ACT.SEARCH_HIDE, _C.ICON.CANCEL);
            _renderSearch();
        }
    }
    
    /**
     * Suche deaktivieren.
     * Setzt die Suche auf deaktiviert und blendet sie aus.
     */
    function _disableSearch() {
        if (_searchIsActive === true) {
            _searchIsActive = false;
            _setButtonLeft(_C.ACT.SEARCH_SHOW, _C.ICON.SEARCH);
            _renderSearch();
        }
    }
    
    /**
     * Dropdown-Menü einblenden.
     * Blendet das Dropdown-Menü des Wörterbuchs ein.
     */
    function _showDropdown() {
        if (_dropdownIsOpened === false) {
            _dropdownIsOpened = true;
            _setButtonRight(_C.ACT.SORT_HIDE, _C.ICON.CANCEL);
            _renderDropdown();
        }
    }
    
    /**
     * Dropdown-Menü ausblenden.
     * Blendet das Dropdown-Menü des Wörterbuchs aus.
     */
    function _hideDropdown() {
        if (_dropdownIsOpened === true) {
            _dropdownIsOpened = false;
            _setButtonRight(_C.ACT.SORT_SHOW, _C.ICON.SORT);
            _renderDropdown();
        }
    }
    
    /**
     * Zustands-Cache aktualisieren.
     * Aktualisiert anhand eines ausgelösten Events den Zustands-Cache
     * der Navigation-Bar; speichert den Zustand für das vorige View-Panel
     * und lädt den Zustand für das neue View-Panel aus dem Cache.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _updateCache(event, data) {
        if ((typeof data !== _C.TYPE.UNDEF) &&
            (typeof data.panelOld !== _C.TYPE.UNDEF) &&
            (typeof data.panelNew !== _C.TYPE.UNDEF)) {

            // Aktuellen Status speichern
            if (data.panelOld !== null) {
                _cache[data.panelOld] = {
                    title               : $.extend({}, _title),
                    buttonLeft          : $.extend({}, _buttonLeft),
                    buttonRight         : $.extend({}, _buttonRight),
                    dropdownIsOpened    : _dropdownIsOpened,
                    searchIsActive      : _searchIsActive
                };
            }

            // Neuen Status laden
            var cached = _cache[data.panelNew];
            $.extend(_title, cached.title);
            $.extend(_buttonLeft, cached.buttonLeft);
            $.extend(_buttonRight, cached.buttonRight);
            _dropdownIsOpened = cached.dropdownIsOpened;
            _searchIsActive = cached.searchIsActive;
            _render();
        }
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();