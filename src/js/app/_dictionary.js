/**
 * Wörterbuch-Modul.
 * Steuert das Wörterbuch der App.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var Dictionary = (function() {
    
    /*global CONF: true*/
    /*global SaveGame: true*/
    /*global NavigationBar: true*/
    
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
    //var _DATA_WORD              = "word";
    
    // Sortier-Konstanten
    var _SORTING = {
        SORT: {
            ALPHA: {
                NAME            : "alpha",
                LABEL           : "Alphabetisch"
            },
            NUMERIC: {
                NAME            : "numeric",
                LABEL           : "Nach Stufe"
            }
        },
        ORDER: {
            ASC: {
                NAME            : "asc",
                LABEL           : "aufsteigend"
            },
            DESC: {
                NAME            : "desc",
                LABEL           : "absteigend"
            }
        }
    };
    
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
     * @param {Object} options Optionale Einstellungen beim Initialisieren
     * @returns {Object} Modul-Objekt
     */
    function init(options) {
        
        // Standard-Optionen definieren und ergänzen
        var defaults = {
            $target         : null,
            initialSort     : _SORTING.SORT.ALPHA.NAME,
            initialOrder    : _SORTING.ORDER.ASC.NAME
        };
        
        // Optionen ergänzen
        $.extend(defaults, options || {});
        
        // Templates suchen und setzen
        _tmplDictionary     = $(_SEL_TMPL_DICTIONARY).html();
        _tmplWordlist       = $(_SEL_TMPL_WORDLIST).html();
        
        // Templates parsen
        Mustache.parse(_tmplDictionary);
        Mustache.parse(_tmplWordlist);
        
        // Interne Arrays initialisieren
        _availableSorts      = [];
        _availableOrders     = [];
        
        // Wörterbuch erzeugen
        _createDictionary(defaults.$target, function() {

            // Modulvariablen initialisieren
            _$slider            = $(_SEL_SLIDER);
            _$dropdown          = _$slider.find(_SEL_DROPDOWN);
            _$list              = _$slider.find(_SEL_LIST);
            _$details           = _$slider.find(_SEL_DETAILS);
            _$sort              = _$dropdown.find(_SEL_SORT);
            _$items             = _$list.find(_SEL_ITEM);
            _currentSort        = defaults.initialSort;
            _currentOrder       = defaults.initialOrder;
            _dropdownIsOpened   = false;
            _list               = SaveGame.getProgressList();
            
            // Funktionen ausführen
            _bindEvents();
            _sortList();
            _renderDropdown();
        });

        // Modul Return
        return this;
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        _$sort.on(CONF.EVENT.CLICK, _sortList);
    }
    
    /**
     * Wörterbuch erzeugen.
     * Erzeugt das Wörterbuch mit Mustache in dem übergebenen
     * jQuery-Container und initialisiert das Wörterbuch danach.
     * @param {Object} $target jQuery-Zielobjekt
     * @param {Object} callback Funktion, die anschließend ausgeführt wird
     */
    function _createDictionary($target, callback) {
        
        // Sortier-Optionen initialisieren
        var sorting = [];
        
        // Verfügbare Aktionen setzen
        $.each(_SORTING.SORT, function(sort, sortProps) {
            _availableSorts.push(sortProps.NAME);
            $.each(_SORTING.ORDER, function(order, orderProps) {
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
        if (($target instanceof jQuery) && $.isFunction(callback)) {
            $target.html(Mustache.render(_tmplDictionary, sorting))
                   .promise().done(function() { callback(); });
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
        if (_currentSort === _SORTING.SORT.NUMERIC.NAME) {
            if (parseInt(a.lvl) < parseInt(b.lvl)) { return -1; }
            else if (parseInt(a.lvl) > parseInt(b.lvl)) { return 1; }
            else { return a.name.localeCompare(b.name); }
            
        // Standard-Sortierung: Alphabetisch
        } else {
            return a.name.localeCompare(b.name);
        }
    }
    
    /**
     * Liste sortieren.
     * Sortiert die Liste der Wörter anhand der gegebenen Sortierung
     * und Ordnung oder eines Klick-Events.
     * @param {Object} event Klick-Event eines Sortier-Buttons
     */
    function _sortList(event) {

        // Wenn ein Event übergeben wurde, dessen Daten setzen
        if (typeof event !== CONF.TYPE.UNDEF) {
            if (event.target) {
                var sortButton = $(event.target).closest(_SEL_SORT);
                _currentSort = sortButton.data(_DATA_SORT);
                _currentOrder = sortButton.data(_DATA_ORDER);
            }
        }
        
        // Liste sortieren
        _list.sort(_compareListItems);
        if (_currentOrder === _SORTING.ORDER.DESC.NAME) { _list.reverse(); }
        
        // Navigation-Bar setzen
        if (_dropdownIsOpened) {
            NavigationBar.setButtonRight(
                NavigationBar.ACTION.SORT,
                NavigationBar.ICON.SORT
            );
        }
        
        // Dropdown ausblenden, Liste aktualisieren
        hideDropdown();
        _renderList();
    }
    
    /**
     * Liste aktualisieren.
     * Aktuelle Fortschritt-Liste vom SaveGame-Modul besorgen
     * und die Liste neu sortieren:
     * @returns {Object} Modul-Objekt
     */
    function updateList() {
        _list = SaveGame.getProgressList();
        _sortList();
        return this;
    }
    
    /**
     * Liste rendern.
     * Rendert die Liste des Wörterbuches.
     */
    function _renderList() {
        
        // Aktuelle Liste mit Mustache-Template einfügen
        if (_$list instanceof jQuery) {
            _$list.html(
                Mustache.render(_tmplWordlist, {
                    words: _list, levels: CONF.QUIZ.LEVELS
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
    
    /**
     * Dropdown-Menü einblenden.
     * Blendet das Dropdown-Menü des Wörterbuchs ein.
     * @returns {Object} Modul-Objekt
     */
    function showDropdown() {
        _dropdownIsOpened = true;
        _renderDropdown();
        return this;
    }
    
    /**
     * Dropdown-Menü ausblenden.
     * Blendet das Dropdown-Menü des Wörterbuchs aus.
     * @returns {Object} Modul-Objekt
     */
    function hideDropdown() {
        _dropdownIsOpened = false;
        _renderDropdown();
        return this;
    }
    
    /**
     * Ermitteln, ob Dropdown geöffnet ist.
     * Gibt zurück, ob das Dropdown-Menü des Wörterbuchs
     * aktuell geöffnet ist.
     * @returns {boolean} Dropdown ist geöffnet/geschlossen
     */
    function dropdownIsOpened() {
        return _dropdownIsOpened;
    }
    
    // Öffentliches Interface
    return {
        init                : init,
        showDropdown        : showDropdown,
        hideDropdown        : hideDropdown,
        dropdownIsOpened    : dropdownIsOpened,
        updateList          : updateList
    };
    
})();