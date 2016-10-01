# JavaScript Dokumentation
Es folgt eine mit [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown) automatisch generierte Dokumentation aller selbst geschriebenen Module und Klassen unter `src/js/app`.

### Modules

<dl>
<dt><a href="#module_App">App</a></dt>
<dd><p>Haupt-Modul der App; aktiviert FastClick, konfiguriert die Optionen für das
BEM-Helper-Plugin und initialisiert alle Module der App, initialisiert sich
selbst, sobald das Dokument bereit ist.</p>
</dd>
<dt><a href="#module_Data">Data</a></dt>
<dd><p>Lädt und verwaltet alle benötigten Daten für die App, bereitet die
Daten aus den Wörterbuch-Dateien auf, kann sie per Mediator an andere
Module senden und speichert über den Mediator empfangene Daten im
LocalStorage des Browsers.</p>
</dd>
<dt><a href="#module_Dictionary">Dictionary</a></dt>
<dd><p>Steuert die Wörterbuch-View der App; erstellt die Liste der Begriffe
per Template und fügt sie ein, ermöglicht das Sortieren und Filtern der
Liste und das Anzeigen von Details für gewählte Begriffe.</p>
</dd>
<dt><a href="#module_Featured">Featured</a></dt>
<dd><p>Steuert die Start-View der App; zeigt beim Start der App den Begriff des
Tages an, indem dieser zunächst per Mediator vom Data-Modul angefragt wird.</p>
</dd>
<dt><a href="#module_Mediator">Mediator</a></dt>
<dd><p>Stellt Funktionen bereit, um die Kommunikation zwischen Modulen zu
gewährleisten; erlaubt das Abonnieren von Kanälen, indem einem Kanal
eine Funktion hinzugefügt wird; durch das Veröffentlichen auf einem Kanal
werden alle gebundenen Funktionen mit den veröffentlichten Daten als
Funktionsparameter ausgeführt.</p>
</dd>
<dt><a href="#module_More">More</a></dt>
<dd><p>Steuert die Liste der Optionen in der Mehr-View; erzeugt die Liste
anhand der globalen Konfiguration, initialisiert den Slider des Moduls
und ermöglicht es, für jede Option die entsprechende Detail-Ansicht zu laden.</p>
</dd>
<dt><a href="#module_NavigationBar">NavigationBar</a></dt>
<dd><p>Steuert die Navigation-Bar der App; erzeugt die Inhalte des Moduls und
ermöglicht es, andere Module und Funktionalitäten der App über die
Navigations-Buttons zu steuern, indem Mediator-Nachrichten gesendet werden;
reagiert auch auf Mediator-Nachrichten, um auf Änderungen in den Views
zu reagieren und die Navigation-Bar entsprechend anzupassen; enthält
zudem ein Sortier-Dropdown, ein Suchfeld für das Wörterbuch und den
aktuellen Titel der View.</p>
</dd>
<dt><a href="#module_Play">Play</a></dt>
<dd><p>Ermöglicht das Abspielen von Audio-Dateien im Quiz und im Wörterbuch;
reagiert auf Klick-Events auf bestimmte Selektoren und spielt eine
in einem Audio-Tag definierte Audio-Datei ab.</p>
</dd>
<dt><a href="#module_Quiz">Quiz</a></dt>
<dd><p>Steuert die Quiz-View der App; erzeugt einen Slider für das Quiz und
füllt ihn mit Fragen, wählt die Fragen anhand der Fortschritts-Daten aus
dem Data-Modul und einen bestimmten Algorithmus aus und stellt somit bei
jedem Start ein neues Quiz zusammen; sendet beim Lösen der Fragen die
neuen Daten über den Mediator an das Data-Modul, um sie zu speichern.</p>
</dd>
<dt><a href="#module_Statistics">Statistics</a></dt>
<dd><p>Steuert die Statistik-View der App; erzeugt und animiert die Diagramme der
Statistik über den Wörterbuch-Fortschritt und die letzten Quiz-Spiele des
Nutzers anhand von angefragten Daten des Data-Moduls.</p>
</dd>
<dt><a href="#module_TabBar">TabBar</a></dt>
<dd><p>Steuert die Tab-Bar der App; erstellt beim Initialisieren alle Tabs anhand
der View-Panels, die dem Modul per Mediator vom View-Modul übergeben werden,
ermöglicht das Wechseln des View-Panels per Klick auf die Tabs und das
Ein-/Ausblenden der Tab-Bar bei bestimmten Events und Mediator-Nachrichten.</p>
</dd>
<dt><a href="#module_Template">Template</a></dt>
<dd><p>Stellt Funktionen bereit, um Inhalte mit Mustache-Templates in die App
einzufügen; lädt Templates vor, die in der Konfigurations-Datei des
Template-Verzeichnisses definiert sind.</p>
</dd>
<dt><a href="#module_Util">Util</a></dt>
<dd><p>Stellt diverse allgemeine Hilfs-Funktionen für andere Module der App bereit.</p>
</dd>
<dt><a href="#module_View">View</a></dt>
<dd><p>Steuert die View der App; erstellt beim Initialisieren alle View-Panels
die im CFG-Modul angegeben sind, ermöglich das Ein-/Ausblenden der View,
löst über den Mediator die Erstellung der View-Inhalte aus, falls diese
leer sind und reagiert auf Änderungen der View, z.B. durch das Keyboard
oder das Starten/Beenden des Quiz.</p>
</dd>
</dl>

### Classes

<dl>
<dt><a href="#Slider">Slider</a></dt>
<dd></dd>
</dl>

### Members

<dl>
<dt><a href="#CFG">CFG</a></dt>
<dd><p>Definiert globale Konstanten und Konfigurationen für alle Module; beinhaltet
Label-Texte, Datei-Pfade und -Endungen, Konfigurationen für das Quiz,
Kanal-Namen für den Mediator, Eigenschaften der View-Panels und Optionen
und Konstanten für Events, Icon-Namen und Zeitangaben.</p>
</dd>
</dl>

<a name="module_App"></a>

### App
Haupt-Modul der App; aktiviert FastClick, konfiguriert die Optionen für das
BEM-Helper-Plugin und initialisiert alle Module der App, initialisiert sich
selbst, sobald das Dokument bereit ist.

**Requires**: <code>[Template](#module_Template)</code>, <code>[Data](#module_Data)</code>, <code>[Featured](#module_Featured)</code>, <code>[Dictionary](#module_Dictionary)</code>, <code>[Quiz](#module_Quiz)</code>, <code>[Statistics](#module_Statistics)</code>, <code>[More](#module_More)</code>, <code>[NavigationBar](#module_NavigationBar)</code>, <code>[TabBar](#module_TabBar)</code>, <code>[Play](#module_Play)</code>, <code>[View](#module_View)</code>  
**Author:** Jakob Metzger <jakob.me@gmail.com>  
**License**: MIT  
**Copyright**: 2016 Jakob Metzger  

-

<a name="module_App..init"></a>

#### App~init()
Aktiviert FastClick, konfiguriert das BEM-Helpers-Plugin und
initialisiert alle Module der App in richtiger Reihenfolge.

**Kind**: inner method of <code>[App](#module_App)</code>  
**Access:** public  

-

<a name="module_Data"></a>

### Data
Lädt und verwaltet alle benötigten Daten für die App, bereitet die
Daten aus den Wörterbuch-Dateien auf, kann sie per Mediator an andere
Module senden und speichert über den Mediator empfangene Daten im
LocalStorage des Browsers.

**Requires**: <code>[Util](#module_Util)</code>, <code>[Mediator](#module_Mediator)</code>  
**Author:** Jakob Metzger <jakob.me@gmail.com>  
**License**: MIT  
**Copyright**: 2016 Jakob Metzger  

* [Data](#module_Data)
    * [~init()](#module_Data..init)
    * [~_subMediator()](#module_Data.._subMediator) ℗
    * [~_bindEvents()](#module_Data.._bindEvents) ℗
    * [~_initDataStored([dictionary])](#module_Data.._initDataStored) ℗
    * [~_loadDataStored([dictionary])](#module_Data.._loadDataStored) ℗
    * [~_loadDataConfig()](#module_Data.._loadDataConfig) ℗
    * [~_loadDataTerms()](#module_Data.._loadDataTerms) ℗
    * [~_checkFile(file)](#module_Data.._checkFile) ⇒ <code>Object</code> ℗
    * [~_checkTermFiles(alias)](#module_Data.._checkTermFiles) ⇒ <code>Object</code> ℗
    * [~_checkDictionaryFiles()](#module_Data.._checkDictionaryFiles) ℗
    * [~_processDataTerms()](#module_Data.._processDataTerms) ℗
    * [~_storeData()](#module_Data.._storeData) ℗
    * [~_updateDataTerm(data)](#module_Data.._updateDataTerm) ℗
    * [~_setDataTerm(alias, lvl, fail)](#module_Data.._setDataTerm) ℗
    * [~_updateDataScore(result)](#module_Data.._updateDataScore) ℗
    * [~_updateDataFeatured()](#module_Data.._updateDataFeatured) ℗
    * [~_setDataFeatured([alias])](#module_Data.._setDataFeatured) ℗
    * [~_serveDataTerms()](#module_Data.._serveDataTerms) ℗
    * [~_serveDataScores()](#module_Data.._serveDataScores) ℗
    * [~_serveDataConfig()](#module_Data.._serveDataConfig) ℗
    * [~_serveDataFeatured()](#module_Data.._serveDataFeatured) ℗
    * [~_serveDataDictionaries()](#module_Data.._serveDataDictionaries) ℗
    * [~_deleteData([confirm])](#module_Data.._deleteData) ℗
    * [~_changeDictionary([confirm])](#module_Data.._changeDictionary) ℗
    * [~_deleteConfirm()](#module_Data.._deleteConfirm) ℗
    * [~_dictionaryConfirm()](#module_Data.._dictionaryConfirm) ℗


-

<a name="module_Data..init"></a>

#### Data~init()
Initialisiert das Data-Modul; bindet Events, abonniert den Mediator
und lädt alle benötigten Daten aus Dateien und dem LocalStorage,
indem andere Funktionen ausgeführt werden.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** public  

-

<a name="module_Data.._subMediator"></a>

#### Data~_subMediator() ℗
Abonniert interne Funktionen beim Mediator.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

-

<a name="module_Data.._bindEvents"></a>

#### Data~_bindEvents() ℗
Bindet Funktionen an Events.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

-

<a name="module_Data.._initDataStored"></a>

#### Data~_initDataStored([dictionary]) ℗
Erstellt einen leeren Standard-Datensatz im LocalStorage; bei Angabe
eines optionalen Wörterbuch-Alias wird für das entsprechende Wörterbuch
ein leerer Datensatz angelegt, während die restlichen Daten unberührt
bleiben.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| [dictionary] | <code>String</code> | Optionaler Wörterbuch-Alias |


-

<a name="module_Data.._loadDataStored"></a>

#### Data~_loadDataStored([dictionary]) ℗
Lädt alle gespeicherten Daten für das aktuelle oder ein optional
angegebenes Wörterbuch aus dem LocalStorage; ruft _initDataStored auf,
falls noch keine Daten vorhanden sind.
zudem

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| [dictionary] | <code>String</code> | Optionaler Wörterbuch-Alias |


-

<a name="module_Data.._loadDataConfig"></a>

#### Data~_loadDataConfig() ℗
Lädt die Datei mit der Konfiguration für die verfügbaren
Wörterbücher und den Einstellungen für das Quiz;
stellt die Daten per Mediator bereit.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

-

<a name="module_Data.._loadDataTerms"></a>

#### Data~_loadDataTerms() ℗
Lädt die Datei zum eingestellten Wörterbuch und speichert die Daten in
einer lokalen Variable; ruft weitere Funktionen auf, um die geladenen
Daten aufzubereiten.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

-

<a name="module_Data.._checkFile"></a>

#### Data~_checkFile(file) ⇒ <code>Object</code> ℗
Überprüft die Existenz einer gegebenen Datei, indem eine
Ajax-Head-Anfrage zur Dateipfad gemacht wird.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Returns**: <code>Object</code> - Ajax-Antwort  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>String</code> | Pfad zur Datei |


-

<a name="module_Data.._checkTermFiles"></a>

#### Data~_checkTermFiles(alias) ⇒ <code>Object</code> ℗
Prüft mittels Ajax-Anfragen per _checkFile, ob ein Begriff mit gegebenem
Alias über Audio- und/oder Bild-Dateien verfügt; erweitert die internen
Wörterbuch-Daten um den Datei-Status.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Returns**: <code>Object</code> - Ajax-Objekte der Anfragen für Audio- und Bild-Dateien  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| alias | <code>String</code> | Alias des Begriffes |


-

<a name="module_Data.._checkDictionaryFiles"></a>

#### Data~_checkDictionaryFiles() ℗
Prüft alle Begriffe des Wörterbuches nach der Existenz von zugehörigen
Audio- und Bild-Dateien; aktualisiert die Daten entsprechend und
bereitet sie im Anschluss mittels _processDataTerms auf.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

-

<a name="module_Data.._processDataTerms"></a>

#### Data~_processDataTerms() ℗
Verknüpft alle Daten der Wörterbuch-Begriffe mit den
gespeicherten Fortschritts-Daten; stellt die aktuellen Daten
über den Mediator zur Verfügung.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

-

<a name="module_Data.._storeData"></a>

#### Data~_storeData() ℗
Speichert alle internen Daten des aktuellen Wörterbuches
als JSON-String im LocalStorage.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

-

<a name="module_Data.._updateDataTerm"></a>

#### Data~_updateDataTerm(data) ℗
Setzt das neue Level und die Anzahl der Fehlschläge
für einen bestimmten Begriff bei einer ausgelösten Mediator-Nachricht.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Übermittelte Mediator-Daten |


-

<a name="module_Data.._setDataTerm"></a>

#### Data~_setDataTerm(alias, lvl, fail) ℗
Setzt den Fortschritt für einen bestimmten Begriff; aktualisiert die
Stufe und die Fehlschläge des Begriffs, speichert den Fortschritt und
aktualisiert die Begriff-Daten mittels anderer Funktionen.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| alias | <code>String</code> | Alias des Begriffs |
| lvl | <code>Number</code> | Neue Stufe des Begriffs |
| fail | <code>Number</code> | Neue Fehlschläge des Begriffs |


-

<a name="module_Data.._updateDataScore"></a>

#### Data~_updateDataScore(result) ℗
Fügt einen neuen Wert zur Liste der letzten Spiele hinzu;
kürzt die Liste wieder auf die Maximallänge, speichert sie
und stellt sie zur Verfügung.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| result | <code>Number</code> | Neues Quiz-Ergebnis |


-

<a name="module_Data.._updateDataFeatured"></a>

#### Data~_updateDataFeatured() ℗
Prüft, ob ein gespeichertes Datum für den Begriff des Tages gesetzt ist;
vergleicht dieses Datum gegebenenfalls mit dem aktuellen und wählt einen
neuen zufälligen Begriff des Tages aus; stellt die Daten anschließend
mittels anderer Funktionen bereit.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

-

<a name="module_Data.._setDataFeatured"></a>

#### Data~_setDataFeatured([alias]) ℗
Setzt einen neuen Begriff des Tages; wählt einen zufälligen Begriff aus,
falls keiner angegeben ist und setzt das aktuelle Datum; speichert die
Daten und stellt sie anschließend bereit.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| [alias] | <code>String</code> | Begriff-Alias des Tages |


-

<a name="module_Data.._serveDataTerms"></a>

#### Data~_serveDataTerms() ℗
Liefert die Fortschritt-Liste in einer Mediator-Nachricht.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

-

<a name="module_Data.._serveDataScores"></a>

#### Data~_serveDataScores() ℗
Liefert die Ergebnisse der letzten Spiele in einer Mediator-Nachricht.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

-

<a name="module_Data.._serveDataConfig"></a>

#### Data~_serveDataConfig() ℗
Liefert die Konfiguration des Wörterbuches in einer Mediator-Nachricht.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

-

<a name="module_Data.._serveDataFeatured"></a>

#### Data~_serveDataFeatured() ℗
Liefert den zufälligen Begriff des Tages in einer Mediator-Nachricht.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

-

<a name="module_Data.._serveDataDictionaries"></a>

#### Data~_serveDataDictionaries() ℗
Liefert alle verfügbaren Wörterbucher in einer Mediator-Nachricht.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

-

<a name="module_Data.._deleteData"></a>

#### Data~_deleteData([confirm]) ℗
Löschte alle Daten über die letzten Spiele und den Fortschritt,
speichert die Daten und stellt sie über den Mediator bereit,
zeigt eine Bestätigung als Alert an; wird nur ausgeführt, wenn
der Parameter 1 (bestätigt) oder undefined ist.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| [confirm] | <code>Number</code> | Löschen bestätigt |


-

<a name="module_Data.._changeDictionary"></a>

#### Data~_changeDictionary([confirm]) ℗
Wechselt das aktuelle Wörterbuch anhand des intern gesetzten neuen
Wörterbuch-Alias zeigt eine Bestätigung als Alert an; wird nur
ausgeführt, wenn der Parameter 1 (bestätigt) oder undefined ist.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| [confirm] | <code>Number</code> | Ändern bestätigt |


-

<a name="module_Data.._deleteConfirm"></a>

#### Data~_deleteConfirm() ℗
Ruft einen Bestätigungs-Dialog zum Löschen der Fortschritts-Daten auf;
verwendet die Cordova-API, falls vorhanden, ansonsten den
Standard-JavaScript-Dialog.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

-

<a name="module_Data.._dictionaryConfirm"></a>

#### Data~_dictionaryConfirm() ℗
Ruft einen Bestätigungs-Dialog zum Ändern des Wörterbuches auf;
verwendet die Cordova-API, falls vorhanden, ansonsten den
Standard-JavaScript-Dialog.

**Kind**: inner method of <code>[Data](#module_Data)</code>  
**Access:** private  

-

<a name="module_Dictionary"></a>

### Dictionary
Steuert die Wörterbuch-View der App; erstellt die Liste der Begriffe
per Template und fügt sie ein, ermöglicht das Sortieren und Filtern der
Liste und das Anzeigen von Details für gewählte Begriffe.

**Requires**: <code>[Util](#module_Util)</code>, <code>[Mediator](#module_Mediator)</code>, <code>[Template](#module_Template)</code>  
**Author:** Jakob Metzger <jakob.me@gmail.com>  
**License**: MIT  
**Copyright**: 2016 Jakob Metzger  

* [Dictionary](#module_Dictionary)
    * [~init()](#module_Dictionary..init)
    * [~_bindEvents()](#module_Dictionary.._bindEvents) ℗
    * [~_subMediator()](#module_Dictionary.._subMediator) ℗
    * [~_create(data)](#module_Dictionary.._create) ℗
    * [~_initDom()](#module_Dictionary.._initDom) ℗
    * [~_renderList()](#module_Dictionary.._renderList) ℗
    * [~_renderDetails(renderNavBar)](#module_Dictionary.._renderDetails) ℗
    * [~_sort(data)](#module_Dictionary.._sort) ℗
    * [~_filter([keyword])](#module_Dictionary.._filter) ℗
    * [~_update(data)](#module_Dictionary.._update) ℗
    * [~_setDetails(event)](#module_Dictionary.._setDetails) ℗
    * [~_loadDetails(alias, [renderNavBar])](#module_Dictionary.._loadDetails) ℗
    * [~_back(data)](#module_Dictionary.._back) ℗
    * [~_restore(panel)](#module_Dictionary.._restore) ℗
    * [~_compareListItems(a, b)](#module_Dictionary.._compareListItems) ⇒ <code>Number</code> ℗


-

<a name="module_Dictionary..init"></a>

#### Dictionary~init()
Initialisiert das Dictionary-Modul; abonniert den Mediator.

**Kind**: inner method of <code>[Dictionary](#module_Dictionary)</code>  
**Access:** public  

-

<a name="module_Dictionary.._bindEvents"></a>

#### Dictionary~_bindEvents() ℗
Bindet Funktionen an Events.

**Kind**: inner method of <code>[Dictionary](#module_Dictionary)</code>  
**Access:** private  

-

<a name="module_Dictionary.._subMediator"></a>

#### Dictionary~_subMediator() ℗
Abonniert interne Funktionen beim Mediator.

**Kind**: inner method of <code>[Dictionary](#module_Dictionary)</code>  
**Access:** private  

-

<a name="module_Dictionary.._create"></a>

#### Dictionary~_create(data) ℗
Generiert bei einer Mediator-Nachricht mit dem Dictionary-Panel als
Daten die Inhalte des Wörterbuches; initialisiert alle DOM-Elemente
des Moduls, bindet Events, blendet die View wieder ein und fragt
per Mediator benötigte Daten vom Data-Modul an.

**Kind**: inner method of <code>[Dictionary](#module_Dictionary)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Übermittelte Mediator-Daten |


-

<a name="module_Dictionary.._initDom"></a>

#### Dictionary~_initDom() ℗
Initialisiert alle DOM-Elemente des Wörterbuches.

**Kind**: inner method of <code>[Dictionary](#module_Dictionary)</code>  
**Access:** private  

-

<a name="module_Dictionary.._renderList"></a>

#### Dictionary~_renderList() ℗
Rendert die Liste des Wörterbuches anhand eines Mustache-Templates
und der aktuell im Modul gesetzt Wörterbuch-Daten.

**Kind**: inner method of <code>[Dictionary](#module_Dictionary)</code>  
**Access:** private  

-

<a name="module_Dictionary.._renderDetails"></a>

#### Dictionary~_renderDetails(renderNavBar) ℗
Rendert die Details des aktuellen Begriffs anhand eines
Mustache-Templates; bewegt den Wörterbuch-Slider und
ändert gegebenenfalls die Navigation-Bar.

**Kind**: inner method of <code>[Dictionary](#module_Dictionary)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| renderNavBar | <code>Boolean</code> | Navigation-Bar neu rendern? |


-

<a name="module_Dictionary.._sort"></a>

#### Dictionary~_sort(data) ℗
Sortiert die Liste der Begriffe anhand der von einer Mediator-Nachricht
übergebenen Sortierung und Ordnung; rendert die Liste anschließend neu.

**Kind**: inner method of <code>[Dictionary](#module_Dictionary)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Übermittelte Daten |


-

<a name="module_Dictionary.._filter"></a>

#### Dictionary~_filter([keyword]) ℗
Filtert die Liste anhand des aktuell gesetzten Suchbegriffes
oder einem durch eine Mediator-Nachricht übergebenen Suchbegriff;
filtert die Original-Liste und kopiert übereinstimmende Einträge
in die Filter-Liste; sortiert die Liste anschließend.

**Kind**: inner method of <code>[Dictionary](#module_Dictionary)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| [keyword] | <code>String</code> | Neuer Suchbegriff |


-

<a name="module_Dictionary.._update"></a>

#### Dictionary~_update(data) ℗
Aktualisiert die Wörterbuch-Liste, sobald eine entsprechende
Mediator-Nachricht mit den erforderlichen Daten empfangen wird.

**Kind**: inner method of <code>[Dictionary](#module_Dictionary)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Übermittelte Daten |


-

<a name="module_Dictionary.._setDetails"></a>

#### Dictionary~_setDetails(event) ℗
Setzt einen neuen aktuellen Begriff anhand eines ausgelösten
Klick-Events; sperrt die Begriff-Liste und lädt und rendert den
neuen Begriff mittels _setDetails.

**Kind**: inner method of <code>[Dictionary](#module_Dictionary)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | Ausgelöstes Klick-Event |


-

<a name="module_Dictionary.._loadDetails"></a>

#### Dictionary~_loadDetails(alias, [renderNavBar]) ℗
Durchsucht die Begriff-Liste nach dem gegebenen Begriff-Alias und
aktualisiert den aktuellen Begriff; rendert die Begriff-Details neu.

**Kind**: inner method of <code>[Dictionary](#module_Dictionary)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| alias | <code>String</code> | Alias des neuen Begriffs |
| [renderNavBar] | <code>Boolean</code> | Navigation-Bar neu rendern? |


-

<a name="module_Dictionary.._back"></a>

#### Dictionary~_back(data) ℗
Bewegt den Wörterbuch-Slider anhand einer Mediatior-Nachricht
zurück zur Wörterbuch-Liste; leert die Begriff-Details.

**Kind**: inner method of <code>[Dictionary](#module_Dictionary)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Übermittelte Mediator-Daten |


-

<a name="module_Dictionary.._restore"></a>

#### Dictionary~_restore(panel) ℗
Setzt die internen Variablen und Zustände anhand einer
Mediator-Nachricht wieder auf ihre Standardwerte zurück; filtert die
Liste mit einem leeren Suchbegriff, setzt den Slider zur Liste zurück
und scrollt die Liste nach oben.

**Kind**: inner method of <code>[Dictionary](#module_Dictionary)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| panel | <code>Object</code> | Übermitteltes Panel-Objekt |


-

<a name="module_Dictionary.._compareListItems"></a>

#### Dictionary~_compareListItems(a, b) ⇒ <code>Number</code> ℗
Eine Vergleichs-Funktion für Elemente der Begriffliste;
wird von der JavaScript-Funktion "sort" verwendet.

**Kind**: inner method of <code>[Dictionary](#module_Dictionary)</code>  
**Returns**: <code>Number</code> - Ergebnis des Vergleichs  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Objekt</code> | Erstes zu vergleichende Listen-Objekt |
| b | <code>Objekt</code> | Zweites zu vergleichende Listen-Objekt |


-

<a name="module_Featured"></a>

### Featured
Steuert die Start-View der App; zeigt beim Start der App den Begriff des
Tages an, indem dieser zunächst per Mediator vom Data-Modul angefragt wird.

**Requires**: <code>[Util](#module_Util)</code>, <code>[Mediator](#module_Mediator)</code>, <code>[Template](#module_Template)</code>  
**Author:** Jakob Metzger <jakob.me@gmail.com>  
**License**: MIT  
**Copyright**: 2016 Jakob Metzger  

* [Featured](#module_Featured)
    * [~init()](#module_Featured..init)
    * [~_subMediator()](#module_Featured.._subMediator) ℗
    * [~_create(data)](#module_Featured.._create) ℗
    * [~_render()](#module_Featured.._render) ℗
    * [~_updateTerms(data)](#module_Featured.._updateTerms) ℗
    * [~_updateFeatured(data)](#module_Featured.._updateFeatured) ℗
    * [~_restore(panel)](#module_Featured.._restore) ℗


-

<a name="module_Featured..init"></a>

#### Featured~init()
Initialisiert das Featured-Modul; abonniert den Mediator.

**Kind**: inner method of <code>[Featured](#module_Featured)</code>  
**Access:** public  

-

<a name="module_Featured.._subMediator"></a>

#### Featured~_subMediator() ℗
Abonniert interne Funktionen beim Mediator.

**Kind**: inner method of <code>[Featured](#module_Featured)</code>  
**Access:** private  

-

<a name="module_Featured.._create"></a>

#### Featured~_create(data) ℗
Generiert bei einer Mediator-Nachricht mit dem Featured-Panel als
Daten die Inhalte der Start-View; initialisiert alle DOM-Elemente
des Moduls und fragt per Mediator benötigte Daten vom Data-Modul an.

**Kind**: inner method of <code>[Featured](#module_Featured)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Übermittelte Mediator-Daten |


-

<a name="module_Featured.._render"></a>

#### Featured~_render() ℗
Rendert den aktuellen Begriff mittels Mustache-Template,
falls alle benötigten Daten vorhanden sind.

**Kind**: inner method of <code>[Featured](#module_Featured)</code>  
**Access:** private  

-

<a name="module_Featured.._updateTerms"></a>

#### Featured~_updateTerms(data) ℗
Aktualisiert die Begriff-Liste, sobald eine entsprechende
Mediator-Nachricht mit den erforderlichen Daten empfangen wird;
rendert den Begriff neu.

**Kind**: inner method of <code>[Featured](#module_Featured)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Übermittelte Daten |


-

<a name="module_Featured.._updateFeatured"></a>

#### Featured~_updateFeatured(data) ℗
Aktualisiert den Begriff-Alias des Wort des Tages, sobald eine
entsprechende Mediator-Nachricht mit den erforderlichen
Daten empfangen wird; rendert den Begriff neu.

**Kind**: inner method of <code>[Featured](#module_Featured)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>String</code> | Übergebene Daten |


-

<a name="module_Featured.._restore"></a>

#### Featured~_restore(panel) ℗
Scrollt das Wort des Tages nach oben, wenn eine entsprechende
Mediator-Nachricht ausgelöst wird, um den Ausgangszustand
wiederherzustellen.

**Kind**: inner method of <code>[Featured](#module_Featured)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| panel | <code>String</code> | Übermittelte Daten |


-

<a name="module_Mediator"></a>

### Mediator
Stellt Funktionen bereit, um die Kommunikation zwischen Modulen zu
gewährleisten; erlaubt das Abonnieren von Kanälen, indem einem Kanal
eine Funktion hinzugefügt wird; durch das Veröffentlichen auf einem Kanal
werden alle gebundenen Funktionen mit den veröffentlichten Daten als
Funktionsparameter ausgeführt.

**Author:** Jakob Metzger <jakob.me@gmail.com>  
**License**: MIT  
**Copyright**: 2016 Jakob Metzger  

* [Mediator](#module_Mediator)
    * [~sub(channel, callback)](#module_Mediator..sub) ⇒ <code>Object</code>
    * [~unsub(channel, callback)](#module_Mediator..unsub) ⇒ <code>Object</code>
    * [~pub(channel, [data])](#module_Mediator..pub) ⇒ <code>Object</code>


-

<a name="module_Mediator..sub"></a>

#### Mediator~sub(channel, callback) ⇒ <code>Object</code>
Fügt einem Kanal des Mediators eine Callback-Funktion hinzu;
erzeugt den Kanal, falls er noch nicht existiert.

**Kind**: inner method of <code>[Mediator](#module_Mediator)</code>  
**Returns**: <code>Object</code> - Interface des Moduls  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| channel | <code>String</code> | Name des Kanals |
| callback | <code>function</code> | Callback-Funktion |


-

<a name="module_Mediator..unsub"></a>

#### Mediator~unsub(channel, callback) ⇒ <code>Object</code>
Entfernt eine Callback-Funktion von einem Kanal des Mediators.

**Kind**: inner method of <code>[Mediator](#module_Mediator)</code>  
**Returns**: <code>Object</code> - Interface des Moduls  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| channel | <code>String</code> | Name des Kanals |
| callback | <code>function</code> | Callback-Funktion |


-

<a name="module_Mediator..pub"></a>

#### Mediator~pub(channel, [data]) ⇒ <code>Object</code>
Veröffentlich beliebige Daten auf einem angegebenen Kanal;
führt alle abonnierten Funktion mit den Daten als Argument aus.

**Kind**: inner method of <code>[Mediator](#module_Mediator)</code>  
**Returns**: <code>Object</code> - Interface des Moduls  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| channel | <code>String</code> | Name des Kanals |
| [data] | <code>\*</code> | Zu veröffentlichende Daten |


-

<a name="module_More"></a>

### More
Steuert die Liste der Optionen in der Mehr-View; erzeugt die Liste
anhand der globalen Konfiguration, initialisiert den Slider des Moduls
und ermöglicht es, für jede Option die entsprechende Detail-Ansicht zu laden.

**Requires**: <code>[Mediator](#module_Mediator)</code>, <code>[Template](#module_Template)</code>  
**Author:** Jakob Metzger <jakob.me@gmail.com>  
**License**: MIT  
**Copyright**: 2016 Jakob Metzger  

* [More](#module_More)
    * [~init()](#module_More..init)
    * [~_subMediator()](#module_More.._subMediator) ℗
    * [~_initDom()](#module_More.._initDom) ℗
    * [~_bindEvents()](#module_More.._bindEvents) ℗
    * [~_create(data)](#module_More.._create) ℗
    * [~_setOption(event)](#module_More.._setOption) ℗
    * [~_renderOption([renderNavBar])](#module_More.._renderOption) ℗
    * [~_back(data)](#module_More.._back) ℗
    * [~_updateTerms(data)](#module_More.._updateTerms) ℗
    * [~_updateDictionary(data)](#module_More.._updateDictionary) ℗
    * [~_updateDictionaries(data)](#module_More.._updateDictionaries) ℗
    * [~_restore(panel)](#module_More.._restore) ℗


-

<a name="module_More..init"></a>

#### More~init()
Initialisiert das More-Modul; abonniert den Mediator.

**Kind**: inner method of <code>[More](#module_More)</code>  
**Access:** public  

-

<a name="module_More.._subMediator"></a>

#### More~_subMediator() ℗
Abonniert interne Funktionen beim Mediator.

**Kind**: inner method of <code>[More](#module_More)</code>  
**Access:** private  

-

<a name="module_More.._initDom"></a>

#### More~_initDom() ℗
Initialisiert alle DOM-Elemente des More-Moduls.

**Kind**: inner method of <code>[More](#module_More)</code>  
**Access:** private  

-

<a name="module_More.._bindEvents"></a>

#### More~_bindEvents() ℗
Bindet Funktionen an Events.

**Kind**: inner method of <code>[More](#module_More)</code>  
**Access:** private  

-

<a name="module_More.._create"></a>

#### More~_create(data) ℗
Generiert bei einer Mediator-Nachricht mit dem More-Panel als
Daten die Inhalte der Options-Liste; initialisiert alle DOM-Elemente
des Moduls, bindet Events, blendet die View wieder ein und fragt
per Mediator benötigte Daten vom Data-Modul an.

**Kind**: inner method of <code>[More](#module_More)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Übermittelte Mediator-Daten |


-

<a name="module_More.._setOption"></a>

#### More~_setOption(event) ℗
Setzt bei einem Klick-Event die aktuell gewählte Option und rendert
die Detail-Ansicht für diese Option.

**Kind**: inner method of <code>[More](#module_More)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | Ausgelöstes Event |


-

<a name="module_More.._renderOption"></a>

#### More~_renderOption([renderNavBar]) ℗
Rendert die Detail-Ansicht der aktuell gewählten Option; fügt die
Inhalte per Template in die App ein, bewegt den Slider des Moduls und
sendet gegebenenfalls eine Mediator-Nachricht an die Navigation-Bar.

**Kind**: inner method of <code>[More](#module_More)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| [renderNavBar] | <code>Boolean</code> | Navigation neu rendern? |


-

<a name="module_More.._back"></a>

#### More~_back(data) ℗
Bewegt den Options-Slider anhand einer Mediatior-Nachricht
zurück zur Options-Liste; leert die Options-Details.

**Kind**: inner method of <code>[More](#module_More)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Übermittelte Mediator-Daten |


-

<a name="module_More.._updateTerms"></a>

#### More~_updateTerms(data) ℗
Aktualisiert anhand einer Mediator-Nachricht die interne Kopie der
Begriff-Daten; rendert gegebenenfalls die aktuelle Ansicht neu.

**Kind**: inner method of <code>[More](#module_More)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Übermittelte Mediator-Daten |


-

<a name="module_More.._updateDictionary"></a>

#### More~_updateDictionary(data) ℗
Aktualisiert anhand einer Mediator-Nachricht die interne Kopie der
Wörterbuch-Daten; rendert gegebenenfalls die aktuelle Ansicht neu.

**Kind**: inner method of <code>[More](#module_More)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Übermittelte Mediator-Daten |


-

<a name="module_More.._updateDictionaries"></a>

#### More~_updateDictionaries(data) ℗
Aktualisiert anhand einer Mediator-Nachricht die interne Kopie der
vorhandenen Wörterbücher; rendert gegebenenfalls die aktuelle
Ansicht neu.

**Kind**: inner method of <code>[More](#module_More)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Übermittelte Mediator-Daten |


-

<a name="module_More.._restore"></a>

#### More~_restore(panel) ℗
Setzt die internen Variablen und Zustände anhand einer
Mediator-Nachricht wieder auf ihre Standardwerte zurück; setzt den
Slider zur Liste zurück und scrollt sie nach oben.
und scrollt die Liste nach oben.

**Kind**: inner method of <code>[More](#module_More)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| panel | <code>Object</code> | Übermitteltes Panel-Objekt |


-

<a name="module_NavigationBar"></a>

### NavigationBar
Steuert die Navigation-Bar der App; erzeugt die Inhalte des Moduls und
ermöglicht es, andere Module und Funktionalitäten der App über die
Navigations-Buttons zu steuern, indem Mediator-Nachrichten gesendet werden;
reagiert auch auf Mediator-Nachrichten, um auf Änderungen in den Views
zu reagieren und die Navigation-Bar entsprechend anzupassen; enthält
zudem ein Sortier-Dropdown, ein Suchfeld für das Wörterbuch und den
aktuellen Titel der View.

**Requires**: <code>[Util](#module_Util)</code>, <code>[Mediator](#module_Mediator)</code>, <code>[Template](#module_Template)</code>  
**Author:** Jakob Metzger <jakob.me@gmail.com>  
**License**: MIT  
**Copyright**: 2016 Jakob Metzger  

* [NavigationBar](#module_NavigationBar)
    * [~init()](#module_NavigationBar..init)
    * [~_bindEvents()](#module_NavigationBar.._bindEvents) ℗
    * [~_subMediator()](#module_NavigationBar.._subMediator) ℗
    * [~_create()](#module_NavigationBar.._create) ℗
    * [~_initDom()](#module_NavigationBar.._initDom) ℗
    * [~_initCache()](#module_NavigationBar.._initCache) ℗
    * [~_render()](#module_NavigationBar.._render) ℗
    * [~_renderBtn($btn)](#module_NavigationBar.._renderBtn) ℗
    * [~_renderHead()](#module_NavigationBar.._renderHead) ℗
    * [~_renderSearch()](#module_NavigationBar.._renderSearch) ℗
    * [~_renderDropdown($selected)](#module_NavigationBar.._renderDropdown) ℗
    * [~_performAction(data)](#module_NavigationBar.._performAction) ℗
    * [~_triggerAction(event)](#module_NavigationBar.._triggerAction) ℗
    * [~_setSort(event)](#module_NavigationBar.._setSort) ℗
    * [~_setDropdown(willBeOpened, [$selected])](#module_NavigationBar.._setDropdown) ℗
    * [~_setBtn(button, action, icon)](#module_NavigationBar.._setBtn) ℗
    * [~_setBtnL(action, icon)](#module_NavigationBar.._setBtnL) ℗
    * [~_setBtnR(action, icon)](#module_NavigationBar.._setBtnR) ℗
    * [~_setHead(title)](#module_NavigationBar.._setHead) ℗
    * [~_setSearch(willBeActive, [triggerSearch])](#module_NavigationBar.._setSearch) ℗
    * [~_triggerSearch()](#module_NavigationBar.._triggerSearch) ℗
    * [~_focusSearch()](#module_NavigationBar.._focusSearch) ℗
    * [~_updateSearch()](#module_NavigationBar.._updateSearch) ℗
    * [~_clearSearch()](#module_NavigationBar.._clearSearch) ℗
    * [~_loadCache(index)](#module_NavigationBar.._loadCache) ℗
    * [~_restore(panel)](#module_NavigationBar.._restore) ℗
    * [~_update(data)](#module_NavigationBar.._update) ℗


-

<a name="module_NavigationBar..init"></a>

#### NavigationBar~init()
Initialisiert das NavigationBar-Modul; abonniert den Mediator und
erzeugt anhand eines Templates den Inhalt der Navigation-Bar.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** public  

-

<a name="module_NavigationBar.._bindEvents"></a>

#### NavigationBar~_bindEvents() ℗
Bindet Funktionen an Events.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

-

<a name="module_NavigationBar.._subMediator"></a>

#### NavigationBar~_subMediator() ℗
Abonniert interne Funktionen beim Mediator.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

-

<a name="module_NavigationBar.._create"></a>

#### NavigationBar~_create() ℗
Erzeugt die Navigation-Bar; fügt die Navigation-Bar mittels Template
ein und initialisiert die Elemente der Navigation-Bar.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

-

<a name="module_NavigationBar.._initDom"></a>

#### NavigationBar~_initDom() ℗
Initialisiert alle DOM-Elemente des NavigationBar-Moduls.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

-

<a name="module_NavigationBar.._initCache"></a>

#### NavigationBar~_initCache() ℗
Legt für jedes in der globalen Konfiguration vorhandene View-Panel
die Standard-Konfiguration der Navigation-Bar im internen Cache fest.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

-

<a name="module_NavigationBar.._render"></a>

#### NavigationBar~_render() ℗
Rendert alle Elemente der Navigation-Bar anhand der intern
gesetzten aktuellen Variablen.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

-

<a name="module_NavigationBar.._renderBtn"></a>

#### NavigationBar~_renderBtn($btn) ℗
Rendert einen gewählten Button (Links/Rechts) anhand seiner
gesetzten Eigenschaften (Aktion/Icon).

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| $btn | <code>Object</code> | DOM-Element des Buttons |


-

<a name="module_NavigationBar.._renderHead"></a>

#### NavigationBar~_renderHead() ℗
Rendert den Titel der Titelleiste anhand des aktuell gesetzten Titels.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

-

<a name="module_NavigationBar.._renderSearch"></a>

#### NavigationBar~_renderSearch() ℗
Rendert die Suche anhand der gesetzten Eigenschaften des Moduls.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

-

<a name="module_NavigationBar.._renderDropdown"></a>

#### NavigationBar~_renderDropdown($selected) ℗
Rendert das Dropdown-Menü anhand einer ausgewählten Option und den
aktuell gesetzten Eigenschaften des Menüs.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| $selected | <code>Object</code> | Ausgewählte Dropdown-Option als DOM-Element |


-

<a name="module_NavigationBar.._performAction"></a>

#### NavigationBar~_performAction(data) ℗
Führt anhand einer Mediator-Nachricht und dem darin enthaltenen Namen
einer Aktion die entsprechende Aktion innerhalb der Navigation-Bar aus;
verändert dabei gegebenenfalls die Buttons, den Titel, die Suche
und das Dropdown der Navigation-Bar.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Übermittelte Mediator-Daten |


-

<a name="module_NavigationBar.._triggerAction"></a>

#### NavigationBar~_triggerAction(event) ℗
Löst anhand eines Klick-Events auf einen Navigation-Bar-Button die damit
verknüpfte Aktion aus; sendet die Aktion über den Mediator.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | Ausgelöstes Klick-Event |


-

<a name="module_NavigationBar.._setSort"></a>

#### NavigationBar~_setSort(event) ℗
Setzt anhand eines Klick-Events die aktuelle Sortierung; sendet
die Sortierung per Mediator und blendet die Dropdown-Sortierung aus.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | Ausgelöstes Klick-Event |


-

<a name="module_NavigationBar.._setDropdown"></a>

#### NavigationBar~_setDropdown(willBeOpened, [$selected]) ℗
Blendet das Dropdown-Menü anhand des übergebenen Wertes ein oder aus;
setzt den zugehörigen Button entsprechend; aktualisiert optional
die ausgewählte Sortierungs-Option.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| willBeOpened | <code>Boolean</code> | Soll Dropdown geöffnet werden? |
| [$selected] | <code>Object</code> | DOM-Element der gewählten Option |


-

<a name="module_NavigationBar.._setBtn"></a>

#### NavigationBar~_setBtn(button, action, icon) ℗
Setzt die Aktion und das Icon eines angegebenen Buttons.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| button | <code>Object</code> | DOM-Element des Buttons |
| action | <code>String</code> | Neue Aktion |
| icon | <code>String</code> | Neues Icon |


-

<a name="module_NavigationBar.._setBtnL"></a>

#### NavigationBar~_setBtnL(action, icon) ℗
Setzt Aktion und Icon des linken Buttons.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>String</code> | Neue Aktion |
| icon | <code>String</code> | Neues Icon |


-

<a name="module_NavigationBar.._setBtnR"></a>

#### NavigationBar~_setBtnR(action, icon) ℗
Setzt Aktion und Icon des rechten Buttons.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>String</code> | Neue Aktion |
| icon | <code>String</code> | Neues Icon |


-

<a name="module_NavigationBar.._setHead"></a>

#### NavigationBar~_setHead(title) ℗
Setzt den aktuellen Titel und rendert ihn neu.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>String</code> | Neuer Titel |


-

<a name="module_NavigationBar.._setSearch"></a>

#### NavigationBar~_setSearch(willBeActive, [triggerSearch]) ℗
Aktiviert oder deaktiviert die Suche anhand des übergebenen Wertes;
setzt den zugehörigen Button entsprechend und rendert die Suche neu.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| willBeActive | <code>Boolean</code> |  | Wird Suche aktiviert? |
| [triggerSearch] | <code>Boolean</code> | <code>true</code> | Suchbegriff an Mediator senden? |


-

<a name="module_NavigationBar.._triggerSearch"></a>

#### NavigationBar~_triggerSearch() ℗
Sendet den aktuellen Suchbegriff an den Mediator.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

-

<a name="module_NavigationBar.._focusSearch"></a>

#### NavigationBar~_focusSearch() ℗
Fokussiert das Such-Input nach einem kurzen Delay.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

-

<a name="module_NavigationBar.._updateSearch"></a>

#### NavigationBar~_updateSearch() ℗
Ermittelt den aktuellen Suchbegriff und leitet diesen Wert weiter;
blendet den Clear-Button für das Input ein/aus.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

-

<a name="module_NavigationBar.._clearSearch"></a>

#### NavigationBar~_clearSearch() ℗
Leert und fokussiert das Suchfeld, löst ein Input-Event aus.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

-

<a name="module_NavigationBar.._loadCache"></a>

#### NavigationBar~_loadCache(index) ℗
Lädt eine Konfiguration anhand des übergebenen Indexes aus dem Cache,
falls sie vorhanden ist, und ersetzt die aktuelle Konfiguration.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>String</code> | Name der Konfiguration |


-

<a name="module_NavigationBar.._restore"></a>

#### NavigationBar~_restore(panel) ℗
Lädt anhand einer Mediator-Nachricht den Original-Zustand der
Navigation-Bar für ein bestimmtes View-Panel.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| panel | <code>String</code> | Name des View-Panels |


-

<a name="module_NavigationBar.._update"></a>

#### NavigationBar~_update(data) ℗
Aktualisiert anhand einer Mediator-Nachricht den Zustand
der Navigation-Bar; speichert den Zustand für das vorige View-Panel
im Cache und lädt den Zustand für das neue View-Panel aus dem Cache;
das geschieht bei einem Wechsel der View über die Tab-Bar.

**Kind**: inner method of <code>[NavigationBar](#module_NavigationBar)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Empfangene Mediator-Daten |


-

<a name="module_Play"></a>

### Play
Ermöglicht das Abspielen von Audio-Dateien im Quiz und im Wörterbuch;
reagiert auf Klick-Events auf bestimmte Selektoren und spielt eine
in einem Audio-Tag definierte Audio-Datei ab.

**Author:** Jakob Metzger <jakob.me@gmail.com>  
**License**: MIT  
**Copyright**: 2016 Jakob Metzger  

* [Play](#module_Play)
    * [~init()](#module_Play..init)
    * [~_bindEvents()](#module_Play.._bindEvents) ℗
    * [~_bindEventsAudio()](#module_Play.._bindEventsAudio) ℗
    * [~_play()](#module_Play.._play) ℗
    * [~_setLoading(isLoading)](#module_Play.._setLoading) ℗
    * [~_setPlaying(isPlaying)](#module_Play.._setPlaying) ℗
    * [~_render()](#module_Play.._render) ℗


-

<a name="module_Play..init"></a>

#### Play~init()
Initialisiert das Play-Modul; bindet Events.

**Kind**: inner method of <code>[Play](#module_Play)</code>  
**Access:** public  

-

<a name="module_Play.._bindEvents"></a>

#### Play~_bindEvents() ℗
Bindet Funktionen an Events.

**Kind**: inner method of <code>[Play](#module_Play)</code>  
**Access:** private  

-

<a name="module_Play.._bindEventsAudio"></a>

#### Play~_bindEventsAudio() ℗
Bindet Audio-spezifische Funktionen an Modul-Elemente.

**Kind**: inner method of <code>[Play](#module_Play)</code>  
**Access:** private  

-

<a name="module_Play.._play"></a>

#### Play~_play() ℗
Initialisiert bei einem Klick-Event eine Audio-Instanz und deren
DOM-Elemente, bindet Funktionen an die Elemente und spiel die
zugehörige Audio-Datei ab.

**Kind**: inner method of <code>[Play](#module_Play)</code>  
**Access:** private  

-

<a name="module_Play.._setLoading"></a>

#### Play~_setLoading(isLoading) ℗
Setzt den Lade-Zustand des Audui-Moduls und rendert es neu.

**Kind**: inner method of <code>[Play](#module_Play)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| isLoading | <code>Boolean</code> | Neuer Lade-Zustand |


-

<a name="module_Play.._setPlaying"></a>

#### Play~_setPlaying(isPlaying) ℗
Setzt den aktuellen Abspiel-Zustand des Play-Moduls und rendert es neu.

**Kind**: inner method of <code>[Play](#module_Play)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| isPlaying | <code>Boolean</code> | Neuer Abspiel-Zustand |


-

<a name="module_Play.._render"></a>

#### Play~_render() ℗
Rendert alle Elemente des Moduls anhand der intern
gesetzten aktuellen Variablen.

**Kind**: inner method of <code>[Play](#module_Play)</code>  
**Access:** private  

-

<a name="module_Quiz"></a>

### Quiz
Steuert die Quiz-View der App; erzeugt einen Slider für das Quiz und
füllt ihn mit Fragen, wählt die Fragen anhand der Fortschritts-Daten aus
dem Data-Modul und einen bestimmten Algorithmus aus und stellt somit bei
jedem Start ein neues Quiz zusammen; sendet beim Lösen der Fragen die
neuen Daten über den Mediator an das Data-Modul, um sie zu speichern.

**Requires**: <code>[Util](#module_Util)</code>, <code>[Mediator](#module_Mediator)</code>, <code>[Template](#module_Template)</code>  
**Author:** Jakob Metzger <jakob.me@gmail.com>  
**License**: MIT  
**Copyright**: 2016 Jakob Metzger  

* [Quiz](#module_Quiz)
    * [~init()](#module_Quiz..init)
    * [~_subMediator()](#module_Quiz.._subMediator) ℗
    * [~_bindEvents()](#module_Quiz.._bindEvents) ℗
    * [~_create(data)](#module_Quiz.._create) ℗
    * [~_initDom()](#module_Quiz.._initDom) ℗
    * [~_renderProgressbar()](#module_Quiz.._renderProgressbar) ℗
    * [~_setProgress(step, status)](#module_Quiz.._setProgress) ℗
    * [~_setStep(step)](#module_Quiz.._setStep) ℗
    * [~_resetProgress()](#module_Quiz.._resetProgress) ℗
    * [~_setProgressbarAnimation(animated)](#module_Quiz.._setProgressbarAnimation) ℗
    * [~_skipStep()](#module_Quiz.._skipStep) ℗
    * [~_nextStep()](#module_Quiz.._nextStep) ℗
    * [~_start([event])](#module_Quiz.._start) ℗
    * [~_pickQuestions()](#module_Quiz.._pickQuestions) ℗
    * [~_pickQuestionType(term)](#module_Quiz.._pickQuestionType) ⇒ <code>Object</code> ℗
    * [~_processQuestions()](#module_Quiz.._processQuestions) ℗
    * [~_pickChars(type, answer)](#module_Quiz.._pickChars) ⇒ <code>Object</code> &#124; <code>Boolean</code> ℗
    * [~_clearQuestions([finish])](#module_Quiz.._clearQuestions) ℗
    * [~_pickAnswers(term, propAnswers, propRight, [pictures])](#module_Quiz.._pickAnswers) ⇒ <code>Array.&lt;Object&gt;</code> ℗
    * [~_processSolution(correct)](#module_Quiz.._processSolution) ℗
    * [~_evaluateAnswer(event)](#module_Quiz.._evaluateAnswer) ℗
    * [~_evaluateInput(event)](#module_Quiz.._evaluateInput) ℗
    * [~_addLetter(event)](#module_Quiz.._addLetter) ℗
    * [~_removeLetter(event)](#module_Quiz.._removeLetter) ℗
    * [~_toggleBackspace(locked)](#module_Quiz.._toggleBackspace) ℗
    * [~_updateTerm(correct)](#module_Quiz.._updateTerm) ℗
    * [~_renderLevel(level)](#module_Quiz.._renderLevel) ℗
    * [~_lockSkip()](#module_Quiz.._lockSkip) ℗
    * [~_unlockSkip()](#module_Quiz.._unlockSkip) ℗
    * [~_unlockContinue()](#module_Quiz.._unlockContinue) ℗
    * [~_lockSolve()](#module_Quiz.._lockSolve) ℗
    * [~_hideSolve()](#module_Quiz.._hideSolve) ℗
    * [~_showSolve()](#module_Quiz.._showSolve) ℗
    * [~_focusInput()](#module_Quiz.._focusInput) ℗
    * [~_continue(event)](#module_Quiz.._continue) ℗
    * [~_renderAnswers($answer, correct)](#module_Quiz.._renderAnswers) ℗
    * [~_renderInput($answer, correct)](#module_Quiz.._renderInput) ℗
    * [~_finish()](#module_Quiz.._finish) ℗
    * [~_renderFinish(result, skipped, rating)](#module_Quiz.._renderFinish) ℗
    * [~_renderStart()](#module_Quiz.._renderStart) ℗
    * [~_update(data)](#module_Quiz.._update) ℗
    * [~_setConfig(data)](#module_Quiz.._setConfig) ℗
    * [~_restore(panel)](#module_Quiz.._restore) ℗
    * [~_navbarAction(data)](#module_Quiz.._navbarAction) ℗
    * [~_resetAll([restart])](#module_Quiz.._resetAll) ℗


-

<a name="module_Quiz..init"></a>

#### Quiz~init()
Initialisiert das Quiz-Modul; abonniert den Mediator.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** public  

-

<a name="module_Quiz.._subMediator"></a>

#### Quiz~_subMediator() ℗
Abonniert interne Funktionen beim Mediator.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

-

<a name="module_Quiz.._bindEvents"></a>

#### Quiz~_bindEvents() ℗
Bindet Funktionen an Events.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

-

<a name="module_Quiz.._create"></a>

#### Quiz~_create(data) ℗
Generiert bei einer Mediator-Nachricht mit dem Quiz-Panel als
Daten die Inhalte des Quiz; initialisiert alle DOM-Elemente
des Moduls, bindet Events, blendet die View wieder ein und fragt
per Mediator benötigte Daten vom Data-Modul an.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Übermittelte Mediator-Daten |


-

<a name="module_Quiz.._initDom"></a>

#### Quiz~_initDom() ℗
Initialisiert alle DOM-Elemente des Quiz.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

-

<a name="module_Quiz.._renderProgressbar"></a>

#### Quiz~_renderProgressbar() ℗
Rendert alle Schritte der Fortschrittsleiste anhand 
des aktuellen Fortschrittes.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

-

<a name="module_Quiz.._setProgress"></a>

#### Quiz~_setProgress(step, status) ℗
Setzt den Status eines Schrittes des Quizes; rendert anschließend
die Fortschrittsleiste neu.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| step | <code>Number</code> | Nummer des Quiz-Schrittes |
| status | <code>String</code> | Neuer Status des Schrittes |


-

<a name="module_Quiz.._setStep"></a>

#### Quiz~_setStep(step) ℗
Setzt das Quiz auf den gegebenen Schritt; rendert anschließend
die Fortschrittsleiste neu.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| step | <code>Number</code> | Neuer Quiz-Schritt |


-

<a name="module_Quiz.._resetProgress"></a>

#### Quiz~_resetProgress() ℗
Setzt den aktuellen Fortschritt des Quiz zurück.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

-

<a name="module_Quiz.._setProgressbarAnimation"></a>

#### Quiz~_setProgressbarAnimation(animated) ℗
Aktiviert oder deaktiviert die Animationen für die Icons
des Fortschritts-Balkens.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| animated | <code>Boolean</code> | Animationen aktivieren? |


-

<a name="module_Quiz.._skipStep"></a>

#### Quiz~_skipStep() ℗
Markiert den aktuellen Schritt als übersprungen,
fährt zum nächsten Schritt fort.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

-

<a name="module_Quiz.._nextStep"></a>

#### Quiz~_nextStep() ℗
Markiert den nächsten Schritt als aktiv, bewegt den Slider weiter.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

-

<a name="module_Quiz.._start"></a>

#### Quiz~_start([event]) ℗
Startet das Quiz; bewegt den Slider zur ersten Frage, aktiviert den
ersten Schritt und sendet eine Mediator-Nachricht an andere Module,
um den Viewport anzupassen.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| [event] | <code>Object</code> | Ausgelöstes Klick-Event |


-

<a name="module_Quiz.._pickQuestions"></a>

#### Quiz~_pickQuestions() ℗
Sucht zufällige Fragen für das Quiz aus; stellt sicher, dass
jeder Begriff nur einmal im Quiz auftaucht, gewichtet die
die Begriffe nach ihren bisherigen Fehlschlägen (je mehr
Fehlschläge, desto höher die Wahrscheinlichkeit).

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

-

<a name="module_Quiz.._pickQuestionType"></a>

#### Quiz~_pickQuestionType(term) ⇒ <code>Object</code> ℗
Wählt anhand eines übergebenen Begriffs und den globalen Einstellungen
für die Quiz-Typen einen passenden Typen für die Frage zu diesem
Begriff aus; zieht die Stufe des Begriffs, das Vorhandensein
eines Bildes und die Vollständigkeit der Antwortmöglichkeiten
für die Auswahl hinzu.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Returns**: <code>Object</code> - Konfiguration des Frage-Typs  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| term | <code>Object</code> | Begriff-Daten für den Frage-Typen |


-

<a name="module_Quiz.._processQuestions"></a>

#### Quiz~_processQuestions() ℗
Ergänzt die ausgewählten Fragen um zusätzliche Daten für die Darstellung
und Funktionsweise des Quiz; rendert die Fragen anschließend.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

-

<a name="module_Quiz.._pickChars"></a>

#### Quiz~_pickChars(type, answer) ⇒ <code>Object</code> &#124; <code>Boolean</code> ℗
Wählt anhand des gegebenen Frage-Typs und der Antworten
die Zeichen für die Ausgabe der Lösung aus; mischt die Zeichen
der Lösung durch und wandelt sie in Großbuchstaben um. Falls
der Typ oder die Antworten nicht stimmen, wird false zurückgegeben.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Returns**: <code>Object</code> &#124; <code>Boolean</code> - Konfiguration der Buchstaben oder false  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>Object</code> | Typ der Quiz-Frage |
| answer | <code>Array.&lt;Object&gt;</code> | Antworten der Quiz-Frage |


-

<a name="module_Quiz.._clearQuestions"></a>

#### Quiz~_clearQuestions([finish]) ℗
Entfernt sämtlichen Inhalt aus allen Fragen.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [finish] | <code>Boolean</code> | <code>false</code> | Quiz-Ende ebenfalls leeren? |


-

<a name="module_Quiz.._pickAnswers"></a>

#### Quiz~_pickAnswers(term, propAnswers, propRight, [pictures]) ⇒ <code>Array.&lt;Object&gt;</code> ℗
Stellt für einen gegebenen Begriff zufällig Antworten zusammen.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Returns**: <code>Array.&lt;Object&gt;</code> - Liste der zusammengestellten Antworten  
**Access:** private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| term | <code>Object</code> |  | Begriff mit Antworten |
| propAnswers | <code>String</code> |  | Name der Antwort-Eigenschaft |
| propRight | <code>String</code> |  | Name der Korrektheit-Eigenschaft |
| [pictures] | <code>Boolean</code> | <code>false</code> | Antworten sind Bilder? |


-

<a name="module_Quiz.._processSolution"></a>

#### Quiz~_processSolution(correct) ℗
Führt Funktionen aus, um eine gegebene Lösung in Abhängigkeit
ihrer Korrektheit zu verarbeiten; aktualisiert den Fortschritts-Balken,
aktualisiert die gespeicherten Daten und zeigt den Weiter-Button an.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| correct | <code>Boolean</code> | Lösung ist korrekt |


-

<a name="module_Quiz.._evaluateAnswer"></a>

#### Quiz~_evaluateAnswer(event) ℗
Prüft, ob eine geklickte Antwort richtig oder falsch ist; setzt den
aktuellen Fortschritt entsprechend und rendert alle Antworten.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | Ausgelöstes Klick-Event |


-

<a name="module_Quiz.._evaluateInput"></a>

#### Quiz~_evaluateInput(event) ℗
Evaluiert bei einem Klick-Event das Input der aktuellen Quiz-Frage;
sperrt den Lösen-Button, rendert das Input anhand der Korrektheit
der eingegebenen Lösung neu und verarbeitet die Lösung.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | Ausgelöstes Klick-Event |


-

<a name="module_Quiz.._addLetter"></a>

#### Quiz~_addLetter(event) ℗
Fügt bei einem Klick-Event einen Buchstaben zum Quiz-Input der aktuellen
Frage hinzu; deaktiviert den gedrückten Button und aktualisiert die
Daten des Inputs.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | Ausgelöstes Klick-Event |


-

<a name="module_Quiz.._removeLetter"></a>

#### Quiz~_removeLetter(event) ℗
Entfernt bei einem Klick-Event einen Buchstaben aus dem Quiz-Input der
aktuellen Frage; aktualisiert die Daten des Inputs und deaktiviert
gegebenenfalls den Backspace-Button.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | Ausgelöstes Klick-Event |


-

<a name="module_Quiz.._toggleBackspace"></a>

#### Quiz~_toggleBackspace(locked) ℗
Sperrt oder entsperrt den Backspace-Button der aktuellen Frage.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| locked | <code>Boolean</code> | Backspace-Button sperren? |


-

<a name="module_Quiz.._updateTerm"></a>

#### Quiz~_updateTerm(correct) ℗
Aktualisiert den Begriff der aktuellen Frage entsprechend
der Korrektheit der gegebenen Antwort über eine Mediator-Nachricht.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| correct | <code>Boolean</code> | Wurde der Begriff richtig erraten? |


-

<a name="module_Quiz.._renderLevel"></a>

#### Quiz~_renderLevel(level) ℗
Rendert die Level-Anzeige der aktuellen Frage anhand des übergebenen
Levels; aktualisiert die Anzahl der Sterne und beachtet dabei das
global definierte Level-Maximum.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| level | <code>Number</code> | Neues Level |


-

<a name="module_Quiz.._lockSkip"></a>

#### Quiz~_lockSkip() ℗
Sendet eine Nachricht über den Mediator, um den Überspringen-Button
zu deaktivieren und somit das Überspringen unmöglich zu machen.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

-

<a name="module_Quiz.._unlockSkip"></a>

#### Quiz~_unlockSkip() ℗
Sendet eine Nachricht über den Mediator, um den Überspringen-Button
zu aktivieren und somit das Überspringen möglich zu machen.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

-

<a name="module_Quiz.._unlockContinue"></a>

#### Quiz~_unlockContinue() ℗
Entsperrt den Weiter-Button der aktuellen Frage, um es zu
ermöglichen, zur nächsten Frage fortzufahren.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

-

<a name="module_Quiz.._lockSolve"></a>

#### Quiz~_lockSolve() ℗
Sperrt den Lösen-Button der aktuellen Frage.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

-

<a name="module_Quiz.._hideSolve"></a>

#### Quiz~_hideSolve() ℗
Blendet den Lösen-Button der aktuellen Frage aus.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

-

<a name="module_Quiz.._showSolve"></a>

#### Quiz~_showSolve() ℗
Blendet den Lösen-Button der aktuellen Frage ein.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

-

<a name="module_Quiz.._focusInput"></a>

#### Quiz~_focusInput() ℗
Fokussiert den Input der aktuellen Frage, falls vorhanden.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

-

<a name="module_Quiz.._continue"></a>

#### Quiz~_continue(event) ℗
Fährt zur nächsten Frage des Quiz fort, falls der Weiter-Button
nicht gesperrt ist; reagiert auf ein Klick-Event.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | Ausgelöstes Klick-Event |


-

<a name="module_Quiz.._renderAnswers"></a>

#### Quiz~_renderAnswers($answer, correct) ℗
Rendert die Antworten anhand einer ausgewählten Antwort;
aktualisiert die Status-Klasse aller benachbarten Antworten.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| $answer | <code>Object</code> | DOM-Element der gewählten Antwort |
| correct | <code>Boolean</code> | War die Antwort korrekt? |


-

<a name="module_Quiz.._renderInput"></a>

#### Quiz~_renderInput($answer, correct) ℗
Rendert den übergebenen Input; aktualisiert seine Status-Klasse
und blendet die Lösung ein; sperrt das Input.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| $answer | <code>Object</code> | DOM-Element des Inputs |
| correct | <code>Boolean</code> | War die Antwort korrekt? |


-

<a name="module_Quiz.._finish"></a>

#### Quiz~_finish() ℗
Beendet das Quiz; berechnet das Endergebnis, ermittelt die
entsprechende Bewertung aus der Konfiguration, rendert den Abschluss
und sendet das Ergebnis über den Mediator.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

-

<a name="module_Quiz.._renderFinish"></a>

#### Quiz~_renderFinish(result, skipped, rating) ℗
Rendert das Quiz-Ende mit einem Mustache-Template; fügt
alle Ergebnisse des Quizes ein und animiert anschließend
das Ergebnis-Diagramm.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| result | <code>Number</code> | Anzahl er richtigen Antworten |
| skipped | <code>Number</code> | Anzahl der übersprungenen Fragen |
| rating | <code>Object</code> | Bewertungs-Objekt |


-

<a name="module_Quiz.._renderStart"></a>

#### Quiz~_renderStart() ℗
Rendert das Start-Slide des Quizes anhand eines Mustache-Templates neu.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

-

<a name="module_Quiz.._update"></a>

#### Quiz~_update(data) ℗
Aktualisiert die interne Kopie der Wörterbuch-Daten des Quizes
anhand einer Mediator-Nachricht.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Übermittelte Mediator-Daten |


-

<a name="module_Quiz.._setConfig"></a>

#### Quiz~_setConfig(data) ℗
Setzt die Konfiguration des Wörterbuches anhand einer Mediator-Nachricht.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Übermittelte Mediator-Daten |


-

<a name="module_Quiz.._restore"></a>

#### Quiz~_restore(panel) ℗
Stellt die Standard-Konfiguration des Quizes anhand
einer Mediator-Nachricht wieder her.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| panel | <code>String</code> | Übermittelte Mediator-Daten |


-

<a name="module_Quiz.._navbarAction"></a>

#### Quiz~_navbarAction(data) ℗
Entscheided anhand einer Mediator-Nachricht, welche
Aktion beim Klick eines Navigation-Bar-Buttons ausgeführt wird.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Übermittelte Mediatir-Daten |


-

<a name="module_Quiz.._resetAll"></a>

#### Quiz~_resetAll([restart]) ℗
Setzt alle Kompenenten und Daten vom Quiz zurück.

**Kind**: inner method of <code>[Quiz](#module_Quiz)</code>  
**Access:** private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [restart] | <code>Boolean</code> | <code>false</code> | Quiz nach dem Zurücksetzen starten? |


-

<a name="module_Statistics"></a>

### Statistics
Steuert die Statistik-View der App; erzeugt und animiert die Diagramme der
Statistik über den Wörterbuch-Fortschritt und die letzten Quiz-Spiele des
Nutzers anhand von angefragten Daten des Data-Moduls.

**Requires**: <code>[Util](#module_Util)</code>, <code>[Mediator](#module_Mediator)</code>, <code>[Template](#module_Template)</code>  
**Author:** Jakob Metzger <jakob.me@gmail.com>  
**License**: MIT  
**Copyright**: 2016 Jakob Metzger  

* [Statistics](#module_Statistics)
    * [~init()](#module_Statistics..init)
    * [~_subMediator()](#module_Statistics.._subMediator) ℗
    * [~_create(data)](#module_Statistics.._create) ℗
    * [~_renderChart($target, data, steps, hrznt, stars)](#module_Statistics.._renderChart) ℗
    * [~_renderScores()](#module_Statistics.._renderScores) ℗
    * [~_renderProgress()](#module_Statistics.._renderProgress) ℗
    * [~_renderDictionary()](#module_Statistics.._renderDictionary) ℗
    * [~_updateScores(data)](#module_Statistics.._updateScores) ℗
    * [~_updateProgress(data)](#module_Statistics.._updateProgress) ℗
    * [~_growCharts([shrink])](#module_Statistics.._growCharts) ℗
    * [~_restore(panel)](#module_Statistics.._restore) ℗


-

<a name="module_Statistics..init"></a>

#### Statistics~init()
Initialisiert das Statistics-Modul; abonniert den Mediator.

**Kind**: inner method of <code>[Statistics](#module_Statistics)</code>  
**Access:** public  

-

<a name="module_Statistics.._subMediator"></a>

#### Statistics~_subMediator() ℗
Abonniert interne Funktionen beim Mediator.

**Kind**: inner method of <code>[Statistics](#module_Statistics)</code>  
**Access:** private  

-

<a name="module_Statistics.._create"></a>

#### Statistics~_create(data) ℗
Generiert bei einer Mediator-Nachricht mit dem Statistics-Panel als
Daten die Inhalte der Statistik; initialisiert alle DOM-Elemente
des Moduls, blendet die View wieder ein, fragt per Mediator benötigte
Daten vom Data-Modul an und animiert die Diagramme der Statistik.

**Kind**: inner method of <code>[Statistics](#module_Statistics)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Übermittelte Mediator-Daten |


-

<a name="module_Statistics.._renderChart"></a>

#### Statistics~_renderChart($target, data, steps, hrznt, stars) ℗
Rendert ein Diagramm mit gegebenen Eigenschaften anhand eines
Mustache-Templates in einen angegebenen Container.

**Kind**: inner method of <code>[Statistics](#module_Statistics)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| $target | <code>Object</code> | Ziel-DOM-Element |
| data | <code>Array.&lt;Object&gt;</code> | Array der Diagramm-Daten |
| steps | <code>Array.&lt;Number&gt;</code> | Array der Skala-Schritte |
| hrznt | <code>Boolean</code> | Horizontales Diagramm? |
| stars | <code>Boolean</code> | Level-Sterne anzeigen? |


-

<a name="module_Statistics.._renderScores"></a>

#### Statistics~_renderScores() ℗
Rendert ein Diagramm für die letzten Spielergebnisse mit Hilfe
der _renderChart Methode.

**Kind**: inner method of <code>[Statistics](#module_Statistics)</code>  
**Access:** private  

-

<a name="module_Statistics.._renderProgress"></a>

#### Statistics~_renderProgress() ℗
Rendert das Diagramm für den Wörterbuch-Fortschritt mit Hilfe
der _renderChart Methode.

**Kind**: inner method of <code>[Statistics](#module_Statistics)</code>  
**Access:** private  

-

<a name="module_Statistics.._renderDictionary"></a>

#### Statistics~_renderDictionary() ℗
Rendert das Diagramm für die Wörterbuch-Zusammensetzung mit Hilfe
der _renderChart Methode.

**Kind**: inner method of <code>[Statistics](#module_Statistics)</code>  
**Access:** private  

-

<a name="module_Statistics.._updateScores"></a>

#### Statistics~_updateScores(data) ℗
Aktualisiert die Spielergebnis-Liste, sobald eine entsprechende
Mediator-Nachricht mit den erforderlichen Daten empfangen wird.

**Kind**: inner method of <code>[Statistics](#module_Statistics)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Übermittelte Mediator-Daten |


-

<a name="module_Statistics.._updateProgress"></a>

#### Statistics~_updateProgress(data) ℗
Aktualisiert die Fortschritts-Liste, sobald eine entsprechende
Mediator-Nachricht mit den erforderlichen Daten empfangen wird.

**Kind**: inner method of <code>[Statistics](#module_Statistics)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Übermittelte Mediator-Daten |


-

<a name="module_Statistics.._growCharts"></a>

#### Statistics~_growCharts([shrink]) ℗
Fügt den Diagrammen der Statistik eine Klasse hinzu oder entfernt sie,
um sie zu animieren; blendet Diagramm gegebenenfalls vorher aus.

**Kind**: inner method of <code>[Statistics](#module_Statistics)</code>  
**Access:** private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [shrink] | <code>Boolean</code> | <code>false</code> | Diagramm vorher ausblenden |


-

<a name="module_Statistics.._restore"></a>

#### Statistics~_restore(panel) ℗
Scrollt die Statistik nach oben und animiert die Diagramme, wenn
ein entsprechende Mediator-Nachricht empfangen wird.

**Kind**: inner method of <code>[Statistics](#module_Statistics)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| panel | <code>String</code> | Übermittelte Mediator-Daten |


-

<a name="module_TabBar"></a>

### TabBar
Steuert die Tab-Bar der App; erstellt beim Initialisieren alle Tabs anhand
der View-Panels, die dem Modul per Mediator vom View-Modul übergeben werden,
ermöglicht das Wechseln des View-Panels per Klick auf die Tabs und das
Ein-/Ausblenden der Tab-Bar bei bestimmten Events und Mediator-Nachrichten.

**Requires**: <code>[Util](#module_Util)</code>, <code>[Mediator](#module_Mediator)</code>, <code>[Template](#module_Template)</code>  
**Author:** Jakob Metzger <jakob.me@gmail.com>  
**License**: MIT  
**Copyright**: 2016 Jakob Metzger  

* [TabBar](#module_TabBar)
    * [~init()](#module_TabBar..init)
    * [~_bindEvents()](#module_TabBar.._bindEvents) ℗
    * [~_subMediator()](#module_TabBar.._subMediator) ℗
    * [~_create(panels)](#module_TabBar.._create) ℗
    * [~_render()](#module_TabBar.._render) ℗
    * [~_setTab(tab)](#module_TabBar.._setTab) ℗
    * [~_hide()](#module_TabBar.._hide) ℗
    * [~_show()](#module_TabBar.._show) ℗
    * [~_disable()](#module_TabBar.._disable) ℗
    * [~_enable()](#module_TabBar.._enable) ℗


-

<a name="module_TabBar..init"></a>

#### TabBar~init()
Initialisiert das TabBar-Modul; bindet Events und abonniert den
Mediator, indem andere Funktionen ausgeführt werden.

**Kind**: inner method of <code>[TabBar](#module_TabBar)</code>  
**Access:** public  

-

<a name="module_TabBar.._bindEvents"></a>

#### TabBar~_bindEvents() ℗
Bindet Funktionen an Events.

**Kind**: inner method of <code>[TabBar](#module_TabBar)</code>  
**Access:** private  

-

<a name="module_TabBar.._subMediator"></a>

#### TabBar~_subMediator() ℗
Abonniert interne Funktionen beim Mediator.

**Kind**: inner method of <code>[TabBar](#module_TabBar)</code>  
**Access:** private  

-

<a name="module_TabBar.._create"></a>

#### TabBar~_create(panels) ℗
Generiert für jedes vom View-Modul übergebene Panel einen Tab,
indem das Tab-Bar-Template per Mustache mit den Panel-Daten geladen
und in die App eingefügt wird; aktiviert den ersten Tab.

**Kind**: inner method of <code>[TabBar](#module_TabBar)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| panels | <code>Object</code> | Vom View-Modul übergebenes Panel-Objekt |


-

<a name="module_TabBar.._render"></a>

#### TabBar~_render() ℗
Rendert alle Elemente der Tab-Bar anhand der intern
gesetzten aktuellen Variablen.

**Kind**: inner method of <code>[TabBar](#module_TabBar)</code>  
**Access:** private  

-

<a name="module_TabBar.._setTab"></a>

#### TabBar~_setTab(tab) ℗
Setzt den aktiven Tab anhand eines Klick-Events oder eines
übergebenen Tab-Indexes; rendert anschließend die Tab-Bar
und sendet das gewählte View-Panel über den Mediator.

**Kind**: inner method of <code>[TabBar](#module_TabBar)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| tab | <code>Object</code> &#124; <code>Number</code> | Klick-Event vom Tab oder Tab-Index |


-

<a name="module_TabBar.._hide"></a>

#### TabBar~_hide() ℗
Blendet die Tab-Bar aus.

**Kind**: inner method of <code>[TabBar](#module_TabBar)</code>  
**Access:** private  

-

<a name="module_TabBar.._show"></a>

#### TabBar~_show() ℗
Blendet die Tab-Bar ein.

**Kind**: inner method of <code>[TabBar](#module_TabBar)</code>  
**Access:** private  

-

<a name="module_TabBar.._disable"></a>

#### TabBar~_disable() ℗
Deaktiviert die Tab-Bar.

**Kind**: inner method of <code>[TabBar](#module_TabBar)</code>  
**Access:** private  

-

<a name="module_TabBar.._enable"></a>

#### TabBar~_enable() ℗
Aktiviert die Tab-Bar.

**Kind**: inner method of <code>[TabBar](#module_TabBar)</code>  
**Access:** private  

-

<a name="module_Template"></a>

### Template
Stellt Funktionen bereit, um Inhalte mit Mustache-Templates in die App
einzufügen; lädt Templates vor, die in der Konfigurations-Datei des
Template-Verzeichnisses definiert sind.

**Author:** Jakob Metzger <jakob.me@gmail.com>  
**License**: MIT  
**Copyright**: 2016 Jakob Metzger  

* [Template](#module_Template)
    * [~init()](#module_Template..init)
    * [~_html($target, content, [callback])](#module_Template.._html) ℗
    * [~render($target, template, data, [callback])](#module_Template..render)


-

<a name="module_Template..init"></a>

#### Template~init()
Lädt die Konfigurations-Datei für die Templates und lädt alle dort
definierten Templates vor; parst die Templates mit Mustache, um das
spätere Rendern der Templates zu beschleunigen.

**Kind**: inner method of <code>[Template](#module_Template)</code>  
**Access:** public  

-

<a name="module_Template.._html"></a>

#### Template~_html($target, content, [callback]) ℗
Fügt einen gegebenen String als HTML in ein DOM-Objekt ein;
führt gegebenenfalls eine Callback-Funktion aus.

**Kind**: inner method of <code>[Template](#module_Template)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| $target | <code>Object</code> | Ziel-DOM-Element zum Einfügen des HTML-Strings |
| content | <code>String</code> | HTML-String, der eingefügt werden soll |
| [callback] | <code>function</code> | Callback-Funktion |


-

<a name="module_Template..render"></a>

#### Template~render($target, template, data, [callback])
Rendert ein Template mit gegebenem Namen mittels Mustache und fügt den
Inhalt in einen gegebenes DOM-Element ein; lädt das Template per AJAX,
falls es noch nicht zwischengespeichert wurde; führt gegebenenfalls
eine Callback-Funktion aus.

**Kind**: inner method of <code>[Template](#module_Template)</code>  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| $target | <code>Object</code> | Ziel-DOM-Element |
| template | <code>String</code> | Name des Templates |
| data | <code>Object</code> | Daten, die an Mustache übergeben werden sollen |
| [callback] | <code>function</code> | Callback-Funktion |


-

<a name="module_Util"></a>

### Util
Stellt diverse allgemeine Hilfs-Funktionen für andere Module der App bereit.

**Author:** Jakob Metzger <jakob.me@gmail.com>  
**License**: MIT  
**Copyright**: 2016 Jakob Metzger  

* [Util](#module_Util)
    * [~arrFromNumber(number)](#module_Util..arrFromNumber) ⇒ <code>Array.&lt;Number&gt;</code>
    * [~calcPercent(first, second, [round])](#module_Util..calcPercent) ⇒ <code>Number</code>
    * [~countTermsWithLevel(terms, level)](#module_Util..countTermsWithLevel) ⇒ <code>Number</code>
    * [~findTerm(terms, alias)](#module_Util..findTerm) ⇒ <code>Object</code> &#124; <code>Boolean</code>
    * [~getRandom(array)](#module_Util..getRandom) ⇒ <code>\*</code>
    * [~shuffle(array)](#module_Util..shuffle) ⇒ <code>Array</code>
    * [~limit(number, min, max)](#module_Util..limit) ⇒ <code>Number</code>
    * [~getDate()](#module_Util..getDate) ⇒ <code>Number</code>
    * [~intToStr(number, digits)](#module_Util..intToStr) ⇒ <code>String</code>
    * [~dialog(type, text, callback, title, buttons)](#module_Util..dialog)


-

<a name="module_Util..arrFromNumber"></a>

#### Util~arrFromNumber(number) ⇒ <code>Array.&lt;Number&gt;</code>
Erzeugt ein Array mit Ganzzahlen von 1 bis zur gewählten Zahl.

**Kind**: inner method of <code>[Util](#module_Util)</code>  
**Returns**: <code>Array.&lt;Number&gt;</code> - Array aus Zahlen bis zur gewählten Zahl  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| number | <code>Number</code> | Letzte Zahl im Array |


-

<a name="module_Util..calcPercent"></a>

#### Util~calcPercent(first, second, [round]) ⇒ <code>Number</code>
Berechnet den prozentualen Anteil einer Zahl an einer anderen;
gibt das Ergebnis in Prozentpunkten zurück.

**Kind**: inner method of <code>[Util](#module_Util)</code>  
**Returns**: <code>Number</code> - Berechnete Prozentpunkte  
**Access:** public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| first | <code>Number</code> |  | Erster Zahlenwert |
| second | <code>Number</code> |  | Zweiter Zahlenwert |
| [round] | <code>Boolean</code> | <code>true</code> | Prozentpunkte runden? |


-

<a name="module_Util..countTermsWithLevel"></a>

#### Util~countTermsWithLevel(terms, level) ⇒ <code>Number</code>
Zählt in einer gegeben Begriff-Liste alle Einträge,
die das angegebene Level haben.

**Kind**: inner method of <code>[Util](#module_Util)</code>  
**Returns**: <code>Number</code> - Anzahl der gefundenen Begriffe  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| terms | <code>Array.&lt;Object&gt;</code> | Array aus Begriff-Objekten |
| level | <code>Number</code> | Gesuchter Level |


-

<a name="module_Util..findTerm"></a>

#### Util~findTerm(terms, alias) ⇒ <code>Object</code> &#124; <code>Boolean</code>
Sucht in einer gegebenen Begriff-Liste nach einem Begriff
mit dem passenden gegebenen Alias; gibt entweder den Begriff
oder false zurück, falls er nicht gefunden wurde.

**Kind**: inner method of <code>[Util](#module_Util)</code>  
**Returns**: <code>Object</code> &#124; <code>Boolean</code> - Gefundener Begriff oder false  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| terms | <code>Array.&lt;Object&gt;</code> | Array aus Begriff-Objekten |
| alias | <code>String</code> | Alias des gesuchten Begriffs |


-

<a name="module_Util..getRandom"></a>

#### Util~getRandom(array) ⇒ <code>\*</code>
Gibt ein zufälliges Element eines Arrays zurück.

**Kind**: inner method of <code>[Util](#module_Util)</code>  
**Returns**: <code>\*</code> - Zufälliges Element des Arrays  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | Beliebiges Array |


-

<a name="module_Util..shuffle"></a>

#### Util~shuffle(array) ⇒ <code>Array</code>
Mischt ein Array zufällig durch.

**Kind**: inner method of <code>[Util](#module_Util)</code>  
**Returns**: <code>Array</code> - Gemischtes Array  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | Zu mischendes Array |


-

<a name="module_Util..limit"></a>

#### Util~limit(number, min, max) ⇒ <code>Number</code>
Begrenzt eine gegebene Zahl zwischen dem gegebenen Minimum und Maximum.

**Kind**: inner method of <code>[Util](#module_Util)</code>  
**Returns**: <code>Number</code> - Begrenzte Zahl  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| number | <code>Number</code> | Zu begrenzende Zahl |
| min | <code>Number</code> | Minimum |
| max | <code>Number</code> | Maximum |


-

<a name="module_Util..getDate"></a>

#### Util~getDate() ⇒ <code>Number</code>
Gibt das aktuelle Datum als Zahl zurück, sortiert nach Jahr, Monat und
Tag, jeweils mit der maximalen Anzahl an Stellen; z.B. "20160612".

**Kind**: inner method of <code>[Util](#module_Util)</code>  
**Returns**: <code>Number</code> - Aktuelles Datum als Zahl  
**Access:** public  

-

<a name="module_Util..intToStr"></a>

#### Util~intToStr(number, digits) ⇒ <code>String</code>
Wandelt eine gegebene Ganzzahl in einen String um; stellt führende
Nullen entsprechend der angegebenen Mindeststellen an, z.B. 2 -> 02.

**Kind**: inner method of <code>[Util](#module_Util)</code>  
**Returns**: <code>String</code> - In String Umgewandelte Zahl  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| number | <code>Number</code> | Ganzzahl, die umgewandelt werden soll |
| digits | <code>Number</code> | Mindestanzahl der Vorkommastellen |


-

<a name="module_Util..dialog"></a>

#### Util~dialog(type, text, callback, title, buttons)
Zeigt einen System-Dialog des angegebenen Typs mit den entsprechend
gewählten Eigenschaften an, z.B. Alert, Confirm, Prompt; versucht, die
Cordova-API zu nutzen, falls vorhanden.

**Kind**: inner method of <code>[Util](#module_Util)</code>  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | Typ des Dialogs (alert, confirm, prompt) |
| text | <code>String</code> | Anzuzeigender Text im Dialog |
| callback | <code>function</code> | Funktion, die anschließend ausgeführt wird |
| title | <code>String</code> | Titel des Dialogs |
| buttons | <code>Array.&lt;String&gt;</code> | Labels der Buttons des Dialogs |


-

<a name="module_View"></a>

### View
Steuert die View der App; erstellt beim Initialisieren alle View-Panels
die im CFG-Modul angegeben sind, ermöglich das Ein-/Ausblenden der View,
löst über den Mediator die Erstellung der View-Inhalte aus, falls diese
leer sind und reagiert auf Änderungen der View, z.B. durch das Keyboard
oder das Starten/Beenden des Quiz.

**Requires**: <code>[Mediator](#module_Mediator)</code>, <code>[Template](#module_Template)</code>  
**Author:** Jakob Metzger <jakob.me@gmail.com>  
**License**: MIT  
**Copyright**: 2016 Jakob Metzger  

* [View](#module_View)
    * [~init()](#module_View..init)
    * [~_bindEvents()](#module_View.._bindEvents) ℗
    * [~_subMediator()](#module_View.._subMediator) ℗
    * [~_create()](#module_View.._create) ℗
    * [~_render()](#module_View.._render) ℗
    * [~_renderPanels()](#module_View.._renderPanels) ℗
    * [~_setView(panel)](#module_View.._setView) ℗
    * [~_hide()](#module_View.._hide) ℗
    * [~_show()](#module_View.._show) ℗
    * [~_enableFullscreen()](#module_View.._enableFullscreen) ℗
    * [~_disableFullscreen()](#module_View.._disableFullscreen) ℗
    * [~_enableQuiz()](#module_View.._enableQuiz) ℗
    * [~_disableQuiz()](#module_View.._disableQuiz) ℗


-

<a name="module_View..init"></a>

#### View~init()
Initialisiert das View-Modul; erstellt alle View-Panels, bindet Events
und abonniert den Mediator, indem andere Funktionen ausgeführt werden.

**Kind**: inner method of <code>[View](#module_View)</code>  
**Access:** public  

-

<a name="module_View.._bindEvents"></a>

#### View~_bindEvents() ℗
Bindet Funktionen an Events.

**Kind**: inner method of <code>[View](#module_View)</code>  
**Access:** private  

-

<a name="module_View.._subMediator"></a>

#### View~_subMediator() ℗
Abonniert interne Funktionen beim Mediator.

**Kind**: inner method of <code>[View](#module_View)</code>  
**Access:** private  

-

<a name="module_View.._create"></a>

#### View~_create() ℗
Generiert für jedes im CFG-Modul definierte Panel anhand des gesetzten
Templates ein HTML-Panel im Content-Bereich; initialisiert die Elemente
der View und leitet die Panel-Daten über den Mediator weiter;
rendert die View anschließend.

**Kind**: inner method of <code>[View](#module_View)</code>  
**Access:** private  

-

<a name="module_View.._render"></a>

#### View~_render() ℗
Rendert alle Elemente der View anhand der intern
gesetzten aktuellen Variablen.

**Kind**: inner method of <code>[View](#module_View)</code>  
**Access:** private  

-

<a name="module_View.._renderPanels"></a>

#### View~_renderPanels() ℗
Rendert alle View-Panels; blendet sie ein oder aus.

**Kind**: inner method of <code>[View](#module_View)</code>  
**Access:** private  

-

<a name="module_View.._setView"></a>

#### View~_setView(panel) ℗
Setzt das aktuelle View-Panel anhand eines Mediator-Events;
entscheidet, ob sich das Panel geändert hat oder nicht;
teilt dem Mediator die Änderung mit und rendert die View.

**Kind**: inner method of <code>[View](#module_View)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| panel | <code>String</code> | Name des neuen Panels |


-

<a name="module_View.._hide"></a>

#### View~_hide() ℗
Blendet die View aus.

**Kind**: inner method of <code>[View](#module_View)</code>  
**Access:** private  

-

<a name="module_View.._show"></a>

#### View~_show() ℗
Blendet die View ein.

**Kind**: inner method of <code>[View](#module_View)</code>  
**Access:** private  

-

<a name="module_View.._enableFullscreen"></a>

#### View~_enableFullscreen() ℗
Aktiviert die volle Höhe für die View.

**Kind**: inner method of <code>[View](#module_View)</code>  
**Access:** private  

-

<a name="module_View.._disableFullscreen"></a>

#### View~_disableFullscreen() ℗
Deaktiviert die volle Höhe für die View, wenn Quiz inaktiv ist.

**Kind**: inner method of <code>[View](#module_View)</code>  
**Access:** private  

-

<a name="module_View.._enableQuiz"></a>

#### View~_enableQuiz() ℗
Notiert, dass das Quiz aktiv ist; aktiviert Fullscreen.

**Kind**: inner method of <code>[View](#module_View)</code>  
**Access:** private  

-

<a name="module_View.._disableQuiz"></a>

#### View~_disableQuiz() ℗
Notiert, dass Quiz inaktiv ist; deaktiviert Fullscreen.

**Kind**: inner method of <code>[View](#module_View)</code>  
**Access:** private  

-

<a name="Slider"></a>

### Slider
**Kind**: global class  
**Requires**: <code>[Util](#module_Util)</code>  
**Author:** Jakob Metzger <jakob.me@gmail.com>  
**License**: MIT  
**Copyright**: 2016 Jakob Metzger  

* [Slider](#Slider)
    * [new Slider($target)](#new_Slider_new)
    * [~_init($target)](#Slider.._init) ℗
    * [~setSlide(index)](#Slider..setSlide)
    * [~getSlide()](#Slider..getSlide) ⇒ <code>Number</code>
    * [~getIndexOf(selector)](#Slider..getIndexOf) ⇒ <code>Number</code> &#124; <code>Boolean</code>


-

<a name="new_Slider_new"></a>

#### new Slider($target)
Erstellt einen Slider auf einem gegebenen Ziel-DOM-Element.


| Param | Type | Description |
| --- | --- | --- |
| $target | <code>Object</code> | Ziel-DOM-Element des Sliders |


-

<a name="Slider.._init"></a>

#### Slider~_init($target) ℗
Initialisiert das DOM-Element des Sliders, die Anzahl der vorhandenen
Slides, setzt ein Data-Attribut für jedes Slide und setzt den 
Slider auf den ersten Slide.

**Kind**: inner method of <code>[Slider](#Slider)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| $target | <code>Object</code> | Ziel-DOM-Element des Sliders |


-

<a name="Slider..setSlide"></a>

#### Slider~setSlide(index)
Setzt den Index des Sliders auf die gegebene Zahl und ändert
die Klasse des Slider-DOM-Element entsprechend.

**Kind**: inner method of <code>[Slider](#Slider)</code>  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | Neuer Index des Sliders |


-

<a name="Slider..getSlide"></a>

#### Slider~getSlide() ⇒ <code>Number</code>
Gibt den aktuellen Slide-Index des Sliders zurück.

**Kind**: inner method of <code>[Slider](#Slider)</code>  
**Returns**: <code>Number</code> - Aktueller index  
**Access:** public  

-

<a name="Slider..getIndexOf"></a>

#### Slider~getIndexOf(selector) ⇒ <code>Number</code> &#124; <code>Boolean</code>
Ermittelt den Slide-Index eines Elements innerhalb des Sliders
anhand eines gegebenen Query-Selektors, falls das gesuchte Element
ein Slide-Element des Sliders ist (ein direktes Kind-Element).

**Kind**: inner method of <code>[Slider](#Slider)</code>  
**Returns**: <code>Number</code> &#124; <code>Boolean</code> - Index des gefundenen Elements oder false  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>String</code> | Query-Selektor |


-

<a name="CFG"></a>

### CFG
Definiert globale Konstanten und Konfigurationen für alle Module; beinhaltet
Label-Texte, Datei-Pfade und -Endungen, Konfigurationen für das Quiz,
Kanal-Namen für den Mediator, Eigenschaften der View-Panels und Optionen
und Konstanten für Events, Icon-Namen und Zeitangaben.

**Kind**: global variable  
**Author:** Jakob Metzger <jakob.me@gmail.com>  
**License**: MIT  
**Copyright**: 2016 Jakob Metzger  

-


&copy; 2016 Jakob Metzger [\<jakob.me@gmail.com\>](mailto:jakob.me@gmail.com). Dokumentiert mit [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
