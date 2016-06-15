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
            ALIAS               : "owl",
            PATH_DATA           : "data/",
            PATH_AUDIO          : "/audio/",
            PATH_IMAGE          : "/image/",
            TYPE_DATA           : ".json",
            TYPE_AUDIO          : ".mp3",
            TYPE_IMAGE          : ".jpg"
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
                LABEL           : "Start",
                TITLE           : "Wort der Woche"
            },
            DICTIONARY: {
                LABEL           : "Wörterbuch",
                TITLE           : "Mein Wörterbuch"
            },
            QUIZ: {
                LABEL           : "Quiz",
                TITLE           : "OWL-Quiz"
            },
            PROGRESS: {
                LABEL           : "Fortschritt",
                TITLE           : "Mein Fortschritt"
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
            DICTIONARY_FORWARD  : "dictionary-forward",
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
            INPUT               : "input",
            PLAY                : "play",
            LOADEDDATA          : "loadeddata",
            KEYBOARD_HIDE       : "keyboardWillHide",
            KEYBOARD_SHOW       : "keyboardWillShow",
            LOAD_PANEL_CONTENT  : "loadedPanelContent",
            CREATE_PANELS       : "createdPanelContainers",
            UPDATE_NAVBAR       : "updateNavigationBar",
            SEARCHED_LIST       : "searchedDictionaryList",
            SORTED_LIST         : "sortedDictionaryList",
            SET_PANEL           : "setCurrentPanel",
            HIDE_VIEW           : "hideView",
            SHOW_VIEW           : "showView",
            SHOW_VIEWPORT       : "showViewport",
            PRESSED_BUTTON      : "pressedNavigationBarButton",
            REQUEST_DICTIONARY  : "requestedDictionary",
            REQUEST_PROGRESS    : "requestedProgress",
            SERVE_DICTIONARY    : "servedDictionary",
            SERVE_PROGRESS      : "servedProgress",
            UPDATE_PROGRESS     : "updatedProgress"
        },
        SORTING: {
            SORT: {
                ALPHA           : "Alphabetisch",
                NUMERIC         : "Nach Stufe"
            },
            ORDER: {
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