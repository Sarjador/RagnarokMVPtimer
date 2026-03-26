## ADDED Requirements

### Requirement: Load boss catalog from bundled asset
The system SHALL load the complete boss catalog from a bundled JSON asset file at application startup. The catalog SHALL include all MVPs from the Ragnarok Online `bossList.json` source.

#### Scenario: Catalog loads at startup
- **WHEN** the application starts
- **THEN** the boss catalog is available in memory with all boss entries before the user interacts with any timer feature

### Requirement: Boss data structure
Each boss entry in the catalog SHALL contain: `ID`, `bossName`, `minRespawnTimeScheduleInSeconds`, `maxRespawnTimeScheduleInSeconds`, `location`, `aliases` (array of alternative names), and optionally `HP`, `race`, `property`.

#### Scenario: Access boss respawn schedule
- **WHEN** a boss is selected to create a tracker entry
- **THEN** the system reads `minRespawnTimeScheduleInSeconds` and `maxRespawnTimeScheduleInSeconds` from the catalog entry

### Requirement: Search boss by name or alias
The system SHALL allow users to search for a boss by partial match on `bossName` or any entry in `aliases`, case-insensitively.

#### Scenario: Search by partial boss name
- **WHEN** user types a partial string that matches part of a boss name
- **THEN** the system returns all catalog entries whose `bossName` contains the string (case-insensitive)

#### Scenario: Search by alias
- **WHEN** user types a string that matches an alias for a boss
- **THEN** the system includes that boss in the search results

#### Scenario: No match
- **WHEN** user types a string that matches no boss name or alias
- **THEN** the system returns an empty result set and displays a "no results" message
