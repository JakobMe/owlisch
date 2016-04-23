/**
 * Viewport-Modul.
 * Steuert den Viewport der App.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var Viewport = (function() {
    
    // Konstanten
    var _SEL_VIEWPORT           = "[role='application']";
    var _B                      = "viewport";
    var _E                      = "app";
    var _M                      = "visible";
    
    // Private Variablen
    var _isVisible              = false;
    var _$viewport              = $(_SEL_VIEWPORT);
    
    /**
     * Viewport initialisieren.
     * Startet Funktionen, um den Anfangszustand des Viewports herzustellen.
     */
    function init() {
        _bindEvents();
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        $(window).on(CFG.EVT.SHOW_VIEWPORT, _show);
    }
    
    /**
     * Modul rendern.
     * Rendert alle Elemente des Moduls anhand der intern
     * gesetzten aktuellen Variablen.
     */
    function _render() {
        _$viewport.setMod(_B, _E, _M, _isVisible);
    }
    
    /**
     * Modul zeigen.
     * Blendet das Modul ein und rendert es neu.
     */
    function _show() {
        _isVisible = true;
        setTimeout(function() { _render(); }, CFG.TIME.DELAY);
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();