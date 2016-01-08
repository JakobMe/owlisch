<?php
    
    // Daten inkludieren
    include("data.php");
    
    // Wort auswählen
    $selected = $_POST["word"];
    $word = $words[$selected];
    
?>

<!--Wort: <?php echo $word["word"]; ?>-->
<?php if (file_exists("../img/content/$selected.jpg")) { ?>
<div class="quiz-image big">
    <img src="img/content/<?php echo $selected; ?>.jpg" />
</div>
<?php } ?>
<h2 class="quiz-title">
    <b><?php echo $word["word"]; ?></b>
</h2>
<div class="quiz-info">
    <span class="quiz-info-difficulty">
        Fortschritt:
    </span>
    <span class="quiz-info-level level-<?php echo $word["level"]; ?>">
        <i class="level level-1"></i>
        <i class="level level-2"></i>
        <i class="level level-3"></i>
    </span>
    <span class="quiz-info-audio-play">
        <i class="fa fa-volume-up"></i>
    </span>
    <audio preload="none" class="quiz-info-audio">
        <source src="audio/<?php echo $selected; ?>.mp3" type="audio/mpeg">
    </audio>
</div>
<div class="content-padding center">
    <p class="title">
        <i class="fa fa-comments-o"></i>
        <b><?php echo $word["translate"]; ?></b>
    </p>
    <p class="info important small">
        <i class="fa fa-info-circle"></i>
        <?php echo trim($word["info"]); ?>
    </p>
</div>