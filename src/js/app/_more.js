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
    
    // BEM-Konstanten
    var _B_SLIDER               = "slider";
    var _M_IS                   = "is";
    
    // Data-Attribut-Konstanten
    var _DATA_OPTION            = "option";
    var _DATA_SLIDE             = "slide";
    
    // Private Variablen
    var _listIsLocked           = false;
    var _indexListbox           = 0;
    var _indexOption            = 0;
    var _currentSlide           = 0;
    var _currentOption          = {};
    
    // DOM-Elemente
    var _$more                  = null;
    var _$items                 = null;
    var _$listbox               = null;
    var _$slider                = null;
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
                .hook(CFG.CNL.NAVBAR_ACTION, _back);
    }
    
    /**
     * DOM-Komponenten initialisieren.
     * Initialisiert alle DOM-Elemente des Moduls.
     */
    function _initDom() {
        if (_$more instanceof $) {
            _$items       = _$more.find(_SEL_ITEM);
            _$listbox     = _$more.find(_SEL_LISTBOX);
            _$slider      = _$more.find(_SEL_SLIDER);
            _$option      = _$more.find(_SEL_OPTION);
            _indexOption  = parseInt(_$option.data(_DATA_SLIDE));
            _indexListbox = parseInt(_$listbox.data(_DATA_SLIDE));
        }
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
            
            // Inhalte per Template einfügen, DOM-Elemente initialisieren
            _$more = data.target;
            Template.render(_$more, _TMPL_MORE, options, function() {
                
                // Funktionen ausführen
                _initDom();
                _setSlider(_indexListbox);
                _bindEvents();
                
                // Wörterbuch-Daten anfragen, View einblenden
                Mediator.send(CFG.CNL.VIEW_SHOW);
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
        Template.render(_$option, tmpl, {}, function() {
            if (renderNavBar !== false) {
                Mediator.send(CFG.CNL.NAVBAR_ACTION, {
                    act : CFG.ACT.MORE_FORWARD,
                    str : _currentOption.label
                });
            }
            _$option.scrollTop(0);
            _setSlider(_indexOption);
        });
    }
    
    /**
     * Aktuellen Slide setzen.
     * Aktualisiert den aktiven Slide des Mehr-Sliders; entsperrt
     * die Liste gegebenenfalls und rendert den Slider anschließend neu.
     * @param {Number} slide Nummer des neuen Slides
     */
    function _setSlider(slide) {
        _currentSlide = slide;
        if (_currentSlide === _indexListbox) { _listIsLocked = false; }
        _$slider.setMod(_B_SLIDER, _M_IS, _currentSlide);
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
            _setSlider(_indexListbox);
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
            _setSlider(_indexListbox);
        }
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();