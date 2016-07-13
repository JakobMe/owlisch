/**
 * Util-Modul.
 * Stellt Hilfs-Funktionen zur Verfügung.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var Util = (function() {
    
    /**
     * Ein Array aus einer Zahl generieren.
     * Erzeugt ein Array mit Ganzzahlen von 1 bis zur gewählten Zahl.
     * @param {Number} number Letzte Zahl im Array
     * @returns {Number[]} Array aus Zahlen bis zur gewählten Zahl
     */
    function arrFromNum(number) {
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
     * @param {Boolean} [true] round Prozentpunkte runden
     * @returns {Number} Prozentpunkte
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
     * Begriffe mit Level zählen.
     * Zählt in einer gegeben Begriff-Liste alle Einträge,
     * die das angegebene Level haben.
     * @param {Object[]} terms Begriff-Liste
     * @param {Number} level Gesuchter Level
     * @returns {Number} Anzahl der gefundenen Begriffe
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
     * Nach Begriff suchen.
     * Sucht in einer gegebenen Begriff-Liste nach einem Begriff
     * mit dem passenden gegebenen Alias; gibt entweder den Begriff
     * oder false zurück.
     * @param {Object[]} terms Liste der Begriffe
     * @param {String} alias Alias des gesuchten Begriffs
     * @returns {(Object|Boolean)} Gefundener Begriff oder false
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
     * Zufälliges Array-Element auswählen.
     * Gibt ein zufälliges Element eines Arrays zurück.
     * @param {*[]} array Beliebiges Array
     * @returns {*} Zufälliges Element des Arrays
     */
    function getRandom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    /**
     * Array mischen.
     * Mischt ein Array zufällig durch.
     * @param {*[]} array Zu mischendes Array
     * @returns {*[]} Gemischtes Array
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
     * Zahl begrenzen.
     * Begrenzt eine gegebene Zahl zwischen dem gegebenen Minimum und Maximum.
     * @param {Number} number Zu begrenzende Zahl
     * @param {Number} min Minimum
     * @param {Number} max Maximum
     */
    function limit(number, min, max) {
        if (typeof number === typeof 0) {
            return Math.max(Math.min(number, max), min);
        } else {
            return number;
        }
    }
    
    /**
     * Aktuelles Datum ermitteln.
     * Gibt das aktuelle Datum als Zahl zurück, sortiert nach
     * Jahr, Monat und Tag, jeweils mit der maximalen Anzahl an Stellen.
     * @returns {Number} Aktuelles Datum
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
     * Ganzzahl in String umwandeln.
     * Wandelt eine gegebene Ganzzahl in einen String um; stellt
     * führende Nullen entsprechend der angegebenen Mindeststellen an.
     * @param {Number} number Ganzzahl, die umgewandelt werden soll
     * @param {Number} digits Mindestanzahl der Vorkommastellen
     * @returns {String} Umgewandelte Zahl
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
        intToStr            : intToStr
    };
    
})();