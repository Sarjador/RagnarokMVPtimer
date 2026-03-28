## Context

The app uses Angular signals + `ChangeDetectionStrategy.OnPush` throughout. `LocaleService` wraps `AppSettingsService` for translation lookups. `AppSettingsService` hydrates asynchronously from Electron IPC on startup. `MvpTimerService` runs a 1-second `setInterval` and exposes `currentTimeMs` as a signal. `SettingsComponent` uses `computed` signals for live timezone previews.

## Goals / Non-Goals

**Goals:**
- Fix locale desync on startup — UI locale must match the persisted setting after hydration
- Fix timezone clock — seconds update every second while Settings is open
- Auto-scroll to the add-boss form when it opens; scroll back when it closes
- Translate all hardcoded strings in the custom-boss UI

**Non-Goals:**
- Adding new locales beyond EN/ES
- Animated scroll transitions
- Persisting scroll position across tab switches

## Decisions

### D1 — Remove `LocaleService._locale` signal; delegate directly to `AppSettingsService.locale`

**Decision**: Delete `LocaleService`'s own `_locale = signal(...)` and replace with `readonly locale = this.appSettings.locale`. The `t()` method reads from `this.appSettings.locale()`. `setLocale()` calls `this.appSettings.setLocale()` only.

**Rationale**: The desync exists because `_locale` is captured once at construction, before the async IPC response arrives. Delegating to the source of truth (`AppSettingsService`) means that when `loadFromStorage()` eventually calls `appSettings._locale.set('es')`, `LocaleService.locale()` and `t()` reflect `'es'` immediately — no extra effect or subscription needed.

**Alternative considered**: Use `effect()` in `LocaleService` to mirror `appSettings.locale`. Rejected — introduces a write-to-signal-inside-effect pattern that triggers Angular warnings, and is more code than needed.

### D2 — Piggyback on `MvpTimerService.currentTimeMs` for clock reactivity

**Decision**: In `SettingsComponent`, change the two `computed` signals to read `this.timerService.currentTimeMs()` at the start (just `void` the value to suppress "unused variable" linting). This makes the computed depend on a signal that changes every second.

**Rationale**: `MvpTimerService` already runs a `setInterval` at 1 s. There is no need for a second timer. The `void` pattern is the established idiom in this codebase (already used in `MvpCatalogComponent.filteredBosses` for locale reactivity).

### D3 — `scrollIntoView` via `ViewChild` + `afterNextRender` / `setTimeout(0)`

**Decision**: In `MvpCatalogComponent`, add a `@ViewChild('addFormAnchor')` template ref on the form wrapper element. After setting `showAddForm(true)`, call `setTimeout(() => anchorEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)`. On cancel/save, call `addCardRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })`.

**Rationale**: Angular's `OnPush` + `@if` means the DOM element doesn't exist until after the next render cycle. A zero-timeout defers the scroll until Angular has committed the DOM change. `scrollIntoView` is a standard DOM API with no extra dependency. `behavior: 'smooth'` gives a polished feel.

**Alternative considered**: `afterNextRender()` / `afterRender()`. Available in Angular 17+ but requires a different import path. The `setTimeout(0)` approach is simpler and already used elsewhere in this codebase (`prefillBoss`).

### D4 — Translation keys follow existing `catalog.*` namespace

**Decision**: New keys use `catalog.add-custom-boss` for the button and `catalog.form.*` prefix for form labels (e.g., `catalog.form.title`, `catalog.form.name-label`, `catalog.form.add-btn`, `catalog.form.cancel-btn`).

**Rationale**: Keeps custom-boss UI strings in the same namespace as the rest of the catalog. The `AddBossFormComponent` already injects `LocaleService` so no new injection is needed.

## Risks / Trade-offs

- **`currentTimeMs` computed cost**: Every 1-second tick re-evaluates two `computed` signals in `SettingsComponent`. These are O(1) string operations — negligible overhead.
- **`scrollIntoView` in Electron**: Works in Chromium (Electron's renderer). No polyfill needed.
- **Removing `LocaleService._locale`**: The signal's `asReadonly()` was exposed publicly. After the change, `locale` becomes an alias for `appSettings.locale` which is already `readonly`. No consumer is broken.

## Open Questions

_(none)_
