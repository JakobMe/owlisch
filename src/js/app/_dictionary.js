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
    
    // DOM-Elemente
    var _$slider;
    var _$dropdown;
    var _$sort;
    var _$list;
    var _$items;
    var _$details;
    
    // Private Variablen
    var _currentSort;
    var _currentOrder;
    var _availableSorts;
    var _availableOrders;
    var _dropdownIsOpened;
    var _tmplDictionary;
    var _tmplWordlist;
    
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
            
            // Funktionen ausführen
            _bindEvents();
            _updateList();
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
     * Dropdown-Menü rendern.
     * Rendert das Dropdown-Menü anhand der aktuell gesetzte Eigenschaften
     * des Menüs (offen/geschlossen, aktiver Menüpunkt).
     */
    function _renderDropdown() {
        _$dropdown.setMod(_B_DROPDOWN, _M_OPENED, _dropdownIsOpened);
        _$sort.each(function() {
            var sortItem = $(this);
            var isCurrent = false;
            if ((sortItem.data(CONF.DATA.SORT) === _currentSort) &&
                (sortItem.data(CONF.DATA.ORDER) === _currentOrder)) {
                isCurrent = true;
            }
            sortItem.setMod(_B_DROPDOWN, _E_ITEM, _M_SELECTED, isCurrent);
        });
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
     *
     */
    function _sortList(sort, order) {
        
        // Wenn Sortierung ein Button ist
        if (sort.target) {
            
            // Sortierung und Ordnung ermitteln und setzen
            var sortButton = $(sort.target).closest(_SEL_SORT);
            _currentSort = sortButton.data(CONF.DATA.SORT);
            _currentOrder = sortButton.data(CONF.DATA.ORDER);
            
        // Wenn Sortierung und Ordnung Strings sind
        } else if ((typeof sort === CONF.TYPE.STRING) &&
                   (typeof order === CONF.TYPE.STRING)) {
            
            // Wenn Sortierung und Ordnung valide sind
            if (($.inArray(sort, _availableSorts) >= 0) &&
                ($.inArray(order, _availableOrders)  >= 0)) {
                _currentSort = sort;
                _currentOrder = order;
            }
        }
        
        // Navigation-Bar setzen
        NavigationBar.setButtonRight(
            NavigationBar.ACTION.SORT,
            NavigationBar.ICON.SORT
        );
        
        // Dropdown ausblenden, Liste aktualisieren
        hideDropdown();
        _updateList();
    }
    
    /**
     *
     *
     */
    function _updateList() {
        
        //
        var _test = {
            levels: CONF.QUIZ.LEVELS,
            words: [
                {
                    id      : "pinneken",
                    name    : "Pinneken",
                    level   : "3"
                },
                {
                    id      : "latuechte",
                    name    : "Latüchte",
                    level   : "0"
                },
                {
                    id      : "noenkern",
                    name    : "Nönkern",
                    level   : "1"
                },
                {
                    id      : "fickerich",
                    name    : "Fickerich",
                    level   : "2"
                },
                {
                    id      : "buetterken",
                    name    : "Bütterken",
                    level   : "0"
                },
                {
                    id      : "knuepp",
                    name    : "Knüpp",
                    level   : "3"
                },
                {
                    id      : "pinneken",
                    name    : "Pinneken",
                    level   : "3"
                },
                {
                    id      : "latuechte",
                    name    : "Latüchte",
                    level   : "0"
                },
                {
                    id      : "noenkern",
                    name    : "Nönkern",
                    level   : "1"
                },
                {
                    id      : "fickerich",
                    name    : "Fickerich",
                    level   : "2"
                },
                {
                    id      : "buetterken",
                    name    : "Bütterken",
                    level   : "0"
                },
                {
                    id      : "knuepp",
                    name    : "Knüpp",
                    level   : "3"
                }
            ]
        };
        
        //
        if (_$list instanceof jQuery) {
            _$list.html(Mustache.render(_tmplWordlist, _test));
        }
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
        dropdownIsOpened    : dropdownIsOpened
    };
    
})();