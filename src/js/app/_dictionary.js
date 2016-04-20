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
    var _SEL_LIST               = "[role='list']";
    var _SEL_ITEM               = "[role='listitem']";
    var _SEL_DETAILS            = "[role='complementary']";
    var _SEL_TMPL_DICTIONARY    = "#tmpl-dictionary";
    var _SEL_TMPL_WORDLIST      = "#tmpl-wordlist";
    
    // DOM-Elemente
    var _$slider;
    var _$list;
    var _$items;
    var _$details;
    
    // Private Variablen
    var _list;
    var _currentSort;
    var _currentOrder;
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
        _$list              = null;
        _$details           = null;
        _$items             = null;
        _list               = [];
        _currentSort        = _C.SORTING.SORT.ALPHA.NAME;
        _currentOrder       = _C.SORTING.ORDER.ASC.NAME;
        
        // Funktionen ausführen
        _bindEvents();
    }
    
    /**
     * Wörterbuch initialisieren.
     * Initialisiert die DOM-Elemente und internen Variablen
     * des Wörterbuch-Moduls, sobald sie bereitstehen.
     */
    function _initDictionary() {
        
        // Modulvariablen initialisieren
        _$slider            = $(_SEL_SLIDER);
        _$list              = _$slider.find(_SEL_LIST);
        _$details           = _$slider.find(_SEL_DETAILS);
        _$items             = _$list.find(_SEL_ITEM);
        
        // Funktionen ausführen
        _bindEvents();
        
        // Fortschritt-Liste anfragen
        $(window).trigger(_C.EVT.REQUEST_PROGRESS);
        $(window).trigger(_C.EVT.SHOW_VIEW);
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        $(window).on(_C.EVT.LOAD_PANEL_CONTENT, _createDictionary);
        $(window).on(_C.EVT.SERVE_PROGRESS, _updateList);
        $(window).on(_C.EVT.SORTED_LIST, _sortList);
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

                // Template füllen, Callback ausführen
                data.target.html(Mustache.render(_tmplDictionary))
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
     * Sortiert die Liste der Wörter anhand der von einem Event
     * übergenen Sortierung und Ordnung; rendert die Liste anschließend.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _sortList(event, data) {

        // Wenn ein Event übergeben wurde, dessen Daten setzen
        if ((typeof data !== _C.TYPE.UNDEF) &&
            (typeof data.sort !== _C.TYPE.UNDEF) &&
            (typeof data.order !== _C.TYPE.UNDEF)) {
            _currentSort = data.sort;
            _currentOrder = data.order;
        }
        
        // Liste sortieren und rendern
        _list.sort(_compareListItems);
        if (_currentOrder === _C.SORTING.ORDER.DESC.NAME) { _list.reverse(); }
        _renderList();
    }
    
    /**
     * Liste aktualisieren.
     * Aktualisiert die Wörterbuch-Liste, sobald ein entsprechendes
     * Event mit den erforderlichen Daten ausgelöst wird.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _updateList(event, data) {
        if ((typeof data !== _C.TYPE.UNDEF) &&
            (typeof data.list !== _C.TYPE.UNDEF)) {
            _list = data.list;
            _sortList();
        }
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
    
    // Öffentliches Interface
    return { init: init };
    
})();