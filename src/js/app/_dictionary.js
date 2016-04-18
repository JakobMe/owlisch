/**
 * Wörterbuch-Modul.
 * Steuert das Wörterbuch der App.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var Dictionary = (function() {
    
    // Selektor-Konstanten
    var _SEL_SLIDER             = "[role='directory']";
    var _SEL_DROPDOWN           = "[role='menu']";
    var _SEL_SORT               = "[role='menuitem']";
    var _SEL_LIST               = "[role='list']";
    var _SEL_ITEM               = "[role='listitem']";
    var _SEL_DETAILS            = "[role='complementary']";
    var _SEL_TMPL_DICTIONARY    = "#tmpl-dictionary";
    var _SEL_TMPL_WORDLIST      = "#tmpl-wordlist";
    
    // BEM-Konstanten
    var _B_DROPDOWN             = "dropdown";
    var _E_ITEM                 = "item";
    var _M_OPENED               = "opened";
    var _M_SELECTED             = "selected";
    
    // Data-Attibut-Konstanten
    var _DATA_SORT              = "sort";
    var _DATA_ORDER             = "order";
    
    // DOM-Elemente
    var _$slider;
    var _$dropdown;
    var _$sort;
    var _$list;
    var _$items;
    var _$details;
    
    // Private Variablen
    var _list;
    var _currentSort;
    var _currentOrder;
    var _availableSorts;
    var _availableOrders;
    var _dropdownIsOpened;
    var _tmplDictionary;
    var _tmplWordlist;
    
    /**
     * Modul initialisieren.
     * Setzt die Standard-Anfangswerte des Moduls, bindet alle Events,
     * sucht nach den benötigten DOM-Elementen und rendert das Modul.
     */
    function init() {

        // Templates suchen und setzen
        _tmplDictionary     = $(_SEL_TMPL_DICTIONARY).html();
        _tmplWordlist       = $(_SEL_TMPL_WORDLIST).html();
        
        // Templates parsen
        Mustache.parse(_tmplDictionary);
        Mustache.parse(_tmplWordlist);
        
        // Interne Variablen initialisieren
        _$slider            = null;
        _$dropdown          = null;
        _$list              = null;
        _$details           = null;
        _$sort              = null;
        _$items             = null;
        _list               = [];
        _availableSorts     = [];
        _availableOrders    = [];
        _dropdownIsOpened   = false;
        _currentSort        = _C.SORTING.SORT.ALPHA.NAME;
        _currentOrder       = _C.SORTING.ORDER.ASC.NAME;
        
        // Funktionen ausführen
        _bindEvents(false);
    }
    
    /**
     * Wörterbuch initialisieren.
     * Initialisiert die DOM-Elemente und internen Variablen
     * des Wörterbuch-Moduls, sobald sie bereitstehen.
     */
    function _initDictionary() {
        
        // Modulvariablen initialisieren
        _$slider            = $(_SEL_SLIDER);
        _$dropdown          = _$slider.find(_SEL_DROPDOWN);
        _$list              = _$slider.find(_SEL_LIST);
        _$details           = _$slider.find(_SEL_DETAILS);
        _$sort              = _$dropdown.find(_SEL_SORT);
        _$items             = _$list.find(_SEL_ITEM);
        
        // Funktionen ausführen
        _bindEvents(true);
        
        // Fortschritt-Liste anfragen
        $(window).trigger(_C.EVT.REQUEST_PROGRESS);
        $(window).trigger(_C.EVT.SHOW_VIEW);
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     * @param {boolean} domElements Nur DOM-Elemente binden oder andere
     */
    function _bindEvents(domElements) {
        if (domElements) { _$sort.on(_C.EVT.CLICK, _sortList); }
        else {
            $(window).on(_C.EVT.LOAD_PANEL_CONTENT, _createDictionary);
            $(window).on(_C.EVT.SERVE_PROGRESS, _updateList);
            $(window).on(_C.EVT.PRESSED_BUTTON, _setDropdown);
        }
    }
    
    /**
     * Wörterbuch erzeugen.
     * Erzeugt das Wörterbuch mit Mustache in dem übergebenen
     * jQuery-Container und initialisiert das Wörterbuch danach.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _createDictionary(event, data) {
        if (typeof data !== _C.TYPE.UNDEF) {
            if ((data.panel === _C.VIEW.DICTIONARY.NAME) &&
                (data.target instanceof jQuery)) {

                // Verfügbare Aktionen setzen
                var sorting = [];
                $.each(_C.SORTING.SORT, function(sort, sortProps) {
                    _availableSorts.push(sortProps.NAME);
                    $.each(_C.SORTING.ORDER, function(order, orderProps) {
                        _availableOrders.push(orderProps.NAME);
                        sorting.push({
                            optionSort  : sortProps.NAME,
                            optionOrder : orderProps.NAME,
                            labelSort   : sortProps.LABEL,
                            labelOrder  : orderProps.LABEL
                        });
                    });
                });
                
                // Template füllen, Callback ausführen
                data.target.html(Mustache.render(_tmplDictionary, sorting))
                    .promise().done(function() { _initDictionary(); });
            }
        }
    }
    
    /**
     * Listen-Element miteinander vergleichen.
     * Eine Vergleichs-Funktion für Elemente der Wortliste;
     * wird von der JavaScript-Funktion "sort" verwendet.
     * @param {Objekt} a Erstes zu vergleichende Listen-Objekt
     * @param {Objekt} b Zweites zu vergleichende Listen-Objekt
     * @returns {integer} Ergebnis des Vergleichs
     */
    function _compareListItems(a, b) {
        
        // Sortierung: Numerisch
        if (_currentSort === _C.SORTING.SORT.NUMERIC.NAME) {
            if (parseInt(a.lvl) < parseInt(b.lvl)) { return -1; }
            else if (parseInt(a.lvl) > parseInt(b.lvl)) { return 1; }
            else { return a.name.localeCompare(b.name); }
            
        // Standard-Sortierung: Alphabetisch
        } else { return a.name.localeCompare(b.name); }
    }
    
    /**
     * Liste sortieren.
     * Sortiert die Liste der Wörter anhand der gegebenen Sortierung
     * und Ordnung oder eines Klick-Events.
     * @param {Object} event Klick-Event eines Sortier-Buttons
     */
    function _sortList(event) {

        // Wenn ein Event übergeben wurde, dessen Daten setzen
        if (typeof event !== _C.TYPE.UNDEF) {
            if (event.target) {
                var sortButton = $(event.target).closest(_SEL_SORT);
                _currentSort = sortButton.data(_DATA_SORT);
                _currentOrder = sortButton.data(_DATA_ORDER);
            }
        }
        
        // Liste sortieren
        _list.sort(_compareListItems);
        if (_currentOrder === _C.SORTING.ORDER.DESC.NAME) { _list.reverse(); }
        
        // Dropdown ausblenden, wenn geöffnet
        if (_dropdownIsOpened) {
            $(window).trigger(
                _C.EVT.PRESSED_BUTTON,
                { action: _C.ACT.SORT_HIDE }
            );
        }
        
        // Liste rendern
        _renderList();
    }
    
    /**
     * Liste aktualisieren.
     * Aktualisiert die Wörterbuch-Liste, sobald ein entsprechendes
     * Event mit den erforderlichen Daten ausgelöst wird.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     * @returns {Object} Modul-Objekt
     */
    function _updateList(event, data) {
        if (typeof data.list !== _C.TYPE.UNDEF) {
            _list = data.list;
            _sortList();
        }
        return this;
    }
    
    /**
     * Liste rendern.
     * Rendert die Liste des Wörterbuches.
     */
    function _renderList() {
        if (_$list instanceof jQuery) {
            _$list.html(
                Mustache.render(_tmplWordlist, {
                    words: _list, levels: _C.QUIZ.LEVELS
                })
            );
        }
    }
    
    /**
     * Dropdown-Menü rendern.
     * Rendert das Dropdown-Menü anhand der aktuell gesetzte Eigenschaften
     * des Menüs (offen/geschlossen, aktiver Menüpunkt).
     */
    function _renderDropdown() {
        if (_$dropdown instanceof jQuery) {
            _$dropdown.setMod(_B_DROPDOWN, _M_OPENED, _dropdownIsOpened);
            _$sort.each(function() {
                var sortItem = $(this);
                var isCurrent = false;
                if ((sortItem.data(_DATA_SORT) === _currentSort) &&
                    (sortItem.data(_DATA_ORDER) === _currentOrder)) {
                    isCurrent = true;
                }
                sortItem.setMod(_B_DROPDOWN, _E_ITEM, _M_SELECTED, isCurrent);
            });
        }
    }
    
    /**
     * Dropdown aktualisieren.
     * Setzt das Dropdown anhand eines übergebenen Button-Events;
     * blendet es entweder ein oder aus.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _setDropdown(event, data) {
        if (typeof data !== _C.TYPE.UNDEF) {
            if (typeof data.action !== _C.TYPE.UNDEF) {
                if (data.action === _C.ACT.SORT_SHOW) {
                    _showDropdown();
                }
                if ((data.action === _C.ACT.SORT_HIDE) ||
                    (data.action === _C.ACT.SEARCH_HIDE) ||
                    (data.action === _C.ACT.SEARCH_SHOW)) {
                    _hideDropdown();
                }
            }
        }
    }
    
    /**
     * Dropdown-Menü einblenden.
     * Blendet das Dropdown-Menü des Wörterbuchs ein.
     */
    function _showDropdown() {
        _dropdownIsOpened = true;
        _renderDropdown();
    }
    
    /**
     * Dropdown-Menü ausblenden.
     * Blendet das Dropdown-Menü des Wörterbuchs aus.
     */
    function _hideDropdown() {
        _dropdownIsOpened = false;
        _renderDropdown();
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();