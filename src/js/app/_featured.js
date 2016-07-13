/**
 * Featured-Modul.
 * Steuert das Wort des Tages der App.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var Featured = (function() {
    
    // Template-Namen
    var _TMPL_DETAILS           = "dictionary-details";
    
    // Private Variablen
    var _dataFeatured           = "";
    var _dataTerms              = [];
    var _$featured              = null;
    
    /**
     * Wort des Tages initialisieren.
     * Führt Funktionen aus, um den Ausgangszustand
     * des Wort des Tages herzustellen.
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
                .hook(CFG.CNL.TERMS_SERVE, _updateTerms)
                .hook(CFG.CNL.FEATURED_SERVE, _updateFeatured);
    }
    
    /**
     * Wort des Tages erzeugen.
     * Erzeugt das Wort des Tages anhand eines Mediator-Events; sendet
     * Anfragen für benötigte Daten über den Mediator und initialisiert
     * benötigte DOM-Elemente.
     * @param {Object} data Übergebene Daten des Mediators
     */
    function _create(data) {
        if ((typeof data !== typeof undefined) &&
            (CFG.VIEW[data.panel] === CFG.VIEW.FEATURED) &&
            (data.target instanceof $)) {
            
            // Modulvariablen initialisieren, Mediator aufrufen
            _$featured = data.target;
            Mediator.send(CFG.CNL.VIEW_SHOW)
                    .send(CFG.CNL.TERMS_REQUEST)
                    .send(CFG.CNL.FEATURED_REQUEST);
        }
    }
    
    /**
     * Begriff des Tages rendern.
     * Rendert den aktuellen Begriff mittels Mustache-Template,
     * falls alle benötigten Daten vorhanden sind.
     */
    function _render() {
        if ((_$featured instanceof $) &&
            (_dataFeatured.length > 0) &&
            (_dataTerms.length > 0)) {
            
            // Daten definieren
            var data = $.extend({
                levels : CFG.QUIZ.LEVELS,
                label  : CFG.LABEL.PROGRESS
            }, Util.findTerm(_dataTerms, _dataFeatured));
            
            // Details laden, Event auslösen, Slider bewegen
            Template.render(_$featured, _TMPL_DETAILS, data);
        }
    }
    
    /**
     * Begriff-Daten aktualisieren.
     * Aktualisiert die Begriff-Liste, sobald ein entsprechendes
     * Mediator-Event mit den erforderlichen Daten ausgelöst wird;
     * rendert den Begriff neu.
     * @param {Object} data Übergebene Daten
     */
    function _updateTerms(data) {
        if ((typeof data        !== typeof undefined) &&
            (typeof data.data   !== typeof undefined)) {  
            _dataTerms  = data.data;
            _render();
        }
    }
    
    /**
     * Wort des Tages aktualisieren.
     * Aktualisiert den Begriff-Alias des Wort des Tages, sobald ein
     * entsprechendes Mediator-Event mit den erforderlichen
     * Daten ausgelöst wird; rendert den Begriff neu.
     * @param {String} data Übergebene Daten
     */
    function _updateFeatured(data) {
        if (typeof data === typeof "") {  
            _dataFeatured = data;
            _render();
        }
    }
    
    /**
     * Standard-Konfiguration wiederherstellen.
     * Scrollt das Wort des Tages nach oben, wenn ein
     * entsprechendes Mediator-Event ausgelöst wird.
     * @param {String} panel Ziel-Panel des Events
     */
    function _restore(panel) {
        if ((typeof panel    !== typeof undefined) &&
            (CFG.VIEW[panel] === CFG.VIEW.FEATURED) &&
            (_$featured instanceof $)) {
            _$featured.animate({ scrollTop: 0 }, CFG.TIME.ANIMATION);
        }
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();