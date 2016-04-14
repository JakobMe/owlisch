/**
 * Globale Konfiguration.
 * Definiert globale Konstanten und Konfigurationen für alle Module.
 * @author Jakob Metzger
 */
var CONF = (function() {
    
    // Öffentliches Interface
    return {
        
        // Konfiguration
        CONFIG: {
            FILE_DATA       : "owl",
            TYPE_DATA       : ".min.json",
            TYPE_IMG        : ".jpg",
            TYPE_AUDIO      : ".mp3",
            PATH_DATA       : "data/dictionary/",
            PATH_IMG        : "data/images",
            PATH_AUDIO      : "data/audio"
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
            SUBMIT          : "submit",
            DEVICEREADY     : "deviceready"
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