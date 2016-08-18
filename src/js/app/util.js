/**
 * Stellt diverse allgemeine Hilfs-Funktionen für andere Module der App bereit.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @license MIT
 * @module Util
 */
var Util = (function() {
    
    /**
     * Erzeugt ein Array mit Ganzzahlen von 1 bis zur gewählten Zahl.
     * @access public
     * @param {Number} number Letzte Zahl im Array
     * @returns {Number[]} Array aus Zahlen bis zur gewählten Zahl
     * @function arrFromNumber
     */
    function arrFromNum(number) {
        var arr = [];
        for (var i = 0; i < number; i++) { arr.push(i + 1); }
        return arr;
    }
    
    /**
     * Berechnet den prozentualen Anteil einer Zahl an einer anderen;
     * gibt das Ergebnis in Prozentpunkten zurück.
     * @access public
     * @param {Number} first Erster Zahlenwert
     * @param {Number} second Zweiter Zahlenwert
     * @param {Boolean} [round=true] Prozentpunkte runden?
     * @returns {Number} Berechnete Prozentpunkte
     * @function calcPercent
     */
    function calcPercent(first, second, round) {
        var result = ((first / second) * 100);
        if ((typeof round === typeof undefined) ||
            (round === true)) {
            result = Math.round(result);
        }
        return (isNaN(result) ? 0 : result);
    }
    
    /**
     * Zählt in einer gegeben Begriff-Liste alle Einträge,
     * die das angegebene Level haben.
     * @access public
     * @param {Object[]} terms Array aus Begriff-Objekten
     * @param {Number} level Gesuchter Level
     * @returns {Number} Anzahl der gefundenen Begriffe
     * @function countTermsWithLevel
     */
    function countTermsWithLevel(terms, level) {
        var count = 0;
        if ((typeof level === typeof 0) &&
            (typeof terms === typeof [])) {
            $.each(terms, function(i, term) {
                if (term.lvl === level) { count++; }
            });
        }
        return count;
    }
    
    /**
     * Sucht in einer gegebenen Begriff-Liste nach einem Begriff
     * mit dem passenden gegebenen Alias; gibt entweder den Begriff
     * oder false zurück, falls er nicht gefunden wurde.
     * @access public
     * @param {Object[]} terms Array aus Begriff-Objekten
     * @param {String} alias Alias des gesuchten Begriffs
     * @returns {(Object|Boolean)} Gefundener Begriff oder false
     * @function findTerm
     */
    function findTerm(terms, alias) {
        var found = false;
        if ((typeof alias === typeof "") &&
            (typeof terms === typeof [])) {
            $.each(terms, function(i, term) {
                if (term.alias === alias) {
                    found = $.extend({}, term);
                    return false;
                }
            });
        }
        return found;
    }
    
    /**
     * Gibt ein zufälliges Element eines Arrays zurück.
     * @access public
     * @param {Array} array Beliebiges Array
     * @returns {*} Zufälliges Element des Arrays
     * @function getRandom
     */
    function getRandom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    /**
     * Mischt ein Array zufällig durch.
     * @access public
     * @param {Array} array Zu mischendes Array
     * @returns {Array} Gemischtes Array
     * @function shuffle
     */
    function shuffle(array) {
        var rand, last;
        for (var i = array.length; i; i -= 1) {
            rand = Math.floor(Math.random() * i);
            last = array[i - 1];
            array[i - 1] = array[rand];
            array[rand] = last;
        }
        return array;
    }
    
    /**
     * Begrenzt eine gegebene Zahl zwischen dem gegebenen Minimum und Maximum.
     * @access public
     * @param {Number} number Zu begrenzende Zahl
     * @param {Number} min Minimum
     * @param {Number} max Maximum
     * @returns {Number} Begrenzte Zahl
     * @function limit
     */
    function limit(number, min, max) {
        if (typeof number === typeof 0) {
            return Math.max(Math.min(number, max), min);
        } else {
            return number;
        }
    }
    
    /**
     * Gibt das aktuelle Datum als Zahl zurück, sortiert nach Jahr, Monat und
     * Tag, jeweils mit der maximalen Anzahl an Stellen; z.B. "20160612".
     * @access public
     * @returns {Number} Aktuelles Datum als Zahl
     * @function getDate
     */
    function getDate() {
        var date = new Date();
        return parseInt(
            intToStr(date.getFullYear(), 4) +
            intToStr(date.getMonth() + 1, 2) +
            intToStr(date.getDate(), 2)
        );
    }
    
    /**
     * Wandelt eine gegebene Ganzzahl in einen String um; stellt führende
     * Nullen entsprechend der angegebenen Mindeststellen an, z.B. 2 -> 02.
     * @access public
     * @param {Number} number Ganzzahl, die umgewandelt werden soll
     * @param {Number} digits Mindestanzahl der Vorkommastellen
     * @returns {String} In String Umgewandelte Zahl
     * @function intToStr
     */
    function intToStr(number, digits) {
        var str = number.toString();
        if (str.length < digits) {
            for (var i = 0; i < (digits - str.length); i++) {
                str = "0" + str;
            }
        }
        return str;
    }
    
    /**
     * Zeigt einen System-Dialog des angegebenen Typs mit den entsprechend
     * gewählten Eigenschaften an, z.B. Alert, Confirm, Prompt; versucht, die
     * Cordova-API zu nutzen, falls vorhanden.
     * @access public
     * @param {String} type Typ des Dialogs (alert, confirm, prompt)
     * @param {String} text Anzuzeigender Text im Dialog
     * @param {Function} callback Funktion, die anschließend ausgeführt wird
     * @param {String} title Titel des Dialogs
     * @param {String[]} buttons Labels der Buttons des Dialogs
     * @function dialog
     */
    function dialog(type, text, callback, title, buttons) {
        var fn = null, cordova = false;
        if (typeof navigator.notification !== typeof undefined) {
            cordova = true;
            fn = navigator.notification[type];
        } else { fn = window[type]; }
        if (cordova) { fn(text, callback, title, buttons); }
        else if (fn(text) && $.isFunction(callback)) { callback(); }
    }
    
    // Öffentliches Interface
    return { 
        arrFromNum          : arrFromNum,
        calcPercent         : calcPercent,
        findTerm            : findTerm,
        countTermsWithLevel : countTermsWithLevel,
        getRandom           : getRandom,
        shuffle             : shuffle,
        limit               : limit,
        getDate             : getDate,
        intToStr            : intToStr,
        dialog              : dialog
    };
    
})();