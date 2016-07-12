/**
 * Util-Modul.
 * Stellt Hilfs-Funktionen zur Verfügung.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var Template = (function() {
    
    // Konstanten
    var _PRELOAD                = "tpl/preload.json";
    var _PATH                   = "tpl/_";
    var _TYPE                   = ".tpl";
    
    // Private Variablen
    var _cache                  = {};
    
    /**
     * Templates initialisieren.
     * Ermittelt die Liste der Templates im entsprechenden Verzeichnis
     * und lädt alle genannten Templates vor.
     */
    function init() {
        $.getJSON(_PRELOAD, function(data) {
            $.each(data.templates, function(i, template) {
                $.get(_PATH + template + _TYPE, function(content) {
                    _cache[template] = content;
                    Mustache.parse(content);
                });
            });
        });
    }
    
    /**
     * HTML einfügen.
     * Fügt einen gegebenen String als HTML in ein DOM-Objekt ein;
     * führt gegebenenfalls eine Callback-Funktion aus.
     * @param {Object} $target Ziel-DOM-Element
     * @param {String} content HTML-String
     * @param {Function} [undefined] callback Callback-Funktion
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
     * Template rendern.
     * Rendern ein gegebenes Template mit Mustache und fügt den
     * Inhalt in einen gegebenes DOM-Element ein; lädt das Template per AJAX,
     * falls es noch nicht zwischengespeichert wurde; führt gegebenenfalls
     * eine Callback-Funktion aus.
     * @param {Object} $target Ziel-DOM-Element
     * @param {String} template Name des Templates
     * @param {Object} data Daten, die an Mustache übergeben werden
     * @param {Function} [undefined] callback Callback-Funktion
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