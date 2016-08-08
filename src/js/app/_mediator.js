/**
 * Stellt Funktionen bereit, um die Kommunikation zwischen Modulen zu
 * gewährleisten; erlaubt das Abonnieren von Kanälen, indem einem Kanal
 * eine Funktion hinzugefügt wird; durch das Veröffentlichen auf einem Kanal
 * werden alle gebundenen Funktionen mit den veröffentlichten Daten als
 * Funktionsparameter ausgeführt.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @module Mediator
 */
var Mediator = (function() {
    
    // Private Variablen
    var _channels = {};
    
    /**
     * Fügt einem Kanal des Mediators eine Callback-Funktion hinzu;
     * erzeugt den Kanal, falls er noch nicht existiert.
     * @access public
     * @param {String} channel Name des Kanals
     * @param {Function} callback Callback-Funktion
     * @returns {Object} Interface des Moduls
     * @function sub
     */
    function sub(channel, callback) {
        if (!_channels.hasOwnProperty(channel)) { _channels[channel] = []; }
        _channels[channel].push(callback);
        return this;
    }
    
    /**
     * Entfernt eine Callback-Funktion von einem Kanal des Mediators.
     * @access public
     * @param {String} channel Name des Kanals
     * @param {Function} callback Callback-Funktion
     * @returns {Object} Interface des Moduls
     * @function unsub
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
     * Veröffentlich beliebige Daten auf einem angegebenen Kanal;
     * führt alle abonnierten Funktion mit den Daten als Argument aus.
     * @access public
     * @param {String} channel Name des Kanals
     * @param {*} [data] Zu veröffentlichende Daten
     * @returns {Object} Interface des Moduls
     * @function pub
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