## ADDED Requirements

### Requirement: Persist active tracker state on change
The system SHALL save all active tracker entries to a local JSON file whenever the tracker state changes (entry added, cleared, or alert flags updated).

#### Scenario: State saved after adding MVP
- **WHEN** a new tracker entry is created
- **THEN** the updated state is written to `{userData}/mvp-state.json`

#### Scenario: State saved after clearing MVP
- **WHEN** a tracker entry is removed
- **THEN** the updated state is written to `{userData}/mvp-state.json`

### Requirement: Restore active tracker state on startup
The system SHALL read persisted state from `{userData}/mvp-state.json` at startup and resume tracking any entries that have not yet passed their `maxRespawnTime`.

#### Scenario: Active entries restored
- **WHEN** the application starts and the state file contains entries with future `maxRespawnTime`
- **THEN** those entries are loaded into the active tracker and the timer loop resumes for them

#### Scenario: Expired entries discarded on restore
- **WHEN** the application starts and a persisted entry has a `maxRespawnTime` in the past
- **THEN** that entry is discarded and not added to the active tracker

### Requirement: Atomic file write
The system SHALL write the state file atomically — writing to a `.tmp` file first, then renaming it to overwrite the target — to prevent corruption on unexpected shutdown.

#### Scenario: Atomic write pattern
- **WHEN** the system writes state to disk
- **THEN** it writes to `mvp-state.json.tmp` first, then renames to `mvp-state.json`

### Requirement: Corruption recovery
The system SHALL handle a corrupted or missing state file gracefully by resetting to empty state without crashing.

#### Scenario: Corrupted file on startup
- **WHEN** `mvp-state.json` contains invalid JSON
- **THEN** the system initializes with an empty tracker state and overwrites the corrupt file

#### Scenario: Missing file on first launch
- **WHEN** no `mvp-state.json` exists
- **THEN** the system initializes with empty state without error

### Requirement: Persist timezone settings
The system SHALL persist user timezone settings in the local state file alongside tracker data.

#### Scenario: Settings included in persisted state
- **WHEN** state is written to disk
- **THEN** the file includes the current `serverTimezone` and `displayTimezone` values
