/**
 * Globale Konfiguration.
 * Definiert globale Konstanten und Konfigurationen für alle Module.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var CFG = (function() {
    return {
        DATA: {
            STORE               : "owlisch",
            ALIAS               : "owl",
            PATH_DATA           : "data/",
            PATH_AUDIO          : "/audio/",
            PATH_IMAGE          : "/image/",
            TYPE_DATA           : ".json",
            TYPE_AUDIO          : ".mp3",
            TYPE_IMAGE          : ".jpg"
        },
        QUIZ: {
            LEVELS              : [1,2,3],
            FAILS               : [1,2,3,4,5],
            DIFF                : ["Leicht", "Mittel", "Schwer"],
            QUESTIONS           : 10,
            LASTGAMES           : 10,
            ANSWERS             : 4
        },
        LABEL: {
            MEANING             : "Was bedeutet",
            WHAT                : "Was ist",
            PROGRESS            : "Fortschritt:",
            DETAILS             : "Details",
            THIS                : "das"
        },
        RATING: {
            PERFECT: {
                ICON            : "smile",
                LABEL           : "Perfekt!",
                PERCENT         : 100
            },
            EXCELLENT: {
                ICON            : "smile",
                LABEL           : "Hervorragend!",
                PERCENT         : 80
            },
            VERYGOOD: {
                ICON            : "smile",
                LABEL           : "Sehr gut!",
                PERCENT         : 60
            },
            GOOD: {
                ICON            : "smile",
                LABEL           : "Gar nicht übel!",
                PERCENT         : 40
            },
            MEDIOCRE: {
                ICON            : "meh",
                LABEL           : "Das geht besser!",
                PERCENT         : 20
            },
            BAD: {
                ICON            : "frown",
                LABEL           : "Das war nichts...",
                PERCENT         : 0
            }
        },
        VIEW: {
            START: {
                LABEL           : "Start",
                TITLE           : "Begriff der Woche"
            },
            DICTIONARY: {
                LABEL           : "Wörterbuch",
                TITLE           : "Mein Wörterbuch"
            },
            QUIZ: {
                LABEL           : "Quiz",
                TITLE           : "Quiz"
            },
            STATISTICS: {
                LABEL           : "Statistik",
                TITLE           : "Meine Statistik"
            },
            MORE: {
                LABEL           : "Mehr",
                TITLE           : "Mehr Optionen"
            }
        },
        ACT: {
            NONE                : "none",
            SEARCH_SHOW         : "search-show",
            SEARCH_HIDE         : "search-hide",
            SORT_SHOW           : "sort-show",
            SORT_HIDE           : "sort-hide",
            SORT_TOGGLE         : "sort-toggle",
            DICTIONARY_FORWARD  : "dictionary-forward",
            DICTIONARY_BACK     : "dictionary-back",
            QUIZ_SKIP           : "quiz-skip",
            QUIZ_CANCEL         : "quiz-cancel",
            QUIZ_START          : "quiz-start",
            QUIZ_SOLVE          : "quiz-solve"
        },
        ICO: {
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
            INPUT               : "input",
            PLAY                : "play",
            LOADEDDATA          : "loadeddata",
            KEYBOARD_HIDE       : "keyboardWillHide",
            KEYBOARD_SHOW       : "keyboardWillShow",
            TRANSITION          : "transitionend"
        },
        CNL: {
            TERMS_REQUEST       : "terms:request",
            TERMS_SERVE         : "terms:serve",
            TERMS_UPDATE        : "terms:update",
            SCORES_REQUEST      : "scores:request",
            SCORES_SERVE        : "scores:serve",
            SCORES_UPDATE       : "scores:update",
            CONFIG_REQUEST      : "config:request",
            CONFIG_SERVE        : "config:serve",
            VIEW_SHOW           : "view:show",
            VIEW_HIDE           : "view:hide",
            VIEW_CHANGE         : "view:change",
            VIEW_SET            : "view:set",
            VIEW_INIT           : "view:init",
            VIEW_LOAD           : "view:load",
            VIEW_RESTORE        : "view:restore",
            NAVBAR_ACTION       : "navbar:action",
            QUIZ_START          : "quiz:start",
            QUIZ_END            : "quiz:end",
            DICTIONARY_SORT     : "dictionary:sort",
            DICTIONARY_SEARCH   : "dictionary:search"
        },
        SORTING: {
            SORT: {
                ALPHA           : "Alphabetisch",
                NUMERIC         : "Nach Stufe"
            },
            ORDR: {
                ASC             : "aufsteigend",
                DESC            : "absteigend"
            }
        },
        BEM: {
            ELEMDIV             : "__",
            MODDIV              : "--",
            MODKEY              : "-"
        },
        AJAX: {
            HEAD                : "HEAD",
            ERROR               : "error"
        },
        STR: {
            EMPTY               : "",
            SLASH               : "/",
            WIDTH               : "width",
            PCT                 : "%"
        },
        TIME: {
            WAIT                : 10,
            ANIMATION           : 150,
            DELAY               : 300,
            DELAY_LONG          : 600
        },
        WEBAPP: {
            IOS                 : (window.navigator.standalone || false),
            CORDOVA             : (typeof window.cordova !== "undefined")
        }
    };
})();