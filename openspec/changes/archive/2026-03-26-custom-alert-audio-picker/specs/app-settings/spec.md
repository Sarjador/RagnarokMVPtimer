## MODIFIED Requirements

### Requirement: App settings are persisted across restarts
The system SHALL persist `serverTimezone`, `displayTimezone`, and `customAudioPath` in `AppState`. All three fields SHALL be written on every settings change and read on startup. `customAudioPath` is optional — its absence in persisted state SHALL be treated as `null` (no custom audio).

#### Scenario: Custom audio path is persisted
- **WHEN** the user selects a custom audio file
- **THEN** `AppState.customAudioPath` is written to `userData/mvp-state.json`
- **AND** on the next app launch the same path is restored

#### Scenario: Legacy state without customAudioPath loads cleanly
- **WHEN** `userData/mvp-state.json` does not contain `customAudioPath`
- **THEN** the app starts with `customAudioPath` as `null` and no error is thrown
