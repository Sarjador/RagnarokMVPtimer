## Why

All UI labels, placeholders, button text, and desktop notifications are hardcoded in Spanish. Non-Spanish-speaking players cannot use the app comfortably. Adding English (US) as a second locale — with a user-selectable language preference — makes the app usable by a much wider RO community while preserving the existing Spanish experience.

## What Changes

- New `LocaleService` that holds the active locale (`'en' | 'es'`) as a signal and exposes a `t(key)` translation function.
- A lightweight translation dictionary with keys mapped to EN and ES strings covering every user-facing string in the app.
- Language preference persisted in `AppState` and restored on startup.
- Language selector (EN / ES toggle or dropdown) added to the Settings page.
- All HTML templates and TypeScript string literals replaced with `t('key')` calls.
- Desktop notification strings (notification.service.ts) use the active locale.
- Default locale: English (`'en'`).

## Capabilities

### New Capabilities

- `locale-service`: Reactive locale signal + `t(key)` lookup used by all components and services.

### Modified Capabilities

- `app-settings`: `AppState` gains a `locale` field; `AppSettingsService` exposes and persists it.
- `ui-strings`: All templates and notification strings replaced with translation keys.

## Impact

- **New file**: `src/app/core/i18n/translations.ts` — EN + ES dictionaries.
- **New file**: `src/app/core/services/locale.service.ts` — `LocaleService` with `t()` and `setLocale()`.
- **`src/app/core/models/mvp-tracker.model.ts`**: Add `locale?: 'en' | 'es'` to `AppState`.
- **`src/app/core/services/app-settings.service.ts`**: Add `locale` signal; expose `setLocale()`; persist/restore.
- **`src/app/core/services/notification.service.ts`**: Replace hardcoded strings with `t()` calls.
- **`src/app/features/settings/settings.component.{ts,html}`**: Add language selector.
- **`src/app/features/boss-search/boss-search.component.{ts,html}`**: Replace Spanish strings.
- **`src/app/features/timer-list/timer-list.component.{ts,html}`**: Replace Spanish strings.
- **`src/app/app.html`**: Replace "Configuración" nav link label.
- No new npm dependencies.
