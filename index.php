<?php
    
    // Einstellungen
    $v       = rand(0, 10000);
    $app     = "OWLisch";
    $color   = "#3bbb77";
    $favicon = "img/favicon";
    
?>
<!DOCTYPE html>
<html lang="de">
    
    <!--Head-->
    <head>
        
        <!--Meta-->
        <title><?php echo $app; ?></title>
        <meta charset="utf-8">
        
        <!--Favicons: Apple-->
        <link rel="apple-touch-icon" type="image/png" sizes="57x57"   href="<?php echo $favicon; ?>/apple-touch-icon-57x57.png">
        <link rel="apple-touch-icon" type="image/png" sizes="60x60"   href="<?php echo $favicon; ?>/apple-touch-icon-60x60.png">
        <link rel="apple-touch-icon" type="image/png" sizes="72x72"   href="<?php echo $favicon; ?>/apple-touch-icon-72x72.png">
        <link rel="apple-touch-icon" type="image/png" sizes="76x76"   href="<?php echo $favicon; ?>/apple-touch-icon-76x76.png">
        <link rel="apple-touch-icon" type="image/png" sizes="114x114" href="<?php echo $favicon; ?>/apple-touch-icon-114x114.png">
        <link rel="apple-touch-icon" type="image/png" sizes="120x120" href="<?php echo $favicon; ?>/apple-touch-icon-120x120.png">
        <link rel="apple-touch-icon" type="image/png" sizes="144x144" href="<?php echo $favicon; ?>/apple-touch-icon-144x144.png">
        <link rel="apple-touch-icon" type="image/png" sizes="152x152" href="<?php echo $favicon; ?>/apple-touch-icon-152x152.png">
        <link rel="apple-touch-icon" type="image/png" sizes="180x180" href="<?php echo $favicon; ?>/apple-touch-icon-180x180.png">
        
        <!--Favicons: Android-->
        <link rel="icon"             type="image/png" sizes="16x16"   href="<?php echo $favicon; ?>/favicon-16x16.png">
        <link rel="icon"             type="image/png" sizes="32x32"   href="<?php echo $favicon; ?>/favicon-32x32.png">
        <link rel="icon"             type="image/png" sizes="96x96"   href="<?php echo $favicon; ?>/favicon-96x96.png">
        <link rel="icon"             type="image/png" sizes="192x192" href="<?php echo $favicon; ?>/android-chrome-192x192.png">
        <link rel="icon"             type="image/png" sizes="194x194" href="<?php echo $favicon; ?>/favicon-194x194.png">
        <link rel="manifest"                                          href="<?php echo $favicon; ?>/manifest.json">
        
        <!--Favicons: Desktop-->
        <link rel="shortcut icon" href="<?php echo $favicon; ?>/favicon.ico">
        
        <!--Webapp-Einstellungen-->
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-capable"          content="yes">
        <meta name="apple-mobile-web-app-title"            content="<?php echo $app; ?>">
        <meta name="application-name"                      content="<?php echo $app; ?>">
        <meta name="theme-color"                           content="<?php echo $color; ?>">
        <meta name="msapplication-TileColor"               content="<?php echo $color; ?>">
        <meta name="msapplication-TileImage"               content="<?php echo $favicon; ?>/mstile-144x144.png">
        <meta name="viewport"                              content="width=device-width, initial-scale=1,
                                                                    minimum-scale=1, maximum-scale=1,
                                                                    user-scalable=0">
        
    </head>
    
    <!--Body-->
    <body>
        
        <!--Viewport-->
        <div id="viewport">
            <div id="viewport-inner">
                
                <!--Inhalt-->
                <main id="content">
                    <div id="error" class="hidden">
                        <div class="error">
                            <h4 class="subtitle uniform">
                                <span class="text">
                                    <i class="fa fa-warning"></i>
                                    Fehler!
                                </span>
                            </h4>
                            <p class="text error">
                                Es ist ein Fehler aufgetreten.<br/>Versuche es bitte erneut
                                (vermutlich wurde die Internetverbindung unterbrochen).
                            </p>
                            <h4 class="subtitle uniform"></h4>
                        </div>
                    </div>
                    <div id="content-inner"></div>
                </main>
                
                <!--Top-Leiste-->
                <header id="bar-top">
                    
                    <!--Statusbar-->
                    <div id="bar-status" class="disabled"></div>
                    
                    <!--Titlebar-->
                    <div id="bar-title">
                        
                        <!--Wörterbuch-Suche-->
                        <div id="dictionary-search">
                            <input id="dictionary-search-input" type="text"
                                   spellcheck="false" autocomplete="off"
                                   autocorrect="off" autocapitalize="none"
                                   tabindex="-100" />
                        </div>
                        
                        <!--Linker Button-->
                        <a id="bar-title-left" class="nav-button locked" href="#">
                            <i class="fa"></i>
                            <span class="bar-title-button"></span>
                        </a>
                        
                        <!--Rechter Button-->
                        <a id="bar-title-right" class="nav-button locked" href="#">
                            <i class="fa"></i>
                            <span class="bar-title-button"></span>
                        </a>
                        
                        <!--Titel-->
                        <h1 id="bar-title-text">Wort des Tages</h1>
                    
                    </div>
                    
                </header>
                
                <!--Bottom-Leiste-->
                <nav id="bar-tabs">
                    <a href="#home" class="bar-tabs-tab current" data-tab="1" title="Wort des Tages">
                        <i class="fa fa-home"></i>
                        <span class="tab-label">Start</span>
                    </a>
                    <a href="#dictionary" class="bar-tabs-tab" data-tab="2" title="Wörterbuch">
                        <i class="fa fa-book"></i>
                        <span class="tab-label">Wörterbuch</span>
                    </a>
                    <a href="#quiz" class="bar-tabs-tab" data-tab="3" title="Quiz">
                        <i class="no-icon">Q</i>
                        <span class="tab-label">Quiz</span>
                    </a>
                    <a href="#progress" class="bar-tabs-tab" data-tab="4" title="Fortschritt">
                        <i class="fa fa-bar-chart"></i>
                        <span class="tab-label">Fortschritt</span>
                    </a>
                    <a href="#help" class="bar-tabs-tab" data-tab="5" title="Hilfe">
                        <i class="fa fa-question-circle"></i>
                        <span class="tab-label">Hilfe</span>
                    </a>
                    <div id="bar-tabs-indicator" class="tab-1">
                        <div class="indicator-bar"></div>
                    </div>
                </nav>
            
            </div>
        </div>
        
        <!--CSS-->
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic" type="text/css">
        <link rel="stylesheet" href="css/style.min.css?v=<?php echo $v; ?>" type="text/css">
        
        <!--Javascript-->
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
        <script type="text/javascript" src="js/main.min.js?v=<?php echo $v; ?>"></script>
        
    </body>
    
</html>