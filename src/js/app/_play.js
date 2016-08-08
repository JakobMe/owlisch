/**
 * Ermöglicht das Abspielen von Audio-Dateien im Quiz und im Wörterbuch;
 * reagiert auf Klick-Events auf bestimmte Selektoren und spielt eine
 * in einem Audio-Tag definierte Audio-Datei ab.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence MIT
 * @module Play
 */
var Play = (function() {
    
    // Selektor-Konstanten
    var _SEL_MAIN               = "[data-play='main']";
    var _SEL_AUDIO              = "[data-play='audio']";
    
    // BEM-Konstanten
    var _B                      = "play";
    var _M_PLAYING              = "playing";
    var _M_LOADING              = "loading";
    
    // Sonstige Konstanten
    var _READY_VALUE            = 4;
    var _READY_PROP             = "readyState";
    
    // Private Variablen
    var _isPlaying              = false;
    var _isLoading              = false;
    
    // DOM-Elemente
    var _$play                  = null;
    var _$audio                 = null;
    
    /**
     * Initialisiert das Play-Modul; bindet Events.
     * @access public
     * @function init
     */
    function init() {
        _bindEvents();
    }
    
    /**
     * Bindet Funktionen an Events.
     * @access private
     * @function _bindEvents
     */
    function _bindEvents() {
        $(document).on(CFG.EVT.CLICK, _SEL_MAIN, _play);
    }
    
    /**
     * Bindet Audio-spezifische Funktionen an Modul-Elemente.
     * @access private
     * @function _bindEventsAudio
     */
    function _bindEventsAudio() {
        if (_$audio !== null) {
            _$audio.off()
                   .on(CFG.EVT.LOADEDDATA, function() { _setLoading(false); })
                   .on(CFG.EVT.ENDED, function() { _setPlaying(false); });
        }
    }
    
    /**
     * Initialisiert bei einem Klick-Event eine Audio-Instanz und deren
     * DOM-Elemente, bindet Funktionen an die Elemente und spiel die
     * zugehörige Audio-Datei ab.
     * @access private
     * @function _play
     */
    function _play(event) {
        if (typeof event !== typeof undefined) {
            
            // Play-Button und Audio definieren
            _$play = $(event.target).closest(_SEL_MAIN);
            _$audio = _$play.find(_SEL_AUDIO);
            
            // Abspielen, Audio-Events binden, Zustand aktualisieren
            _$audio.trigger(CFG.EVT.PLAY);
            _bindEventsAudio();
            _setLoading(_$audio.prop(_READY_PROP) !== _READY_VALUE);
            _setPlaying(true);
        }
    }
    
    /**
     * Setzt den Lade-Zustand des Audui-Moduls und rendert es neu.
     * @access private
     * @param {Boolean} isLoading Neuer Lade-Zustand
     * @function _setLoading
     */
    function _setLoading(isLoading) {
        if (typeof isLoading === typeof true) {
            _isLoading = isLoading;
            _render();
        }
    }
    
    /**
     * Setzt den aktuellen Abspiel-Zustand des Play-Moduls und rendert es neu.
     * @access private
     * @param {Boolean} isPlaying Neuer Abspiel-Zustand
     * @function _setPlaying
     */
    function _setPlaying(isPlaying) {
        if (typeof isPlaying === typeof true) {
            _isPlaying = isPlaying;
            _render();
        }
    }
    
    /**
     * Rendert alle Elemente des Moduls anhand der intern
     * gesetzten aktuellen Variablen.
     * @access private
     * @function _render
     */
    function _render() {
        _$play.setMod(_B, _M_LOADING, _isLoading)
              .setMod(_B, _M_PLAYING, _isPlaying);
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();