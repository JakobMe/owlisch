<!--Fortschritt-->
<div id="quiz-progress">
    <div id="quiz-progress-inner">
        <div id="quiz-progress-bar"></div>
        <ul id="quiz-progress-steps">
            <li class="quiz-progress-step" data-step="1"></li>
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

<!--Quiz-Karten-->
<div id="quiz-slider" class="slide-0">
    
    <!--Start-->
    <div class="quiz-slide slide-0 current">
        <h2 class="quiz-title finished">
            <b>OWL</b>-Quiz
        </h2>
        <div class="content-padding center">
            <p class="title">
                <i class="fa fa-graduation-cap"></i>
                Teste dein <b>Wissen</b>!
            </p>
        </div>
        <p class="label"><span class="text">Hinweis</span></p>
        <p class="word description margin-bottom info">
            Je häufiger du ein Wort <b>richtig</b> errätst,
            desto <b>schwieriger</b> werden die Fragen.
        </p>
        <div class="content-padding">
            <a class="button round action" id="quiz-start">
                <b>Quiz</b><br/><i>starten</i>
            </a>
        </div>
    </div>
    
    <!--Frage 1: OWL zu Deutsch-->
    <div class="quiz-slide slide-1">
        <h2 class="quiz-title">
            Was ist ein <b>Pinneken</b>?
        </h2>
        <div class="quiz-info">
            <span class="quiz-info-difficulty">
                Leicht
            </span>
            <span class="quiz-info-level level-0" data-level="0">
                <i class="level level-1"></i>
                <i class="level level-2"></i>
                <i class="level level-3"></i>
            </span>
            <span class="quiz-info-audio-play">
                <i class="fa fa-volume-up"></i>
            </span>
            <audio preload="none" class="quiz-info-audio">
                <source src="audio/pinneken.mp3" type="audio/mpeg">
            </audio>
        </div>
        <div class="content-padding">
            <div class="quiz-choices">
                <a class="button choice wrong">Schraube</a>
                <a class="button choice right">Schnapsglas</a>
                <a class="button choice wrong">Blume</a>
                <a class="button choice wrong">Pinienzapfen</a>
            </div>
        </div>
        <div class="content-padding bottom">
            <a class="button action quiz-next hidden">
                Weiter
                <i class="fa fa-arrow-right"></i>
            </a>
        </div>
    </div>
    
    <!--Frage 2: Deutsch zu OWL-->
    <div class="quiz-slide slide-2">
        <h2 class="quiz-title">
            Was ist ein <b>Schnapsglas</b>?
        </h2>
        <div class="quiz-info">
            <span class="quiz-info-difficulty">
                Leicht
            </span>
            <span class="quiz-info-level level-0" data-level="0">
                <i class="level level-1"></i>
                <i class="level level-2"></i>
                <i class="level level-3"></i>
            </span>
        </div>
        <div class="content-padding">
            <div class="quiz-choices">
                <a class="button choice wrong">Öpperken</a>
                <a class="button choice right">Pinneken</a>
                <a class="button choice wrong">Pankauken</a>
                <a class="button choice wrong">Pömpel</a>
            </div>
        </div>
        <div class="content-padding bottom">
            <a class="button action quiz-next hidden">
                Weiter
                <i class="fa fa-arrow-right"></i>
            </a>
        </div>
    </div>
    
    <!--Frage 3: OWL zu Bild-->
    <div class="quiz-slide slide-3">
        <h2 class="quiz-title">
            Was ist ein <b>Pinneken</b>?
        </h2>
        <div class="quiz-info">
            <span class="quiz-info-difficulty">
                Leicht
            </span>
            <span class="quiz-info-level level-0" data-level="0">
                <i class="level level-1"></i>
                <i class="level level-2"></i>
                <i class="level level-3"></i>
            </span>
            <span class="quiz-info-audio-play">
                <i class="fa fa-volume-up"></i>
            </span>
            <audio preload="none" class="quiz-info-audio">
                <source src="audio/pinneken.mp3" type="audio/mpeg">
            </audio>
        </div>
        <div class="quiz-choices images">
            <a class="button choice wrong image">
                <span class="button-image">
                    <img src="img/content/pinienzapfen.jpg" />
                </span>
            </a>
            <a class="button choice wrong image">
                <span class="button-image">
                    <img src="img/content/schraube.jpg" />
                </span>
            </a>
            <a class="button choice right image">
                <span class="button-image">
                    <img src="img/content/pinneken.jpg" />
                </span>
            </a>
            <a class="button choice wrong image">
                <span class="button-image">
                    <img src="img/content/blume.jpg" />
                </span>
            </a>
            <div class="clear"></div>           
        </div>
        <div class="content-padding bottom">
            <a class="button action quiz-next hidden">
                Weiter
                <i class="fa fa-arrow-right"></i>
            </a>
        </div>
    </div>
    
    <!--Frage 4: Bild zu OWL-->
    <div class="quiz-slide slide-4">
        <h2 class="quiz-title image">
            Was ist <b>das</b>?
        </h2>
        <div class="quiz-image">
            <img src="img/content/pinneken.jpg" />
        </div>
        <div class="quiz-info">
            <span class="quiz-info-difficulty">
                Leicht
            </span>
            <span class="quiz-info-level level-0" data-level="0">
                <i class="level level-1"></i>
                <i class="level level-2"></i>
                <i class="level level-3"></i>
            </span>
        </div>
        <div class="content-padding">
            <div class="quiz-choices">
                <a class="button choice small wrong">Öpperken</a>
                <a class="button choice small right">Pinneken</a>
                <a class="button choice small wrong">Pankauken</a>
                <a class="button choice small wrong">Pömpel</a>
            </div>
        </div>
        <div class="content-padding bottom">
            <a class="button action quiz-next hidden">
                Weiter
                <i class="fa fa-arrow-right"></i>
            </a>
        </div>
    </div>
    
    <!--Frage 5: Deutsch zu Buchstaben-->
    <div class="quiz-slide slide-5">
        <h2 class="quiz-title">
            Was ist ein <b>Schnapsglas</b>?
        </h2>
        <div class="quiz-info">
            <span class="quiz-info-difficulty">
                Mittel
            </span>
            <span class="quiz-info-level level-1" data-level="1">
                <i class="level level-1"></i>
                <i class="level level-2"></i>
                <i class="level level-3"></i>
            </span>
        </div>
        <div class="quiz-input-characters quiz-solution characters-8"
             data-solution="Pinneken">
            <span class="input-character current" data-choice=""></span>
            <span class="input-character" data-choice=""></span>
            <span class="input-character" data-choice=""></span>
            <span class="input-character" data-choice=""></span>
            <span class="input-character" data-choice=""></span>
            <span class="input-character" data-choice=""></span>
            <span class="input-character" data-choice=""></span>
            <span class="input-character" data-choice=""></span>
        </div>
        <div class="content-padding center quiz-solution-reveal">
            <p class="title">
                <i>Lösung: <b>Pinneken</b></i>
                <i class="quiz-solution-icon"></i>
            </p>
        </div>
        <div class="quiz-input-choices">
            <a class="button input-delete locked">
                <i class="fa fa-long-arrow-left"></i>
                Entfernen
            </a>
            <br/>
            <span class="button input-choice choice-1" data-choice="1">K</span>
            <span class="button input-choice choice-2" data-choice="2">E</span>
            <span class="button input-choice choice-3" data-choice="3">N</span>
            <span class="button input-choice choice-4" data-choice="4">S</span>
            <span class="button input-choice choice-5" data-choice="5">I</span>
            <span class="button input-choice choice-6" data-choice="6">P</span>
            <span class="button input-choice choice-7" data-choice="7">N</span>
            <span class="button input-choice choice-8" data-choice="8">E</span>
            <span class="button input-choice choice-9" data-choice="9">T</span>
            <span class="button input-choice choice-10" data-choice="10">N</span>
            <span class="button input-choice choice-11" data-choice="11">I</span>
        </div>
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
    </div>
    
    <!--Frage 6: Deutsch zu Eingabe-->
    <div class="quiz-slide slide-6 autofocus">
        <h2 class="quiz-title">
            Was ist ein <b>Schnapsglas</b>?
        </h2>
        <div class="quiz-info">
            <span class="quiz-info-difficulty">
                Schwer
            </span>
            <span class="quiz-info-level level-2" data-level="2">
                <i class="level level-1"></i>
                <i class="level level-2"></i>
                <i class="level level-3"></i>
            </span>
        </div>
        <form class="quiz-input-text quiz-solution"
             data-solution="Pinneken">
             <input spellcheck="false" autocomplete="off" autocorrect="off"
                    class="input-text" type="text" />
             <input class="input-submit" type="submit" />
        </form>
        <div class="content-padding center quiz-solution-reveal">
            <p class="title">
                <i>Lösung: <b>Pinneken</b></i>
                <i class="quiz-solution-icon"></i>
            </p>
        </div>
        <div class="content-padding small-vertical quiz-solution-info center">
            <p class="info small">
                <i class="fa fa-lightbulb-o"></i>
                Benutze die Tastatur, um die Lösung einzugeben.
            </p>
        </div>
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
    </div>
    
    <!--Frage 7: Deutsch zu OWL-->
    <div class="quiz-slide slide-7">
        <h2 class="quiz-title">
            Was ist ein <b>Schnapsglas</b>?
        </h2>
        <div class="quiz-info">
            <span class="quiz-info-difficulty">
                Leicht
            </span>
            <span class="quiz-info-level level-0" data-level="0">
                <i class="level level-1"></i>
                <i class="level level-2"></i>
                <i class="level level-3"></i>
            </span>
        </div>
        <div class="content-padding">
            <div class="quiz-choices">
                <a class="button choice wrong">Öpperken</a>
                <a class="button choice right">Pinneken</a>
                <a class="button choice wrong">Pankauken</a>
                <a class="button choice wrong">Pömpel</a>
            </div>
        </div>
        <div class="content-padding bottom">
            <a class="button action quiz-next hidden">
                Weiter
                <i class="fa fa-arrow-right"></i>
            </a>
        </div>
    </div>
    
    <!--Frage 8: OWL zu Bild-->
    <div class="quiz-slide slide-8">
        <h2 class="quiz-title">
            Was ist ein <b>Pinneken</b>?
        </h2>
        <div class="quiz-info">
            <span class="quiz-info-difficulty">
                Leicht
            </span>
            <span class="quiz-info-level level-0" data-level="0">
                <i class="level level-1"></i>
                <i class="level level-2"></i>
                <i class="level level-3"></i>
            </span>
            <span class="quiz-info-audio-play">
                <i class="fa fa-volume-up"></i>
            </span>
            <audio preload="none" class="quiz-info-audio">
                <source src="audio/pinneken.mp3" type="audio/mpeg">
            </audio>
        </div>
        <div class="quiz-choices images">
            <a class="button choice wrong image">
                <span class="button-image">
                    <img src="img/content/pinienzapfen.jpg" />
                </span>
            </a>
            <a class="button choice wrong image">
                <span class="button-image">
                    <img src="img/content/schraube.jpg" />
                </span>
            </a>
            <a class="button choice right image">
                <span class="button-image">
                    <img src="img/content/pinneken.jpg" />
                </span>
            </a>
            <a class="button choice wrong image">
                <span class="button-image">
                    <img src="img/content/blume.jpg" />
                </span>
            </a>
            <div class="clear"></div>           
        </div>
        <div class="content-padding bottom">
            <a class="button action quiz-next hidden">
                Weiter
                <i class="fa fa-arrow-right"></i>
            </a>
        </div>
    </div>
    
    <!--Frage 9: Bild zu OWL-->
    <div class="quiz-slide slide-9">
        <h2 class="quiz-title image">
            Was ist <b>das</b>?
        </h2>
        <div class="quiz-image">
            <img src="img/content/pinneken.jpg" />
        </div>
        <div class="quiz-info">
            <span class="quiz-info-difficulty">
                Leicht
            </span>
            <span class="quiz-info-level level-0" data-level="0">
                <i class="level level-1"></i>
                <i class="level level-2"></i>
                <i class="level level-3"></i>
            </span>
        </div>
        <div class="content-padding">
            <div class="quiz-choices">
                <a class="button choice small wrong">Öpperken</a>
                <a class="button choice small right">Pinneken</a>
                <a class="button choice small wrong">Pankauken</a>
                <a class="button choice small wrong">Pömpel</a>
            </div>
        </div>
        <div class="content-padding bottom">
            <a class="button action quiz-next hidden">
                Weiter
                <i class="fa fa-arrow-right"></i>
            </a>
        </div>
    </div>
    
    <!--Frage 10: Deutsch zu Buchstaben-->
    <div class="quiz-slide slide-10">
        <h2 class="quiz-title">
            Was ist ein <b>Schnapsglas</b>?
        </h2>
        <div class="quiz-info">
            <span class="quiz-info-difficulty">
                Mittel
            </span>
            <span class="quiz-info-level level-1" data-level="1">
                <i class="level level-1"></i>
                <i class="level level-2"></i>
                <i class="level level-3"></i>
            </span>
        </div>
        <div class="quiz-input-characters quiz-solution characters-8"
             data-solution="Pinneken">
            <span class="input-character current" data-choice=""></span>
            <span class="input-character" data-choice=""></span>
            <span class="input-character" data-choice=""></span>
            <span class="input-character" data-choice=""></span>
            <span class="input-character" data-choice=""></span>
            <span class="input-character" data-choice=""></span>
            <span class="input-character" data-choice=""></span>
            <span class="input-character" data-choice=""></span>
        </div>
        <div class="content-padding center quiz-solution-reveal">
            <p class="title">
                <i>Lösung: <b>Pinneken</b></i>
                <i class="quiz-solution-icon"></i>
            </p>
        </div>
        <div class="quiz-input-choices">
            <a class="button input-delete locked">
                <i class="fa fa-long-arrow-left"></i>
                Entfernen
            </a>
            <br/>
            <span class="button input-choice choice-1" data-choice="1">K</span>
            <span class="button input-choice choice-2" data-choice="2">E</span>
            <span class="button input-choice choice-3" data-choice="3">N</span>
            <span class="button input-choice choice-4" data-choice="4">S</span>
            <span class="button input-choice choice-5" data-choice="5">I</span>
            <span class="button input-choice choice-6" data-choice="6">P</span>
            <span class="button input-choice choice-7" data-choice="7">N</span>
            <span class="button input-choice choice-8" data-choice="8">E</span>
            <span class="button input-choice choice-9" data-choice="9">T</span>
            <span class="button input-choice choice-10" data-choice="10">N</span>
            <span class="button input-choice choice-11" data-choice="11">I</span>
        </div>
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
    </div>
    
    <!--Ende-->
    <div class="quiz-slide slide-11">
        <h2 class="quiz-title finished">
            <b>Fertig!</b>
        </h2>
        <div id="quiz-result">
            <div id="quiz-result-inner">
                <div id="result-lines">
                    <div class="result-line line-1"></div>
                    <div class="result-line line-2"></div>
                    <div class="result-line line-3"></div>
                    <div class="result-line line-4"></div>
                    <div class="result-line line-5"></div>
                    <div class="result-line line-6"></div>
                    <div class="result-line line-7"></div>
                    <div class="result-line line-8"></div>
                    <div class="result-line line-9"></div>
                </div>
                <div id="result-bar" class="hidden"></div>
            </div>
        </div>
        <div class="content-padding center">
            <p class="title">
                Du hast <b><span id="result-right">5</span> von
                <span id="result-total">10</span></b>
                Fragen richtig beantwortet!
                <i class="fa fa-smile-o"></i>
            </p>
            <p class="info">
                Willst Du noch einmal spielen?
            </p>
        </div>
        <a class="button round action" id="quiz-restart">
            <b>Quiz</b><br/><i>starten</i>
        </a>
    </div>
    
</div>