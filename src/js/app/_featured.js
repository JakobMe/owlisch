/**
 * Featured-Modul.
 * Steuert das Wort des Tages der App.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var Featured = (function() {
    
    // Private Variablen
    var _dataTerms              = [];
    var _dataFeatured           = "";
    
    // DOM-Elemente
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
     * Erzeugt das Wort des Tages anhand eines Mediator-Events; fügt den
     * Inhalt mittels Template ein, initialisiert die Elemente des
     * Moduls und teilt dem Mediator weitere Events mit.
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
     * Begriff-Daten aktualisieren.
     * Aktualisiert die Begriff-Liste, sobald ein entsprechendes
     * Mediator-Event mit den erforderlichen Daten ausgelöst wird.
     * @param {Object} data Übergebene Daten
     */
    function _updateTerms(data) {
        if ((typeof data        !== typeof undefined) &&
            (typeof data.data   !== typeof undefined)) {  
            _dataTerms  = data.data;
        }
    }
    
    /**
     * Wort des Tages aktualisieren.
     * Aktualisiert den Begriff-Alias des Wort des Tages, sobald ein
     * entsprechendes Mediator-Event mit den erforderlichen
     * Daten ausgelöst wird.
     * @param {String} data Übergebene Daten
     */
    function _updateFeatured(data) {
        if (typeof data === typeof "") {  
            _dataFeatured = data;
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
            (CFG.VIEW[panel] === CFG.VIEW.FEATURED)) {
            _$featured.animate({ scrollTop: 0 }, CFG.TIME.ANIMATION);
        }
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();