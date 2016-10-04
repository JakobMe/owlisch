/**
 * Stellt Funktionen bereit, um Inhalte mit Mustache-Templates in die App
 * einzufügen; lädt Templates vor, die in der Konfigurations-Datei des
 * Template-Verzeichnisses definiert sind.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @license MIT
 * @module Template
 */
var Template = (function() {

    // Konstanten
    var _CONFIG                 = "tmpl/conf.json";
    var _PATH                   = "tmpl/";
    var _TYPE                   = ".html";

    // Private Variablen
    var _cache                  = {};

    /**
     * Lädt die Konfigurations-Datei für die Templates und lädt alle dort
     * definierten Templates vor; parst die Templates mit Mustache, um das
     * spätere Rendern der Templates zu beschleunigen.
     * @access public
     * @function init
     */
    function init() {
        $.getJSON(_CONFIG, function(data) {
            $.each(data.templates, function(i, template) {
                $.get(_PATH + template + _TYPE, function(content) {
                    _cache[template] = content;
                    Mustache.parse(content);
                });
            });
        });
    }

    /**
     * Fügt einen gegebenen String als HTML in ein DOM-Objekt ein;
     * führt gegebenenfalls eine Callback-Funktion aus.
     * @access private
     * @param {Object} $target Ziel-DOM-Element zum Einfügen des HTML-Strings
     * @param {String} content HTML-String, der eingefügt werden soll
     * @param {Function} [callback] Callback-Funktion
     * @function _html
     */
    function _html($target, content, callback) {
        if (($target instanceof $) &&
            (typeof content === typeof "")) {
            $target.html(content).promise().done(function() {
                if ($.isFunction(callback)) { callback(); }
            });
        }
    }

    /**
     * Rendert ein Template mit gegebenem Namen mittels Mustache und fügt den
     * Inhalt in einen gegebenes DOM-Element ein; lädt das Template per AJAX,
     * falls es noch nicht zwischengespeichert wurde; führt gegebenenfalls
     * eine Callback-Funktion aus.
     * @access public
     * @param {Object} $target Ziel-DOM-Element
     * @param {String} template Name des Templates
     * @param {Object} data Daten, die an Mustache übergeben werden sollen
     * @param {Function} [callback] Callback-Funktion
     * @function render
     */
    function render($target, template, data, callback) {
        if (typeof _cache[template] === typeof undefined) {
            $.get(_PATH + template + _TYPE, function(content) {
                _cache[template] = content;
                _html($target, Mustache.render(content, data), callback);
            });
        } else {
            _html($target, Mustache.render(_cache[template], data), callback);
        }
    }

    // Öffentliches Interface
    return {
        init   : init,
        render : render
    };

})();
