/**
 * Mediator-Modul.
 * Übernimmt die Komminikation zwischen den Modulen.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var Mediator = (function() {
    
    // Private Variablen
    var _channels = {};
    
    /**
     * Kanal abonnieren.
     * Fügt einem Kanal des Mediators eine Callback-Funktion hinzu;
     * erzeugt den Kanal, falls er noch nicht existiert.
     * @param {String} channel Name des Kanals
     * @param {Function} callback Callback-Funktion
     */
    function sub(channel, callback) {
        if (!_channels.hasOwnProperty(channel)) { _channels[channel] = []; }
        _channels[channel].push(callback);
        return this;
    }
    
    /**
     * Kanal deabonnieren.
     * Entfernt eine Callback-Funktion von einem Kanal des Mediators.
     * @param {String} channel Name des Kanals
     * @param {Function} callback Callback-Funktion
     */
    function unsub(channel, callback) {
        if (_channels.hasOwnProperty(channel)) {
            $.each(_channels[channel], function(i, subscription) {
                if (subscription === callback) {
                    _channels[channel].splice(i, 1);
                    return true;
                }
            });
        }
        return this;
    }
    
    /**
     * Daten veröffentlichen.
     * Veröffentlich beliebige Daten auf einem angegebenen Kanal;
     * führt alle abonnierten Funktion mit den Daten als Argument aus.
     * @param {String} channel Name des Kanals
     * @param {*} data Zu veröffentlichende Daten
     */
    function pub(channel, data) {
        if (_channels.hasOwnProperty(channel)) {
            $.each(_channels[channel], function(i, subscription) {
                if ($.isFunction(subscription)) { subscription(data); }
            });
        }
        return this;
    }
    
    // Öffentliches Interface
    return { 
        sub   : sub,
        unsub : unsub,
        pub   : pub
    };
    
})();