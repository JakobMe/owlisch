<?php
    
    // Daten inkludieren
    include("data.php");
    
    // Fortschrittsdaten definieren
    $statSteps = 10;
    $statAll = 120;
    $statOne = 0;
    $statTwo = 0;
    $statThree = 0;
    $statLast = array(1, 2, 0, 3, 5, 4, 8, 7, 10, 9);
    $statSum = sizeof($words);
    
    // Wort-Stufen zählen
    foreach ($words as $word) {
        switch (intval($word[$iLevel])) {
            case 1: $statOne++; break;
            case 2: $statTwo++; break;
            case 3: $statThree++; break;
        }
    }
    
    // Liste aller Wörterbuch-Daten zusammenstellen
    $statDictionary = array(
        0 => array($statSum),
        1 => array($statOne),
        2 => array($statTwo),
        3 => array($statThree)
    );
    
    // Wörterbuchdaten um Prozentangaben ergänzen
    foreach ($statDictionary as $index => $stat) {
        $divider = $statSum;
        if ($stat[0] === $statSum) { $divider = $statAll;}
        $statDictionary[$index][1] = round(($stat[0] / $divider) * 100, 1);
        $statDictionary[$index][2] = number_format($statDictionary[$index][1], 1, ",", "");
    }
    
?>

<!--Fortschritt-->
<article id="progress">
    
    <!--Titel: Letzte Spiele-->
    <h1 class="quiz-title standalone">
        Meine <b>10</b> letzten <b>Spiele</b>
    </h1>
    
    <!--Statistik: Letzte Spiele-->
    <div class="statistic-last">
        <?php for ($i = 1; $i <= $statSteps; $i++) { ?>
        <span class="statistic-step line-<?php echo $i; ?>"></span>
        <?php } ?>
        <div class="statistic-bars statistics">
            <?php foreach ($statLast as $points) { ?>
            <div class="statistic-bar bar-<?php echo $points; ?>"><div class="bar"></div></div>
            <?php } ?>
        </div>
    </div>
    
    <!--Titel: Gelernte Wörter-->
    <h1 class="quiz-title standalone">
        <b>Gelernte</b> Wörter
    </h1>
    
    <!--Statistik: Wörterbuch-->
    <div class="statistic-dictionary">
        <div class="statistic-inner single">
            <?php for ($i = 1; $i <= $statSteps; $i++) { ?>
            <span class="statistic-step line-<?php echo $i; ?>"></span>
            <?php } ?>
            <div class="statistic-bars statistics">
                <div class="statistic-bar single">
                    <div class="bar" style="width:<?php echo $statDictionary[0][1]; ?>%;"></div>
                    <span class="bar-label">
                        <b><?php echo $statDictionary[0][0]; ?>/<?php echo $statAll; ?></b>
                        <span class="percent"><i><?php echo $statDictionary[0][2]; ?>%</i></span>
                    </span>
                </div>
            </div>
        </div>
    </div>
    
    <!--Titel: Wörterbuch-->
    <h1 class="quiz-title standalone">
        Mein <b>Wörterbuch</b>
    </h1>
    
    <!--Statistik: Wörterbuch-->
    <div class="statistic-dictionary">
        <div class="statistic-inner">
            <?php for ($i = 1; $i <= $statSteps; $i++) { ?>
            <span class="statistic-step line-<?php echo $i; ?>"></span>
            <?php } ?>
            <div class="statistic-bars statistics">
                <?php foreach ($statDictionary as $i => $stat) { if ($i === 0) { continue; } ?>
                <div class="statistic-bar bar-<?php echo $i; ?>">
                    <div class="bar" style="width:<?php echo $stat[1]; ?>%;"></div>
                    <span class="bar-label level-<?php echo $i; ?>">
                        <i class="level no-animation level-1"></i>
                        <i class="level no-animation level-2"></i>
                        <i class="level no-animation level-3"></i>
                        <span class="percent">
                            <b><?php echo $stat[0]; ?></b>
                            <i><?php echo $stat[2]; ?>%</i>
                        </span>
                    </span>
                </div>
                <?php } ?>
            </div>
        </div>
    </div>
    
    <!--Erklärung-->    
    <h4 class="subtitle">
        <span class="text">
            <i class="fa fa-info-circle"></i>
            Hinweis
        </span>
    </h4>
    <p class="text info margin-bottom">
        Hier siehst du, wie viele Fragen du in deinen <b>10 letzten
        Spielen</b> richtig beantwortet hast, wie viele der <b>vorhandenen Wörter</b>
        du schon <b>erlernt</b> hast und wie viele Wörter du bereits auf welchen
        <b>Stufen</b> erraten hast.
    </p>
    
</article>