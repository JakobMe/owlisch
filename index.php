<!DOCTYPE html>
<html lang="de">
    
    <!--Head-->
	<head>
    	
    	<!--Meta-->
		<title>OWLisch</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
		
		<!--CSS-->
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,400italic,900"  type="text/css">
        <link rel="stylesheet" href="css/style.min.css?v=<?php echo rand(0, 1000); ?>" type="text/css">
        
        <!--Javascript-->
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
        <script type="text/javascript" src="js/main.min.js?v=<?php echo rand(0, 1000); ?>"></script>
        
	</head>
	
	<!--Body-->
	<body>
    	
    	<!--Viewport-->
    	<section id="viewport">
        	<div id="viewport-inner">
        	    
        	    <!--Spinner-->
        	    <?php include("php/spinner.php"); ?>
        	    
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
                    	<a id="bar-title-left" href="#">
                        	<i class="fa fa-chevron-left"></i>
                        	<span class="bar-title-button"></span>
                    	</a>
                    	
                    	<!--Rechter Button-->
                    	<a id="bar-title-right" href="#">
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