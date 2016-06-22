/**
 * Helper-Modul.
 * Stellt Hilfs-Funktionen zur Verfügung.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var Helper = (function() {
    
    /**
     * Ein Array aus einer Zahl generieren.
     * Erzeugt ein Array mit Ganzzahlen von 1 bis zur gewählten Zahl.
     * @param {Number} number Letzte Zahl im Array
     * @returns {Number[]} Array aus Zahlen bis zur gewählten Zahl
     */
    function arrayFromNumber(number) {
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
    function calcPercent(first, second) {
        var result = Math.round((first / second) * 100);
        return (isNaN(result) ? 0 : result);
    }
    
    /**
     * Begriffe mit Level zählen.
     * Zählt in einer gegeben Begriff-Liste alle Einträge,
     * die das angegebene Level haben.
     * @param {Object[]} list Begriff-Liste
     * @param {Number} level Gesuchter Level
     * @returns {Number} Anzahl der gefundenen Begriffe
     */
    function countTermsWithLevel(list, level) {
        var count = 0;
        $.each(list, function(i, data) {
            if (data.lvl === level) { count++; }
        });
        return count;
    }
    
    // Öffentliches Interface
    return { 
        arrayFromNumber     : arrayFromNumber,
        calcPercent         : calcPercent,
        countTermsWithLevel : countTermsWithLevel
    };
    
})();