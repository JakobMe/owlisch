/**
 * Play-Modul.
 * Steuert Audio-Elemente der App.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var Play = (function() {
    
    // Selektor-Konstanten
    var _SEL_PLAY               = ".play";
    var _SEL_AUDIO              = "audio";
    
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
     * Audio initialisieren.
     * Startet Funktionen, um den Anfangszustand des Moduls herzustellen.
     */
    function init() {
        _bindEvents();
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events und Elemente des Moduls.
     */
    function _bindEvents() {
        $(document).on(CFG.EVT.CLICK, _SEL_PLAY, _play);
    }
    
    /**
     * Audio-Events binden.
     * Bindet spezifische Audio-Events an das interne Audio-Element.
     */
    function _bindEventsAudio() {
        if (_$audio !== null) {
            _$audio.off()
                   .on(CFG.EVT.LOADEDDATA, function() { _setLoading(false); })
                   .on(CFG.EVT.ENDED, function() { _setPlaying(false); });
        }
    }
    
    /**
     * Audio abspielen.
     * Ermittelt das Audio-Element und versucht,
     */
    function _play(event) {
        if (typeof event !== typeof undefined) {
            
            // Play-Button und Audio definieren
            _$play = $(event.target).closest(_SEL_PLAY);
            _$audio = _$play.find(_SEL_AUDIO);
            
            // Abspielen, Audio-Events binden, Zustand aktualisieren
            _$audio.trigger(CFG.EVT.PLAY);
            _bindEventsAudio();
            _setLoading(_$audio.prop(_READY_PROP) !== _READY_VALUE);
            _setPlaying(true);
        }
    }
    
    /**
     * Lade-Zustand setzen.
     * Setzt den aktuellen Lade-Zustand des Moduls; rendert neu.
     * @param {Boolean} isLoading Neuer Lade-Zustand
     */
    function _setLoading(isLoading) {
        if (typeof isLoading === typeof true) {
            _isLoading = isLoading;
            _render();
        }
    }
    
    /**
     * Abspiel-Zustand setzen.
     * Setzt den aktuellen Abspiel-Zustand des Moduls; rendert neu.
     * @param {Boolean} isPlaying Neuer Abspiel-Zustand
     */
    function _setPlaying(isPlaying) {
        if (typeof isPlaying === typeof true) {
            _isPlaying = isPlaying;
            _render();
        }
    }
    
    /**
     * Modul rendern.
     * Rendert alle Elemente des Moduls anhand der intern
     * gesetzten aktuellen Variablen.
     */
    function _render() {
        _$play.setMod(_B, _M_LOADING, _isLoading)
              .setMod(_B, _M_PLAYING, _isPlaying);
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();