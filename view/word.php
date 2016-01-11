<?php
    
    // Daten inkludieren
    include("data.php");
    
    // Wort auswählen
    $selected = $_POST["word"];
    $word = $words[$selected];
    
?>

<!--Wort: <?php echo $word["word"]; ?>-->
<article id="word">
    <?php if (file_exists("../img/content/$selected.jpg")) { ?>
    <div class="quiz-image big">
        <img src="img/content/<?php echo $selected; ?>.jpg" />
    </div>
    <?php } ?>
    <h1 class="quiz-title">
        <b><?php echo $word["word"]; ?></b>
    </h1>
    <div class="quiz-info static">
        <span class="quiz-info-difficulty">
            Fortschritt:
        </span>
        <span class="quiz-info-level level-<?php echo $word["level"]; ?>">
            <i class="level level-1"></i>
            <i class="level level-2"></i>
            <i class="level level-3"></i>
        </span>
        <?php if (file_exists("../audio/$selected.mp3")) { ?>
        <span class="quiz-info-audio-play">
            <i class="fa fa-volume-up"></i>
        </span>
        <audio preload="none" class="quiz-info-audio">
            <source src="audio/<?php echo $selected; ?>.mp3" type="audio/mpeg">
        </audio>
        <?php } ?>
    </div>
    <div class="word-text">
        <h4 class="subtitle"><span class="text">Übersetzung</span></h4>
        <p class="word translation">„<?php echo $word["translate"]; ?>“</p>
        <h4 class="subtitle"><span class="text">Beschreibung</span></h4>
        <p class="word description"><?php echo trim($word["info"]); ?></p>
    </div>
</article>