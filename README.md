# OWLisch App
Eine iOS-App zum Lernen von Dialekt-Wörtern aus Ostwestfalen-Lippe.
Diese App wurde von **Jakob Metzger** als Bachelor-Arbeit an der [Universität Bielefeld](http://www.uni-bielefeld.de) entwickelt.

## Inhaltsverzeichnis
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Verwendete Ressourcen & Dienste](#verwendete-ressourcen-&-dienste)
  - [Frameworks, Plugins & Module](#frameworks-plugins-&-module)
  - [JavaScript Bibliotheken](#javascript-bibliotheken)
  - [Web-Fonts](#web-fonts)
  - [Sonstiges](#sonstiges)
  - [Benötigte Software zum Bearbeiten des Projekts](#ben%C3%B6tigte-software-zum-bearbeiten-des-projekts)
- [Beteiligte Studierende an der Entwicklung des Konzepts](#beteiligte-studierende-an-der-entwicklung-des-konzepts)
- [Installation](#installation)
  - [Initialisieren und Starten](#initialisieren-und-starten)
  - [Projekt bearbeiten](#projekt-bearbeiten)
- [Wörterbücher](#w%C3%B6rterb%C3%BCcher)
  - [Neue Begriffe hinzufügen](#neue-begriffe-hinzuf%C3%BCgen)
  - [Bilder und Audio-Dateien](#bilder-und-audio-dateien)
  - [Ostwestfälisch-Wörterbuch](#ostwestf%C3%A4lisch-w%C3%B6rterbuch)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Verwendete Ressourcen & Dienste
Im folgenden werden alle Ressourcen und Dienste aufgelistet, die von Drittanbietern stammen.
Alle diese Ressourcen und Dienste sind für die private und kommerzielle Nutzung frei verfügbar.

### Frameworks, Plugins & Module
* [Apache Cordova 6.3.0](https://cordova.apache.org)
* [Cordova StatusBar 2.1.3](https://github.com/apache/cordova-plugin-statusbar)
* [Cordova Keyboard 1.1.4](https://github.com/cjpearson/cordova-plugin-keyboard)
* [Cordova Dialogs 1.2.1](https://github.com/apache/cordova-plugin-dialogs)
* [gulp 3.9.1](https://github.com/gulpjs/gulp)
* [jsdoc-to-markdown 1.3.6](https://github.com/jsdoc2md/jsdoc-to-markdown)
* [doctoc 1.2.0](https://github.com/thlorenz/doctoc)

### JavaScript Bibliotheken
* [jQuery 2.2.3](https://github.com/jquery/jquery)
* [FastClick 1.0.6](https://github.com/ftlabs/fastclick)
* [jquery-bemhelpers 2.2.1](https://github.com/ingdir/jquery-bemhelpers)
* [mustache.js 2.2.1](https://github.com/janl/mustache.js)

### Web-Fonts
* [Lato Webfont](https://www.google.com/fonts/specimen/Lato)
* [Entypo](http://www.entypo.com) via [Fontello](http://fontello.com)
* [FontAwesome](http://fontawesome.io) via [Fontello](http://fontello.com)

### Sonstiges
* [FreeImages](http://www.freeimages.com)
* [loading.io](http://loading.io)
* [RealFaviconGenerator](http://realfavicongenerator.net)

### Benötigte Software zum Bearbeiten des Projekts
* [Xcode](https://itunes.apple.com/de/app/xcode/id497799835?mt=12)
* [NPM](https://nodejs.org/en/)
* [Cordova](https://cordova.apache.org)
* [gulp](https://github.com/gulpjs/gulp)

## Beteiligte Studierende an der Entwicklung des Konzepts
Folgende Studierende waren im Zuge des Seminars _Mobile Learning_ an der [Universität Bielefeld](http://www.uni-bielefeld.de) unter Leitung von [Paul John](https://ekvv.uni-bielefeld.de/pers_publ/publ/PersonDetail.jsp?personId=3772740) an der Konzeption des [ersten Prototypen](https://github.com/JakobMe/owlisch/releases/tag/v0.1-alpha) von **OWLisch** beteiligt:

* Tugba Aksakal
* Miriam Belke
* Melanie Derksen
* Franziska Kluge
* Lisa Kottmann
* Kai-Frederik Lüking
* Jakob Metzger
* Philipp Niewöhner

Alle in der App enthaltenen Audio-Dateien wurden von **Miriam Belke** eingesprochen und bearbeitet.

## Installation

Im folgenden wird beschrieben, wie das Projekt installiert und bearbeitet werden kann.

### Initialisieren und Starten

Für die Installation werden zunächst [NPM](https://nodejs.org/en/) und [Xcode](https://itunes.apple.com/de/app/xcode/id497799835?mt=12) benötigt.
Als nächstes müssen per Kommandozeile einige Pakete installiert werden:

```sh
# Xcode Command Line Tools
xcode-select --install

# Node Module
npm install -g cordova
npm install -g jsdoc-to-markdown
npm install -g doctoc
npm install -g ios-sim
```
Um das Projekt anschließend zu initialisieren und ein lauffähiges Xcode-Projekt unter `platforms/ios` anzulegen, können folgende Befehle verwendet werden:

```sh
# Zunächst zum Projekt navigieren
cd /pfad-zum-projekt/owlisch

# Kurzfassung
npm run init

# Alternativ
cordova platform add ios
cordova build ios
```

Um die App in einem Emulator zu starten, können folgende Befehle verwendet werden:

```sh
# Kurzfassung
npm run emulate

# Alternativ
cordova emulate ios --target="iPhone-5s"
```

Alternativ dazu kann auch das Projekt unter `platforms/ios` direkt in Xcode geöffnet und ausgeführt werden; so erfolgt auch die Installation auf einem iPhone, falls eine gültige [Apple Developer-ID](https://developer.apple.com/developer-id/) vorliegt.

Um die JavaScript-Dokumentation des Projekts unter `doc/readme.md` zu aktualisieren oder diese Readme-Datei mit einem Inhaltsverzeichnis auszustatten, können folgende Befehle benutzt werden:

```sh
# doc/readme.md aktualisieren
npm run doc

# README.md um Inhaltsverzeichnis erweitern
npm run readme
```

Um die App zu bauen ohne sie im Emulator zu starten, kann folgender Befehl verwendet werden:

```sh
# Mit Dokumentation
npm run build

# Ohne Dokumentation
cordova build ios
```

### Projekt bearbeiten

Um das Projekt zu bearbeiten, wird ein beliebiger Texteditor benötigt; zwingend erforderlich ist auch [gulp](https://github.com/gulpjs/gulp), um alle Quelldateien unter `src/` an der richtigen Ort unter `www/` 
zu kopieren und gegebenenfalls zu kompilieren.

Dafür muss, wie oben bereits beschrieben, _NPM_ installiert sein; anschließend kann _gulp_ mit allen erforderlichen Modulen über folgende Befehle installiert werden:

```sh
# gulp global installieren
npm install -g gulp

# Alle Module für das Projekt installieren
npm install
```

Um _gulp_ zu starten und im Hintergrund laufen zu lassen oder bestimmte Tasks manuell auszuführen können folgende Befehle verwendet werden:

```sh
# gulp starten
gulp

# www-Verzeichnis komplett neu erstellen
gulp all

# Einzelne Tasks ausführen (siehe gulpfile.js)
gulp <jshint|js|less|html|fonts|data|json|img|favicon|res>
```

Zu beachten ist, dass ausschließlich Dateien im `src/` Verzeichnis bearbeitet werden dürfen; alle Dateien in `www/` werden automatisiert erstellt und überschrieben, sobald die zugehörigen Quelldateien geändert werden und _gulp_ bereits gestartet wurde!

## Wörterbücher

Im folgenden wird beschrieben, wie man die bereits vorhandenen Wörterbücher um neue Begriffe erweitern kann und wie man neue Wörterbücher anlegt, die in der App ausgewählt werden können.

### Neue Begriffe hinzufügen

Einem Wörterbuch können beliebig viele Begriffe hinzugefügt werden. Die Wörterbücher liegen als JSON-Dateien im Verzeichnis `src/data/<alias>/<alias>.json` vor, also z.B. `src/data/owl/owl.json`. Diese Wörterbuch-Dateien werden von Gulp minimiert und unter `www/data/` abgelegt, z.B. `www/data/owl/owl.json`.

Eine solche Datei ist wie folgt aufgebaut:

```json
{
    "alias": "Dateiname",
    "caption": "Anzeigename",
    "terms": [
    
    ]
}
```

Der Dateiname `alias` muss dabei dem echten Dateinamen des Wörterbuches entsprechen, der Anzeigename `caption` wird in der App so angezeigt, wie er definiert wurde (z.B. in der Wörterbuch-View oder im Quiz).

Die eigentlichen Begriffe des Wörterbuches werden im `terms` Array als JSON-Objekte in folgendem Format definiert:

```json
{
    "alias"           : "kurzname",
    "article"         : "Artikel, optional",
    "term"            : "Anzeigename",
    "translation"     : "Übersetzung",
    "info"            : "Beschreibungstext",
    "answersNative"   : ["Deutsche Antwort", "..."],
    "answersForeign"  : ["Fremdsprachen-Antwort", "..."],
    "answersPictures" : ["Bild-Datei", "..."]
}
```

* `alias`: Dient der Identifikation; er sollte nur Kleinbuchstaben und keine Sonderzeichen enthalten, aus _Dönekens_ wird also z.B. _doenekens_. Eventuell vorhandene Bild- und Audio-Dateien müssen genauso heißen.
* `article`: Der optionale Artikel des Begriffs, also _der_, _die_, _das_.
* `term`: Der vollständige Anzeigename des Begriffs.
* `translation`: Die vollständige Übersetzung des Begriffs.
* `info`: Ein relativ kurzer Beschreibungstext mit näheren Informationen zum Begriff.
* `answersNative`: Ein Array aus deutschen Wörtern, die im Quiz als falsche Antwortmöglichkeiten dienen; es müssen mindestens drei vorhanden sein.
* `answersForeign`: Ein Array aus Fremdsprachen-Antworten, die im Quiz als falsche Antwortmöglichkeiten dienen; es müssen mindestens drei vorhanden sein.
* `answersPictures`: Ein optionales Array aus Dateinamen für Bilder unter `www/data/<alias>/image/<bild>.jpg`; diese Bilder kommen im Quiz zum Einsatz, um als Antwortmöglichkeiten zu dienen. Es müssen mindestens drei Bilder angegeben werden und der Begriff muss selbst ebenfalls über ein Bild verfügen. Soll der Begriff über keine Bilder verfügen, muss ein leeres Array `[]` als Wert angegeben werden.

Um einen neuen Begriff hinzuzufügen, muss in der entsprechenden Datei ein neues Objekt mit den obigen Daten zum `terms` Array hinzugefügt werden:

```json
"terms": [
    {
        "alias": "neu",
    },
]
```

### Bilder und Audio-Dateien

Jedes Wörterbuch verfügt über seine eigenen Bild- und Audio-Dateien im entsprechenden Verzeichnis unter `src/data/<alias>/image` und `src/data/<alias>/audio`. Audio-Dateien müssen als `.mp3` vorliegen, Bilder als `.jpg` mit einer Größe von `280x280px`. Die Dateinamen müssen dabei immer dem Alias des zugehörigen Begriffes entsprechen; wenn also der Begriff _Pinneken_ mit dem Alias _pinneken_ über Dateien verfügen soll, muss es `image/pinneken.jpg` und `audio/pinneken.mp3` geben.

Diese Dateien werden von Gulp automatisch in das `www/data/` Verzeichnis kopiert und im Falle der Bilder auch komprimiert.

Beim Laden des Wörterbuches wird automatisch nach zugehörigen Dateien gesucht; gibt es kein Bild, sind bestimmte Quiz-Typen für diesen Begriff ausgeschlossen, ohne Audio-Datei fehlt der Button zum Vorlesen des Begriffes.

Soll es für einen Begriff möglich sein, ein Bilder-Rätsel im Quiz zu erhalten, müssen, wie oben erwähnt, entsprechende Bilder definiert werden. Auch hier müssen die definierten Bildnamen mit den Dateinamen übereinstimmen; sind z.B. folgende Bilder definiert,

```json
"answersPictures" : ["schraube", "knopf", "schluessel"]
```

so müssen auch folgende Dateien existieren:

```
image/
    schraube.jpg
    knopf.jpg
    schluessel.jpg
```

Es müssen immer mindestens drei Bilder angegeben werden, da es im Quiz immer vier Antwortmöglichkeiten gibt und das eigentliche Bild des Begriffs ebenfalls eine Antwortmöglichkeit ist.

### Ostwestfälisch-Wörterbuch

Für ein besseres Verständnis über die Struktur der Wörterbücher und Begriffe sollte man einen Blick auf das Hauptwörterbuch [Ostwestfälisch](src/data/owl/owl.json) unter `src/data/owl/owl.json` werfen.

In diesem Wörterbuch sind zum aktuellen Zeitpunkt folgende Begriffe vorhanden:

1. **angeschickert** — „angetrunken“
2. **beömmeln** — „sich totlachen“
3. **betuppen** — „betrügen“
4. **Bollerbuchse**, _die_ — „Jogginghose“
5. **Bömsken**, _das_ — „Bonbon“
6. **Bütterken**, _das_ — „kleines Butterbrot“
7. **dölmern** — „spielen“
8. **Dönekens**, _die_ — „Anekdoten“
9. **fickerich** — „nervös“
10. **Knüpp**, _der_ — „Knoten“
11. **Kroppzeug**, _das_ — „Krempel“
12. **Latüchte**, _die_ — „Laterne“
13. **Mäse**, _die_ — „Hintern“
14. **Möttke**, _die_ — „Schlamm“
15. **Mürker**, _der_ — „Maurer“
16. **nöhlen** — „meckern“
17. **nönkern** — „Mittagsschlaf halten“
18. **öddelich** — „dreckig“
19. **Pättkenschnüwer**, _der_ — „Moped“
20. **pecken** — „kleben“
21. **Pillepoppen**, _die_ — „Kaulquappen“
22. **Pinneken**, _das_ — „Schnapsglas“
23. **plästern** — „regnen“
24. **Pläte**, _die_ — „Glatze“
25. **Plüdden**, _die_ — „alte Klamotten“
26. **Pölter**, _der_ — „Schlafanzug“
27. **ratzen** — „schlafen“
28. **Töffel**, _der_ — „Trottel“
29. **vermackeln** — „beschädigen“
30. **wullacken** — „schuften“
