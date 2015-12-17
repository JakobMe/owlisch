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
        	    
        	    <!--Inhalt-->
            	<article id="content">
                	<div id="content-inner">
                    	
                    	<!--Fortschritt-->
                    	<div id="quiz-progress">
                        	<div id="quiz-progress-inner">
                        	    <div id="quiz-progress-bar"></div>
                        	    <ul id="quiz-progress-steps">
                            	    <li class="quiz-progress-step current" data-step="1"></li>
                            	    <li class="quiz-progress-step" data-step="2"></li>
                            	    <li class="quiz-progress-step" data-step="3"></li>
                            	    <li class="quiz-progress-step" data-step="4"></li>
                            	    <li class="quiz-progress-step" data-step="5"></li>
                            	    <li class="quiz-progress-step" data-step="6"></li>
                            	    <li class="quiz-progress-step" data-step="7"></li>
                            	    <li class="quiz-progress-step" data-step="8"></li>
                            	    <li class="quiz-progress-step" data-step="9"></li>
                            	    <li class="quiz-progress-step" data-step="10"></li>
                        	    </ul>
                        	</div>
                    	</div>
                    	
                	</div>
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
                	<a href="#home" class="bar-tabs-tab active" title="OWLisch">
                    	<i class="fa fa-home"></i>
                	</a>
                	<a href="#quiz" class="bar-tabs-tab" title="Quiz">
                    	<i class="no-icon">Q</i>
                	</a>
                	<a href="#progress" class="bar-tabs-tab" title="Fortschritt">
                    	<i class="fa fa-line-chart"></i>
                	</a>
                	<a href="#dictionary" class="bar-tabs-tab" title="Wörterbuch">
                    	<i class="fa fa-book"></i>
                	</a>
                	<a href="#help" class="bar-tabs-tab" title="Hilfe">
                    	<i class="fa fa-question-circle"></i>
                	</a>
            	</nav>
            
        	</div>
    	</section>
    	
	</body>
	
</html>