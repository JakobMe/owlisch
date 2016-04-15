/**
 * Wörterbuch-Modul.
 * Steuert das Wörterbuch der App.
 * @author Jakob Metzger
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
    
    // DOM-Elemente
    var _$slider;
    var _$dropdown;
    var _$sort;
    var _$list;
    var _$items;
    var _$details;
    
    // Private Variablen
    var _sort;
    var _order;
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
            sort            : _SORTING.SORT.ALPHA.NAME,
            order           : _SORTING.ORDER.ASC.NAME
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
            _sort               = defaults.sort;
            _order              = defaults.order;
            
            // Wort-Liste aktualisieren
            _updateList();
            
        });

        // Modul Return
        return this;
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
        
        var _test = {
            levels: [],
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
                }
            ]
        };
        
        // Mögliche Stufen ermitteln und hinzufügen
        for (var i = CONF.QUIZ.LVL_MIN; i <= CONF.QUIZ.LVL_MAX; i++) {
            _test.levels.push(i);
        }
        
        if (_$list instanceof jQuery) {
            _$list.html(Mustache.render(_tmplWordlist, _test));
        }
    }
    
    // Öffentliches Interface
    return {
        init : init
    };
    
})();