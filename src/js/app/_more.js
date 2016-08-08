/**
 * Steuert die Liste der Optionen in der Mehr-View; erzeugt die Liste
 * anhand der globalen Konfiguration, initialisiert den Slider des Moduls
 * und ermöglicht es, für jede Option die entsprechende Detail-Ansicht zu laden.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence MIT
 * @requires Mediator
 * @requires Template
 * @module More
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
     * Initialisiert das More-Modul; abonniert den Mediator.
     * @access public
     * @function init
     */
    function init() {
        _subMediator();
    }
    
    /**
     * Abonniert interne Funktionen beim Mediator.
     * @access private
     * @function _subMediator
     */
    function _subMediator() {
        Mediator.sub(CFG.CNL.VIEW_LOAD, _create)
                .sub(CFG.CNL.VIEW_RESTORE, _restore)
                .sub(CFG.CNL.NAVBAR_ACTION, _back)
                .sub(CFG.CNL.TERMS_SERVE, _updateTerms)
                .sub(CFG.CNL.DICTIONARY_SERVE, _updateDictionary);
    }
    
    /**
     * Initialisiert alle DOM-Elemente des More-Moduls.
     * @access private
     * @function _initDom
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
     * Bindet Funktionen an Events.
     * @access private
     * @function _bindEvents
     */
    function _bindEvents() {
        _$items.on(CFG.EVT.CLICK, _setOption);
    }
    
    /**
     * Generiert bei einer Mediator-Nachricht mit dem More-Panel als
     * Daten die Inhalte der Options-Liste; initialisiert alle DOM-Elemente
     * des Moduls, bindet Events, blendet die View wieder ein und fragt
     * per Mediator benötigte Daten vom Data-Modul an.
     * @access private
     * @param {Object} data Übermittelte Mediator-Daten
     * @function _create
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
                Mediator.pub(CFG.CNL.VIEW_SHOW)
                        .pub(CFG.CNL.TERMS_REQUEST)
                        .pub(CFG.CNL.DICTIONARY_REQUEST);
            });
        }
    }
    
    /**
     * Setzt bei einem Klick-Event die aktuell gewählte Option und rendert
     * die Detail-Ansicht für diese Option.
     * @access private
     * @param {Object} event Ausgelöstes Event
     * @function _setOption
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
     * Rendert die Detail-Ansicht der aktuell gewählten Option; fügt die
     * Inhalte per Template in die App ein, bewegt den Slider des Moduls und
     * sendet gegebenenfalls eine Mediator-Nachricht an die Navigation-Bar.
     * @access private
     * @param {Boolean} [renderNavBar] Navigation neu rendern?
     * @function _renderOption
     */
    function _renderOption(renderNavBar) {
        var tmpl = _TMPL_MORE + _TMPL_DELIMITER + _currentOption.option;
        Template.render(_$option, tmpl, _data, function() {
            if (renderNavBar !== false) {
                Mediator.pub(CFG.CNL.NAVBAR_ACTION, {
                    act : CFG.ACT.MORE_FORWARD,
                    str : _currentOption.label
                });
            }
            _$option.scrollTop(0);
            _slider.setSlide(_indexOption);
        });
    }
    
    /**
     * Bewegt den Options-Slider anhand einer Mediatior-Nachricht
     * zurück zur Options-Liste; leert die Options-Details.
     * @access private
     * @param {Object} data Übermittelte Mediator-Daten
     * @function _back
     */
    function _back(data) {
        if ((typeof data !== typeof undefined) &&
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
     * Aktualisiert anhand einer Mediator-Nachricht die interne Kopie der
     * Begriff-Daten; rendert gegebenenfalls die aktuelle Ansicht neu.
     * @access private
     * @param {Object} data Übermittelte Mediator-Daten
     * @function _updateTerms
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
     * Aktualisiert anhand einer Mediator-Nachricht die interne Kopie der
     * Wörterbuch-Daten; rendert gegebenenfalls die aktuelle Ansicht neu.
     * @access private
     * @param {Object} data Übermittelte Mediator-Daten
     * @function _updateDictionary
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
     * Setzt die internen Variablen und Zustände anhand einer
     * Mediator-Nachricht wieder auf ihre Standardwerte zurück; setzt den
     * Slider zur Liste zurück und scrollt sie nach oben.
     * und scrollt die Liste nach oben.
     * @access private
     * @param {Object} panel Übermitteltes Panel-Objekt
     * @function _restore
     */
    function _restore(panel) {
        if ((typeof panel !== typeof undefined) &&
            (CFG.VIEW[panel] === CFG.VIEW.MORE)) {
            _$listbox.animate({ scrollTop: 0 }, CFG.TIME.ANIMATION);
            _slider.setSlide(_indexListbox);
            _listIsLocked = false;
        }
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();