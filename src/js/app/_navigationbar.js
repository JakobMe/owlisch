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
    var _SEL_TITLEBAR           = "[role='navigation']";
    var _SEL_BUTTONS            = "[role='button']";
    var _SEL_TITLE              = "[role='heading']";
    var _SEL_SEARCH             = "[role='search']";
    var _SEL_CLEAR              = "[role='option']";
    var _SEL_DROPDOWN           = "[role='menu']";
    var _SEL_SORT               = "[role='menuitem']";
    var _SEL_TMPL_DROPDOWN      = "#tmpl-dropdown";
    
    // BEM-Konstanten
    var _B_BAR                  = "navigation-bar";
    var _B_DROPDOWN             = "dropdown";
    var _E_ITEM                 = "item";
    var _E_TITLE                = "title";
    var _E_BUTTON               = "button";
    var _E_CLEAR                = "search-clear";
    var _M_HIDDEN               = "hidden";
    var _M_DISABLED             = "disabled";
    var _M_SEARCH               = "search";
    var _M_WEBAPP               = "webapp";
    var _M_ICON                 = "icon";    
    var _M_OPENED               = "opened";
    var _M_SELECTED             = "selected";
    
    // Data-Attibut-Konstanten
    var _DATA_SORT              = "sort";
    var _DATA_ORDER             = "order";
    
    // Private Variablen  
    var _cache                  = {};  
    var _title                  = {};
    var _buttonLeft             = {};
    var _buttonRight            = {};
    var _searchIsActive         = false;
    var _buttonsAreDisabled     = false;
    var _dropdownIsOpened       = false;
    var _tmplDropdown           = $(_SEL_TMPL_DROPDOWN).html();
    var _isWebapp               = (CFG.WEBAPP.IOS || CFG.WEBAPP.CORDOVA);
    
    // DOM-Elemente
    var _$navbar                = $(_SEL_TITLEBAR);
    var _$search                = _$navbar.find(_SEL_SEARCH);
    var _$clear                 = _$navbar.find(_SEL_CLEAR);
    var _$dropdown              = _$navbar.find(_SEL_DROPDOWN);
    var _$sort                  = null;
    
    /**
     * Navigation-Bar initialisieren.
     * Parst alle benötigten Templates und startet Funktionen,
     * um den Anfangszustand der Navigation-Bar herzustellen.
     */
    function init() {
        
        // Funktionen ausführen
        _parseTemplates();
        _initNavigationBar();
        _render();
    }
    
    /**
     * Templates parsen.
     * Übergibt die Templates dieses Moduls an Mustache, um sie zu parsen.
     */
    function _parseTemplates() {
        Mustache.parse(_tmplDropdown);
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
        $.each(CFG.SORTING.SORT, function(optionSort, labelSort) {
            $.each(CFG.SORTING.ORDER, function(optionOrder, labelOrder) {
                sorting.push({
                    iconSort    : optionSort.toLowerCase(),
                    iconOrder   : optionOrder.toLowerCase(),
                    optionSort  : optionSort,
                    optionOrder : optionOrder,
                    labelSort   : labelSort,
                    labelOrder  : labelOrder
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
        _title = { $title: _$navbar.find(_SEL_TITLE), str: CFG.STR.EMPTY };
        _$sort = _$dropdown.find(_SEL_SORT);
    }
    
    /**
     * Standard-Konfiguration im Cache speichern.
     * Legt für jedes vorhandene View-Panel die Standard-Konfiguration
     * der Navigation-Bar im Cache fest.
     */
    function _setDefaultCache() {
        $.each(CFG.VIEW, function(alias, panel) {
            
            // Name und Titel des Panels ermitteln
            var panelAlias = alias;
            var panelTitle = panel.TITLE;
            
            // Cache für Panel setzen
            _cache[panelAlias] = {
                title               : $.extend({}, _title),
                buttonLeft          : $.extend({}, _buttonLeft),
                buttonRight         : $.extend({}, _buttonRight),
                dropdownIsOpened    : _dropdownIsOpened,
                searchIsActive      : _searchIsActive
            };
            
            // Titel setzen
            _cache[panelAlias].title.str = panelTitle;
            
            // Sonderfall: Wörterbuch
            if (panel === CFG.VIEW.DICTIONARY) {
                $.extend(_cache[panelAlias].buttonLeft, {
                    action  : CFG.ACT.SEARCH_SHOW,
                    icon    : CFG.ICON.SEARCH
                });
                $.extend(_cache[panelAlias].buttonRight, {
                    action  : CFG.ACT.SORT_SHOW,
                    icon    : CFG.ICON.SORT
                });
            }            
        });
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        _$sort.on(CFG.EVT.CLICK, _renderDropdown);
        _$navbar.on(CFG.EVT.CLICK, _SEL_BUTTONS, _buttonAction);
        _$search.on(CFG.EVT.INPUT, _searchAction);
        _$clear.on(CFG.EVT.CLICK, _clearSearch);
        $(window).on(CFG.EVT.UPDATE_NAVBAR, _updateCache);
        $(window).on(CFG.EVT.PRESSED_BUTTON, _buttonPressed);
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
        var icon    = (button.icon    || null);
        var action  = (button.action  || null);
        
        // Falls Button vorhanden ist
        if ($button instanceof $) {
            
            // Button ausblenden/deaktivieren
            _buttonsAreDisabled = true;
            $button.setMod(_B_BAR, _E_BUTTON, _M_DISABLED, true);
            
            // Button aktualisieren
            setTimeout(function() {
                if ((icon === null) || (action === null)) {
                    $button.setMod(_B_BAR, _E_BUTTON, _M_ICON, CFG.ICON.NONE);
                } else {
                    $button.setMod(_B_BAR, _E_BUTTON, _M_DISABLED, false);
                    $button.setMod(_B_BAR, _E_BUTTON, _M_ICON, icon);
                }
                setTimeout(function() {
                    _buttonsAreDisabled = false;
                }, CFG.TIME.DELAY);
            }, CFG.TIME.ANIMATION);
        }
    }
    
    /**
     * Titel rendern.
     * Rendert den Titel der Titelleiste anhand des
     * aktuell gesetzten Titels neu.
     */
    function _renderTitle() {
        if (_title.$title instanceof $) {
            _title.$title.setMod(_B_BAR, _E_TITLE, _M_HIDDEN, true);
            setTimeout(function() {
                _title.$title.text(_title.str || CFG.STR.EMPTY);
                _title.$title.setMod(_B_BAR, _E_TITLE, _M_HIDDEN, false);
            }, CFG.TIME.ANIMATION);
        }
    }
    
    /**
     * Suche rendern.
     * Rendert die Suche anhand der gesetzten Eigenschaften des Moduls.
     */
    function _renderSearch() {
        _$navbar.setMod(_B_BAR, _M_SEARCH, false);
        setTimeout(function() {
            _$navbar.setMod(_B_BAR, _M_SEARCH, _searchIsActive);
        }, CFG.TIME.ANIMATION);
    }
    
    /**
     * Dropdown-Menü rendern.
     * Rendert das Dropdown-Menü anhand der aktuell gesetzte Eigenschaften
     * des Menüs (offen/geschlossen, aktiver Menüpunkt).
     * @param {Object} event Ausgelöstes Event
     */
    function _renderDropdown(event) {
        
        // Falls Funktion durch Klick-Event ausgelöst wurde
        if ((typeof event !== typeof undefined) &&
            (event.target)) {
            
            // Geklickten Button aktivieren, Geschwister deaktivieren
            var $sort = $(event.target).closest(_SEL_SORT);
            var sort  = CFG.SORTING.SORT[$sort.data(_DATA_SORT)];
            var order = CFG.SORTING.ORDER[$sort.data(_DATA_ORDER)];
            $sort.setMod(_B_DROPDOWN, _E_ITEM, _M_SELECTED, true)
                .siblings().setMod(_B_DROPDOWN, _E_ITEM, _M_SELECTED, false);
            
            // Event auslösen
            $(window).trigger(
                CFG.EVT.SORTED_LIST,
                { sort: sort, order: order }
            );
            
            // Dropdown ausblenden
            _setDropdown(false);
        
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
        if ((typeof data        !== typeof undefined) &&
            (typeof data.action !== typeof undefined)) {
            switch (data.action) {
                
                // Sortierung einblenden
                case CFG.ACT.SORT_SHOW:
                    _setDropdown(true);
                    break;
                
                // Sortierung ausblenden
                case CFG.ACT.SORT_HIDE:
                    _setDropdown(false);
                    break;
                
                // Suche einblenden
                case CFG.ACT.SEARCH_SHOW:
                    setTimeout(function() {
                        _$search.focus();
                    }, CFG.TIME.DELAY);
                    _setDropdown(false);
                    _setSearch(true);
                    break;
                
                // Suche ausblenden
                case CFG.ACT.SEARCH_HIDE:
                    _setDropdown(false);
                    _setSearch(false);
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
            
            // Event auslösen
            $(window).trigger(CFG.EVT.PRESSED_BUTTON, { action: action });
        }
    }
    
    /**
     * Such-Aktion ausführen.
     * Ermittelt den aktuellen Suchbegriff und leitet diesen Wert weiter;
     * blendet den Clear-Button für das Input ein/aus.
     */
    function _searchAction() {
        var search = _$search.val();
        _$clear.setMod(_B_BAR, _E_CLEAR, _M_HIDDEN, (search.length === 0));
        $(window).trigger(CFG.EVT.SEARCHED_LIST, { search: search });
    }
    
    /**
     * Suchfeld leeren.
     * Leert das Suchfeld, löst ein Input-Event aus
     * und fokussiert das Suchfeld.
     */
    function _clearSearch() {
        _$search.val(CFG.STR.EMPTY).trigger(CFG.EVT.INPUT);
        _$search.focus();
    }
    
    /**
     * Button-Eigenschaften setzen.
     * Setzt die Aktion und das Icon eines gegebenen Buttons.
     * @param {Object} button Button-Objekt
     * @param {string} action Name der Button-Aktion
     * @param {string} icon Name des Button-Icons
     */
    function _setButton(button, action, icon) {
        if (button.$button instanceof $) {
            button.action = (action || null);
            button.icon   = (icon   || null);
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
     * Suche (de-)aktivieren.
     * Aktiviert oder deaktiviert die Suche anhand des übergebenen Wertes;
     * setzt den zugehörigen Button entsprechend und rendert die Suche neu.
     * @param {boolean} willBeActive Angabe, ob die Suche aktiviert wird
     */
    function _setSearch(willBeActive) {
        if (_searchIsActive !== willBeActive) {
            _searchIsActive = willBeActive;
            _setButtonLeft(
                (willBeActive ? CFG.ACT.SEARCH_HIDE : CFG.ACT.SEARCH_SHOW),
                (willBeActive ? CFG.ICON.CANCEL     : CFG.ICON.SEARCH)
            );
            $(window).trigger(
                CFG.EVT.SEARCHED_LIST,
                { search: (willBeActive ? _$search.val() : CFG.STR.EMPTY) }
            );
            _renderSearch();
        }
    }
    
    /**
     * Dropdown-Sortierung ein-/ausblenden.
     * Blendet das Dropdown-Menü anhand des übergebenen Wertes ein
     * oder aus; setzt den zugehörigen Button entsprechend und rendert
     * das Dropdown-Menü.
     * @param {boolean} willBeOpened Angabe, ob das Dropdown geöffnet wird
     */
    function _setDropdown(willBeOpened) {
        if (_dropdownIsOpened !== willBeOpened) {
            _dropdownIsOpened = willBeOpened;
            _setButtonRight(
                (willBeOpened ? CFG.ACT.SORT_HIDE : CFG.ACT.SORT_SHOW),
                (willBeOpened ? CFG.ICON.CANCEL   : CFG.ICON.SORT) 
            );
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
        if ((typeof data          !== typeof undefined) &&
            (typeof data.panelOld !== typeof undefined) &&
            (typeof data.panelNew !== typeof undefined)) {

            // Aktuellen Status speichern
            if (data.panelOld !== null) {
                _cache[data.panelOld] = {
                    title             : $.extend({}, _title),
                    buttonLeft        : $.extend({}, _buttonLeft),
                    buttonRight       : $.extend({}, _buttonRight),
                    dropdownIsOpened  : _dropdownIsOpened,
                    searchIsActive    : _searchIsActive
                };
            }

            // Neuen Status laden
            var cached = _cache[data.panelNew];
            $.extend(_title, cached.title);
            $.extend(_buttonLeft, cached.buttonLeft);
            $.extend(_buttonRight, cached.buttonRight);
            _dropdownIsOpened = cached.dropdownIsOpened;
            _searchIsActive   = cached.searchIsActive;
            _render();
        }
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();