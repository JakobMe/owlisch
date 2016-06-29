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
            QUESTIONS           : 10,
            LASTGAMES           : 10
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
            QUIZ_START          : "quiz-start"
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
            KEYBOARD_SHOW       : "keyboardWillShow"
        },
        CNL: {
            TERMS_REQUEST       : "terms:request",
            TERMS_SERVE         : "terms:serve",
            TERMS_UPDATE        : "terms:update",
            SCORES_REQUEST      : "scores:request",
            SCORES_SERVE        : "scores:serve",
            SCORES_UPDATE       : "scores:update",
            VIEWPORT_SHOW       : "viewport:show",
            VIEWPORT_HIDE       : "viewport:hide",
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
        LABEL: {
            PROGRESS            : "Fortschritt:",
            NEW                 : "Neu!",
            EASY                : "Leicht",
            MEDIUM              : "Mittel",
            HARD                : "Schwer",
            MEANING             : "Was bedeutet"
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
            SLASH               : "/"
        },
        TIME: {
            ANIMATION           : 150,
            DELAY               : 300
        },
        WEBAPP: {
            IOS                 : (window.navigator.standalone || false),
            CORDOVA             : (typeof window.cordova !== "undefined")
        }
    };
})();