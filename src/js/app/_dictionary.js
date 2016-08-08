/**
 * Steuert die Wörterbuch-View der App; erstellt die Liste der Begriffe
 * per Template und fügt sie ein, ermöglicht das Sortieren und Filtern der
 * Liste und das Anzeigen von Details für gewählte Begriffe.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @requires Util
 * @requires Mediator
 * @requires Template
 * @module Dictionary
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
    
    // Data-Attribut-Konstanten
    var _DATA_TERM              = "term";
    
    // Private Variablen
    var _listOriginal           = [];
    var _listFiltered           = [];
    var _listCaption            = "";
    var _currentFilter          = "";
    var _currentSort            = CFG.SORTING.SORT.ALPHA;
    var _currentOrdr            = CFG.SORTING.ORDR.ASC;
    var _currentTerm            = {};
    var _indexListbox           = 0;
    var _indexDetails           = 0;
    var _listIsLocked           = false;
    var _slider                 = null;
    
    // DOM-Elemente
    var _$dictionary            = null;
    var _$list                  = null;
    var _$listbox               = null;
    var _$details               = null;
    
    /**
     * Initialisiert das Dictionary-Modul; abonniert den Mediator.
     * @access public
     * @function init
     */
    function init() {
        _subMediator();
    }
    
    /**
     * Bindet Funktionen an Events.
     * @access private
     * @function _bindEvents
     */
    function _bindEvents() {
        if (_$list instanceof $) {
            _$list.on(CFG.EVT.CLICK, _SEL_ITEM, _setDetails);
        }
    }

    /**
     * Abonniert interne Funktionen beim Mediator.
     * @access private
     * @function _subMediator
     */
    function _subMediator() {
        Mediator.sub(CFG.CNL.VIEW_LOAD, _create)
                .sub(CFG.CNL.VIEW_RESTORE, _restore)
                .sub(CFG.CNL.TERMS_SERVE, _update)
                .sub(CFG.CNL.DICTIONARY_SEARCH, _filter)
                .sub(CFG.CNL.DICTIONARY_SORT, _sort)
                .sub(CFG.CNL.NAVBAR_ACTION, _back);
    }
    
    /**
     * Generiert bei einer Mediator-Nachricht mit dem Dictionary-Panel als
     * Daten die Inhalte des Wörterbuches; initialisiert alle DOM-Elemente
     * des Moduls, bindet Events, blendet die View wieder ein und fragt
     * per Mediator benötigte Daten vom Data-Modul an.
     * @access private
     * @param {Object} data Übermittelte Mediator-Daten
     * @function _create
     */
    function _create(data) {
        if ((typeof data !== typeof undefined) &&
            (CFG.VIEW[data.panel] === CFG.VIEW.DICTIONARY) &&
            (data.target instanceof $)) {
            Template.render(data.target, _TMPL_DICTIONARY, null, function() {
                
                // Funktionen ausführen
                _initDom();
                _bindEvents();
                _slider.setSlide(_indexListbox);
                
                // Fortschritt-Liste anfragen, View einblenden
                Mediator.pub(CFG.CNL.VIEW_SHOW)
                        .pub(CFG.CNL.TERMS_REQUEST);
            });
        }
    }
    
    /**
     * Initialisiert alle DOM-Elemente des Wörterbuches.
     * @access private
     * @function _initDom
     */
    function _initDom() {
        _$dictionary  = $(_SEL_SLIDER);
        _slider       = new Slider(_$dictionary);
        _$list        = _$dictionary.find(_SEL_LIST);
        _$listbox     = _$dictionary.find(_SEL_LISTBOX);
        _$details     = _$dictionary.find(_SEL_DETAILS);
        _indexDetails = _slider.getIndexOf(_SEL_DETAILS);
        _indexListbox = _slider.getIndexOf(_SEL_LISTBOX);
    }
    
    /**
     * Rendert die Liste des Wörterbuches anhand eines Mustache-Templates
     * und der aktuell im Modul gesetzt Wörterbuch-Daten.
     * @access private
     * @function _renderList
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
     * Rendert die Details des aktuellen Begriffs anhand eines
     * Mustache-Templates; bewegt den Wörterbuch-Slider und
     * ändert gegebenenfalls die Navigation-Bar.
     * @access private
     * @param {Boolean} renderNavBar Navigation-Bar neu rendern?
     * @function _renderDetails
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
                    Mediator.pub(CFG.CNL.NAVBAR_ACTION, {
                        act : CFG.ACT.DICTIONARY_FORWARD,
                        str : CFG.LABEL.DETAILS
                    });
                }
                _$details.scrollTop(0);
                _slider.setSlide(_indexDetails);
            });
        }
    }
    
    /**
     * Sortiert die Liste der Begriffe anhand der von einer Mediator-Nachricht
     * übergebenen Sortierung und Ordnung; rendert die Liste anschließend neu.
     * @access private
     * @param {Object} data Übermittelte Daten
     * @function _sort
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
     * Filtert die Liste anhand des aktuell gesetzten Suchbegriffes
     * oder einem durch eine Mediator-Nachricht übergebenen Suchbegriff;
     * filtert die Original-Liste und kopiert übereinstimmende Einträge
     * in die Filter-Liste; sortiert die Liste anschließend.
     * @access private
     * @param {String} [keyword] Neuer Suchbegriff
     * @function _filter
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
     * Aktualisiert die Wörterbuch-Liste, sobald eine entsprechende
     * Mediator-Nachricht mit den erforderlichen Daten empfangen wird.
     * @access private
     * @param {Object} data Übermittelte Daten
     * @function _update
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
            if ((_slider !== null) &&
                (_slider.getSlide() === _indexDetails)) {
                _loadDetails(_currentTerm.alias, false);
            }
        }
    }
    
    /**
     * Setzt einen neuen aktuellen Begriff anhand eines ausgelösten
     * Klick-Events; sperrt die Begriff-Liste und lädt und rendert den
     * neuen Begriff mittels _setDetails.
     * @access private
     * @param {Object} event Ausgelöstes Klick-Event
     * @function _setDetails
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
     * Durchsucht die Begriff-Liste nach dem gegebenen Begriff-Alias und
     * aktualisiert den aktuellen Begriff; rendert die Begriff-Details neu.
     * @access private
     * @param {String} alias Alias des neuen Begriffs
     * @param {Boolean} [renderNavBar] Navigation-Bar neu rendern?
     * @function _loadDetails
     */
    function _loadDetails(alias, renderNavBar) {
        if (typeof alias !== typeof undefined) {
            _currentTerm = Util.findTerm(_listFiltered, alias);
            _renderDetails(renderNavBar !== false);  
        }
    }
    
    /**
     * Bewegt den Wörterbuch-Slider anhand einer Mediatior-Nachricht
     * zurück zur Wörterbuch-Liste; leert die Begriff-Details.
     * @access private
     * @param {Object} data Übermittelte Mediator-Daten
     * @function _back
     */
    function _back(data) {
        if ((typeof data     !== typeof undefined) &&
            (typeof data.act !== typeof undefined) &&
            (data.act === CFG.ACT.DICTIONARY_BACK)) {
            setTimeout(function() {
                _$details.html("");
            }, CFG.TIME.DELAY);
            _slider.setSlide(_indexListbox);
            _listIsLocked = false;
        }
    }
    
    /**
     * Setzt die internen Variablen und Zustände anhand einer
     * Mediator-Nachricht wieder auf ihre Standardwerte zurück; filtert die
     * Liste mit einem leeren Suchbegriff, setzt den Slider zur Liste zurück
     * und scrollt die Liste nach oben.
     * @access private
     * @param {Object} panel Übermitteltes Panel-Objekt
     * @function _restore
     */
    function _restore(panel) {
        if ((typeof panel    !== typeof undefined) &&
            (CFG.VIEW[panel] === CFG.VIEW.DICTIONARY)) {
                
            // Standardwerte setzen, Liste filtern und scrollen
            _currentFilter = "";
            _$listbox.animate({ scrollTop: 0 }, CFG.TIME.ANIMATION);
            _slider.setSlide(_indexListbox);
            _listIsLocked = false;
            _filter();
        }
    }
    
    /**
     * Eine Vergleichs-Funktion für Elemente der Begriffliste;
     * wird von der JavaScript-Funktion "sort" verwendet.
     * @access private
     * @param {Objekt} a Erstes zu vergleichende Listen-Objekt
     * @param {Objekt} b Zweites zu vergleichende Listen-Objekt
     * @returns {Number} Ergebnis des Vergleichs
     * @function _compareListItems
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