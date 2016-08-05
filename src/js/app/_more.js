/**
 * More-Modul.
 * Steuert zusätzliche Optionen der App.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var More = (function() {
    
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
                .hook(CFG.CNL.VIEW_RESTORE, _restore);
    }
    
    /**
     * Mehr Optionen erzeugen.
     * ...
     * @param {Object} data Übergebene Daten des Mediators
     */
    function _create(data) {
        if ((typeof data !== typeof undefined) &&
            (CFG.VIEW[data.panel] === CFG.VIEW.MORE) &&
            (data.target instanceof $)) {
            
            // !TODO: _create()
        }
    }
    
    /**
     * Mehr Optionen rendern.
     * ...
     */
    function _render() {
        
        // !TODO: _render()
    }
    
    /**
     * Standard-Konfiguration wiederherstellen.
     * ...
     * @param {String} panel Ziel-Panel des Events
     */
    function _restore(panel) {
        if ((typeof panel    !== typeof undefined) &&
            (CFG.VIEW[panel] === CFG.VIEW.MORE)) {
            
            // !TODO: _restore()
        }
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();