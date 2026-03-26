## MODIFIED Requirements

### Requirement: App settings are persisted across restarts
The system SHALL persist `serverTimezone`, `displayTimezone`, `customAudioPath`, and `locale` in `AppState`. All four fields SHALL be written on every settings change and read on startup. `locale` is optional — its absence in persisted state SHALL default to `'en'`.

#### Scenario: Locale is persisted
- **WHEN** the user changes the language to Spanish
- **THEN** `AppState.locale` is written to `userData/mvp-state.json` as `'es'`
- **AND** on the next app launch the same locale is restored

#### Scenario: Legacy state without locale loads cleanly
- **WHEN** `userData/mvp-state.json` does not contain `locale`
- **THEN** the app starts with locale `'en'` and no error is thrown
