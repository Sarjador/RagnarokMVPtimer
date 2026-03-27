## 1. Translations

- [x] 1.1 Add translation keys to `translations.ts`: `nav.catalog`, `nav.active-timers`, `catalog.search-placeholder`, `catalog.empty`, `catalog.track`, `catalog.respawn-range`
- [x] 1.2 Add EN and ES values for all 6 new keys

## 2. BossCardComponent

- [x] 2.1 Create `src/app/features/boss-card/boss-card.component.ts` as standalone OnPush component with `boss: BossEntry` input and `select: OutputEmitterRef<BossEntry>` output
- [x] 2.2 Create `boss-card.component.html`: image with error fallback, boss name, property badge, race, respawn range ("Xm – Ym"), and "Track" button
- [x] 2.3 Create `boss-card.component.scss`: card layout, hover lift, image sizing, badge colors
- [x] 2.4 Add `public/images/boss-placeholder.svg` placeholder asset

## 3. MvpCatalogComponent

- [x] 3.1 Create `src/app/features/mvp-catalog/mvp-catalog.component.ts` injecting `BossCatalogService` and `LocaleService`; add `filterQuery` signal and `filteredBosses` computed; add `bossSelected: OutputEmitterRef<BossEntry>` output
- [x] 3.2 Create `mvp-catalog.component.html`: search input bound to `filterQuery`, card grid with `@for` over `filteredBosses`, empty-state message when empty
- [x] 3.3 Create `mvp-catalog.component.scss`: grid layout (auto-fill, min card width ~140px), search input style, empty state style

## 4. BossSearchComponent — prefill support

- [x] 4.1 Add a `prefillBoss(boss: BossEntry): void` public method to `BossSearchComponent` that sets the selected boss and focuses the death-time input

## 5. TimersPageComponent — tabs

- [x] 5.1 Add `activeTab` signal (`'catalog' | 'active'`) defaulting to `'catalog'` in `TimersPageComponent`
- [x] 5.2 Add `@ViewChild(BossSearchComponent)` reference and `onBossSelected(boss)` handler that sets tab to `'active'` then calls `prefillBoss`
- [x] 5.3 Update `timers-page.component.html`: tab bar (Catalog / Active Timers buttons), conditional panels using `@if`; embed `MvpCatalogComponent` in Catalog panel and `BossSearchComponent` + `TimerListComponent` in Active Timers panel
- [x] 5.4 Update `timers-page.component.scss`: tab bar styles, active tab indicator
- [x] 5.5 Update `timers-page.component.ts` imports to include `MvpCatalogComponent` and `BossCardComponent`

## 6. Tests

- [x] 6.1 Write `boss-card.component.spec.ts`: renders boss name, emits `select` on click, shows placeholder on image error
- [x] 6.2 Write `mvp-catalog.component.spec.ts`: shows all bosses, filters by name, filters by alias, shows empty state, emits `bossSelected` on card select
- [x] 6.3 Update `timers-page.component.spec.ts` (or create): default tab is catalog, switching tabs works, card selection triggers tab switch and prefill
