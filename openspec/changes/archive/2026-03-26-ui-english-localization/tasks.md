## 1. Translation dictionary

- [x] 1.1 Create `src/app/core/i18n/translations.ts` with `Locale = 'en' | 'es'`, `TranslationKey` union type, and `TRANSLATIONS` record covering all strings (see key list below)
- [x] 1.2 Key list to cover:
  - `nav.settings`, `nav.timers`
  - `boss-search.title`, `boss-search.search-placeholder`, `boss-search.death-time-placeholder`, `boss-search.add-btn`, `boss-search.selected-label`, `boss-search.respawn-label`, `boss-search.error-invalid-time`, `boss-search.error-generic`
  - `timer-list.title`, `timer-list.clear-all`, `timer-list.empty`, `timer-list.empty-hint`, `timer-list.respawn-label`, `timer-list.remaining`, `timer-list.ready`, `timer-list.remove-title`
  - `settings.title`, `settings.server-tz-label`, `settings.server-tz-hint`, `settings.display-tz-label`, `settings.display-tz-hint`, `settings.now-label`, `settings.audio-label`, `settings.audio-hint`, `settings.pick-audio`, `settings.reset-audio`, `settings.audio-formats`, `settings.info-example`, `settings.language-label`
  - `notif.warning-title`, `notif.warning-body`, `notif.ready-title`, `notif.ready-body`
  - `audio-label.default`

## 2. LocaleService

- [x] 2.1 Create `src/app/core/services/locale.service.ts` with `locale = signal<Locale>('en')`, `setLocale(l: Locale)`, and `t(key: TranslationKey): string` that reads `locale()` signal and returns the translation (fallback: key itself)
- [x] 2.2 Create `src/app/core/services/locale.service.spec.ts` covering: default locale is `'en'`, `t()` returns correct EN string, `t()` returns correct ES string after `setLocale('es')`, missing key returns the key string

## 3. AppSettingsService update

- [x] 3.1 Add `locale?: 'en' | 'es'` to `AppState` interface in `mvp-tracker.model.ts`
- [x] 3.2 Add `_locale = signal<Locale>('en')` and `readonly locale` + `setLocale()` to `AppSettingsService`; restore from state in `loadFromStorage()`
- [x] 3.3 Update `MvpTimerService.persist()` to include `locale` in written state
- [x] 3.4 Update `SettingsComponent.persist()` to include `locale` in written state
- [x] 3.5 Update `app-settings.service.spec.ts` to cover locale default, set, and persistence round-trip

## 4. Wire LocaleService ↔ AppSettingsService

- [x] 4.1 In `LocaleService` constructor, inject `AppSettingsService` and initialize `locale` signal from `appSettings.locale()`; delegate `setLocale()` to both `_locale` and `appSettings.setLocale()`

## 5. Templates — boss-search component

- [x] 5.1 Inject `LocaleService` in `BossSearchComponent`; expose `t = this.locale.t.bind(this.locale)` (or inject and call directly)
- [x] 5.2 Replace all Spanish strings in `boss-search.component.html` with `{{ t('key') }}` bindings
- [x] 5.3 Replace `'Formato inválido. Usa HH:mm (ej: 22:30)'` and `'Error al agregar el MVP'` in `boss-search.component.ts` with `this.locale.t('boss-search.error-invalid-time')` / `t('boss-search.error-generic')`

## 6. Templates — timer-list component

- [x] 6.1 Inject `LocaleService` in `TimerListComponent`
- [x] 6.2 Replace all Spanish strings in `timer-list.component.html` with `t('key')` bindings
- [x] 6.3 Replace `'¡YA!'` in `timer-list.component.ts` `displayEntries` computed with `this.locale.t('timer-list.ready')`

## 7. Templates — settings component

- [x] 7.1 Inject `LocaleService` in `SettingsComponent`
- [x] 7.2 Replace all Spanish strings in `settings.component.html` with `t('key')` bindings
- [x] 7.3 Add language selector row to `settings.component.html`: two buttons (EN / ES) that call `onLocaleChange()`
- [x] 7.4 Implement `onLocaleChange(locale: Locale)` in `settings.component.ts` that calls `locale.setLocale()` and persists state
- [x] 7.5 Update `audioLabel` computed in `settings.component.ts` to use `t('audio-label.default')` instead of hardcoded `'Default (Murloc)'`

## 8. Templates — app shell

- [x] 8.1 Inject `LocaleService` in the root `App` component
- [x] 8.2 Replace `'Configuración'` nav link label in `app.html` with `t('nav.settings')`

## 9. Notification strings

- [x] 9.1 Inject `LocaleService` in `NotificationService`
- [x] 9.2 Replace all hardcoded Spanish notification strings (`¡5 minutos!`, `Loc:`, `Respawn:`, `¡YA RESPAWNEÓ!`, `Desde:`) with `t()` calls, interpolating boss name, location, and times into the translated template strings

## 10. Tests & build

- [x] 10.1 Run `npm test -- --watch=false` and confirm all tests pass (update any spec that asserts Spanish strings)
- [x] 10.2 Run `npm run build` and confirm no TypeScript errors
