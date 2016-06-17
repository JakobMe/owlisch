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
    var _SEL_CHART              = ".chart";
    var _SEL_LASTGAMES          = "#statistics-lastgames";
    var _SEL_PROGRESS           = "#statistics-progress";
    var _SEL_DICTIONARY         = "#statistics-dictionary";
    var _SEL_TMPL_STATISTICS    = "#tmpl-statistics";
    var _SEL_TMPL_CHART         = "#tmpl-chart";
    
    // Sonstige Konstanten
    var _NUM_STEPS_PERCENT      = 10;
    
    // Private Variablen
    var _listLastgames          = [];
    var _listProgress           = [];
    var _arrStepsPercent        = [];
    var _arrStepsLastgames      = [];
    var _sizeProgress           = 0;
    var _sizeDictionary         = 0;
    
    // Templates
    var _tmplStatistics         = $(_SEL_TMPL_STATISTICS).html();
    var _tmplChart              = $(_SEL_TMPL_CHART).html();
    
    // DOM-Elemente
    var _$lastgames             = null;
    var _$progress              = null;
    var _$dictionary            = null;
    
    /**
     * Statistik initialisieren.
     * Startet Funktionen, um den Anfangszustand der Statistik herzustellen.
     */
    function init() {
        
        // Interne Variablen initialisieren
        _arrStepsPercent   = _arrayFromNumber(_NUM_STEPS_PERCENT);
        _arrStepsLastgames = _arrayFromNumber(CFG.QUIZ.NUM_STEPS);
        
        // Funktionen ausführen
        _parseTemplates();
        _bindEvents();
    }
    
    /**
     * Templates parsen.
     * Übergibt die Templates dieses Moduls an Mustache, um sie zu parsen.
     */
    function _parseTemplates() {
        Mustache.parse(_tmplStatistics);
        Mustache.parse(_tmplChart);
    }
    
    /**
     * Statistik initialisieren.
     * Initialisiert die DOM-Elemente und internen Variablen
     * des Statistik-Moduls, sobald sie bereitstehen.
     */
    function _initStatistics() {
        
        // Modulvariablen initialisieren
        _$lastgames  = $(_SEL_LASTGAMES);
        _$progress   = $(_SEL_PROGRESS);
        _$dictionary = $(_SEL_DICTIONARY);           
        
        // Letzte Spiele und Fortschritt anfragen, View einblenden
        $(window).trigger(CFG.EVT.REQUEST_PROGRESS);
        $(window).trigger(CFG.EVT.REQUEST_LASTGAMES);
        $(window).trigger(CFG.EVT.SHOW_VIEW);
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        $(window).on(CFG.EVT.LOAD_PANEL_CONTENT, _createStatistics);
        $(window).on(CFG.EVT.SERVE_PROGRESS, _updateProgress);
        $(window).on(CFG.EVT.SERVE_LASTGAMES, _updateLastgames);
        //$(window).on(CFG.EVT.RESTORE_DEFAULT, _restoreDefault);
    }
    
    /**
     * Statistik erzeugen.
     * Erzeugt die Statistik mit Mustache in dem übergebenen
     * jQuery-Container und initialisiert die Statistik danach.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _createStatistics(event, data) {
        if ((typeof data          !== typeof undefined) &&
            (CFG.VIEW[data.panel] === CFG.VIEW.STATISTICS) &&
            (data.target instanceof $)) {

            // Template füllen, Callback ausführen
            data.target.html(Mustache.render(
                _tmplStatistics, { games: CFG.QUIZ.NUM_PROGRESS }
                )).promise().done(function() { _initStatistics(); });
        }
    }
    
    /**
     * Letzte Spielergebnisse aktualisieren.
     * Aktualisiert die Spielergebnis-Liste, sobald ein entsprechendes
     * Event mit den erforderlichen Daten ausgelöst wird.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _updateLastgames(event, data) {
        if ((typeof data      !== typeof undefined) &&
            (typeof data.list !== typeof undefined)) {
            _listLastgames = data.list;
            _renderLastgames();
        }
    }
    
    /**
     * Fortschritt aktualisieren.
     * Aktualisiert die Fortschritts-Liste, sobald ein entsprechendes
     * Event mit den erforderlichen Daten ausgelöst wird.
     * @param {Object} event Ausgelöstes Event
     * @param {Object} data Daten des Events
     */
    function _updateProgress(event, data) {
        if ((typeof data      !== typeof undefined) &&
            (typeof data.size !== typeof undefined) &&
            (typeof data.list !== typeof undefined) &&
            (typeof data.max  !== typeof undefined)) {  
            _listProgress   = data.list;
            _sizeProgress   = data.size;
            _sizeDictionary = data.max;
            _renderProgress();
            _renderDictionary();
        }
    }
    
    /**
     * Ein Array aus einer Zahl generieren.
     * Erzeugt ein Array mit Ganzzahlen von 1 bis zur gewählten Zahl.
     * @param {Number} number Letzte Zahl im Array
     * @returns {Number[]} Array aus Zahlen bis zur gewählten Zahl
     */
    function _arrayFromNumber(number) {
        var arr = [];
        for (var i = 0; i < number; i++) { arr.push(i + 1); }
        return arr;
    }
    
    /**
     * Prozentwert zweier Zahlen berechnen.
     * Berechnet den prozentualen Anteil einer Zahl an einer anderen;
     * gibt das Ergebnis in Prozentpunkten zurück.
     * @param {Number} first Erster Zahlenwert
     * @param {Number} second Zweiter Zahlenwert
     * @returns {Number} Prozentpunkte
     */
    function _calcPercent(first, second) {
        return Math.round((first / second) * 100);
    }
    
    /**
     * Begriffe mit Level zählen.
     * Zählt in einer gegeben Begriff-Liste alle Einträge,
     * die das angegebene Level haben.
     * @param {Object[]} list Begriff-Liste
     * @param {Number} level Gesuchter Level
     * @returns {Number} Anzahl der gefundenen Begriffe
     */
    function _countTermsWithLevel(list, level) {
        var count = 0;
        $.each(list, function(i, data) {
            if (data.lvl === level) { count++; }
        });
        return count;
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
    function _renderChart($target, data, steps, hrznt, stars) {
        if (typeof hrznt !== typeof true) { hrznt = false; }
        if (typeof stars !== typeof true) { stars = false; }
        $target.find(_SEL_CHART).html(
            Mustache.render(_tmplChart, {
                data  : data,
                hrznt : hrznt,
                steps : steps,
                stars : stars
            })
        );
    }
    
    /**
     * Diagramm für letzte Spielergebnisse rendern.
     * Rendert ein Diagramm für die letzten Spielergebnisse
     * anhand eines Mustache-Templates.
     */
    function _renderLastgames() {
        if (_$lastgames instanceof $) {
            var data = [];
            $.each(_listLastgames, function(i, value) {
                data.push({
                    label   : value,
                    percent : _calcPercent(value, CFG.QUIZ.NUM_STEPS),
                    zero    : (value === 0)
                });
            });
            _renderChart(_$lastgames, data, _arrStepsLastgames);
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
                label   : _sizeProgress + CFG.STR.SLASH + _sizeDictionary,
                percent : _calcPercent(_sizeProgress, _sizeDictionary)
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
                var count = _countTermsWithLevel(_listProgress, level);
                data.push({
                    lvl     : level,
                    levels  : CFG.QUIZ.LEVELS,
                    label   : count,
                    percent : _calcPercent(count, _sizeProgress)
                });
            });
            _renderChart(_$dictionary, data, _arrStepsPercent, true, true);
        }
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();