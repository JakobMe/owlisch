/**
 * Slider-Modul.
 * Steuert die Funktionalitäten von Slidern.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
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
     * Slider Initialisieren.
     * Initialiert das DOM-Element des Sliders, die Anzahl der vorhandenen
     * Slides, setzt ein Data-Attribut für jedes Slide und setzt den 
     * Slider auf den ersten Slide.
     * @param {Object} $target Ziel-DOM-Element des Sliders.
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
     * Slider setzen.
     * Setzt den Index des Sliders auf die gegebene Zahl.
     * @param {Number} index Neuer Index des Sliders
     */
    function setSlide(index) {
        if (_$slider instanceof $) {
            _current = Util.limit(index, _INDEX_MIN, _slides);
            _$slider.setMod(_B_SLIDER, _M_IS, _current);
        }
    }
    
    /**
     * Aktuellen Index ermitteln.
     * Gibt den aktuellen Slider-Index zurück.
     * @returns {Number} Aktueller index
     */
    function getSlide() {
        return _current;
    }
    
    // Initialisieren
    _init($target);
    
    // Öffentliches Interface
    return {
        setSlide : setSlide,
        getSlide : getSlide
    };
};