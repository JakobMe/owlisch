<?php
    
    // Liste der Wörter
    $words = array(
        "pinneken"       => array(
            "level"      => "3",
            "word"       => "Pinneken"
        ),
        "anneeckeliegen" => array(
            "level"      => "1",
            "word"       => "Anne Ecke liegen"
        ),
        "buetterken"     => array(
            "level"      => "2",
            "word"       => "Bütterken"
        ),
        "doelmern"       => array(
            "level"      => "1",
            "word"       => "Dölmern"
        ),
        "doenekens"      => array(
            "level"      => "2",
            "word"       => "Dönekens"
        ),
        "fickerig"       => array(
            "level"      => "1",
            "word"       => "Fickerig"
        ),
        "latuechte"      => array(
            "level"      => "1",
            "word"       => "Latüchte"
        ),
        "noenkern"       => array(
            "level"      => "2",
            "word"       => "Nönkern"
        ),
        "pluedden"       => array(
            "level"      => "1",
            "word"       => "Plüdden"
        ),
        "vermackeln"     => array(
            "level"      => "3",
            "word"       => "Vermackeln"
        ),
    );
    
    // Sortierfunktion: Alphabetisch
    function sortWordsAlpha($a, $b) {
        return strcmp($a["word"], $b["word"]);
    }
    
    // Sortierfunktion: Level
    function sortWordsLevel($a, $b) {
        return $a["level"] - $b["level"];
    }
    
    // Sortieroption ermitteln/setzen
    $sort = $_POST["sort"];
    if ($sort == "") { $sort = "alpha"; }
    
    // Wörter sortieren
    if ($sort === "alpha") { uasort($words, "sortWordsAlpha"); }
    else if ($sort === "level") { uasort($words, "sortWordsLevel"); }
    
?>

<!--Wörterbuch-Slider-->
<div id="dictionary-slider" class="slide-0">
    
    <!--Leer-->
    <div class="dictionary-slide slide-empty"></div>
    
    <!--Übersicht-->
    <div class="dictionary-slide slide-0 scroll current">
        
        <!--Wörter-->
        <div class="dictionary-words">
            
            <?php foreach ($words as $id => $word) { ?>
            <!--Wort: <?php echo $word["word"]; ?>-->
            <a href="#<?php echo $id; ?>" class="quiz-title standalone dictionary-word">
                <span class="word-level level-<?php echo $word["level"]; ?>">
                    <i class="level level-1"></i>
                    <i class="level level-2"></i>
                    <i class="level level-3"></i>
                </span>
                <span class="word"><?php echo $word["word"]; ?></span>
            </a>        
            <?php } ?>
            
            <!--Hinweis-->
            <div class="content-padding center">
                <p class="info small">
                    <i class="fa fa-info-circle"></i> <b>Hinweis:</b><br/>
                    Dein persönliches Wörterbuch füllt sich automatisch
                    mit allen Wörtern, die Du schon erraten hast.
                </p>
            </div>
        </div>
        
    </div>
    
    <!--Details-->
    <div class="dictionary-slide slide-1">
        <div id="content-dictionary"></div>
    </div>
    
</div>