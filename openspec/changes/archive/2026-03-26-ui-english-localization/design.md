## Context

The app has ~40 user-facing strings spread across 4 HTML templates and 1 TypeScript service. There is no existing i18n infrastructure. Angular's built-in `@angular/localize` requires build-time compilation per locale, which would double the Electron build pipeline complexity. A simpler runtime approach is preferred for an app of this size.

`AppSettingsService` already owns persisted settings (timezones, audio path). Adding `locale` there follows the same pattern.

## Goals / Non-Goals

**Goals:**
- Runtime locale switching between `'en'` and `'es'` without app restart.
- All visible strings (labels, placeholders, buttons, notifications, error messages) translated.
- Locale persisted across restarts.
- Language selector in Settings UI.
- Default locale: `'en'` (English).

**Non-Goals:**
- More than 2 locales at this stage.
- Pluralisation rules or date/number formatting — only static strings.
- Angular `@angular/localize` / ICU message format.
- RTL layout support.

## Decisions

### 1. Plain TypeScript dictionary, not `@angular/localize`

A `Record<string, Record<Locale, string>>` object in `translations.ts` is sufficient for ~40 strings. It is tree-shakeable, type-safe (keys can be a union type), and requires no extra build steps or Webpack plugins.

**Alternative considered:** `@angular/localize` — requires separate build per locale and `ng extract-i18n` tooling. Overkill for 2 locales and ~40 strings.

### 2. `LocaleService` with `t(key)` method

A singleton Angular service exposes:
- `locale = signal<Locale>('en')` (readable from outside)
- `t(key: TranslationKey): string` — returns the string for the current locale
- `setLocale(locale: Locale): void`

Components inject `LocaleService` and call `t('key')` directly in templates via a public method. Since `t()` reads `locale()` signal, Angular's OnPush change detection tracks it automatically.

**Alternative considered:** Angular `Pipe` (`translate` pipe) — extra file, same result. The service method is simpler and avoids pipe import boilerplate in every component.

### 3. `AppSettingsService` owns locale persistence

`locale` is added as `_locale = signal<Locale>('en')` to `AppSettingsService`, consistent with timezone and audio path storage. `LocaleService` reads/sets this signal via `AppSettingsService`.

**Alternative considered:** `LocaleService` owning its own storage — would require a second `StorageService` injection and duplicate read/write logic.

### 4. `TranslationKey` as a string-literal union type

All translation keys are defined as a TypeScript union (`type TranslationKey = 'nav.settings' | 'boss-search.title' | ...`). This gives compile-time safety: missing or misspelled keys are caught at build time.

## Risks / Trade-offs

- **Template verbosity**: `{{ t('key') }}` instead of literal text. Minor ergonomic cost, acceptable for maintainability.
- **Missing key fallback**: `t()` should return the key itself if a translation is missing, to prevent blank UI in development.
- **OnPush reactivity**: Because `t()` reads a signal internally, Angular will re-render on locale change without `markForCheck()`. Verified by Angular's signal-based change detection in v17+.
