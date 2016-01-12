<?php
    
    // Daten inkludieren
    include("data.php");
    
    // CSS-Klassen
    $clsEmpty  = "";
    $clsRight  = " right";
    $clsWrong  = " wrong";
    $clsImages = " images";
    $clsImage  = " image";
    $clsSmall  = " small";
    $clsCurr   = " current";
    $clsFocus  = " autofocus";
    
    // Liste der Fragen
    $questions = array(
        
        // Frage 1:
        array(
            "word"     => "dittken",
            "question" => "foreign",
            "answer"   => "german",
            "options"  => "das läuft langsam,das läuft schlecht,das läuft schnell"
        ),
        
        // Frage 2:
        array(
            "word"     => "knuepp",
            "question" => "foreign",
            "answer"   => "image",
            "options"  => "blume,pinienzapfen,schraube"
        ),
        
        // Frage 3:
        array(
            "word"     => "anneeckeliegen",
            "question" => "german",
            "answer"   => "foreign",
            "options"  => "bedötscht,drömmelig,patt"
        ),
        
        // Frage 4:
        array(
            "word"     => "buetterken",
            "question" => "image",
            "answer"   => "foreign",
            "options"  => "Pankauken,Knüpp,Plüdden"
        ),
        
        // Frage 5:
        array(
            "word"     => "latuechte",
            "question" => "image",
            "answer"   => "foreign",
            "options"  => "Pinnorkel,Ommes,Knüpp"
        ),
        
        // Frage 6:
        array(
            "word"     => "noenkern",
            "question" => "german",
            "answer"   => "foreign",
            "options"  => "nöhlen,baseln,dölmern"
        ),
        
        // Frage 7:
        array(
            "word"     => "fickerich",
            "question" => "foreign",
            "answer"   => "german",
            "options"  => "erregt,wütend,fröhlich"
        ),
        
        // Frage 8:
        array(
            "word"     => "beoemmeln",
            "question" => "german",
            "answer"   => "letters"
        ),
        
        // Frage 9:
        array(
            "word"     => "noehlen",
            "question" => "german",
            "answer"   => "letters"
        ),
        
        // Frage 10:
        array(
            "word"     => "pinneken",
            "question" => "german",
            "answer"   => "input"
        )
    );
    
    // Fragen mischen
    shuffle($questions);
    
?>

<!--Fortschritt-->
<div id="quiz-progress">
    <div id="quiz-progress-inner">
        <div id="quiz-progress-bar"></div>
        <ul id="quiz-progress-steps">
            <?php for ($i = 1; $i <= sizeof($questions); $i++) { ?>
            <li class="quiz-progress-step" data-step="<?php echo $i; ?>"></li>
            <?php } ?>
        </ul>
    </div>
</div>

<!--Quiz-Karten-->
<article id="quiz-slider" class="slide-0">
    
    <!--Start-->
    <section class="quiz-slide slide-0 current">
        <h1 class="quiz-title finished">
            <b>OWL</b>-Quiz
        </h1>
        <div class="content-padding center">
            <p class="title">
                <i class="fa fa-graduation-cap"></i>
                Teste dein <b>Wissen</b>!
            </p>
        </div>
        <h4 class="subtitle"><span class="text">Hinweis</span></h4>
        <p class="word description margin-bottom info">
            Je häufiger du ein Wort <b>richtig</b> errätst,
            desto <b>schwieriger</b> werden die Fragen.
        </p>
        <div class="content-padding">
            <a class="button round action" id="quiz-start">
                <b>Quiz</b><br/><i>starten</i>
            </a>
        </div>
    </section>
    <?php
    
    // Alle Fragen iterieren
    foreach ($questions as $slide => $q) {
        
        // Frage-Eigenschaften definieren
        $text      = "das";
        $id        = $q["word"];
        $question  = $q["question"];
        $answer    = $q["answer"];
        $options   = $q["options"];
        $word      = $words[$id]["word"];
        $level     = $words[$id]["level"];
        $translate = $words[$id]["translate"];
        $index     = $slide + 1;

        // Zustände definieren
        $aOptions  = (empty($options)         ? false : $options);
        $qImage    = ($question === "image"   ? true : false);
        $qGerman   = ($question === "german"  ? true : false);
        $qForeign  = ($question === "foreign" ? true : false);
        $aImage    = ($answer   === "image"   ? true : false);
        $aGerman   = ($answer   === "german"  ? true : false);
        $aForeign  = ($answer   === "foreign" ? true : false);
        $aLetters  = ($answer   === "letters" ? true : false);
        $aInput    = ($answer   === "input"   ? true : false);
        
        // Externe Dateien validieren
        $fImage = (file_exists("../img/content/$id.jpg") ? "img/content/$id.jpg" : false);
        $fAudio = (file_exists("../audio/$id.mp3")       ? "audio/$id.mp3"       : false);
        
        // Schwierigkeit festlegen
        if ($aLetters)    { $diff = "Mittel"; }
        else if ($aInput) { $diff = "Schwer"; }
        else              { $diff = "Leicht"; }
        
        // Falls Optionen existieren
        if ($aOptions) {
            
            // Ausgabe-Klasse zusammenfügen
            $class = $clsEmpty;
            if ($aImage) { $class .= $clsImage; }
            if ($qImage) { $class .= $clsSmall; }
            
            // Definierte Optionen in Array speichern
            $opt = array();
            foreach (explode(",", $aOptions) as $o) {
                array_push($opt, array($o, $class . $clsWrong));
            }
            
            // Richtige Antwort hinzufügen (abhängig vom Antwort-Typen)
            if ($aForeign) { array_push($opt, array($word, $class . $clsRight)); }
            if ($aImage)   { array_push($opt, array($id, $class . $clsRight)); }
            if ($aGerman)  { array_push($opt, array($translate, $class . $clsRight)); }
            
            // Optionen mischen und speichern
            shuffle($opt);
            $aOptions = $opt;
        }
        
        // Wenn Antwort-Typ Buchstaben sind, Buchstaben-Mix erzeugen
        if ($aLetters) {
            $alpha = range("a", "z");
            $aLetters = array();
            preg_match_all("/./u", $word, $aLetters);
            $aLetters = $aLetters[0];
            $aSize = sizeof($aLetters);
            $random = array_rand($alpha, 3);
            foreach ($random as $r) { array_push($aLetters, $alpha[$r]); }
            shuffle($aLetters);
        }
        
        // Frage-Text entsprechend es Frage-Typens ändern
        if ($qForeign) { $text = $word; }
        if ($qGerman) { $text = $translate; }
        
    ?>
    <section class="quiz-slide slide-<?php echo $index; echo ($aInput ? $clsFocus : $clsEmpty); ?>">
        <h1 class="quiz-title">Was bedeutet <b><?php echo $text; ?></b>?</h1>
        <?php if ($qImage && $fImage) { ?>
        <div class="quiz-image"><img src="<?php echo $fImage; ?>" /></div>
        <?php } ?>
        <div class="quiz-info">
            <span class="quiz-info-difficulty"><?php echo $diff; ?></span>
            <span class="quiz-info-level level-<?php echo $level; ?>"
                  data-level="<?php echo $level; ?>">
                  <i class="level level-1"></i>
                  <i class="level level-2"></i>
                  <i class="level level-3"></i>
            </span>
            <?php if ($fAudio && $qForeign) { ?>
            <span class="quiz-info-audio-play">
                <i class="fa fa-volume-up"></i>
            </span>
            <audio preload="none" class="quiz-info-audio">
                <source src="<?php echo $fAudio; ?>" type="audio/mpeg">
            </audio>
            <?php } ?>
        </div>
        <?php if ($aOptions) { ?>
        <?php if (!$aImage) { ?><div class="content-padding"><?php } ?>
            <div class="quiz-choices<?php echo ($aImage ? $clsImages : $clsEmpty); ?>">
            <?php foreach ($aOptions as $opt) { ?>
                <a class="button choice<?php echo $opt[1]; ?>">
                   <?php if ($aImage) { ?>
                    <span class="button-image">
                        <img src="img/content/<?php echo $opt[0]; ?>.jpg" />
                    </span>
                   <?php } else { ?>
                   <span><?php echo $opt[0]; ?></span>
                   <?php } ?>
                </a>
            <?php } ?>
            </div>
        <?php if (!$aImage) { ?></div><?php } ?>
        <?php } ?>
        <?php if ($aLetters) { ?>
        <div class="quiz-input-characters quiz-solution characters-<?php echo $aSize; ?>"
             data-solution="<?php echo $word; ?>">
             <?php for ($i = 1; $i <= $aSize; $i++) { ?>
             <span class="input-character<?php echo ($i === 1 ? $clsCurr : $clsEmpty); ?>" data-choice=""></span>
             <?php } ?>
        </div>
        <div class="content-padding center quiz-solution-reveal">
            <p class="title">
                <i>Lösung: <b><?php echo $word; ?></b></i>
                <i class="quiz-solution-icon"></i>
            </p>
        </div>
        <div class="quiz-input-choices">
            <a class="button input-delete locked">
                <i class="fa fa-long-arrow-left"></i>
                Entfernen
            </a>
            <br/>
            <?php foreach ($aLetters as $i => $l) { ?>
            <span class="button input-choice choice-<?php echo ($i + 1); ?>"
                  data-choice="<?php echo ($i + 1); ?>">
                  <?php echo mb_strtoupper($l, "UTF-8"); ?>
            </span>
            <?php } ?>
        </div>
        <?php } ?>
        <?php if ($aInput) { ?>
        <form class="quiz-input-text quiz-solution"
             data-solution="<?php echo $word; ?>">
             <input spellcheck="false" autocomplete="off" autocorrect="off"
                    class="input-text" type="text" tabindex="-<?php echo $index; ?>" />
             <input class="input-submit" type="submit" />
        </form>
        <div class="content-padding center quiz-solution-reveal">
            <p class="title">
                <i>Lösung: <b><?php echo $word; ?></b></i>
                <i class="quiz-solution-icon"></i>
            </p>
        </div>
        <div class="quiz-solution-info center">
            <h4 class="subtitle"><span class="text">Hinweis</span></h4>
            <p class="word description info">
                Benutze die <b>Tastatur</b>, um die Lösung einzugeben.
            </p>
        </div>
        <?php } ?>
        <?php if ($aLetters || $aInput) { ?>
        <div class="content-padding bottom">
            <a class="button action quiz-solve">
                Lösen
                <i class="fa fa-lightbulb-o"></i>
            </a>
            <a class="button action quiz-next hidden">
                Weiter
                <i class="fa fa-arrow-right"></i>
            </a>
        </div>
        <?php } else { ?>
        <div class="content-padding bottom">
            <a class="button action quiz-next hidden">
                Weiter
                <i class="fa fa-arrow-right"></i>
            </a>
        </div>
        <?php } ?>
    </section>
    <?php } ?>
    
    <!--Ende-->
    <section class="quiz-slide slide-<?php echo (sizeof($questions) + 1); ?>">
        <h1 class="quiz-title finished">
            <b>Fertig!</b>
        </h1>
        <div id="quiz-result">
            <div id="quiz-result-inner">
                <div id="result-lines">
                    <?php for ($i = 1; $i < sizeof($questions); $i++) { ?>
                    <div class="result-line line-<?php echo $i; ?>"></div>
                    <?php } ?>
                </div>
                <div id="result-bar" class="hidden"></div>
            </div>
        </div>
        <div class="content-padding center">
            <p class="title">
                Du hast <b><span id="result-right">0</span> von
                <span id="result-total"><?php echo sizeof($questions); ?></span></b>
                Fragen richtig beantwortet!
                <i id="result-emoticon" class="fa fa-smile-o"></i>
            </p>
            <p class="info">
                Willst du noch einmal spielen?
            </p>
        </div>
        <a class="button round action" id="quiz-restart">
            <b>Quiz</b><br/><i>starten</i>
        </a>
    </section>
    
</article>