<li class="list__title">
    <span class="list__title-text">
        <i class="icon icon--dictionary list__title-icon"></i> {{caption}}
        <span class="badge{{#filtered}} badge--highlight{{/filtered}}">
            {{size}} Begriff{{^single}}e{{/single}}
        </span>
    </span>
</li>
{{#terms}}
<li class="list__item" role="listitem" data-term="{{alias}}">
    <span class="stars stars--is-{{lvl}}">
        {{#levels}}
        <i class="stars__star stars__star--{{.}}"></i>
        {{/levels}}
    </span>
    <span class="list__item-label">
        {{start}}<b class="list__item-highlight">{{highlight}}</b>{{tail}}
    </span>
</li>
{{/terms}}
{{^terms}}
{{#filtered}}
<li class="list__title notice notice--error notice--box">
    <span class="notice__title">
        <span class="notice__title-text">Nichts gefunden!</span>
    </span>
    <span class="notice__text">
        Es konnten keine Begriffe gefunden werden, die zu dem
        eingegebenen Suchbegriff passen.
    </span>
</li>
{{/filtered}}
{{/terms}}
{{#empty}}
<li class="list__title notice notice--quiz notice--box">
    <span class="notice__title">
        <span class="notice__title-text">Dein Wörterbuch ist leer!</span>
    </span>
    <span class="notice__text">
        Du hast bisher noch keine Begriffe erraten. Spiele das
        Quiz, um Dein Wörterbuch mit den richtig geratenen Begriffen
        zu füllen.
    </span>
</li>
{{/empty}}