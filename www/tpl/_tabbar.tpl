<ul class="tabbar__list">
    {{#.}}
    <li class="tabbar__tab" data-tabbar="tab" data-panel="{{alias}}">
        <i class="tabbar__icon icon icon--{{icon}}"></i>
        <span class="tabbar__label">{{label}}</span>
    </li>
    {{/.}}
</ul>
<div class="tabbar__status"></div>