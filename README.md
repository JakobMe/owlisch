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

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Verwendete Ressourcen & Dienste
Im folgenden werden alle Ressourcen und Dienste aufgelistet, die von Drittanbietern stammen.
Alle diese Ressourcen und Dienste sind für die private und kommerzielle Nutzung frei verfügbar.

#### Frameworks, Plugins & Module
* [Apache Cordova 6.3.0](https://cordova.apache.org)
* [Cordova StatusBar 2.1.3](https://github.com/apache/cordova-plugin-statusbar)
* [Cordova Keyboard 1.1.4](https://github.com/cjpearson/cordova-plugin-keyboard)
* [Cordova Dialogs 1.2.1](https://github.com/apache/cordova-plugin-dialogs)
* [jsdoc-to-markdown 1.3.6](https://github.com/jsdoc2md/jsdoc-to-markdown)
* [doctoc 1.2.0](https://github.com/thlorenz/doctoc)

#### JavaScript Bibliotheken
* [jQuery 2.2.3](https://github.com/jquery/jquery)
* [FastClick 1.0.6](https://github.com/ftlabs/fastclick)
* [jquery-bemhelpers 2.2.1](https://github.com/ingdir/jquery-bemhelpers)
* [mustache.js 2.2.1](https://github.com/janl/mustache.js)

#### Web-Fonts
* [Lato Webfont](https://www.google.com/fonts/specimen/Lato)
* [Entypo](http://www.entypo.com) via [Fontello](http://fontello.com)
* [FontAwesome](http://fontawesome.io) via [Fontello](http://fontello.com)

#### Sonstiges
* [FreeImages](http://www.freeimages.com)
* [loading.io](http://loading.io)
* [Real Favicon Generator](http://realfavicongenerator.net)

#### Benötigte Software zum Bearbeiten des Projekts
* [Xcode](https://itunes.apple.com/de/app/xcode/id497799835?mt=12)
* [CodeKit](https://incident57.com/codekit/)
* [Cordova](https://cordova.apache.org)

## Beteiligte Studierende an der Entwicklung des Konzepts
Folgende Studierende waren im Zuge des Seminars _Mobile Learning_ an der [Universität Bielefeld](http://www.uni-bielefeld.de) unter Leitung von [Paul John](https://ekvv.uni-bielefeld.de/pers_publ/publ/PersonDetail.jsp?personId=3772740) an der Konzeption des [ersten Prototypen](releases/tag/v0.1-alpha) von **OWLisch** beteiligt:

* Tugba Aksakal
* Miriam Belke
* Melanie Derksen
* Franziska Kluge
* Lisa Kottmann
* Kai-Frederik Lüking
* Jakob Metzger
* Philipp Niewöhner

## Installation
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

Um die JavaScript-Dokumentation in dieser Readme-Datei zu aktualisieren, kann folgender Befehl benutzt werden:

```sh
# README.md aktualisieren
npm run doc
```

Um die App zu bauen ohne sie im Emulator zu starten, kann folgender Befehl verwendet werden:

```sh
# Mit Dokumentation
npm run build

# Ohne Dokumentation
cordova build ios
```
