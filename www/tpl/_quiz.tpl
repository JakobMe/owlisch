<div class="quiz">
    <div class="progressbar" id="quiz-progressbar">
        <div class="progressbar__wrapper">
            <div class="progressbar__line"></div>
            <ul class="progressbar__steps">
                {{#questions}}
                <li class="progressbar__step" role="checkbox">
                    <i class="progressbar__icon icon"></i>
                </li>
                {{/questions}}
            </ul>
        </div>
    </div>
    <div class="slider slider--has-{{slides}}" id="quiz-slider">
        <div class="slider__slide" id="quiz-start" data-slide="1">
            <p class="quiz__title">
                <span class="quiz__title-text">
                    <i class="icon icon--dictionary quiz__title-icon"></i> {{caption}}
                    <span class="badge">{{size}} Fragen</span>
                </span>
            </p>
            <p class="notice">
                <span class="notice__title">
                    <span class="notice__title-text">Hinweis</span>
                </span>
                <span class="notice__text">
                    Du kannst das <b>Quiz</b> jederzeit <b>abbrechen</b>.
                    Wenn Du eine Antwort nicht weißt, kannst Du die Frage
                    auch <b>überspringen</b>. Je häufiger Du einen Begriff
                    <b>richtig errätst</b>, desto schwieriger wird die <b>Frage</b>.
                </span>
            </p>
            <a class="quiz__button quiz__button--round quiz__button--action" href="#" role="button">
                <span class="quiz__buttontext">Quiz</span><br/>
                <span class="quiz__buttontext">starten</span>
            </a>
        </div>
        {{#questions}}
        <div class="slider__slide" data-slide="{{.}}"></div>
        {{/questions}}
        <div class="slider__slide" id="quiz-finish" data-slide="{{slides}}">
            
        </div>
    </div>
</div>