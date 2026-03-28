## MODIFIED Requirements

### Requirement: LocaleService provides runtime translation lookup
The system SHALL provide a `LocaleService` singleton with a `t(key: TranslationKey): string` method that returns the translated string for the current locale. If a key is missing from the dictionary, the method SHALL return the key itself as a fallback (no blank UI).

#### Scenario: Key exists in active locale
- **WHEN** `t('nav.settings')` is called with locale set to `'en'`
- **THEN** the method returns `'Settings'`

#### Scenario: Key exists in active locale (Spanish)
- **WHEN** `t('nav.settings')` is called with locale set to `'es'`
- **THEN** the method returns `'Configuración'`

#### Scenario: Key missing from dictionary
- **WHEN** `t('nonexistent.key')` is called
- **THEN** the method returns `'nonexistent.key'`

### Requirement: Locale can be switched at runtime without restart
The system SHALL allow the active locale to be changed via `setLocale(locale)`. All components using `t()` SHALL re-render automatically due to Angular signal reactivity.

#### Scenario: Locale switches from EN to ES
- **WHEN** `setLocale('es')` is called
- **THEN** `locale()` signal returns `'es'`
- **AND** subsequent `t()` calls return Spanish strings

### Requirement: Default locale is English
The system SHALL initialize with `'en'` as the default locale when no persisted preference exists.

#### Scenario: First launch, no saved locale
- **WHEN** the app starts with no saved state
- **THEN** `locale()` returns `'en'`

### Requirement: Persisted locale is reflected immediately after async hydration
`LocaleService.locale` SHALL derive from `AppSettingsService.locale` signal directly so that when `AppSettingsService.loadFromStorage()` resolves and updates the stored locale, all components that read `LocaleService.t()` or `LocaleService.locale()` re-render automatically without requiring any user interaction.

#### Scenario: App starts with persisted Spanish locale
- **WHEN** the app starts with `locale: 'es'` saved in storage
- **THEN** the UI renders in Spanish immediately after hydration completes
- **AND** the language selector in Settings shows Spanish as selected

#### Scenario: No desync between LocaleService and AppSettingsService
- **WHEN** `AppSettingsService.loadFromStorage()` resolves with `locale: 'es'`
- **THEN** `LocaleService.locale()` returns `'es'`
- **AND** there is no state where `AppSettingsService.locale()` and `LocaleService.locale()` return different values
