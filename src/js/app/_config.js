/**
 * Globale Konfiguration.
 * Definiert globale Konstanten und Konfigurationen für alle Module.
 * @author Jakob Metzger
 */
var CONF = (function() {
    
    // Öffentliches Interface
    return {
        
        // Wörterbuch
        DICTIONARY: {
            ID              : "owl",
            PATH_DATA       : "data/",
            PATH_AUDIO      : "/audio/",
            PATH_IMAGES     : "/images/",
            TYPE_DATA       : ".json",
            TYPE_AUDIO      : ".mp3",
            TYPE_IMAGES     : ".jpg"
        },
        
        // Quiz
        QUIZ: {
            LVL_MIN         : 0,
            LVL_MAX         : 3,
            NUM_STEPS       : 10,
            NUM_PROGRESS    : 10
        },
        
        // Webapp
        WEBAPP: {
            IOS             : (window.navigator.standalone || false),
            CORDOVA         : (typeof window.cordova !== "undefined")
        },
        
        // Strings
        STR: {
            EMPTY           : ""
        },
        
        // Events
        EVENT: {
            CLICK           : "click",
            ENDED           : "ended",
            FOCUS           : "focus",
            SUBMIT          : "submit"
        },
        
        // Datentypen
        TYPE: {
            NUMBER          : "number",
            BOOL            : "boolean",
            UNDEF           : "undefined",
            OBJECT          : "object"
        },
        
        // HTML-Attribute
        ATTR: {
            DATA_PANEL      : "data-panel",
            DATA_ACTION     : "data-action",
            DATA_TITLE      : "data-title"
        },
        
        // Data-Attribute
        DATA: {
            PANEL           : "panel",
            ACTION          : "action",
            TITLE           : "title"
        },
        
        // BEM-Syntax
        BEM: {
            ELEMDIV         : "__",
            MODDIV          : "--",
            MODKEY          : "-"
        },
        
        // Zeiten
        TIME: {
            STANDARD        : 300,
            MEDIUM          : 375,
            SHORT           : 150,
            LONG            : 450,
            LONGER          : 600
        }
    };
    
})();