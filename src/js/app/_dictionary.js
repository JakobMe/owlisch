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
    
    // Private Variablen
    var _listOriginal           = [];
    var _listFiltered           = [];
    var _listCaption            = CFG.STR.EMPTY;
    var _currentFilter          = CFG.STR.EMPTY;
    var _currentSort            = CFG.SORTING.SORT.ALPHA;
    var _currentOrder           = CFG.SORTING.ORDER.ASC;
    var _tmplDictionary         = $(_SEL_TMPL_DICTIONARY).html();
    var _tmplWordlist           = $(_SEL_TMPL_WORDLIST).html();
    
    // DOM-Elemente
    var _$slider                = null;
    var _$list                  = null;
    var _$items                 = null;
    var _$details               = null;
    
    /**
     * Wörterbuch initialisieren.
     * Parst alle benötigten Templates und startet Funktionen,
     * um den Anfangszustand des Wörterbuches herzustellen.
     */
    function init() {

        // Templates parsen, Funktionen ausführen
        Mustache.parse(_tmplDictionary);
        Mustache.parse(_tmplWordlist);
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
        
        // Fortschritt-Liste anfragen
        $(window).trigger(CFG.EVT.REQUEST_PROGRESS);
        $(window).trigger(CFG.EVT.SHOW_VIEW);
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        $(window).on(CFG.EVT.LOAD_PANEL_CONTENT, _createDictionary);
        $(window).on(CFG.EVT.SERVE_PROGRESS, _updateList);
        $(window).on(CFG.EVT.SORTED_LIST, _sortList);
        $(window).on(CFG.EVT.SEARCHED_LIST, _filterList);
    }
    
    /**
     * Wörterbuch erzeugen.
     * Erzeugt das Wörterbuch mit Mustache in dem übergebenen
     * jQuery-Container und initialisiert das Wörterbuch danach.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _createDictionary(event, data) {
        if ((typeof data !== typeof undefined) &&
            (CFG.VIEW[data.panel] === CFG.VIEW.DICTIONARY) &&
            (data.target instanceof jQuery)) {

            // Template füllen, Callback ausführen
            data.target.html(Mustache.render(_tmplDictionary))
                .promise().done(function() { _initDictionary(); });
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
        if (_currentSort === CFG.SORTING.SORT.NUMERIC) {
            if (parseInt(a.lvl) < parseInt(b.lvl)) { return -1; }
            else if (parseInt(a.lvl) > parseInt(b.lvl)) { return 1; }
            else { return a.term.localeCompare(b.term); }
            
        // Standard-Sortierung: Alphabetisch
        } else { return a.term.localeCompare(b.term); }
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
        if ((typeof data !== typeof undefined) &&
            (typeof data.sort !== typeof undefined) &&
            (typeof data.order !== typeof undefined)) {
            _currentSort = data.sort;
            _currentOrder = data.order;
        }
        
        // Liste sortieren und rendern
        _listFiltered.sort(_compareListItems);
        if (_currentOrder === CFG.SORTING.ORDER.DESC) {
            _listFiltered.reverse();
        }
        _renderList();
    }
    
    /**
     * Liste filtern.
     * Filtert die Liste anhand des aktuell gesetzten Suchbegriffes
     * oder einem durch ein Event übergebenen Suchbegriff; filtert die
     * Original-Liste und kopiert übereinstimmende Einträge in die
     * Filter-Liste; sortiert die Liste anschließend.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _filterList(event, data) {
        
        // Filter-Wort gegebenenfalls aktualisieren
        if ((typeof data !== typeof undefined) &&
            (typeof data.search === typeof CFG.STR.EMPTY)) {
            _currentFilter = data.search.toLowerCase();
        }
        
        // Wenn Suchbegriff leer ist, Original-Liste setzen
        if (_currentFilter === CFG.STR.EMPTY) {
            _listFiltered = _listOriginal.slice(0);
        
        // Ansonsten Filter-Liste neu erzeugen
        } else {
            _listFiltered = [];
            $.each(_listOriginal, function(index, word) {
                if (word.term.toLowerCase().indexOf(_currentFilter) > -1) {
                    _listFiltered.push(word);
                }
            });
        }
        
        // Liste sortieren
        _sortList();
    }
    
    /**
     * Liste aktualisieren.
     * Aktualisiert die Wörterbuch-Liste, sobald ein entsprechendes
     * Event mit den erforderlichen Daten ausgelöst wird.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _updateList(event, data) {
        if ((typeof data !== typeof undefined) &&
            (typeof data.list !== typeof undefined)) {
            _listCaption = data.caption;
            _listOriginal = data.list;
            _filterList();
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
                    caption     : _listCaption,
                    words       : _listFiltered,
                    levels      : CFG.QUIZ.LEVELS,
                    size        : _listFiltered.length,
                    single      : (_listFiltered.length === 1),
                    filtered    : (_currentFilter.length > 0),
                    filter      : _currentFilter
                })
            );
        }
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();