## ADDED Requirements

### Requirement: Configure server timezone
The system SHALL allow the user to set a "server timezone" — the timezone in which death times entered by the user are interpreted (e.g., `America/Sao_Paulo` for Brazilian servers).

#### Scenario: Default server timezone on first launch
- **WHEN** the application runs for the first time with no saved settings
- **THEN** the server timezone defaults to `America/Sao_Paulo`

#### Scenario: User changes server timezone
- **WHEN** user selects a valid IANA timezone string in the settings UI
- **THEN** the new timezone is saved and all subsequent death-time inputs are interpreted in that timezone

### Requirement: Configure display timezone
The system SHALL allow the user to set a "display timezone" — the timezone used when showing formatted respawn times in the UI (e.g., `Europe/Madrid`).

#### Scenario: Default display timezone on first launch
- **WHEN** the application runs for the first time with no saved settings
- **THEN** the display timezone defaults to `Europe/Madrid`

#### Scenario: User changes display timezone
- **WHEN** user selects a valid IANA timezone string in the settings UI
- **THEN** all displayed respawn times are reformatted in the new timezone immediately

### Requirement: Persist timezone settings
The system SHALL persist the server timezone and display timezone settings to local storage so they survive application restarts.

#### Scenario: Settings survive restart
- **WHEN** user sets custom timezones and restarts the application
- **THEN** the application loads the previously saved timezones on startup

### Requirement: Timezone-aware death time input
The system SHALL interpret user-entered HH:mm death times in the currently configured server timezone and store the result as a UTC Unix timestamp.

#### Scenario: Death time interpreted in server timezone
- **WHEN** user enters "22:00" as death time with server timezone `America/Sao_Paulo`
- **THEN** the system stores the Unix timestamp corresponding to 22:00 in `America/Sao_Paulo` on the current date

#### Scenario: Display time in display timezone
- **WHEN** a respawn time Unix timestamp is shown in the UI
- **THEN** it is formatted using the configured display timezone
