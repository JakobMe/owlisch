/**
 * Erstellt einen Slider auf einem gegebenen Ziel-DOM-Element.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @requires Util
 * @param {Object} $target Ziel-DOM-Element des Sliders
 * @constructor
 */
var Slider = function($target) {
    
    // BEM-Konstanten
    var _B_SLIDER               = "slider";
    var _M_HAS                  = "has";
    var _M_IS                   = "is";
    
    // Sonstige Konstanten
    var _DATA_SLIDE             = "data-slide";
    var _INDEX_MIN              = 1;
    
    // Private Variablen
    var _$slider                = null;
    var _slides                 = 0;
    var _current                = 0;
    
    /**
     * Initialisiert das DOM-Element des Sliders, die Anzahl der vorhandenen
     * Slides, setzt ein Data-Attribut für jedes Slide und setzt den 
     * Slider auf den ersten Slide.
     * @inner
     * @access private
     * @param {Object} $target Ziel-DOM-Element des Sliders
     */
    function _init($target) {
        if ($target instanceof $) {
            _$slider = $target;
            _$slider.children().each(function(i) {
                $(this).attr(_DATA_SLIDE, i + 1);
                _slides++;
            });
            _$slider.setMod(_B_SLIDER, _M_HAS, _slides);
            setSlide(_INDEX_MIN);
        }
    }
    
    /**
     * Setzt den Index des Sliders auf die gegebene Zahl und ändert
     * die Klasse des Slider-DOM-Element entsprechend.
     * @inner
     * @access public
     * @param {Number} index Neuer Index des Sliders
     */
    function setSlide(index) {
        if (_$slider instanceof $) {
            _current = Util.limit(index, _INDEX_MIN, _slides);
            _$slider.setMod(_B_SLIDER, _M_IS, _current);
        }
    }
    
    /**
     * Gibt den aktuellen Slide-Index des Sliders zurück.
     * @inner
     * @access public
     * @returns {Number} Aktueller index
     */
    function getSlide() {
        return _current;
    }
    
    /**
     * Ermittelt den Slide-Index eines Elements innerhalb des Sliders
     * anhand eines gegebenen Query-Selektors, falls das gesuchte Element
     * ein Slide-Element des Sliders ist (ein direktes Kind-Element).
     * @inner
     * @access public
     * @param {String} selector Query-Selektor
     * @returns {(Number|Boolean)} Index des gefundenen Elements oder false
     */
    function getIndexOf(selector) {
        var index = false;
        if (typeof selector === typeof "") {
            var $found = _$slider.children(selector);
            if ($found.length > 0) {
                index = $found.first().attr(_DATA_SLIDE);
                index = (typeof index === typeof undefined ?
                         false : parseInt(index));
            }
        }
        return index;
    }
    
    // Initialisieren
    _init($target);
    
    // Öffentliches Interface
    return {
        setSlide   : setSlide,
        getSlide   : getSlide,
        getIndexOf : getIndexOf
    };
};