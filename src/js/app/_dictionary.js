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
    var _SEL_ITEM               = "[role='listitem']";
    var _SEL_SLIDER             = "#dictionary-slider";
    var _SEL_LISTBOX            = "#dictionary-listbox";
    var _SEL_LIST               = "#dictionary-list";
    var _SEL_DETAILS            = "#dictionary-details";
    var _SEL_TMPL_DICTIONARY    = "#tmpl-dictionary";
    var _SEL_TMPL_LIST          = "#tmpl-dictionary-list";
    var _SEL_TMPL_DETAILS       = "#tmpl-dictionary-details";
    
    // BEM-Konstanten
    var _B_SLIDER               = "slider";
    var _M_IS                   = "is";
    
    // Data-Attribut-Konstanten
    var _DATA_TERM              = "term";
    var _DATA_SLIDE             = "slide";
    
    // Private Variablen
    var _listOriginal           = [];
    var _listFiltered           = [];
    var _listCaption            = CFG.STR.EMPTY;
    var _currentFilter          = CFG.STR.EMPTY;
    var _currentSort            = CFG.SORTING.SORT.ALPHA;
    var _currentOrder           = CFG.SORTING.ORDER.ASC;
    var _currentTerm            = {};
    var _currentSlide           = 0;
    var _indexListbox           = 0;
    var _indexDetails           = 0;
    var _listIsLocked           = false;
    
    // Templates
    var _tmplDictionary         = $(_SEL_TMPL_DICTIONARY).html();
    var _tmplTermlist           = $(_SEL_TMPL_LIST).html();
    var _tmplTermdetails        = $(_SEL_TMPL_DETAILS).html();
    
    // DOM-Elemente
    var _$slider                = null;
    var _$list                  = null;
    var _$listbox               = null;
    var _$details               = null;
    
    /**
     * Wörterbuch initialisieren.
     * Parst alle benötigten Templates und startet Funktionen,
     * um den Anfangszustand des Wörterbuches herzustellen.
     */
    function init() {
        _parseTemplates();
        _bindEvents();
    }
    
    /**
     * Templates parsen.
     * Übergibt die Templates dieses Moduls an Mustache, um sie zu parsen.
     */
    function _parseTemplates() {
        Mustache.parse(_tmplDictionary);
        Mustache.parse(_tmplTermlist);
        Mustache.parse(_tmplTermdetails);
    }
    
    /**
     * Wörterbuch initialisieren.
     * Initialisiert die DOM-Elemente und internen Variablen
     * des Wörterbuch-Moduls, sobald sie bereitstehen.
     */
    function _initDictionary() {
        
        // Modulvariablen initialisieren
        _$slider      = $(_SEL_SLIDER);
        _$list        = _$slider.find(_SEL_LIST);
        _$listbox     = _$slider.find(_SEL_LISTBOX);
        _$details     = _$slider.find(_SEL_DETAILS);
        _indexDetails = parseInt(_$details.data(_DATA_SLIDE));
        _indexListbox = parseInt(_$listbox.data(_DATA_SLIDE));
        
        // Funktionen ausführen
        _setCurrentSlide(_indexListbox);
        _bindClickEvents();
        
        // Fortschritt-Liste anfragen, View einblenden
        $(window).trigger(CFG.EVT.REQUEST_TERMS);
        $(window).trigger(CFG.EVT.SHOW_VIEW);
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        $(window).on(CFG.EVT.LOAD_PANEL_CONTENT, _createDictionary);
        $(window).on(CFG.EVT.SERVE_TERMS, _updateList);
        $(window).on(CFG.EVT.SORTED_LIST, _sortList);
        $(window).on(CFG.EVT.SEARCHED_LIST, _filterList);
        $(window).on(CFG.EVT.PRESSED_BUTTON, _backToList);
        $(window).on(CFG.EVT.RESTORE_DEFAULT, _restoreDefault);
    }
    
    /**
     * Klick-Events binden.
     * Bindet Klick-Funktionen an interne jQuery-Objekte.
     */
    function _bindClickEvents() {
        if (_$list instanceof $) {
            _$list.on(CFG.EVT.CLICK, _SEL_ITEM, _updateCurrentTerm);
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
        if ((typeof data          !== typeof undefined) &&
            (CFG.VIEW[data.panel] === CFG.VIEW.DICTIONARY) &&
            (data.target instanceof $)) {

            // Template füllen, Callback ausführen
            data.target.html(Mustache.render(_tmplDictionary))
                .promise().done(function() { _initDictionary(); });
        }
    }
    
    /**
     * Listen-Element miteinander vergleichen.
     * Eine Vergleichs-Funktion für Elemente der Begriffliste;
     * wird von der JavaScript-Funktion "sort" verwendet.
     * @param {Objekt} a Erstes zu vergleichende Listen-Objekt
     * @param {Objekt} b Zweites zu vergleichende Listen-Objekt
     * @returns {integer} Ergebnis des Vergleichs
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
    
    /**
     * Liste sortieren.
     * Sortiert die Liste der Begriffe anhand der von einem Event
     * übergenen Sortierung und Ordnung; rendert die Liste anschließend.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _sortList(event, data) {

        // Wenn ein Event übergeben wurde, dessen Daten setzen
        if ((typeof data       !== typeof undefined) &&
            (typeof data.sort  !== typeof undefined) &&
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
        if ((typeof data        !== typeof undefined) &&
            (typeof data.search === typeof CFG.STR.EMPTY)) {
            _currentFilter = data.search.toLowerCase();
        }
        
        // Wenn Suchbegriff leer ist, Original-Liste setzen
        if (_currentFilter === CFG.STR.EMPTY) {
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
                        highlight : CFG.STR.EMPTY,
                        tail      : CFG.STR.EMPTY
                    });
                    _listOriginal.push(item);
                }
            });
            _filterList();
            
            // Details neu rendern
            if (_currentSlide === _indexDetails) {
                _setCurrentTerm(_currentTerm.alias, false);
            }
        }
    }
    
    /**
     * Liste rendern.
     * Rendert die Liste des Wörterbuches anhand eines Mustache-Templates.
     */
    function _renderList() {
        if (_$list instanceof $) {
            _$list.html(
                Mustache.render(_tmplTermlist, {
                    caption  : _listCaption,
                    terms    : _listFiltered,
                    levels   : CFG.QUIZ.LEVELS,
                    size     : _listFiltered.length,
                    single   : (_listFiltered.length === 1),
                    filtered : (_currentFilter.length > 0)
                })
            );
        }
    }
    
    /**
     * Aktuellen Begriff aktualisieren.
     * Setzt einen neuen aktuellen Begriff anhand eines ausgelösten
     * Klick-Events; sperrt die Begriff-Liste.
     * @param {Object} event Ausgelöstes Event
     */
    function _updateCurrentTerm(event) {
        if ((typeof event !== typeof undefined) && (!_listIsLocked)) {
            
            // Liste sperren und Begriff setzen
            _listIsLocked = true;
            _setCurrentTerm(
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
    function _setCurrentTerm(alias, renderNavBar) {
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
    function _setCurrentSlide(slide) {
        _currentSlide = slide;
        if (_currentSlide === _indexListbox) { _listIsLocked = false; }
        _renderSlider();
    }
    
    /**
     * Slider rendern.
     * Rendert den Wörterbuch-Slider anhand der intern gesetzt Variablen.
     */
    function _renderSlider() {
        _$slider.setMod(_B_SLIDER, _M_IS, _currentSlide);
    }
    
    /**
     * Zurück zu Liste.
     * Reagiert auf ein Navigation-Bar Event; verschiebt den Slider
     * zurück zur Wörterbuch-Liste, wenn das Event passend ist.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _backToList(event, data) {
        if ((typeof data        !== typeof undefined) &&
            (typeof data.action !== typeof undefined) &&
            (data.action === CFG.ACT.DICTIONARY_BACK)) {
            _setCurrentSlide(_indexListbox);
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
            
            // Inhalte einfügen
            _$details.html(Mustache.render(_tmplTermdetails, data))
                     .promise().done(function() {
                
                // Event für Navigation-Bar auslösen
                if (renderNavBar !== false) {
                    $(window).trigger(CFG.EVT.PRESSED_BUTTON, {
                        action : CFG.ACT.DICTIONARY_FORWARD,
                        text   : _currentTerm.term
                    });
                }
                    
                // Details scrollen, Slider verschieben
                _$details.scrollTop(0);
                _setCurrentSlide(_indexDetails);
            });
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
    function _restoreDefault(event, data) {
        if ((typeof data         !== typeof undefined) &&
            (typeof data.panel   !== typeof undefined) &&
            (CFG.VIEW[data.panel] === CFG.VIEW.DICTIONARY)) {
                
            // Standardwerte setzen, Liste filtern und scrollen
            _currentFilter = CFG.STR.EMPTY;
            _$listbox.animate({ scrollTop: 0 }, CFG.TIME.ANIMATION);
            _setCurrentSlide(_indexListbox);
            _filterList();
        }
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();