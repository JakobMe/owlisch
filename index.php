<?php $v = rand(0, 10000); ?>
<!DOCTYPE html>
<html lang="de">
    
    <!--Head-->
	<head>
    	
    	<!--Meta-->
		<title>OWLisch</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
		
		<!--Favicon-->
		<link rel="apple-touch-icon" sizes="57x57" href="img/favicon/apple-touch-icon-57x57.png?v=<?php echo $v; ?>">
        <link rel="apple-touch-icon" sizes="60x60" href="img/favicon/apple-touch-icon-60x60.png?v=<?php echo $v; ?>">
        <link rel="apple-touch-icon" sizes="72x72" href="img/favicon/apple-touch-icon-72x72.png?v=<?php echo $v; ?>">
        <link rel="apple-touch-icon" sizes="76x76" href="img/favicon/apple-touch-icon-76x76.png?v=<?php echo $v; ?>">
        <link rel="apple-touch-icon" sizes="114x114" href="img/favicon/apple-touch-icon-114x114.png?v=<?php echo $v; ?>">
        <link rel="apple-touch-icon" sizes="120x120" href="img/favicon/apple-touch-icon-120x120.png?v=<?php echo $v; ?>">
        <link rel="apple-touch-icon" sizes="144x144" href="img/favicon/apple-touch-icon-144x144.png?v=<?php echo $v; ?>">
        <link rel="apple-touch-icon" sizes="152x152" href="img/favicon/apple-touch-icon-152x152.png?v=<?php echo $v; ?>">
        <link rel="apple-touch-icon" sizes="180x180" href="img/favicon/apple-touch-icon-180x180.png?v=<?php echo $v; ?>">
        <link rel="icon" type="image/png" href="img/favicon/favicon-32x32.png?v=<?php echo $v; ?>" sizes="32x32">
        <link rel="icon" type="image/png" href="img/favicon/favicon-194x194.png?v=<?php echo $v; ?>" sizes="194x194">
        <link rel="icon" type="image/png" href="img/favicon/favicon-96x96.png?v=<?php echo $v; ?>" sizes="96x96">
        <link rel="icon" type="image/png" href="img/favicon/android-chrome-192x192.png?v=<?php echo $v; ?>" sizes="192x192">
        <link rel="icon" type="image/png" href="img/favicon/favicon-16x16.png?v=<?php echo $v; ?>" sizes="16x16">
        <link rel="manifest" href="img/favicon/manifest.json?v=<?php echo $v; ?>">
        <link rel="shortcut icon" href="img/favicon/favicon.ico?v=<?php echo $v; ?>">
        <meta name="apple-mobile-web-app-title" content="OWLisch">
        <meta name="application-name" content="OWLisch">
        <meta name="msapplication-TileColor" content="#3bbb77">
        <meta name="msapplication-TileImage" content="img/favicon/mstile-144x144.png?v=<?php echo $v; ?>">
        <meta name="theme-color" content="#3bbb77">
		
		<!--CSS-->
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic"  type="text/css">
        <link rel="stylesheet" href="css/style.min.css?v=<?php echo $v; ?>" type="text/css">
        
        <!--Javascript-->
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
        <script type="text/javascript" src="js/main.min.js?v=<?php echo $v; ?>"></script>
        
	</head>
	
	<!--Body-->
	<body>
    	
    	<!--Viewport-->
    	<section id="viewport">
        	<div id="viewport-inner">
        	    
        	    <!--Inhalt-->
            	<article id="content">
                	<div id="content-inner"></div>
            	</article>
        	    
            	<!--Top-Leiste-->
            	<header id="bar-top">
                	
                	<!--Statusbar-->
                	<div id="bar-status" class="disabled"></div>
                	
                	<!--Titlebar-->
                	<div id="bar-title">
                    	
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
                    	<h1 id="bar-title-text">OWLisch</h1>
                	
                	</div>
                	
            	</header>
            	
            	<!--Bottom-Leiste-->
            	<nav id="bar-tabs">
                	<a href="#home" class="bar-tabs-tab current" data-tab="1" title="OWLisch">
                    	<i class="fa fa-home"></i>
                	</a>
                	<a href="#quiz" class="bar-tabs-tab" data-tab="2" title="Quiz">
                    	<i class="no-icon">Q</i>
                	</a>
                	<a href="#progress" class="bar-tabs-tab" data-tab="3" title="Fortschritt">
                    	<i class="fa fa-line-chart"></i>
                	</a>
                	<a href="#dictionary" class="bar-tabs-tab" data-tab="4" title="Wörterbuch">
                    	<i class="fa fa-book"></i>
                	</a>
                	<a href="#help" class="bar-tabs-tab" data-tab="5" title="Hilfe">
                    	<i class="fa fa-question-circle"></i>
                	</a>
                	<div id="bar-tabs-indicator" class="tab-1"></div>
            	</nav>
            
        	</div>
    	</section>
    	
	</body>
	
</html>