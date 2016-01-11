<?php
    
    // Daten inkludieren
    include("data.php");
    
    // Sortieroption ermitteln
    $sort = $_POST["sort"];
    $dir = $_POST["dir"];
    
    // Sortierung bei fehlerhaften Angaben korrigieren
    if (($sort !== "alpha") && ($sort !== "level")) { $sort = "alpha"; }
    if (($dir !== "asc") && ($dir !== "desc")) { $dir = "asc"; }
    
    /**
     * Sortieren: Alphabetisch aufsteigend.
     * Vergleicht zwei Wörter und ordnet sie alphabetisch aufsteigend.
     */
    function sortWordsAlphaAsc($a, $b) {
        return strcmp($a["word"], $b["word"]);
    }
    
    /**
     * Sortieren: Alphabetisch absteigend.
     * Vergleicht zwei Wörter und ordnet sie alphabetisch absteigend.
     */
    function sortWordsAlphaDesc($a, $b) {
        return strcmp($b["word"], $a["word"]);
    }
    
    /**
     * Sortieren: Nach Stufe aufsteigend.
     * Vergleicht zwei Wörter und ordnet sie alphabetisch, wenn die Stufen
     * identisch sind und numerisch, falls sich die Stufen unterscheiden;
     * beide Vergleiche werden aufsteigend geordnet.
     */
    function sortWordsLevelAsc($a, $b) {
        if ($a["level"] === $b["level"]) {
            return strcmp($a["word"], $b["word"]);
        } else {
            return $a["level"] - $b["level"];
        }
    }
    
    /**
     * Sortieren: Nach Stufe absteigend.
     * Vergleicht zwei Wörter und ordnet sie alphabetisch, wenn die Stufen
     * identisch sind und numerisch, falls sich die Stufen unterscheiden;
     * beide Vergleiche werden absteigend geordnet.
     */
    function sortWordsLevelDesc($a, $b) {
        if ($a["level"] === $b["level"]) {
            return strcmp($a["word"], $b["word"]);
        } else {
            return $b["level"] - $a["level"];
        }
    }
    
    // Wörter alphabetisch sortieren
    if ($sort === "alpha") {
        
        // Aufsteigend
        if ($dir === "asc") {
            uasort($words, "sortWordsAlphaAsc");
        
        // Absteigend
        } else if ($dir === "desc") {
            uasort($words, "sortWordsAlphaDesc");
        }
        
    // Wörter nach Stufe sortieren
    } else if ($sort === "level") {
        
        // Aufsteigend
        if ($dir === "asc") {
            uasort($words, "sortWordsLevelAsc");
        
        // Absteigend
        } else if ($dir === "desc") {
            uasort($words, "sortWordsLevelDesc");
        }
    }
    
?>

<!--Wörterbuch-Slider-->
<article id="dictionary-slider" class="slide-0">
    
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
    
    <!--Übersicht-->
    <section class="dictionary-slide slide-0 scroll current">
        
        <!--Wörter-->
        <ul class="dictionary-words">
            
            <?php foreach ($words as $id => $word) { ?>
            <li>
                <a class="dictionary-word" href="#<?php echo $id; ?>">
                    <span class="word-level level-<?php echo $word["level"]; ?>">
                        <i class="level level-1"></i>
                        <i class="level level-2"></i>
                        <i class="level level-3"></i>
                    </span>
                    <span class="word"><?php echo $word["word"]; ?></span>
                </a>
            </li>
            <?php } ?>
            
        </ul>
        
        <!--Fehler-->
        <div class="error">
            <h4 class="subtitle"><span class="text">Nichts gefunden</span></h4>
            <p class="word description error">
                Es konnten keine Wörter gefunden werden, die zu dem eingegebenen
                Suchbegriff passen.
            </p>
        </div>
        
        <!--Hinweis-->
        <div class="hint">
            <h4 class="subtitle"><span class="text">Hinweis</span></h4>
            <p class="word description info">
                Dein persönliches <b>Wörterbuch</b> füllt sich automatisch
                mit allen Wörtern, die Du schon erraten hast.
            </p>
        </div>
        
    </section>
    
    <!--Details-->
    <section class="dictionary-slide slide-1">
        <div id="content-dictionary"></div>
    </section>
    
</article>