## Why

The current timer workflow requires users to type a boss name into a search box before they can start tracking, which is friction-heavy and requires knowing exact names. A visual card-based catalog lets users browse all MVPs at a glance, click one to instantly pre-fill the tracker form, and surface image-based context (boss portrait, element, race) that helps players identify targets faster.

## What Changes

- Replace the single "Timers" page with a **two-tab layout**: "Catalog" (card browser + search) and "Active Timers" (existing timer list).
- Add a **MVP Catalog tab** showing all bosses as small interactive cards with boss image, name, and respawn window. Clicking a card opens a death-time entry modal/panel.
- The existing text **search box** moves to the Catalog tab and filters the card grid in real time.
- The boss list data source (`BossCatalogService`) stays unchanged — new cards and search results automatically reflect any new entries added to `bossList.json`.
- The **Active Timers tab** is an exact relocation of the current `TimersPageComponent` content (timer list + boss search).

## Capabilities

### New Capabilities
- `mvp-catalog-view`: Card grid showing all MVPs with image, name and respawn info. Cards are filterable by the search box. Clicking a card triggers death-time entry.
- `boss-card`: Individual card component displaying boss portrait, name, element/race badge, and respawn window range. Stateless — receives `Boss` as input.
- `tabbed-navigation`: Two-tab layout within the Timers route — "Catalog" and "Active Timers" — replacing the current single-view page.

### Modified Capabilities
- `ui-strings`: New translation keys for tab labels ("Catalog" / "Active Timers"), card action label ("Track"), and the death-time entry prompt.

## Impact

- `src/app/features/timers-page/` — refactored to host tab navigation; current content moved to Active Timers tab.
- `src/app/features/mvp-catalog/` — new feature folder for the catalog tab (card grid + search).
- `src/app/features/boss-card/` — new standalone component for individual MVP cards.
- `src/app/core/i18n/translations.ts` — new translation keys.
- `public/data/bossList.json` — no schema changes; new bosses will appear automatically.
- No routing changes; tab switching is internal to the Timers page.
