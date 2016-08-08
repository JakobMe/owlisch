/**
 * Steuert die Statistik-View der App; erzeugt und animiert die Diagramme der
 * Statistik über den Wörterbuch-Fortschritt und die letzten Quiz-Spiele des
 * Nutzers anhand von angefragten Daten des Data-Moduls. 
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence MIT
 * @requires Util
 * @requires Mediator
 * @requires Template
 * @module Statistics
 */
var Statistics = (function() {
    
    // Selektor-Konstanten
    var _SEL_MAIN               = "[data-statistics='main']";
    var _SEL_CHART              = "[data-statistics='chart']";
    var _SEL_SCORES             = "[data-statistics='scores']";
    var _SEL_PROGRESS           = "[data-statistics='progress']";
    var _SEL_DICTIONARY         = "[data-statistics='dictionary']";
    
    // Template-Namen
    var _TMPL_STATISTICS        = "statistics";
    var _TMPL_CHART             = "statistics-chart";
    
    // BEM-Konstanten
    var _B_CHART                = "chart";
    var _M_GROW                 = "grow";
    
    // Sonstige Konstanten
    var _NUM_STEPS_PERCENT      = 10;
    var _DELIMITER_SCORE        = "/";
    
    // Private Variablen
    var _dataScores             = [];
    var _dataTerms              = [];
    var _arrStepsPercent        = [];
    var _arrStepsScores         = [];
    var _sizeSolved             = 0;
    var _sizeTerms              = 0;
    
    // DOM-Elemente
    var _$statistics            = null;
    var _$scores                = null;
    var _$progress              = null;
    var _$dictionary            = null;
    
    /**
     * Initialisiert das Statistics-Modul; abonniert den Mediator.
     * @access public
     * @function init
     */
    function init() {
        _arrStepsPercent = Util.arrFromNum(_NUM_STEPS_PERCENT);
        _arrStepsScores  = Util.arrFromNum(CFG.QUIZ.QUESTIONS);
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
                .sub(CFG.CNL.TERMS_SERVE, _updateProgress)
                .sub(CFG.CNL.SCORES_SERVE, _updateScores);
    }
    
    /**
     * Generiert bei einer Mediator-Nachricht mit dem Statistics-Panel als
     * Daten die Inhalte der Statistik; initialisiert alle DOM-Elemente
     * des Moduls, blendet die View wieder ein, fragt per Mediator benötigte
     * Daten vom Data-Modul an und animiert die Diagramme der Statistik.
     * @access private
     * @param {Object} data Übermittelte Mediator-Daten
     * @function _create
     */
    function _create(data) {
        if ((typeof data !== typeof undefined) &&
            (CFG.VIEW[data.panel] === CFG.VIEW.STATISTICS) &&
            (data.target instanceof $)) {
            
            // Mit Template rendern
            Template.render(
                data.target, _TMPL_STATISTICS,
                { games: CFG.QUIZ.LASTGAMES },
                function() {
                    
                    // Modulvariablen initialisieren
                    _$statistics = $(_SEL_MAIN);
                    _$scores     = _$statistics.find(_SEL_SCORES);
                    _$progress   = _$statistics.find(_SEL_PROGRESS);
                    _$dictionary = _$statistics.find(_SEL_DICTIONARY);
                    
                    // Diagramme animieren
                    _growCharts(false);
                    
                    // Mediator aufrufen
                    Mediator.pub(CFG.CNL.VIEW_SHOW)
                            .pub(CFG.CNL.TERMS_REQUEST)
                            .pub(CFG.CNL.SCORES_REQUEST);
                }
            );
        }
    }
    
    /**
     * Rendert ein Diagramm mit gegebenen Eigenschaften anhand eines
     * Mustache-Templates in einen angegebenen Container.
     * @access private
     * @param {Object} $target Ziel-DOM-Element
     * @param {Object[]} data Array der Diagramm-Daten
     * @param {Number[]} steps Array der Skala-Schritte
     * @param {Boolean} hrznt Horizontales Diagramm?
     * @param {Boolean} stars Level-Sterne anzeigen?
     * @function _renderChart
     */
    function _renderChart($target, data, steps, hrznt, stars, empty) {
        hrznt = (hrznt || false);
        stars = (stars || false);
        empty = (empty || false);
        Template.render($target.find(_SEL_CHART), _TMPL_CHART, {
            data: data, hrznt: hrznt, steps: steps, stars: stars, empty: empty
        });
    }
    
    /**
     * Rendert ein Diagramm für die letzten Spielergebnisse mit Hilfe
     * der _renderChart Methode.
     * @access private
     * @function _renderScores
     */
    function _renderScores() {
        if (_$scores instanceof $) {
            var data = [];
            $.each(_dataScores, function(i, value) {
                data.push({
                    label   : value,
                    percent : Util.calcPercent(value, CFG.QUIZ.QUESTIONS),
                    zero    : (value === 0)
                });
            });
            _renderChart(_$scores, data, _arrStepsScores,
                false, false, (_dataScores.length === 0));
        }
    }
    
    /**
     * Rendert das Diagramm für den Wörterbuch-Fortschritt mit Hilfe
     * der _renderChart Methode.
     * @access private
     * @function _renderProgress
     */
    function _renderProgress() {
        if (_$progress instanceof $) {
            var data = [{
                label   : _sizeSolved + _DELIMITER_SCORE + _sizeTerms,
                percent : Util.calcPercent(_sizeSolved, _sizeTerms),
                zero    : (_sizeSolved === 0)
            }];
            _renderChart(_$progress, data, _arrStepsPercent, true);
        }
    }
    
    /**
     * Rendert das Diagramm für die Wörterbuch-Zusammensetzung mit Hilfe
     * der _renderChart Methode.
     * @access private
     * @function _renderDictionary
     */
    function _renderDictionary() {
        if (_$dictionary instanceof $) {
            var data = [];
            $.each(CFG.QUIZ.LEVELS, function(i, level) {
                var count = Util.countTermsWithLevel(_dataTerms, level);
                data.push({
                    lvl     : level,
                    levels  : CFG.QUIZ.LEVELS,
                    label   : count,
                    zero    : (count === 0),
                    percent : Util.calcPercent(count, _sizeSolved)
                });
            });
            _renderChart(_$dictionary, data, _arrStepsPercent, true, true);
        }
    }
    
    /**
     * Aktualisiert die Spielergebnis-Liste, sobald eine entsprechende
     * Mediator-Nachricht mit den erforderlichen Daten empfangen wird.
     * @access private
     * @param {Object} data Übermittelte Mediator-Daten
     * @function _updateScores
     */
    function _updateScores(data) {
        if ((typeof data      !== typeof undefined) &&
            (typeof data.data !== typeof undefined)) {
            _dataScores = data.data;
            _renderScores();
        }
    }
    
    /**
     * Aktualisiert die Fortschritts-Liste, sobald eine entsprechende
     * Mediator-Nachricht mit den erforderlichen Daten empfangen wird.
     * @access private
     * @param {Object} data Übermittelte Mediator-Daten
     * @function _updateProgress
     */
    function _updateProgress(data) {
        if ((typeof data        !== typeof undefined) &&
            (typeof data.solved !== typeof undefined) &&
            (typeof data.data   !== typeof undefined) &&
            (typeof data.size   !== typeof undefined)) {  
            _dataTerms  = data.data;
            _sizeSolved = data.solved;
            _sizeTerms  = data.size;
            _renderProgress();
            _renderDictionary();
        }
    }
    
    /**
     * Fügt den Diagrammen der Statistik eine Klasse hinzu oder entfernt sie,
     * um sie zu animieren; blendet Diagramm gegebenenfalls vorher aus.
     * @access private
     * @param {Boolean} [shrink=false] Diagramm vorher ausblenden
     * @function _growCharts
     */
    function _growCharts(shrink) {
        shrink = (shrink || false);
        var $charts = _$statistics.find(_SEL_CHART);
        if (shrink) { $charts.setMod(_B_CHART, _M_GROW, false); }
        setTimeout(function() {
            $charts.setMod(_B_CHART, _M_GROW, true);
        }, (shrink ? CFG.TIME.DELAY : CFG.TIME.ANIMATION));
    }
    
    /**
     * Scrollt die Statistik nach oben und animiert die Diagramme, wenn
     * ein entsprechende Mediator-Nachricht empfangen wird.
     * @access private
     * @param {String} panel Übermittelte Mediator-Daten
     * @function _restore
     */
    function _restore(panel) {
        if ((typeof panel    !== typeof undefined) &&
            (CFG.VIEW[panel] === CFG.VIEW.STATISTICS)) {
            _$statistics.animate(
                { scrollTop: 0 },
                CFG.TIME.ANIMATION,
                function() { _growCharts(true); }
            );
        }
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();