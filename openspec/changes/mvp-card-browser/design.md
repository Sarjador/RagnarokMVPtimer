## Context

The current `TimersPageComponent` is a simple vertical layout: `BossSearchComponent` (text search + death-time form) on top, `TimerListComponent` below. All boss interaction happens through the search box. The `BossEntry` model already carries an `imageUrl` field that is not yet displayed anywhere in the UI.

The app is Angular 20 with standalone components, OnPush change detection, and signal-based services. `BossCatalogService` exposes `bosses()` as a readonly signal loaded from `public/data/bossList.json` — this is the single source of truth for the catalog.

## Goals / Non-Goals

**Goals:**
- Add a two-tab UI inside the Timers page: "Catalog" (browse + click to track) and "Active Timers" (existing timer list).
- Show all MVPs as small clickable cards (image, name, element badge, respawn range).
- Search box on the Catalog tab filters cards in real time; search remains fully reactive to locale changes.
- Clicking a card pre-fills and focuses the death-time entry form (reusing `BossSearchComponent` logic).
- New bosses added to `bossList.json` surface automatically — no code changes needed.

**Non-Goals:**
- Pagination or virtual scrolling (catalog fits comfortably in a grid for the ~30 current MVPs).
- Drag-to-sort or persistent card order customization.
- Card animations beyond a simple hover lift.
- Showing timer countdowns on the cards themselves (that stays in the Active Timers tab).

## Decisions

### 1. Tab implementation: signals-based local state, no router
Two tabs ("Catalog" and "Active Timers") are controlled by a `activeTab` signal inside `TimersPageComponent`. Using `@if` / `[hidden]` to show/hide panels preserves scroll position in the Active Timers tab without a route change. No new routes needed.

*Alternative considered:* child routes (`/timers/catalog`, `/timers/active`). Rejected because it would require router config changes, add URL noise, and lose scroll position on navigation.

### 2. BossCardComponent: stateless presentational component
`BossCardComponent` is a standalone `@Component` accepting a `boss: BossEntry` input and emitting a `select` output. It has no service injections — purely presentational. The parent `MvpCatalogComponent` handles the click and delegates to `BossSearchComponent` via a shared signal or event.

*Alternative considered:* inline card template inside the catalog. Rejected to keep the catalog component lean and enable future card reuse (e.g., a "recently tracked" section).

### 3. Connecting card click to death-time entry
`MvpCatalogComponent` exposes an `Output` `bossSelected: EventEmitter<BossEntry>`. `TimersPageComponent` handles the event by switching to the Active Timers tab and calling a public method `prefillBoss(boss)` on `BossSearchComponent` via `@ViewChild`. This keeps the tab-switch logic in the page and avoids a shared service just for pre-fill.

*Alternative considered:* a shared `SelectedBossService` signal that `BossSearchComponent` observes. Rejected as over-engineering for a one-way, one-time event triggered by a user click.

### 4. Image loading: img with fallback
Cards use `<img [src]="boss.imageUrl" (error)="onImgError($event)">` with a placeholder SVG fallback. No lazy-loading library needed at current catalog size.

### 5. Search filtering in catalog
`MvpCatalogComponent` has a `filterQuery` signal. A `filteredBosses` computed signal chains `BossCatalogService.bosses()` through a case-insensitive filter on `bossName` and `alias`. This pattern mirrors what `BossSearchComponent` already does — no new utility needed.

## Risks / Trade-offs

- **imageUrl availability**: Many bosses in `bossList.json` may have empty or external `imageUrl` values. The fallback silhouette placeholder mitigates blank card slots. → Mitigation: Provide a `public/images/boss-placeholder.svg` asset.
- **`@ViewChild` coupling**: `TimersPageComponent` holds a direct reference to `BossSearchComponent.prefillBoss()`. If `BossSearchComponent` is refactored, this breaks. → Mitigation: Keep the method name stable; document it clearly. If the coupling becomes painful later, promote to a service signal.
- **Tab state on refresh**: The active tab resets to "Catalog" on hard reload. This is acceptable UX for a desktop app.

## Migration Plan

1. Add new translation keys to `translations.ts` (tab labels, card CTA).
2. Create `BossCardComponent` standalone component.
3. Create `MvpCatalogComponent` (card grid + search input).
4. Refactor `TimersPageComponent` to add tab state and host both panels.
5. Move `BossSearchComponent` embed to Active Timers tab; add `prefillBoss()` public method.
6. Wire card-click → tab switch → prefill.
7. Add tests for catalog filtering and card selection.

Rollback: revert `TimersPageComponent` to the two-line template; no data model changes.
