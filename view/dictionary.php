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
    
    // Sortieroption ermitteln
    $sort = $_POST["sort"];
    $dir = $_POST["dir"];
    
    // Sortierung bei fehlerhaften Angaben korrigieren
    if (($sort !== "alpha") && ($sort !== "level")) { $sort = "alpha"; }
    if (($dir !== "asc") && ($dir !== "desc")) { $dir = "asc"; }
    
    // Sortierfunktionen definieren
    function sortWordsAlpha($a, $b) { return strcmp($a["word"], $b["word"]); }
    function sortWordsLevel($a, $b) { return $a["level"] - $b["level"]; }
    
    // Wörter sortieren
    if ($sort === "alpha") { uasort($words, "sortWordsAlpha"); }
    else if ($sort === "level") { uasort($words, "sortWordsLevel"); }
    
    // Bei Absteigender Sortierung Wort-Array umkehren
    if ($dir === "desc") { $words = array_reverse($words, true); }
    
?>

<!--Wörterbuch-Slider-->
<div id="dictionary-slider" class="slide-0">
    
    <!--Sortierung-->
    <ul id="dictionary-sort" class="hidden sort-<?php echo $sort; ?>-<?php echo $dir; ?>">
        <li class="sort sort-alpha-asc" data-sort="alpha" data-dir="asc">
            <i class="fa fa-sort-alpha-asc"></i>
            Alphabetisch sortieren (aufsteigend)
        </li>
        <li class="sort sort-alpha-desc" data-sort="alpha" data-dir="desc">
            <i class="fa fa-sort-alpha-desc"></i>
            Alphabetisch sortieren (absteigend)
        </li>
        <li class="sort sort-level-asc" data-sort="level" data-dir="asc">
            <i class="fa fa-sort-numeric-asc"></i>
            Nach Stufe sortieren (aufsteigend)
        </li>
        <li class="sort sort-level-desc" data-sort="level" data-dir="desc">
            <i class="fa fa-sort-numeric-desc"></i>
            Nach Stufe sortieren (absteigend)
        </li>
    </ul>
    
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