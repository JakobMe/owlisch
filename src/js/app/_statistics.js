/**
 * Statistik-Modul.
 * Steuert die Statistik der App.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
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
     * Statistik initialisieren.
     * Startet Funktionen, um den Anfangszustand der Statistik herzustellen.
     */
    function init() {
        _arrStepsPercent = Util.arrFromNum(_NUM_STEPS_PERCENT);
        _arrStepsScores  = Util.arrFromNum(CFG.QUIZ.QUESTIONS);
        _subMediator();
    }
    
    /**
     * Mediator abonnieren.
     * Meldet Funktionen beim Mediator an.
     */
    function _subMediator() {
        Mediator.sub(CFG.CNL.VIEW_LOAD, _create)
                .sub(CFG.CNL.VIEW_RESTORE, _restore)
                .sub(CFG.CNL.TERMS_SERVE, _updateProgress)
                .sub(CFG.CNL.SCORES_SERVE, _updateScores);
    }
    
    /**
     * Statistik erzeugen.
     * Erzeugt die Statistik anhand eines Mediator-Events; fügt die
     * Statistik mittels Template ein, initialisiert die Elemente der
     * Statistik und teilt dem Mediator weitere Events mit.
     * @param {Object} data Übergebene Daten des Mediators
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
     * Diagramm rendern.
     * Rendert ein Diagramm mit gegebenen Eigenschaften anhand eines
     * Mustache-Templates in einen angegebenen Container.
     * @param {Object} $target Ziel-DOM-Element
     * @param {Object[]} data Array der Diagramm-Daten
     * @param {Number[]} steps Array der Skala-Schritte
     * @param {Boolean} hrznt Horizontales Diagramm
     * @param {Boolean} stars Level-Sterne anzeigen
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
     * Diagramm für letzte Spielergebnisse rendern.
     * Rendert ein Diagramm für die letzten Spielergebnisse
     * anhand eines Mustache-Templates.
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
     * Diagramme für Fortschritt rendern.
     * Rendert die Diagramme für den Wörterbuch-Fortschritt
     * anhand eines Mustache-Templates.
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
     * Diagramme für Wörterbuch rendern.
     * Rendert die Diagramme für das Wörterbuch
     * anhand eines Mustache-Templates.
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
     * Letzte Spielergebnisse aktualisieren.
     * Aktualisiert die Spielergebnis-Liste, sobald ein entsprechendes
     * Mediator-Event mit den erforderlichen Daten ausgelöst wird.
     * @param {Object} data Übergebene Daten
     */
    function _updateScores(data) {
        if ((typeof data      !== typeof undefined) &&
            (typeof data.data !== typeof undefined)) {
            _dataScores = data.data;
            _renderScores();
        }
    }
    
    /**
     * Fortschritt aktualisieren.
     * Aktualisiert die Fortschritts-Liste, sobald ein entsprechendes
     * Mediator-Event mit den erforderlichen Daten ausgelöst wird.
     * @param {Object} data Übergebene Daten
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
     * Diagramme animieren.
     * Fügt den Diagrammen der Statistik eine Klasse hinzu oder entfernt sie,
     * um sie zu animieren; blendet Diagramm gegebenenfalls vorher aus.
     * @param {Boolean} shrink Diagramm vorher ausblenden
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
     * Standard-Konfiguration wiederherstellen.
     * Scrollt die Statistik nach oben und animiert die Diagramme, wenn
     * ein entsprechendes Mediator-Event ausgelöst wird.
     * @param {String} panel Ziel-Panel des Events
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