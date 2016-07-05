<article class="term term--quiz term--no-image">
    <header class="term__header">
        <!--
        {{#image}}
        <img class="term__image" alt="{{term}}" src="{{image}}" />
        {{/image}}
        -->
        <h1 class="term__title">
            {{question}} <span class="term__keyword">{{keyword}}</span>?
        </h1>
        <span class="term__info term__info--left term__label">{{difficulty}}</span>
        <span class="term__info">
            <span class="stars stars--animated stars--is-{{lvl}}" data-quiz="level">
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
        <span class="quiz__button quiz__button--{{#correct}}right{{/correct}}{{^correct}}wrong{{/correct}}"
              data-quiz="answer" data-answer="{{correct}}">
            {{label}}
        </span>
        {{/answers}}
    </div>
    <div class="quiz__continue quiz__continue--locked">
        <span class="quiz__button quiz__button--action" data-locked="true" data-quiz="continue">
            Weiter
            <i class="icon icon--right icon--forward"></i>
        </span>
    </div>
</article>