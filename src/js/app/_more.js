/**
 * More-Modul.
 * Steuert weitere Optionen der App.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var More = (function() {
    
    // Selektor-Konstanten
    var _SEL_LISTBOX            = "[data-more='listbox']";
    var _SEL_ITEM               = "[data-more='item']";
    var _SEL_OPTION             = "[data-more='option']";
    var _SEL_SLIDER             = "[data-more='slider']";
    var _SEL_LABEL              = "[data-more='label']";
    
    // Template-Namen
    var _TMPL_DELIMITER         = "-";
    var _TMPL_MORE              = "more";

    // Data-Attribut-Konstanten
    var _DATA_OPTION            = "option";
    
    // Private Variablen
    var _slider                 = null;
    var _listIsLocked           = false;
    var _indexListbox           = 0;
    var _indexOption            = 0;
    var _currentOption          = {};
    var _data                   = {};
    
    // DOM-Elemente
    var _$more                  = null;
    var _$items                 = null;
    var _$listbox               = null;
    var _$option                = null;
    
    /**
     * Weitere Optionen initialisieren.
     * Führt Funktionen aus, um den Ausgangszustand
     * der weiteren Optionen herzustellen.
     */
    function init() {
        _hookMediator();
    }
    
    /**
     * Mediator abonnieren.
     * Meldet Funktionen beim Mediator an.
     */
    function _hookMediator() {
        Mediator.hook(CFG.CNL.VIEW_LOAD, _create)
                .hook(CFG.CNL.VIEW_RESTORE, _restore)
                .hook(CFG.CNL.NAVBAR_ACTION, _back)
                .hook(CFG.CNL.TERMS_SERVE, _updateTerms)
                .hook(CFG.CNL.DICTIONARY_SERVE, _updateDictionary);
    }
    
    /**
     * DOM-Komponenten initialisieren.
     * Initialisiert alle DOM-Elemente des Moduls.
     */
    function _initDom() {
        _$more        = $(_SEL_SLIDER);
        _slider       = new Slider(_$more);
        _$items       = _$more.find(_SEL_ITEM);
        _$listbox     = _$more.find(_SEL_LISTBOX);
        _$option      = _$more.find(_SEL_OPTION);
        _indexOption  = _slider.getIndexOf(_SEL_OPTION);
        _indexListbox = _slider.getIndexOf(_SEL_LISTBOX);
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events.
     */
    function _bindEvents() {
        _$items.on(CFG.EVT.CLICK, _setOption);
    }
    
    /**
     * Weitere Optionen erzeugen.
     * Initialisiert alle DOM-Elemente und Event-Bindings des Moduls,
     * fügt den Inhalt per Template ein.
     * @param {Object} data Übergebene Daten des Mediators
     */
    function _create(data) {
        if ((typeof data !== typeof undefined) &&
            (CFG.VIEW[data.panel] === CFG.VIEW.MORE) &&
            (data.target instanceof $)) {
            
            // Optionen ermitteln
            var options = { size: 0, list: [] };
            $.each(CFG.OPTIONS, function(option, label) {
                options.size++;
                options.list.push({
                    option : option.toLowerCase(),
                    label  : label
                });
            });
            
            // Inhalte per Template einfügen
            Template.render(data.target, _TMPL_MORE, options, function() {
                
                // Funktionen ausführen
                _initDom();
                _bindEvents();
                _slider.setSlide(_indexListbox);
                
                // Wörterbuch-Daten anfragen, View einblenden
                Mediator.send(CFG.CNL.VIEW_SHOW)
                        .send(CFG.CNL.TERMS_REQUEST)
                        .send(CFG.CNL.DICTIONARY_REQUEST);
            });
        }
    }
    
    /**
     * Aktuelle Option setzen.
     * Setzt eine neue Option anhand eines ausgelösten Klick-Events;
     * sperrt die Begriff-Liste, setzt die Daten der Option und rendert neu.
     * @param {Object} event Ausgelöstes Event
     */
    function _setOption(event) {
        if ((typeof event !== typeof undefined) && (!_listIsLocked)) {
            var $selected  = $(event.target).closest(_SEL_ITEM);
            _listIsLocked  = true;
            _currentOption = {
                option : $selected.data(_DATA_OPTION),
                label  : $selected.find(_SEL_LABEL).text()
            };
            _renderOption();
        }
    }
    
    /**
     * Option rendern.
     * Rendert die Details der aktuellen Option anhand eines Mustache-
     * Templates; bewegt den Mehr-Slider und ändert die Navigation-Bar.
     * @param {Boolean} renderNavBar Navigation rendern
     */
    function _renderOption(renderNavBar) {
        var tmpl = _TMPL_MORE + _TMPL_DELIMITER + _currentOption.option;
        Template.render(_$option, tmpl, _data, function() {
            if (renderNavBar !== false) {
                Mediator.send(CFG.CNL.NAVBAR_ACTION, {
                    act : CFG.ACT.MORE_FORWARD,
                    str : _currentOption.label
                });
            }
            _$option.scrollTop(0);
            _slider.setSlide(_indexOption);
        });
    }
    
    /**
     * Zurück zur Liste.
     * Bewegt den Mehr-Slider anhand einer Mediatior-Nachricht
     * zurück zur Mehr-Liste; leert die Mehr-Details.
     * @param {Object} data Übermittelte Daten
     */
    function _back(data) {
        if ((typeof data     !== typeof undefined) &&
            (typeof data.act !== typeof undefined) &&
            (data.act === CFG.ACT.MORE_BACK)) {
            setTimeout(function() {
                _$option.html("");
            }, CFG.TIME.DELAY);
            _slider.setSlide(_indexListbox);
            _listIsLocked = false;
        }
    }
    
    /**
     * Begriff-Daten aktualisieren.
     * Aktualisiert die interne Kopie der Begriff-Daten;
     * rendert gegebenenfalls die aktuell angezeigte Option neu.
     * @param {Object} data Daten des Events
     */
    function _updateTerms(data) {
        if (typeof data !== typeof undefined) {
            _data.terms = $.extend({}, data);
            _data.terms.single = (_data.terms.solved === 1);
            if ((_slider !== null) &&
                (_slider.getSlide() === _indexOption)) {
                _renderOption(false);
            }
        }
    }
    
    /**
     * Wörterbuch-Daten aktualisieren.
     * Aktualisiert die interne Kopie der Wörterbuch-Daten;
     * rendert gegebenenfalls die aktuell angezeigte Option neu.
     * @param {Object} data Daten des Events
     */
    function _updateDictionary(data) {
        if (typeof data !== typeof undefined) {
            _data.dictionary = $.extend({}, data);
            if ((_slider !== null) &&
                (_slider.getSlide() === _indexOption)) {
                _renderOption(false);
            }
        }
    }
    
    /**
     * Standard-Konfiguration wiederherstellen.
     * Bewegt den Slider zurück auf die Liste und scrollt sie nach oben.
     * @param {String} panel Ziel-Panel des Events
     */
    function _restore(panel) {
        if ((typeof panel    !== typeof undefined) &&
            (CFG.VIEW[panel] === CFG.VIEW.MORE)) {
            _$listbox.animate({ scrollTop: 0 }, CFG.TIME.ANIMATION);
            _slider.setSlide(_indexListbox);
            _listIsLocked = false;
        }
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();