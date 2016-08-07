/**
 * Navigation-Bar-Modul.
 * Steuert die Navigation-Bar der App.
 * @author Jakob Metzger <jakob.me@gmail.com>
 * @copyright 2016 Jakob Metzger
 * @licence https://opensource.org/licenses/MIT MIT
 * @link http://jmportfolio.de
 */
var NavigationBar = (function() {

    // Selektor-Konstanten
    var _SEL_MAIN               = "[data-navigationbar='main']";
    var _SEL_BUTTON             = "[data-navigationbar='button']";
    var _SEL_SORT               = "[data-navigationbar='sort']";
    var _SEL_HEADING            = "[data-navigationbar='heading']";
    var _SEL_SEARCH             = "[data-navigationbar='search']";
    var _SEL_CLEAR              = "[data-navigationbar='clear']";
    var _SEL_DROPDOWN           = "[data-navigationbar='dropdown']";
    
    // Template-Namen
    var _TMPL_NAVBAR            = "navigationbar";
    
    // BEM-Konstanten
    var _B_BAR                  = "navigationbar";
    var _B_DROPDOWN             = "dropdown";
    var _E_ITEM                 = "item";
    var _E_HEADING              = "heading";
    var _E_BUTTON               = "button";
    var _E_CLEAR                = "search-clear";
    var _M_HIDDEN               = "hidden";
    var _M_DISABLED             = "disabled";
    var _M_SEARCH               = "search";
    var _M_WEBAPP               = "webapp";
    var _M_ICON                 = "icon";    
    var _M_OPENED               = "opened";
    var _M_SELECTED             = "selected";
    
    // Data-Attibut-Konstanten
    var _DATA_SORT              = "sort";
    var _DATA_ORDR              = "ordr";
    var _DATA_ICO               = "ico";
    var _DATA_ACT               = "act";
    var _DATA_STR               = "str";
    
    // Private Variablen  
    var _cache                  = {};
    var _defaults               = {};
    var _searchIsActive         = false;
    var _buttonsAreDisabled     = false;
    var _dropdownIsOpened       = false;
    var _isWebapp               = (CFG.WEBAPP.IOS || CFG.WEBAPP.CORDOVA);
    
    // DOM-Elemente
    var _$navbar                = $(_SEL_MAIN);
    var _$drpdwn                = null;
    var _$search                = null;
    var _$clear                 = null;
    var _$sort                  = null;
    var _$head                  = null;
    var _$btnL                  = null;
    var _$btnR                  = null;
    
    /**
     * Navigation-Bar initialisieren.
     * Führt Funktionen aus, um den Anfangszustand der
     * Navigation-Bar herzustellen.
     */
    function init() {
        _create();
        _subMediator();
    }
    
    /**
     * Events binden.
     * Bindet Funktionen an Events.
     */
    function _bindEvents() {
        _$sort.on(CFG.EVT.CLICK, _setSort);
        _$navbar.on(CFG.EVT.CLICK, _SEL_BUTTON, _triggerAction);
        _$search.on(CFG.EVT.INPUT, _updateSearch);
        _$clear.on(CFG.EVT.CLICK, _clearSearch);
    }
    
    /**
     * Mediator abonnieren.
     * Meldet Funktionen beim Mediator an.
     */
    function _subMediator() {
        Mediator.sub(CFG.CNL.VIEW_CHANGE, _update)
                .sub(CFG.CNL.VIEW_RESTORE, _restore)
                .sub(CFG.CNL.NAVBAR_ACTION, _performAction)
                .sub(CFG.CNL.QUIZ_START, _performAction)
                .sub(CFG.CNL.QUIZ_END, _performAction);
    }
    
    /**
     * Navigation-Bar erzeugen.
     * Erzeugt die Navigation-Bar; fügt die Navigation-Bar mittels Template
     * ein, initialisiert die Elemente der Navigation-Bar und teilt dem
     * Mediator weitere Events mit.
     */
    function _create() {
        
        // Verfügbare Sortierungen ermitteln
        var sorting = [];
        $.each(CFG.SORTING.SORT, function(optSort, lblSort) {
            $.each(CFG.SORTING.ORDR, function(optOrdr, lblOrdr) {
                sorting.push({
                    icoSort : optSort.toLowerCase(),
                    icoOrdr : optOrdr.toLowerCase(),
                    optSort : optSort,
                    optOrdr : optOrdr,
                    lblSort : lblSort,
                    lblOrdr : lblOrdr
                });
            });
        });
        
        // Template füllen, initialisieren
        Template.render(_$navbar, _TMPL_NAVBAR, sorting, function() {
            _initDom();
            _setBtnL();
            _setBtnR();
            _initCache();
            _bindEvents();
            _render();
            _$sort.first().click();
        });    
    }
    
    /**
     * DOM-Komponenten initialisieren.
     * Initialisiert alle DOM-Elemente der Navigation-Bar.
     */
    function _initDom() {
        _$search = _$navbar.find(_SEL_SEARCH);
        _$clear  = _$navbar.find(_SEL_CLEAR);
        _$drpdwn = _$navbar.find(_SEL_DROPDOWN);
        _$head   = _$navbar.find(_SEL_HEADING);
        _$btnL   = _$navbar.find(_SEL_BUTTON).first();
        _$btnR   = _$navbar.find(_SEL_BUTTON).last();
        _$sort   = _$drpdwn.find(_SEL_SORT);
    }
    
    /**
     * Standard-Konfiguration im Cache speichern.
     * Legt für jedes vorhandene View-Panel die Standard-Konfiguration
     * der Navigation-Bar im Cache fest.
     */
    function _initCache() {
        
        // Alle View-Panels iterieren
        $.each(CFG.VIEW, function(alias, panel) {
            
            // Name und Titel des Panels ermitteln, speichern
            var panelAlias = alias;
            var panelTitle = panel.TITLE;
            _saveCache(panelAlias, panelTitle);
            
            // Sonderfall: Wörterbuch
            if (panel === CFG.VIEW.DICTIONARY) {
                $.extend(_cache[panelAlias].btnL, {
                    act : CFG.ACT.SEARCH_SHOW,
                    ico : CFG.ICO.SEARCH
                });
                $.extend(_cache[panelAlias].btnR, {
                    act : CFG.ACT.SORT_SHOW,
                    ico : CFG.ICO.SORT
                });
            }            
        });
        
        // Cache duplizieren
        _defaults = $.extend({}, _cache);
    }
    
    /**
     * Navigation-Bar rendern.
     * Rendert alle Elemente der Navigation-Bar anhand der intern
     * gesetzten aktuellen Variablen.
     */
    function _render() {
        _$navbar.setMod(_B_BAR, _M_WEBAPP, _isWebapp);
        _renderBtn(_$btnL);
        _renderBtn(_$btnR);
        _renderDropdown();
        _renderSearch();
        _renderHead();
    }
    
    /**
     * Button rendern.
     * Rendert einen gewählten Button (Links/Rechts) anhand seiner
     * gesetzten Eigenschaften (Aktion/Icon).
     * @param {Object} $btn jQuery-Objekt des Buttons
     */
    function _renderBtn($btn) {
        if ($btn instanceof $) {
            
            // Aktion und Icon ermitteln
            var ico = ($btn.data(_DATA_ICO) || null);
            var act = ($btn.data(_DATA_ACT) || null);
            
            // Button ausblenden/deaktivieren
            _buttonsAreDisabled = true;
            $btn.setMod(_B_BAR, _E_BUTTON, _M_DISABLED, true);
            
            // Button aktualisieren
            setTimeout(function() {
                if ((ico !== null) || (act !== null)) {
                    $btn.setMod(_B_BAR, _E_BUTTON, _M_DISABLED, false);
                    $btn.setMod(_B_BAR, _E_BUTTON, _M_ICON, ico);
                }
                setTimeout(function() {
                    _buttonsAreDisabled = false;
                }, CFG.TIME.DELAY);
            }, CFG.TIME.ANIMATION);
        }
    }
    
    /**
     * Titel rendern.
     * Rendert den Titel der Titelleiste anhand des
     * aktuell gesetzten Titels neu.
     */
    function _renderHead() {
        if (_$head instanceof $) {
            _$head.setMod(_B_BAR, _E_HEADING, _M_HIDDEN, true);
            setTimeout(function() {
                _$head.text(_$head.data(_DATA_STR) || "");
                _$head.setMod(_B_BAR, _E_HEADING, _M_HIDDEN, false);
            }, CFG.TIME.ANIMATION);
        }
    }
    
    /**
     * Suche rendern.
     * Rendert die Suche anhand der gesetzten Eigenschaften des Moduls.
     */
    function _renderSearch() {
        _$navbar.setMod(_B_BAR, _M_SEARCH, false);
        setTimeout(function() {
            _$navbar.setMod(_B_BAR, _M_SEARCH, _searchIsActive);
        }, CFG.TIME.ANIMATION);
    }
    
    /**
     * Dropdown-Menü rendern.
     * Rendert das Dropdown-Menü anhand einer ausgewählten Option und den
     * aktuell gesetzten Eigenschaften des Menüs.
     * @param {Object} $selected Ausgewählte Dropdown-Option
     */
    function _renderDropdown($selected) {
        _$drpdwn.setMod(_B_DROPDOWN, _M_OPENED, _dropdownIsOpened);  
        if ((typeof $selected !== typeof undefined) &&
            ($selected instanceof $)) {
            $selected.setMod(_B_DROPDOWN, _E_ITEM, _M_SELECTED, true)
                .siblings().setMod(_B_DROPDOWN, _E_ITEM, _M_SELECTED, false);
        }  
    }
    
    /**
     * Aktion ausführen.
     * Führt anhand einer über den Mediator übermittelten
     * Nachricht eine entsprechende Aktion aus.
     * @param {Object} data Übermittelte Daten
     */
    function _performAction(data) {
        if ((typeof data     !== typeof undefined) &&
            (typeof data.act !== typeof undefined)) {
            switch (data.act) {
                
                // Sortierung einblenden
                case CFG.ACT.SORT_SHOW:
                    _setDropdown(true);
                    break;
                
                // Sortierung ausblenden
                case CFG.ACT.SORT_HIDE:
                    _setDropdown(false);
                    break;
                
                // Suche einblenden
                case CFG.ACT.SEARCH_SHOW:
                    _focusSearch();
                    _setDropdown(false);
                    _setSearch(true);
                    break;
                
                // Suche ausblenden
                case CFG.ACT.SEARCH_HIDE:
                    _setDropdown(false);
                    _setSearch(false);
                    break;
                
                // Wörterbuch vorwärts
                case CFG.ACT.DICTIONARY_FORWARD:
                    _saveCache(CFG.ACT.DICTIONARY_BACK);
                    _setDropdown(false);
                    _setSearch(false, false);
                    _setBtnL(CFG.ACT.DICTIONARY_BACK, CFG.ICO.BACK);
                    _setBtnR(null, null);
                    _setHead(data.str || CFG.VIEW.DICTIONARY.TITLE);
                    break;
                
                // Wörterbuch zurück
                case CFG.ACT.DICTIONARY_BACK:
                    _loadCache(CFG.ACT.DICTIONARY_BACK);
                    break;
                
                // Mehr vorwärts
                case CFG.ACT.MORE_FORWARD:
                    _saveCache(CFG.ACT.MORE_BACK);
                    _setDropdown(false);
                    _setSearch(false, false);
                    _setBtnL(CFG.ACT.MORE_BACK, CFG.ICO.BACK);
                    _setBtnR(null, null);
                    _setHead(data.str || CFG.VIEW.MORE.TITLE);
                    break;
                
                // Mehr zurück
                case CFG.ACT.MORE_BACK:
                    _loadCache(CFG.ACT.MORE_BACK);
                    break;
                
                // Quiz gestartet
                case CFG.ACT.QUIZ_START:
                    _setBtnL(CFG.ACT.QUIZ_CANCEL, CFG.ICO.CANCEL);
                    _setBtnR(CFG.ACT.QUIZ_SKIP, CFG.ICO.SKIP);
                    break;
                
                // Quiz beendet
                case CFG.ACT.QUIZ_CANCEL:
                    _setBtnL(null, null);
                    _setBtnR(null, null);
                    break;
                
                // Quiz übersprungen
                case CFG.ACT.QUIZ_SOLVE:
                    _setBtnR(null, null);
                    break;
            }
        }
    }
    
    /**
     * Aktion auslösen.
     * Löst anhand eines Klick-Events auf einen Navigation-Bar-Button die damit
     * verknüpfte Aktion aus; veröffentlich die Aktion über den Mediator.
     * @param {Object} event Ausgelöstes Event
     */
    function _triggerAction(event) {
        if (!_buttonsAreDisabled && event.target) {
            var $button = $(event.target).closest(_SEL_BUTTON);
            var data = { act: $button.data(_DATA_ACT) };
            Mediator.pub(CFG.CNL.NAVBAR_ACTION, data);
        }
    }
    
    /**
     * Sortierung setzen.
     * Setzt anhand eines Klick-Events die aktuelle Sortierung; veröffentlicht
     * die Sortierung per Mediator und blendet die Dropdown-Sortierung aus.
     * @param {Object} event Ausgelöstes Event
     */
    function _setSort(event) {
        if ((typeof event !== typeof undefined) && (event.target)) {
            
            // Sortierung veröffentlichen
            var $selected = $(event.target).closest(_SEL_SORT);            
            Mediator.pub(CFG.CNL.DICTIONARY_SORT, {
                sort : CFG.SORTING.SORT[$selected.data(_DATA_SORT)],
                ordr : CFG.SORTING.ORDR[$selected.data(_DATA_ORDR)]
            });
            
            // Dropdown ausblenden
            _setDropdown(false, $selected);
        }
    }
    
    /**
     * Dropdown-Sortierung ein-/ausblenden.
     * Blendet das Dropdown-Menü anhand des übergebenen Wertes ein oder aus;
     * setzt den zugehörigen Button entsprechend; aktualisiert optional
     * die ausgewählte Sortierungs-Option.
     * @param {Boolean} willBeOpened Angabe, ob das Dropdown geöffnet wird
     * @param {(Object|undefined)} [undefined] $selected Ausgewählte Opttion
     */
    function _setDropdown(willBeOpened, $selected) {
        if (_dropdownIsOpened !== willBeOpened) {
            _dropdownIsOpened = willBeOpened;
            _setBtnR(
                (willBeOpened ? CFG.ACT.SORT_HIDE : CFG.ACT.SORT_SHOW),
                (willBeOpened ? CFG.ICO.CANCEL    : CFG.ICO.SORT) 
            );
        }
        _renderDropdown($selected);
    }
    
    /**
     * Button-Eigenschaften setzen.
     * Setzt die Aktion und das Icon eines gegebenen Buttons.
     * @param {Object} button Button-Objekt
     * @param {String} action Name der Button-Aktion
     * @param {String} icon Name des Button-Icons
     */
    function _setBtn($btn, act, ico) {
        if ($btn instanceof $) {
            
            // Alte und neue Eigenschaften bestimmen
            var actOld = $btn.data(_DATA_ACT);
            var icoOld = $btn.data(_DATA_ICO);
            var actNew = (act || null);
            var icoNew = (ico || null);
            
            // Button aktualisieren, wenn sich Eigenschaften geändert haben
            if ((icoNew !== icoOld) || (actNew !== actOld)) {
                $btn.data(_DATA_ACT, actNew);
                $btn.data(_DATA_ICO, icoNew);
                _renderBtn($btn);
            }
        }
    }
    
    /**
     * Button Links setzen.
     * Setzt Aktion und Icon des linken Buttons.
     * @param {String} action Neue Aktion
     * @param {String} icon Neues Icon
     */
    function _setBtnL(act, ico) {
        _setBtn(_$btnL, act, ico);
    }
    
    /**
     * Button Rechts setzen.
     * Setzt Aktion und Icon des rechten Buttons.
     * @param {String} action Neue Aktion
     * @param {String} icon Neues Icon
     */
    function _setBtnR(act, ico) {
        _setBtn(_$btnR, act, ico);
    }
    
    /**
     * Titel setzen.
     * Setzt den aktuellen Titel und rendert ihn neu.
     * @param {String} title Neuer Titel
     */
    function _setHead(head) {
        if (typeof head === typeof "") {
            _$head.data(_DATA_STR, head);
            _renderHead();
        }
    }
    
    /**
     * Suche (de-)aktivieren.
     * Aktiviert oder deaktiviert die Suche anhand des übergebenen Wertes;
     * setzt den zugehörigen Button entsprechend und rendert die Suche neu.
     * @param {Boolean} willBeActive Angabe, ob die Suche aktiviert wird
     * @param {Boolean} triggerSearch Angabe, ob Such-Event ausgelöst wird
     */
    function _setSearch(willBeActive, triggerSearch) {
        if (_searchIsActive !== willBeActive) {
            _searchIsActive = willBeActive;
            _setBtnL(
                (willBeActive ? CFG.ACT.SEARCH_HIDE : CFG.ACT.SEARCH_SHOW),
                (willBeActive ? CFG.ICO.CANCEL      : CFG.ICO.SEARCH)
            );
            if (triggerSearch !== false) { _triggerSearch(); }
            _renderSearch();
        }
    }
    
    /**
     * Suche auslösen.
     * Sendet den aktuellen Suchbegriff an den Mediator.
     */
    function _triggerSearch() {
        Mediator.pub(
            CFG.CNL.DICTIONARY_SEARCH,
            (_searchIsActive ? _$search.val() : "")
        );
    }
    
    /**
     * Suche fokussieren.
     * Fokussiert das Such-Input nach einem kurzen Delay.
     */
    function _focusSearch() {
        setTimeout(function() {
            _$search.focus();
        }, CFG.TIME.DELAY);
    }
    
    /**
     * Suche aktualisieren.
     * Ermittelt den aktuellen Suchbegriff und leitet diesen Wert weiter;
     * blendet den Clear-Button für das Input ein/aus.
     */
    function _updateSearch() {
        var search = _$search.val();
        _$clear.setMod(_B_BAR, _E_CLEAR, _M_HIDDEN, (search.length === 0));
        _triggerSearch();
    }
    
    /**
     * Suchfeld leeren.
     * Leert das Suchfeld, löst ein Input-Event aus
     * und fokussiert das Suchfeld.
     */
    function _clearSearch() {
        _$search.val("").trigger(CFG.EVT.INPUT);
        _$search.focus();
    }
    
    /**
     * Aktuelle Navigation-Bar im Cache speichern.
     * Hinterlegt die aktuelle Konfiguration der Navigation-Bar
     * anhand des übergebenen Indexes im internen Cache.
     * @param {String} index Name der Konfiguration
     * @param {(String|undefined)} [undefined] title Alternativer neuer Titel
     */
    function _saveCache(index, head) {
        
        // Aktuellen Status speichern
        _cache[index] = {
            head             : $.extend({}, _$head.data()),
            btnL             : $.extend({}, _$btnL.data()),
            btnR             : $.extend({}, _$btnR.data()),
            dropdownIsOpened : _dropdownIsOpened,
            searchIsActive   : _searchIsActive
        };
        
        // Optional Titel überschreiben
        if (typeof head === typeof "") {
            $.extend(_cache[index].head, { str: head });
        }
    }
    
    /**
     * Aktuelle Konfiguration aus Cache wiederherstellen.
     * Lädt eine Konfiguration anhand des übergebenen Indexes aus dem Cache,
     * falls sie vorhanden ist, und ersetzt die aktuelle Konfiguration.
     * @param {String} index Name der Konfiguration
     */
    function _loadCache(index) {
        
        // Cache laden, falls vorhanden und rendern
        if (typeof _cache[index] !== typeof undefined) {
            var cached = _cache[index];
            $.each(cached.head, function(i, val) { _$head.data(i, val); });
            $.each(cached.btnL, function(i, val) { _$btnL.data(i, val); });
            $.each(cached.btnR, function(i, val) { _$btnR.data(i, val); });
            _dropdownIsOpened = cached.dropdownIsOpened;
            _searchIsActive   = cached.searchIsActive;
        }
        _render();
    }
    
    /**
     * Standard-Konfiguration wiederherstellen.
     * Lädt anhand einer Mediator-Nachricht den Original-Zustand der
     * Navigation-Bar für ein bestimmtes View-Panel.
     * @param {String} panel Name des View-Panels
     */
    function _restore(panel) {
        if ((typeof panel            !== typeof undefined) &&
            (typeof _cache[panel]    !== typeof undefined) &&
            (typeof _defaults[panel] !== typeof undefined)) {
            
            // Aktuelle Konfiguration im Cache speichern
            _saveCache(panel);

            // Standard-Konfiguration wiederherstellen und laden
            if (JSON.stringify(_defaults[panel]) !==
                JSON.stringify(_cache[panel])) {
                _cache[panel] = $.extend({}, _defaults[panel]);
                _loadCache(panel);
            }
        }
    }
    
    /**
     * Navigation-Bar aktualisieren.
     * Aktualisiert anhand einer Mediator-Nachricht den Zustand
     * der Navigation-Bar; speichert den Zustand für das vorige View-Panel
     * im Cache und lädt den Zustand für das neue View-Panel aus dem Cache.
     * @param {Object} data Empfangene Daten
     */
    function _update(data) {
        if ((typeof data          !== typeof undefined) &&
            (typeof data.panelOld !== typeof undefined) &&
            (typeof data.panelNew !== typeof undefined)) {

            // Aktuellen Status speichern, neuen Status laden
            if (data.panelOld !== null) { _saveCache(data.panelOld);   }
            if (data.panelNew !== null) { _loadCache(data.panelNew); }
        }
    }
    
    // Öffentliches Interface
    return { init: init };
    
})();