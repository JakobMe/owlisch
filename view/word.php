<?php
    
    // Daten inkludieren
    include("data.php");
    
    // Wort auswählen
    $selected = $_POST[$iWord];
    $word = $words[$selected];
    
    // Dateipfade definieren
    $pBack  = "../";
    $pImage = "img/content/";
    $pAudio = "audio/";
    $fImage = "$selected.jpg";
    $fAudio = "$selected.mp3";
    
?>

<!--Wort: <?php echo $word["word"]; ?>-->
<article id="word">
    <?php if (file_exists($pBack . $pImage . $fImage)) { ?>
    <div class="quiz-image big">
        <img src="<?php echo ($pImage . $fImage); ?>" />
    </div>
    <?php } ?>
    <h1 class="quiz-title">
        <b><?php echo $word[$iWord]; ?></b>
    </h1>
    <div class="quiz-info static">
        <span class="quiz-info-difficulty">
            Fortschritt:
        </span>
        <span class="quiz-info-level level-<?php echo $word[$iLevel]; ?>">
            <i class="level level-1"></i>
            <i class="level level-2"></i>
            <i class="level level-3"></i>
        </span>
        <?php if (file_exists($pBack . $pAudio . $fAudio)) { ?>
        <span class="quiz-info-audio-play">
            <i class="fa fa-volume-up"></i>
        </span>
        <audio preload="none" class="quiz-info-audio">
            <source src="<?php echo ($pAudio . $fAudio); ?>" type="audio/mpeg">
        </audio>
        <?php } ?>
    </div>
    <div class="word-text">
        <h4 class="subtitle"><span class="text">Übersetzung</span></h4>
        <p class="word translation">„<?php echo $word[$iTranslate]; ?>“</p>
        <h4 class="subtitle"><span class="text">Beschreibung</span></h4>
        <p class="word description"><?php echo trim($word[$iInfo]); ?></p>
    </div>
</article>