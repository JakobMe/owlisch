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
        <!--
        {{#audio}}
        <span class="term__info term__info--right play" data-play="main">
            <i class="icon icon--audio play__icon"></i>
            <audio preload="none" class="play__audio" data-play="audio">
                <source src="{{.}}" type="audio/mpeg">
            </audio>
        </span>
        {{/audio}}
        -->
    </header>
    <div class="quiz__answers" data-locked="false" data-quiz="answers">
        {{#answers}}
        <span class="quiz__button{{#image}} quiz__button--small{{/image}} quiz__button--{{#correct}}right{{/correct}}{{^correct}}wrong{{/correct}}"
              data-quiz="answer" data-answer="{{correct}}">
            {{label}}
        </span>
        {{/answers}}
    </div>
</article>
<div class="quiz__continue quiz__continue--locked" data-locked="true" data-quiz="continue">
    <span class="quiz__button quiz__button--action">
        <span>Weiter</span>
        <i class="icon icon--right icon--forward"></i>
    </span>
</div>