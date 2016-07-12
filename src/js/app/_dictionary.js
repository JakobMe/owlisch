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
    var _SEL_LIST               = "[data-dictionary='list']";
    var _SEL_LISTBOX            = "[data-dictionary='listbox']";
    var _SEL_ITEM               = "[data-dictionary='item']";
    var _SEL_DETAILS            = "[data-dictionary='details']";
    var _SEL_SLIDER             = "[data-dictionary='slider']";
    
    // Template-Namen
    var _TMPL_DICTIONARY        = "dictionary";
    var _TMPL_LIST              = "dictionary-list";
    var _TMPL_DETAILS           = "dictionary-details";
    
    // BEM-Konstanten
    var _B_SLIDER               = "slider";
    var _M_IS                   = "is";
    
    // Data-Attribut-Konstanten
    var _DATA_TERM              = "term";
    var _DATA_SLIDE             = "slide";
    
    // Private Variablen
    var _listOriginal           = [];
    var _listFiltered           = [];
    var _listCaption            = "";
    var _currentFilter          = "";
    var _currentSort            = CFG.SORTING.SORT.ALPHA;
    var _currentOrdr            = CFG.SORTING.ORDR.ASC;
    var _currentTerm            = {};
    var _currentSlide           = 0;
    var _indexListbox           = 0;
    var _indexDetails           = 0;
    var _listIsLocked           = false;
    
    // DOM-Elemente
    var _$slider                = null;
    var _$list                  = null;
    var _$listbox               = null;
    var _$details               = null;
    
    /**
     * Wörterbuch initialisieren.
     * Führt Funktionen aus, um den Ausgangszustand des
     * des Wörterbuches herzustellen.
     */
    function init() {
        _hookMediator();
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events.
     */
    function _bindEvents() {
        if (_$list instanceof $) {
            _$list.on(CFG.EVT.CLICK, _SEL_ITEM, _setDetails);
        }
    }

    /**
     * Mediator abonnieren.
     * Meldet Funktionen beim Mediator an.
     */
    function _hookMediator() {
        Mediator.hook(CFG.CNL.VIEW_LOAD, _create)
                .hook(CFG.CNL.VIEW_RESTORE, _restore)
                .hook(CFG.CNL.TERMS_SERVE, _update)
                .hook(CFG.CNL.DICTIONARY_SEARCH, _filter)
                .hook(CFG.CNL.DICTIONARY_SORT, _sort)
                .hook(CFG.CNL.NAVBAR_ACTION, _back);
    }
    
    /**
     * Wörterbuch erzeugen.
     * Erzeugt das Wörterbuch anhand eines Mediator-Events; fügt das
     * Wörterbuch mittels Template ein, initialisiert die Elemente des
     * Wörterbuches und teilt dem Mediator weitere Events mit.
     * @param {Object} data Übergebene Daten des Mediators
     */
    function _create(data) {
        if ((typeof data !== typeof undefined) &&
            (CFG.VIEW[data.panel] === CFG.VIEW.DICTIONARY) &&
            (data.target instanceof $)) {
            Template.render(data.target, _TMPL_DICTIONARY, null, function() {
                
                // Funktionen ausführen
                _initDom();
                _setSlider(_indexListbox);
                _bindEvents();
                
                // Fortschritt-Liste anfragen, View einblenden
                Mediator.send(CFG.CNL.VIEW_SHOW)
                        .send(CFG.CNL.TERMS_REQUEST);
            });
        }
    }
    
    /**
     * DOM-Komponenten initialisieren.
     * Initialisiert alle DOM-Elemente des Wörterbuches.
     */
    function _initDom() {
        _$slider      = $(_SEL_SLIDER);
        _$list        = _$slider.find(_SEL_LIST);
        _$listbox     = _$slider.find(_SEL_LISTBOX);
        _$details     = _$slider.find(_SEL_DETAILS);
        _indexDetails = parseInt(_$details.data(_DATA_SLIDE));
        _indexListbox = parseInt(_$listbox.data(_DATA_SLIDE));
    }
    
    /**
     * Slider rendern.
     * Rendert den Wörterbuch-Slider anhand der intern gesetzt Variablen.
     */
    function _renderSlider() {
        _$slider.setMod(_B_SLIDER, _M_IS, _currentSlide);
    }
    
    /**
     * Liste rendern.
     * Rendert die Liste des Wörterbuches anhand eines Mustache-Templates.
     */
    function _renderList() {
        if (_$list instanceof $) {
            Template.render(_$list, _TMPL_LIST, {
                caption  : _listCaption,
                terms    : _listFiltered,
                levels   : CFG.QUIZ.LEVELS,
                size     : _listFiltered.length,
                single   : (_listFiltered.length === 1),
                filtered : (_currentFilter.length > 0),
                empty    : (_listOriginal.length === 0)
            });
        }
    }
    
    /**
     * Begriff-Details rendern.
     * Rendert die Details des aktuellen Begriffs anhand eines
     * Mustache-Templates; bewegt den Wörterbuch-Slider und
     * ändert die Navigation-Bar.
     * @param {Boolean} renderNavBar Navigation rendern
     */
    function _renderDetails(renderNavBar) {
        if ((typeof _currentTerm       === typeof {}) &&
            (typeof _currentTerm.alias !== typeof undefined) &&
            (typeof _currentTerm.term  !== typeof undefined)) {
            
            // Daten definieren
            var data = $.extend({
                levels : CFG.QUIZ.LEVELS,
                label  : CFG.LABEL.PROGRESS
            }, _currentTerm);
            
            // Details laden, Event auslösen, Slider bewegen
            Template.render(_$details, _TMPL_DETAILS, data, function() {
                if (renderNavBar !== false) {
                    Mediator.send(CFG.CNL.NAVBAR_ACTION, {
                        act : CFG.ACT.DICTIONARY_FORWARD,
                        str : CFG.LABEL.DETAILS
                    });
                }
                _$details.scrollTop(0);
                _setSlider(_indexDetails);
            });
        }
    }
    
    /**
     * Liste sortieren.
     * Sortiert die Liste der Begriffe anhand der von einer Mediator-Nachricht
     * übergenen Sortierung und Ordnung; rendert die Liste anschließend.
     * @param {Object} data Übermittelte Daten
     */
    function _sort(data) {

        // Wenn ein Event übergeben wurde, dessen Daten setzen
        if ((typeof data      !== typeof undefined) &&
            (typeof data.sort !== typeof undefined) &&
            (typeof data.ordr !== typeof undefined)) {
            _currentSort = data.sort;
            _currentOrdr = data.ordr;
        }
        
        // Liste sortieren und rendern
        _listFiltered.sort(_compareListItems);
        if (_currentOrdr === CFG.SORTING.ORDR.DESC) {
            _listFiltered.reverse();
        }
        _renderList();
    }
    
    /**
     * Liste filtern.
     * Filtert die Liste anhand des aktuell gesetzten Suchbegriffes
     * oder einem durch eine Mediator-Nachricht übergebenen Suchbegriff;
     * filtert die Original-Liste und kopiert übereinstimmende Einträge
     * in die Filter-Liste; sortiert die Liste anschließend.
     * @param {String} keyword Neuer Suchbegriff
     */
    function _filter(keyword) {
        
        // Filter-Wort gegebenenfalls aktualisieren
        if (typeof keyword === typeof "") {
            _currentFilter = keyword.toLowerCase();
        }
        
        // Wenn Suchbegriff leer ist, Original-Liste setzen
        if (_currentFilter === "") {
            _listFiltered = _listOriginal.slice(0);
        
        // Ansonsten Filter-Liste neu erzeugen
        } else {
            _listFiltered = [];
            var len = _currentFilter.length;
            $.each(_listOriginal, function(i, item) {
                var term  = $.extend({}, item);
                var found = item.term.toLowerCase().indexOf(_currentFilter);
                if (found > -1) {
                    _listFiltered.push($.extend(term, {
                        start     : item.term.substring(0, found),
                        highlight : item.term.substr(found, len),
                        tail      : item.term.substr(found + len)
                    }));
                }
            });
        }
        
        // Liste sortieren
        _sort();
    }
    
    /**
     * Liste aktualisieren.
     * Aktualisiert die Wörterbuch-Liste, sobald ein entsprechendes
     * Event mit den erforderlichen Daten ausgelöst wird.
     * @param {Object} data Daten des Events
     */
    function _update(data) {
        if ((typeof data      !== typeof undefined) &&
            (typeof data.data !== typeof undefined)) {
                
            // Daten zurücksetzen
            var listTemp  = data.data;
            _listCaption  = data.caption;
            _listOriginal = [];
            
            // Liste erweitert und filtern
            $.each(listTemp, function(i, item) {
                if (item.lvl > 0) {
                    $.extend(item, {
                        start     : item.term,
                        highlight : "",
                        tail      : ""
                    });
                    _listOriginal.push(item);
                }
            });
            _filter();
            
            // Details neu rendern
            if (_currentSlide === _indexDetails) {
                _loadDetails(_currentTerm.alias, false);
            }
        }
    }
    
    /**
     * Aktuellen Begriff aktualisieren.
     * Setzt einen neuen aktuellen Begriff anhand eines ausgelösten
     * Klick-Events; sperrt die Begriff-Liste.
     * @param {Object} event Ausgelöstes Event
     */
    function _setDetails(event) {
        if ((typeof event !== typeof undefined) && (!_listIsLocked)) {
            _listIsLocked = true;
            _loadDetails(
                $(event.target).closest(_SEL_ITEM).data(_DATA_TERM)
            );
        }
    }
    
    /**
     * Aktuellen Begriff setzen.
     * Durchsucht die Begriff-Liste nach dem Begriff-Alias und aktualisiert
     * den aktuellen Begriff; rendert die Begriff-Details neu.
     * @param {String} alias Alias des neuen Begriffs
     * @param {Boolean} renderNavBar Navigation-Bar neu rendern
     */
    function _loadDetails(alias, renderNavBar) {
        if (typeof alias !== typeof undefined) {
            
            // Aktuelle Liste iterieren und Begriff setzen
            $.each(_listFiltered, function(i, item) {
                if (item.alias === alias) {
                    _currentTerm = $.extend({}, this);
                    _renderDetails(renderNavBar !== false);             
                    return false;
                }
            });
        }
    }
    
    /**
     * Aktuellen Slide setzen.
     * Aktualisiert den aktiven Slide des Wörterbuch-Sliders; entsperrt
     * die Liste gegebenenfalls und rendert den Slider anschließend neu.
     * @param {Number} slide Nummer des neuen Slides
     */
    function _setSlider(slide) {
        _currentSlide = slide;
        if (_currentSlide === _indexListbox) { _listIsLocked = false; }
        _renderSlider();
    }
    
    /**
     * Zurück zu Liste.
     * Bewegt den Wörterbuch-Slider anhand einer Mediatior-Nachricht
     * zurück zur Wörterbuch-Liste; leert die Begriff-Details.
     * @param {Object} data Übermittelte Daten
     */
    function _back(data) {
        if ((typeof data     !== typeof undefined) &&
            (typeof data.act !== typeof undefined) &&
            (data.act === CFG.ACT.DICTIONARY_BACK)) {
            setTimeout(function() {
                _$details.html("");
            }, CFG.TIME.DELAY);
            _setSlider(_indexListbox);
        }
    }
    
    /**
     * Standard-Konfiguration wiederherstellen.
     * Setzt die internen Variablen und Zustände anhand eines ausgelösten
     * Events wieder auf ihre Standardwerte zurück; filtert die Liste,
     * setzt den Slider zurück und scrollt die Liste nach oben.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _restore(panel) {
        if ((typeof panel    !== typeof undefined) &&
            (CFG.VIEW[panel] === CFG.VIEW.DICTIONARY)) {
                
            // Standardwerte setzen, Liste filtern und scrollen
            _currentFilter = "";
            _$listbox.animate({ scrollTop: 0 }, CFG.TIME.ANIMATION);
            _setSlider(_indexListbox);
            _filter();
        }
    }
    
    /**
     * Listen-Element miteinander vergleichen.
     * Eine Vergleichs-Funktion für Elemente der Begriffliste;
     * wird von der JavaScript-Funktion "sort" verwendet.
     * @param {Objekt} a Erstes zu vergleichende Listen-Objekt
     * @param {Objekt} b Zweites zu vergleichende Listen-Objekt
     * @returns {Number} Ergebnis des Vergleichs
     */
    function _compareListItems(a, b) {
        
        // Sortierung: Numerisch
        if (_currentSort === CFG.SORTING.SORT.NUMERIC) {
            if      (parseInt(a.lvl) < parseInt(b.lvl)) { return -1; }
            else if (parseInt(a.lvl) > parseInt(b.lvl)) { return  1; }
            else { return a.term.localeCompare(b.term); }
            
        // Standard-Sortierung: Alphabetisch
        } else { return a.term.localeCompare(b.term); }
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();