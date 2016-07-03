<ul class="dropdown" data-navigationbar="dropdown">
    {{#.}}
    <li class="dropdown__item" data-navigationbar="sort"
        data-sort="{{optSort}}" data-ordr="{{optOrdr}}">
        <i class="dropdown__icon icon icon--sort-{{icoSort}}-{{icoOrdr}}"></i>
        <span class="dropdown__label">
            {{lblSort}} {{lblOrdr}} sortieren
        </span>
    </li>
    {{/.}}
</ul>
<div class="navigationbar__wrapper">
    <div class="navigationbar__search">
        <input class="navigationbar__search-input" type="text"
               spellcheck="false" autocomplete="off"
               autocorrect="off" autocapitalize="none"
               tabindex="-100" placeholder="Suche"
               maxlength="16" data-navigationbar="search" />
        <i class="navigationbar__search-clear navigationbar__search-clear--hidden"
           data-navigationbar="clear"></i>
    </div>
    <h1 class="navigationbar__heading" data-navigationbar="heading"></h1>
    <i class="navigationbar__button navigationbar__button--left"
       data-navigationbar="button" data-action="null" data-icon="null"></i>
    <i class="navigationbar__button navigationbar__button--right"
       data-navigationbar="button" data-action="null" data-icon="null"></i>
</div>