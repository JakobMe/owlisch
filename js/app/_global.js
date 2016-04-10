/**
 * Globale Konstanten.
 * Definiert globale Konstanten für alle Module.
 * @author Jakob Metzger
 */
var GLOBAL = (function() {
    
    // Öffentliches Interface
    return {
        
        // Strings
        STR: {
            EMPTY:          ""
        },
        
        // Events
        EVENT: {
            CLICK:          "click",
            ENDED:          "ended",
            FOCUS:          "focus",
            SUBMIT:         "submit"
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