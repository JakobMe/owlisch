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
            
            // Wort-Liste aktualisieren
            _updateList();
            _renderDropdown();
        });

        // Modul Return
        return this;
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
        
        // Alle Sortierungen und Reihenfolgen iterieren
        for (var sort in _SORTING.SORT) {
            if (_SORTING.SORT.hasOwnProperty(sort)) {    
                for (var order in _SORTING.ORDER) {
                    if (_SORTING.ORDER.hasOwnProperty(order)) {
                        
                        // Sortierung hinzufügen
                        sorting.push({
                            optionSort  : _SORTING.SORT[sort].NAME,
                            optionOrder : _SORTING.ORDER[order].NAME,
                            labelSort   : _SORTING.SORT[sort].LABEL,
                            labelOrder  : _SORTING.ORDER[order].LABEL
                        });
                    }
                }
            }
        }
        
        // Template füllen, Callback ausführen
        if (($target instanceof jQuery) && $.isFunction(callback)) {
            $target.html(Mustache.render(_tmplDictionary, sorting))
                   .promise().done(function() { callback(); });
        }
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
     * Dropdown-Menü ein-/ausblenden.
     * Wechselt die Sichtbarkeit des Dropdown-Menüs.
     * @param {boolean} hide Dropdown ausblenden ja/nein
     * @returns {Object} Modul-Objekt
     */
    function toggleDropdown(hide) {
        if (hide === true) { _dropdownIsOpened = false; }
        else { _dropdownIsOpened = !_dropdownIsOpened; }
        _renderDropdown();
        return this;
    }
    
    // Öffentliches Interface
    return {
        init            : init,
        toggleDropdown  : toggleDropdown
    };
    
})();