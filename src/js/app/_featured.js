/**
 * Steuert die Start-View der App; zeigt beim Start der App den Begriff des
 * Tages an, indem dieser zunächst per Mediator vom Data-Modul angefragt wird.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @requires Util
 * @requires Mediator
 * @requires Template
 * @module Featured
 */
var Featured = (function() {
    
    // Template-Namen
    var _TMPL_DETAILS           = "dictionary-details";
    
    // Private Variablen
    var _dataFeatured           = "";
    var _dataTerms              = [];
    var _$featured              = null;
    
    /**
     * Initialisiert das Featured-Modul; abonniert den Mediator.
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
                .sub(CFG.CNL.TERMS_SERVE, _updateTerms)
                .sub(CFG.CNL.FEATURED_SERVE, _updateFeatured);
    }
    
    /**
     * Generiert bei einer Mediator-Nachricht mit dem Featured-Panel als
     * Daten die Inhalte der Start-View; initialisiert alle DOM-Elemente
     * des Moduls und fragt per Mediator benötigte Daten vom Data-Modul an.
     * @access private
     * @param {Object} data Übermittelte Mediator-Daten
     * @function _create
     */
    function _create(data) {
        if ((typeof data !== typeof undefined) &&
            (CFG.VIEW[data.panel] === CFG.VIEW.FEATURED) &&
            (data.target instanceof $)) {
            
            // Modulvariablen initialisieren, Mediator aufrufen
            _$featured = data.target;
            Mediator.pub(CFG.CNL.TERMS_REQUEST)
                    .pub(CFG.CNL.FEATURED_REQUEST);
        }
    }
    
    /**
     * Rendert den aktuellen Begriff mittels Mustache-Template,
     * falls alle benötigten Daten vorhanden sind.
     * @access private
     * @function _render
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
            
            // Begriff des Tages per Template einfügen
            Template.render(_$featured, _TMPL_DETAILS, data, function() {
                Mediator.pub(CFG.CNL.VIEW_SHOW);
            });
        }
    }
    
    /**
     * Aktualisiert die Begriff-Liste, sobald eine entsprechende
     * Mediator-Nachricht mit den erforderlichen Daten empfangen wird;
     * rendert den Begriff neu.
     * @access private
     * @param {Object} data Übermittelte Daten
     * @function _updateTerms
     */
    function _updateTerms(data) {
        if ((typeof data !== typeof undefined) &&
            (typeof data.data !== typeof undefined)) {  
            _dataTerms  = data.data;
            _render();
        }
    }
    
    /**
     * Aktualisiert den Begriff-Alias des Wort des Tages, sobald eine
     * entsprechende Mediator-Nachricht mit den erforderlichen
     * Daten empfangen wird; rendert den Begriff neu.
     * @access private
     * @param {String} data Übergebene Daten
     * @function _updateFeatured
     */
    function _updateFeatured(data) {
        if (typeof data === typeof "") {  
            _dataFeatured = data;
            _render();
        }
    }
    
    /**
     * Scrollt das Wort des Tages nach oben, wenn eine entsprechende
     * Mediator-Nachricht ausgelöst wird, um den Ausgangszustand
     * wiederherzustellen.
     * @access private
     * @param {String} panel Übermittelte Daten
     * @function _restore
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