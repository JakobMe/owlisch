/**
 * Globale Konstanten.
 * Definiert globale Konstanten für alle Module.
 * @author Jakob Metzger
 */
var GLOBALS = (function() {
    
    // Konstanten
    return {
        
        // Webapp
        WEBAPP: {
            IOS:            (window.navigator.standalone || false),
            CORDOVA:        (typeof window.cordova !== "undefined")
        },
        
        // Strings
        STR: {
            EMPTY:          ""
        },
        
        // Events
        EVENT: {
            CLICK:          "click",
            ENDED:          "ended",
            FOCUS:          "focus",
            SUBMIT:         "submit",
            DEVREADY:       "deviceready"
        },
        
        // Datentypen
        TYPE: {
            NUMBER:         "number",
            BOOL:           "boolean",
            UNDEF:          "undefined",
            OBJECT:         "object"
        },
        
        // HTML-Attribute
        ATTR: {
            DATA_ACTION:    "data-action"
        },
        
        // Data-Attribute
        DATA: {
            VIEW:           "view",
            ACTION:         "action"
        },
        
        // BEM-Syntax
        BEM: {
            ELEMDIV:        "__",
            MODDIV:         "--",
            MODKEY:         "-"
        },
        
        // Zeiten
        TIME: {
            STANDARD:       300,
            MEDIUM:         375,
            SHORT:          150,
            LONG:           450,
            LONGER:         600
        }
    };
    
})();