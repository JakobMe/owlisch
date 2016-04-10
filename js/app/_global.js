/**
 * Globale Konstanten.
 * Definiert globale Konstanten für alle Module.
 * @author Jakob Metzger
 */
var GLOBAL = (function() {
    
    // Öffentliches Interface
    return {
        
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
        
        // Data-Attribute
        DATA: {
            VIEW:           "view"
        },
        
        // BEM-Syntax
        BEM: {
            ELEMDIV:        "__",
            MODDIV:         "--",
            MODKEY:         "-"
        }
    };
    
})();