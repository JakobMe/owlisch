<article class="term term--quiz{{^image}} term--no-image{{/image}}">
    <header class="term__header">
        {{#image}}
        <img class="term__image" alt="{{term}}" src="{{image}}" />
        {{/image}}
        <h1 class="term__title">
            {{question}} <span class="term__keyword">{{keyword}}</span>?
        </h1>
        <span class="term__info term__info--left term__label">{{difficulty}}</span>
        <span class="term__info">
            <span class="stars stars--is-{{lvl}}" data-quiz="level">
                {{#levels}}
                <i class="stars__star stars__star--{{.}}"></i>
                {{/levels}}
            </span>
        </span>
        {{#audio}}
        <span class="term__info term__info--right play" data-play="main">
            <i class="icon icon--audio play__icon"></i>
            <audio preload="none" class="play__audio" data-play="audio">
                <source src="{{.}}" type="audio/mpeg">
            </audio>
        </span>
        {{/audio}}
    </header>
    <div class="quiz__answers{{#chars}} quiz__answers--chars{{/chars}}" data-locked="false" data-quiz="answers">
        {{#buttons}}
        {{#answers}}
        <span class="quiz__button{{#image}} quiz__button--small{{/image}} quiz__button--{{#correct}}right{{/correct}}{{^correct}}wrong{{/correct}}"
              data-quiz="answer" data-answer="{{correct}}">
            {{label}}
        </span>
        {{/answers}}
        {{/buttons}}
        {{#pictures}}
        {{#answers}}
        <span class="quiz__button quiz__button--image quiz__button--{{#correct}}right{{/correct}}{{^correct}}wrong{{/correct}}"
              data-quiz="answer" data-answer="{{correct}}">
            <img class="quiz__image" src="{{label}}" />
        </span>
        {{/answers}}
        {{/pictures}}
        {{#chars}}
        <div class="quiz__input quiz__input--letters" data-quiz="input" data-solution="{{solution}}" data-input="" data-current="-1">
            {{#letters}}
            <span class="quiz__letter" style="width:{{width}}%;"></span>
            {{/letters}}
        </div>
        <div class="quiz__solution quiz__solution--locked" data-quiz="solution">
            Lösung: <b>„{{solution}}“</b>
        </div>
        <div class="quiz__keyboard" data-quiz="keyboard">
            <span class="quiz__button quiz__button--inline quiz__button--backspace quiz__button--locked" data-quiz="backspace">
                <i class="icon icon--backspace icon--left"></i> Entfernen
            </span>
            <br/>
            {{#letters}}
            <span class="quiz__button quiz__button--inline" data-quiz="letter" data-locked="false">{{.}}</span>
            {{/letters}}
        </div>
        {{/chars}}
        {{#input}}
        <form data-quiz="form">
            <input class="quiz__input" data-quiz="input" data-solution="{{.}}" type="text"
                   spellcheck="false" autocomplete="off" autocorrect="off" tabindex="-1" />
            <input class="quiz__submit" type="submit" />
        </form>
        <div class="quiz__solution quiz__solution--locked" data-quiz="solution">
            Lösung: <b>„{{.}}“</b>
        </div>
        <p class="notice">
            <span class="notice__title">
                <span class="notice__title-text">Hinweis</span>
            </span>
            <span class="notice__text">
                <b>Groß-/Kleinschreibung</b> wird <b>nicht</b> beachtet.
            </span>
        </p>
        {{/input}}
    </div>
</article>
{{#solve}}
<div class="quiz__action" data-locked="false" data-quiz="solve">
    <span class="quiz__button quiz__button--action">
        <span>Lösen</span>
        <i class="icon icon--right icon--solve"></i>
    </span>
</div>
{{/solve}}
<div class="quiz__action quiz__action--locked" data-locked="true" data-quiz="continue">
    <span class="quiz__button quiz__button--action">
        <span>Weiter</span>
        <i class="icon icon--right icon--forward"></i>
    </span>
</div>