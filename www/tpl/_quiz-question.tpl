<article class="term term--quiz{{^image}} term--no-image{{/image}}">
    <header class="term__header">
        {{#image}}
        <img class="term__image" alt="{{term}}" src="{{image}}" />
        {{/image}}
        <h1 class="term__title">
            {{term}}{{#article}}<span class="term__article">, {{article}}</span>{{/article}}
        </h1>
        <span class="term__info term__info--left term__label">{{label}}</span>
        <span class="term__info">
            <span class="stars stars--is-{{lvl}}">
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
</article>