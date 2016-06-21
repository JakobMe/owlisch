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
    var _SEL_BUTTONS            = "[role='button']";
    var _SEL_SORT               = "[role='menuitem']";
    var _SEL_NAVBAR             = "#navigationbar";
    var _SEL_TITLE              = "#navigation-title";
    var _SEL_SEARCH             = "#navigation-search";
    var _SEL_CLEAR              = "#navigation-clear";
    var _SEL_DROPDOWN           = "#navigation-dropdown";
    var _SEL_TMPL_DROPDOWN      = "#tmpl-dropdown";
    
    // BEM-Konstanten
    var _B_BAR                  = "navigationbar";
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
    var _defaults               = {};
    var _title                  = {};
    var _buttonLeft             = {};
    var _buttonRight            = {};
    var _searchIsActive         = false;
    var _buttonsAreDisabled     = false;
    var _dropdownIsOpened       = false;
    var _tmplDropdown           = $(_SEL_TMPL_DROPDOWN).html();
    var _isWebapp               = (CFG.WEBAPP.IOS || CFG.WEBAPP.CORDOVA);
    
    // DOM-Elemente
    var _$navbar                = $(_SEL_NAVBAR);
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
        
        // Alle View-Panels iterieren
        $.each(CFG.VIEW, function(alias, panel) {
            
            // Name und Titel des Panels ermitteln
            var panelAlias = alias;
            var panelTitle = panel.TITLE;
            
            // Konfiguration im Cache speichern
            _saveToCache(panelAlias, panelTitle);
            
            // Sonderfall: Wörterbuch
            if (panel === CFG.VIEW.DICTIONARY) {
                $.extend(_cache[panelAlias].buttonLeft, {
                    action : CFG.ACT.SEARCH_SHOW,
                    icon   : CFG.ICON.SEARCH
                });
                $.extend(_cache[panelAlias].buttonRight, {
                    action : CFG.ACT.SORT_SHOW,
                    icon   : CFG.ICON.SORT
                });
            }            
        });
        
        // Cache duplizieren
        _defaults = $.extend({}, _cache);
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
        $(window).on(CFG.EVT.UPDATE_NAVBAR, _updateNavbar);
        $(window).on(CFG.EVT.RESTORE_DEFAULT, _restoreDefault);
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
                    _focusSearch();
                    _setDropdown(false);
                    _setSearch(true);
                    break;
                
                // Suche ausblenden
                case CFG.ACT.SEARCH_HIDE:
                    _setDropdown(false);
                    _setSearch(false);
                    break;
                
                // Wörterbuch vorwärts
                case CFG.ACT.DICTIONARY_FORWARD:
                    _saveToCache(CFG.ACT.DICTIONARY_BACK);
                    _setDropdown(false);
                    _setSearch(false, false);
                    _setButtonLeft(CFG.ACT.DICTIONARY_BACK, CFG.ICON.BACK);
                    _setButtonRight(null, null);
                    _setTitle(data.text || CFG.VIEW.DICTIONARY.TITLE);
                    break;
                
                // Wörterbuch zurück
                case CFG.ACT.DICTIONARY_BACK:
                    _loadFromCache(CFG.ACT.DICTIONARY_BACK);
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
     * @param {String} action Name der Button-Aktion
     * @param {String} icon Name des Button-Icons
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
     * @param {String} action Neue Aktion
     * @param {String} icon Neues Icon
     */
    function _setButtonLeft(action, icon) {
        _setButton(_buttonLeft, action, icon);
    }
    
    /**
     * Button Rechts setzen.
     * Setzt Aktion und Icon des rechten Buttons.
     * @param {String} action Neue Aktion
     * @param {String} icon Neues Icon
     */
    function _setButtonRight(action, icon) {
        _setButton(_buttonRight, action, icon);
    }
    
    /**
     * Titel setzen.
     * Setzt den aktuellen Titel und rendert ihn neu.
     * @param {String} title Neuer Titel
     */
    function _setTitle(title) {
        if (typeof title === typeof CFG.STR.EMPTY) {
            _title.str = title;
            _renderTitle();
        }
    }
    
    /**
     * Suche (de-)aktivieren.
     * Aktiviert oder deaktiviert die Suche anhand des übergebenen Wertes;
     * setzt den zugehörigen Button entsprechend und rendert die Suche neu.
     * @param {Boolean} willBeActive Angabe, ob die Suche aktiviert wird
     * @param {Boolean} triggerSearch Angabe, ob Such-Event ausgelöst wird
     */
    function _setSearch(willBeActive, triggerSearch) {
        if (_searchIsActive !== willBeActive) {
            _searchIsActive = willBeActive;
            _setButtonLeft(
                (willBeActive ? CFG.ACT.SEARCH_HIDE : CFG.ACT.SEARCH_SHOW),
                (willBeActive ? CFG.ICON.CANCEL     : CFG.ICON.SEARCH)
            );
            if (triggerSearch !== false) { _triggerSearch(); }
            _renderSearch();
        }
    }
    
    /**
     * Such-Event auslösen.
     * Löst ein globales Event mit dem aktuellen Suchbegriff aus.
     */
    function _triggerSearch() {
        $(window).trigger(
            CFG.EVT.SEARCHED_LIST,
            { search: (_searchIsActive ? _$search.val() : CFG.STR.EMPTY) }
        );
    }
    
    /**
     * Suche fokussieren.
     * Fokussiert das Such-Input nach einem kurzen Delay.
     */
    function _focusSearch() {
        setTimeout(function() {
            _$search.focus();
        }, CFG.TIME.DELAY);
    }
    
    /**
     * Dropdown-Sortierung ein-/ausblenden.
     * Blendet das Dropdown-Menü anhand des übergebenen Wertes ein
     * oder aus; setzt den zugehörigen Button entsprechend und rendert
     * das Dropdown-Menü.
     * @param {Boolean} willBeOpened Angabe, ob das Dropdown geöffnet wird
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
     * Aktuelle Navigation-Bar im Cache speichern.
     * Hinterlegt die aktuelle Konfiguration der Navigation-Bar
     * anhand des übergebenen Indexes im internen Cache.
     * @param {String} index Name der Konfiguration
     * @param {String} title Alternativer neuer Titel
     */
    function _saveToCache(index, title) {
        
        // Aktuellen Status speichern
        _cache[index] = {
            title             : $.extend({}, _title),
            buttonLeft        : $.extend({}, _buttonLeft),
            buttonRight       : $.extend({}, _buttonRight),
            dropdownIsOpened  : _dropdownIsOpened,
            searchIsActive    : _searchIsActive
        };
        
        // Optional Titel überschreiben
        if (typeof title === typeof CFG.STR.EMPTY) {
            $.extend(_cache[index].title, { str: title });
        }
    }
    
    /**
     * Aktuelle Konfiguration aus Cache wiederherstellen.
     * Lädt eine Konfiguration anhand des übergebenen Indexes aus dem Cache,
     * falls sie vorhanden ist, und ersetzt die aktuelle Konfiguration.
     * @param {String} index Name der Konfiguration
     */
    function _loadFromCache(index) {
        
        // Cache laden, falls vorhanden
        if (typeof _cache[index] !== typeof undefined) {
            var cached = _cache[index];
            $.extend(_title, cached.title);
            $.extend(_buttonLeft, cached.buttonLeft);
            $.extend(_buttonRight, cached.buttonRight);
            _dropdownIsOpened = cached.dropdownIsOpened;
            _searchIsActive   = cached.searchIsActive;
        }
        
        // Rendern
        _render();
    }
    
    /**
     * Standard-Konfiguration wiederherstellen.
     * Lädt anhand eines ausgelösten Events den Original-Zustand der
     * Navigation-Bar für ein bestimmtes View-Panel.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _restoreDefault(event, data) {
        if ((typeof data                  !== typeof undefined) &&
            (typeof data.panel            !== typeof undefined) &&
            (typeof _cache[data.panel]    !== typeof undefined) &&
            (typeof _defaults[data.panel] !== typeof undefined)) {
            
            // Aktuelle Konfiguration im Cache speichern
            _saveToCache(data.panel);

            // Standard-Konfiguration wiederherstellen und laden
            if (JSON.stringify(_defaults[data.panel]) !==
                JSON.stringify(_cache[data.panel])) {
                _cache[data.panel] = $.extend({}, _defaults[data.panel]);
                _loadFromCache(data.panel);
            }
        }
    }
    
    /**
     * Navigation-Bar aktualisieren.
     * Aktualisiert anhand eines ausgelösten Events den Zustand
     * der Navigation-Bar; speichert den Zustand für das vorige View-Panel
     * im Cache und lädt den Zustand für das neue View-Panel aus dem Cache.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _updateNavbar(event, data) {
        if ((typeof data          !== typeof undefined) &&
            (typeof data.panelOld !== typeof undefined) &&
            (typeof data.panelNew !== typeof undefined)) {

            // Aktuellen Status speichern, neuen Status laden
            if (data.panelOld !== null) { _saveToCache(data.panelOld);   }
            if (data.panelNew !== null) { _loadFromCache(data.panelNew); }
        }
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();