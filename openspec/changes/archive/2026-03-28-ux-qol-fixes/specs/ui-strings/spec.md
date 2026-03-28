## MODIFIED Requirements

### Requirement: All user-visible strings use the translation system
Every hardcoded string in HTML templates and TypeScript files SHALL be replaced with a `t('key')` call using the `LocaleService`. No Spanish-only or English-only literals SHALL remain in production code. This includes the custom-boss catalog UI (add button, form title, field labels, action buttons).

#### Scenario: English UI
- **WHEN** locale is `'en'`
- **THEN** the nav link reads "Settings", the timer list title reads "Active MVPs", the add button reads "+ Add", the countdown label reads "remaining", the notification title for 5-min warning reads "⚠️ <boss> — 5 minutes!", the ready notification reads "🔥 <boss> — SPAWNED!", the add-custom-boss card reads "Add Custom Boss", and the form add button reads "Add Boss"

#### Scenario: Spanish UI
- **WHEN** locale is `'es'`
- **THEN** the nav link reads "Configuración", the timer list title reads "MVPs Activos", the add button reads "+ Agregar", the countdown label reads "restante", the notification title for 5-min warning reads "⚠️ <boss> — ¡5 minutos!", the ready notification reads "🔥 <boss> — ¡YA RESPAWNEÓ!", the add-custom-boss card reads "Agregar Jefe Personalizado", and the form add button reads "Agregar Jefe"

### Requirement: Language selector is visible in Settings
The Settings page SHALL display a language selector (EN / ES) that immediately applies the chosen locale.

#### Scenario: User switches language
- **WHEN** the user selects "Español" in Settings
- **THEN** all visible labels switch to Spanish immediately (no page reload)
- **AND** the preference is persisted

## ADDED Requirements

### Requirement: Custom-boss UI strings are fully translated
The catalog's add-custom-boss button, the add-boss form title, field labels, placeholder hints, and action buttons SHALL all have translation entries for `'en'` and `'es'` under the `catalog.*` namespace and SHALL be rendered via `t()`.

#### Scenario: Add-custom-boss card label in Spanish
- **WHEN** locale is `'es'` and the catalog grid is rendered
- **THEN** the "+" card shows "Agregar Jefe Personalizado"

#### Scenario: Add-boss form action buttons in Spanish
- **WHEN** locale is `'es'` and the add-boss form is open
- **THEN** the submit button reads "Agregar Jefe" and the cancel button reads "Cancelar"
