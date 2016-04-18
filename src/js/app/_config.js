/**
 * Globale Konfiguration.
 * Definiert globale Konstanten und Konfigurationen für alle Module.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var _C = (function() {
    return {
        DICTIONARY: {
            ID                  : "owl",
            PATH_DATA           : "data/",
            PATH_AUDIO          : "/audio/",
            PATH_IMAGES         : "/images/",
            TYPE_DATA           : ".json",
            TYPE_AUDIO          : ".mp3",
            TYPE_IMAGES         : ".jpg"
        },
        QUIZ: {
            LVL_MIN             : 1,
            LVL_MAX             : 3,
            LEVELS              : [1,2,3],
            NUM_STEPS           : 10,
            NUM_PROGRESS        : 10
        },
        VIEW: {
            START: {
                NAME            : "start",
                LABEL           : "Start",
                TITLE           : "Wort der Woche"
            },
            DICTIONARY: {
                NAME            : "dictionary",
                LABEL           : "Wörterbuch",
                TITLE           : "Wörterbuch"
            },
            QUIZ: {
                NAME            : "quiz",
                LABEL           : "Quiz",
                TITLE           : "Quiz"
            },
            PROGRESS: {
                NAME            : "progress",
                LABEL           : "Fortschritt",
                TITLE           : "Fortschritt"
            },
            HELP: {
                NAME            : "help",
                LABEL           : "Hilfe",
                TITLE           : "Hilfe"
            }
        },
        ACT: {
            NONE                : "none",
            SEARCH_SHOW         : "search-show",
            SEARCH_HIDE         : "search-hide",
            SORT_SHOW           : "sort-show",
            SORT_HIDE           : "sort-hide",
            DICTIONARY_BACK     : "dictionary-back",
            QUIZ_SKIP           : "quiz-skip",
            QUIZ_CANCEL         : "quiz-cancel"
        },
        ICON: {
            NONE                : "none",
            SEARCH              : "search",
            SORT                : "sort",
            BACK                : "back",
            CANCEL              : "cancel",
            SKIP                : "skip"
        },
        EVT: {
            CLICK               : "click",
            ENDED               : "ended",
            FOCUS               : "focus",
            SUBMIT              : "submit",
            KEYBOARD_HIDE       : "keyboardWillHide",
            KEYBOARD_SHOW       : "keyboardWillShow",
            LOAD_PANEL_CONTENT  : "loadedPanelContent",
            CREATE_PANELS       : "createdPanelContainers",
            SET_PANEL           : "setCurrentPanel",
            HIDE_VIEW           : "hideView",
            SHOW_VIEW           : "showView",
            SHOW_VIEWPORT       : "showViewport",
            PRESSED_BUTTON      : "pressedNavigationBarButton",
            REQUEST_DICTIONARY  : "requestedDictionary",
            REQUEST_PROGRESS    : "requestedProgress",
            SERVE_DICTIONARY    : "servedDictionary",
            SERVE_PROGRESS      : "servedProgress",
            UPDATE_PROGRESS     : "updatedProgress",
        },
        SORTING: {
            SORT: {
                ALPHA: {
                    NAME        : "alpha",
                    LABEL       : "Alphabetisch"
                },
                NUMERIC: {
                    NAME        : "numeric",
                    LABEL       : "Nach Stufe"
                }
            },
            ORDER: {
                ASC: {
                    NAME        : "asc",
                    LABEL       : "aufsteigend"
                },
                DESC: {
                    NAME        : "desc",
                    LABEL       : "absteigend"
                }
            }
        },
        TYPE: {
            NUM                 : "number",
            BOOL                : "boolean",
            UNDEF               : "undefined",
            STR                 : "string"
        },
        BEM: {
            ELEMDIV             : "__",
            MODDIV              : "--",
            MODKEY              : "-"
        },
        STR: {
            EMPTY               : "",
            SLASH               : "/"
        },
        TIME: {
            DEFAULT             : 150,
            DOUBLE              : 300
        },
        WEBAPP: {
            IOS                 : (window.navigator.standalone || false),
            CORDOVA             : (typeof window.cordova !== "undefined")
        }
    };
})();