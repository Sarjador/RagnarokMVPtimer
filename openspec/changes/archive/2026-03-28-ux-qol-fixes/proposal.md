## Why

Four small but annoying issues hurt the daily usability of the app: the "Add Custom Boss" form opens off-screen forcing manual scroll; its button label is never translated to Spanish; on every fresh start the UI renders in English while the Settings page incorrectly shows Spanish as selected; and the timezone clock in Settings freezes at the second it was rendered. All four are low-effort, high-impact fixes.

## What Changes

- **Auto-scroll to form**: After `AddBossFormComponent` expands inside the catalog grid, the viewport scrolls automatically to reveal the form. On cancel/save, the viewport scrolls back up to the "+" card.
- **i18n for custom-boss UI strings**: The "Add Custom Boss" button label and the `AddBossFormComponent` field labels/buttons that are currently hardcoded English strings are added to the translation dictionary and rendered via `t()`.
- **Locale init desync fix**: `LocaleService` currently initialises its private `_locale` signal once from `AppSettingsService.locale()` at construction time. Because `AppSettingsService.loadFromStorage()` is async, the persisted locale arrives after `LocaleService` has already captured the default `'en'`. `LocaleService` must derive its active locale directly from the `AppSettingsService` signal so it stays in sync after async hydration.
- **Timezone clock live update**: `serverTimePreview` and `displayTimePreview` in `SettingsComponent` are `computed` signals. They call `new Date()` inside but have no signal dependency that ticks every second, so they never re-evaluate after first render. Fix by reading `MvpTimerService.currentTimeMs()` inside each computed to create a reactive 1-second heartbeat dependency (the timer loop already exists).

## Capabilities

### New Capabilities

_(none — all changes are fixes to existing behaviour)_

### Modified Capabilities

- `locale-service`: `LocaleService` SHALL derive its locale from `AppSettingsService.locale` signal directly so that async storage hydration immediately propagates to the UI without requiring a manual toggle.
- `ui-strings`: Add translation keys for `catalog.add-custom-boss`, `catalog.add-custom-boss-form.*` labels used in the add-boss form (field labels, placeholder hints, button labels).

## Impact

- `LocaleService` — signal wiring change; no public API change
- `AppSettingsService` — no change
- `SettingsComponent` — add `currentTimeMs` reactive dependency to two `computed` signals
- `MvpCatalogComponent` — add `ViewChild` + `scrollIntoView` after form toggle
- `AddBossFormComponent` — replace hardcoded English strings with `t()` calls
- `MvpCatalogComponent` template — replace hardcoded "Add Custom Boss" with `t()`
- `translations.ts` — new keys for custom-boss UI strings
