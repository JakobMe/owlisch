<?php
    
    // Daten inkludieren
    include("data.php");
    
    // Sortieroption ermitteln
    $sort = $_POST["sort"];
    $dir = $_POST["dir"];
    
    // Sortieroptionen definieren
    $sAlpha = "alpha";
    $sLevel = "level";
    $sAsc   = "asc";
    $sDesc  = "desc";

    // Sortierung bei fehlerhaften Angaben korrigieren
    if (($sort !== $sAlpha) && ($sort !== $sLevel)) { $sort = $sAlpha; }
    if (($dir !== $sAsc) && ($dir !== $sDesc)) { $dir = $sAsc; }
    
    /**
     * Sortieren: Alphabetisch aufsteigend.
     * Vergleicht zwei Wörter und ordnet sie alphabetisch aufsteigend.
     */
    function sortWordsAlphaAsc($a, $b) {
        global $iWord;
        return strcmp($a[$iWord], $b[$iWord]);
    }
    
    /**
     * Sortieren: Alphabetisch absteigend.
     * Vergleicht zwei Wörter und ordnet sie alphabetisch absteigend.
     */
    function sortWordsAlphaDesc($a, $b) {
        global $iWord;
        return strcmp($b[$iWord], $a[$iWord]);
    }
    
    /**
     * Sortieren: Nach Stufe aufsteigend.
     * Vergleicht zwei Wörter und ordnet sie alphabetisch, wenn die Stufen
     * identisch sind und numerisch, falls sich die Stufen unterscheiden;
     * beide Vergleiche werden aufsteigend geordnet.
     */
    function sortWordsLevelAsc($a, $b) {
        global $iWord, $iLevel;
        if ($a[$iLevel] === $b[$iLevel]) {
            return strcmp($a[$iWord], $b[$iWord]);
        } else {
            return $a[$iLevel] - $b[$iLevel];
        }
    }
    
    /**
     * Sortieren: Nach Stufe absteigend.
     * Vergleicht zwei Wörter und ordnet sie alphabetisch, wenn die Stufen
     * identisch sind und numerisch, falls sich die Stufen unterscheiden;
     * beide Vergleiche werden absteigend geordnet.
     */
    function sortWordsLevelDesc($a, $b) {
        global $iWord, $iLevel;
        if ($a[$iLevel] === $b[$iLevel]) {
            return strcmp($a[$iWord], $b[$iWord]);
        } else {
            return $b[$iLevel] - $a[$iLevel];
        }
    }
    
    // Wörter alphabetisch sortieren
    if ($sort === $sAlpha) {
        
        // Aufsteigend
        if ($dir === $sAsc) {
            uasort($words, "sortWordsAlphaAsc");
        
        // Absteigend
        } else if ($dir === $sDesc) {
            uasort($words, "sortWordsAlphaDesc");
        }
        
    // Wörter nach Stufe sortieren
    } else if ($sort === $sLevel) {
        
        // Aufsteigend
        if ($dir === $sAsc) {
            uasort($words, "sortWordsLevelAsc");
        
        // Absteigend
        } else if ($dir === $sDesc) {
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
                    <span class="word-level level-<?php echo $word[$iLevel]; ?>">
                        <i class="level level-1"></i>
                        <i class="level level-2"></i>
                        <i class="level level-3"></i>
                    </span>
                    <span class="word"><?php echo $word[$iWord]; ?></span>
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
                mit allen Wörtern, die du schon erraten hast.
            </p>
        </div>
        
    </section>
    
    <!--Details-->
    <section class="dictionary-slide slide-1">
        <div id="content-dictionary"></div>
    </section>
    
</article>