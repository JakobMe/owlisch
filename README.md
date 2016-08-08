# OWLisch App
Eine iOS-App zum Lernen von Dialekt-Wörtern aus Ostwestfalen-Lippe.
Diese App wurde von **Jakob Metzger** als Bachelor-Arbeit an der [Universität Bielefeld](http://www.uni-bielefeld.de) entwickelt.

## Verwendete Ressourcen & Dienste
Im folgenden werden alle Ressourcen und Dienste aufgelistet, die von Drittanbietern stammen.
Alle diese Ressourcen und Dienste sind für die private und kommerzielle Nutzung frei verfügbar.

#### Frameworks & Plugins
* [Apache Cordova 6.3.0](https://cordova.apache.org)
* [Cordova StatusBar 2.1.3](https://github.com/apache/cordova-plugin-statusbar)
* [Cordova Keyboard 1.1.4](https://github.com/cjpearson/cordova-plugin-keyboard)
* [Cordova Dialogs 1.2.1](https://github.com/apache/cordova-plugin-dialogs)

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
Folgende Studierende waren im Zuge des Seminars _Mobile Learning_ an der [Universität Bielefeld](http://www.uni-bielefeld.de) unter Leitung von [Paul John](https://ekvv.uni-bielefeld.de/pers_publ/publ/PersonDetail.jsp?personId=3772740) an der Konzeption des ersten Prototypen von **OWLisch** beteiligt:

* Tugba Aksakal
* Miriam Belke
* Melanie Derksen
* Franziska Kluge
* Lisa Kottmann
* Kai-Frederik Lüking
* Jakob Metzger
* Philipp Niewöhner

## Installation
Für die lokale Installation werden zunächst [Node.js und NPM](https://nodejs.org/en/) benötigt.
Mit `npm install -g cordova` kann im Terminal nun **Apache Cordova** global installiert werden. Alternativ kann Cordova zusammen mit anderen Node-Modulen lokal installiert werden, indem im `owlisch/` Verzeichnis `npm install` ausgeführt wird. Um das Projekt zu initialisieren, muss erst die iOS-Plattform mit `cordova platform add ios` im `owlisch/` Verzeichnis hinzugefügt werden; anschließend kann eine lauffähige iOS-Version mit `cordova build ios` erzeugt werden. Wurde Cordova lokal installiert, kann die iOS-Version auch mit `npm run build` erzeugt werden (hierbei wird auch gleichzeitig eine JSDoc-Datei in `doc/` erzeugt).

Für das Ausführen der App auf einem Simulator wird [Xcode](https://itunes.apple.com/de/app/xcode/id497799835?mt=12) auf Mac OS X (El Capitan oder neuer) benötigt. Zusätzlich müssen nach der Installation von Xcode auch die Xcode Command-line-tools mit `xcode-select --install` installiert werden.

Der Emulator für das Terminal wird mit `npm install -g ios-sim` installiert und mit `cordova emulate ios --target="iPhone-5s"` gestartet. Alternativ kann auch das Projekt unter `owlisch/platforms/ios` in Xcode geöffnet und gestartet werden. Für die Installation auf einem iPhone benötigt man eine gültige [Apple Developer-ID](https://developer.apple.com/developer-id/), die Installation erfolgt dann direkt über Xcode.
