## MODIFIED Requirements

### Requirement: All user-visible strings use the translation system
Every hardcoded string in HTML templates and TypeScript files SHALL be replaced with a `t('key')` call using the `LocaleService`. No Spanish-only or English-only literals SHALL remain in production code.

#### Scenario: English UI
- **WHEN** locale is `'en'`
- **THEN** the nav link reads "Settings", the timer list title reads "Active MVPs", the add button reads "+ Add", the countdown label reads "remaining", the notification title for 5-min warning reads "⚠️ <boss> — 5 minutes!", and the ready notification reads "🔥 <boss> — SPAWNED!"

#### Scenario: Spanish UI
- **WHEN** locale is `'es'`
- **THEN** the nav link reads "Configuración", the timer list title reads "MVPs Activos", the add button reads "+ Agregar", the countdown label reads "restante", the notification title for 5-min warning reads "⚠️ <boss> — ¡5 minutos!", and the ready notification reads "🔥 <boss> — ¡YA RESPAWNEÓ!"

### Requirement: Language selector is visible in Settings
The Settings page SHALL display a language selector (EN / ES) that immediately applies the chosen locale.

#### Scenario: User switches language
- **WHEN** the user selects "Español" in Settings
- **THEN** all visible labels switch to Spanish immediately (no page reload)
- **AND** the preference is persisted
