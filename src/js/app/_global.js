/**
 * Globale Konstanten.
 * Definiert globale Konstanten für alle Module.
 * @author Jakob Metzger
 */
var C = (function() {
    
    // Konstanten
    return {
        
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
            DATA_ACTION     : "data-action",
            DATA_PANEL      : "data-panel",
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