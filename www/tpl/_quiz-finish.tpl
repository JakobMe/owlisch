<p class="quiz__title">
    <span class="quiz__title-text">
        <i class="icon icon--{{icon}} quiz__title-icon"></i> {{rating}}
        <span class="badge{{#noskip}} badge--disabled{{/noskip}}">
            {{skipped}} ausgelassen
        </span>
    </span>
</p>
<div class="quiz__chart chart chart--score">
    <div class="chart__lines">
        {{#questions}}
        <div class="chart__line"></div>
        {{/questions}}
    </div>
    <div class="chart__container">
        <div class="chart__data{{#zero}} chart__data--none{{/zero}}">
            <div id="quiz-chart" class="chart__bar" style="width: {{percent}}%;"></div>
            <div class="chart__label">
                <span class="chart__text chart__text--percent">{{percent}}%</span>
                <span class="chart__text">{{result}} Punkt{{^single}}e{{/single}}</span>
            </div>
        </div>
    </div>
</div>
<p class="notice notice--quiz">
    <span class="notice__title">
        <span class="notice__title-text">Fertig!</span>
    </span>
    <span class="notice__text">
        Dein <b>Ergebnis</b> wurde zu Deiner <b>Statistik</b> hinzugefügt.<br/>
        <b>Willst Du noch einmal spielen?</b>
    </span>
</p>
<a class="quiz__button quiz__button--round quiz__button--action" href="#" role="button">
    <span class="quiz__buttontext">Quiz</span><br/>
    <span class="quiz__buttontext">starten</span>
</a>