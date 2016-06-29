<ul class="dropdown" id="navigation-dropdown" role="menu">
    {{#.}}
    <li class="dropdown__item" role="menuitem"
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
               maxlength="16" id="navigation-search"
               role="search" />
        <i class="navigationbar__search-clear
           navigationbar__search-clear--hidden"
           id="navigation-clear"></i>
    </div>
    <h1 class="navigationbar__heading" id="navigation-heading"></h1>
    <i class="navigationbar__button navigationbar__button--left"
       role="button" data-action="null" data-icon="null"></i>
    <i class="navigationbar__button navigationbar__button--right"
       role="button" data-action="null" data-icon="null"></i>
</div>