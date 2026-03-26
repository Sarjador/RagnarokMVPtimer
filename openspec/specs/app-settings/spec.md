## Requirements

### Requirement: App settings are persisted across restarts
The system SHALL persist `serverTimezone`, `displayTimezone`, `customAudioPath`, and `locale` in `AppState`. All four fields SHALL be written on every settings change and read on startup. `customAudioPath` is optional — its absence in persisted state SHALL be treated as `null` (no custom audio). `locale` is optional — its absence in persisted state SHALL default to `'en'`.

#### Scenario: Custom audio path is persisted
- **WHEN** the user selects a custom audio file
- **THEN** `AppState.customAudioPath` is written to `userData/mvp-state.json`
- **AND** on the next app launch the same path is restored

#### Scenario: Legacy state without customAudioPath loads cleanly
- **WHEN** `userData/mvp-state.json` does not contain `customAudioPath`
- **THEN** the app starts with `customAudioPath` as `null` and no error is thrown

#### Scenario: Locale is persisted
- **WHEN** the user changes the language to Spanish
- **THEN** `AppState.locale` is written to `userData/mvp-state.json` as `'es'`
- **AND** on the next app launch the same locale is restored

#### Scenario: Legacy state without locale loads cleanly
- **WHEN** `userData/mvp-state.json` does not contain `locale`
- **THEN** the app starts with locale `'en'` and no error is thrown
