## ADDED Requirements

### Requirement: Add MVP with death time
The system SHALL allow a user to register an active MVP by selecting a boss from the catalog and providing a death time (HH:mm format). The system SHALL calculate the minimum and maximum respawn timestamps using the boss's respawn window schedule.

#### Scenario: Add MVP with explicit death time
- **WHEN** user selects a boss and enters a valid HH:mm death time
- **THEN** the system creates a tracker entry with `deathTime`, `minRespawnTime` (deathTime + minRespawnTimeScheduleInSeconds), and `maxRespawnTime` (deathTime + maxRespawnTimeScheduleInSeconds)

#### Scenario: Add MVP without explicit death time
- **WHEN** user selects a boss without providing a death time
- **THEN** the system uses the current time as the death time

#### Scenario: Invalid time input
- **WHEN** user enters a death time that is not a valid HH:mm string
- **THEN** the system SHALL display an error and not create the tracker entry

### Requirement: Five-minute warning alert
The system SHALL emit a warning alert when the current time reaches 5 minutes before the minimum respawn time. The warning SHALL be emitted exactly once per active tracker entry.

#### Scenario: Warning fires at correct threshold
- **WHEN** `currentTime >= (minRespawnTime - 300 seconds)` and the warning has not yet been sent
- **THEN** the system triggers a 5-minute warning notification and marks the entry as `fiveMinWarningSent = true`

#### Scenario: Warning not repeated
- **WHEN** `fiveMinWarningSent` is already `true` for an entry
- **THEN** the system SHALL NOT trigger the warning again even if the threshold condition remains true

### Requirement: Respawn-ready alert
The system SHALL emit a respawn-ready alert when the current time reaches the minimum respawn time and SHALL clear the tracker entry after the alert.

#### Scenario: Respawn-ready fires and clears entry
- **WHEN** `currentTime >= minRespawnTime`
- **THEN** the system triggers a respawn-ready alert and removes the tracker entry from the active list

### Requirement: Timer polling loop
The system SHALL check all active tracker entries every 1000 milliseconds using the current wall-clock time.

#### Scenario: Loop uses wall-clock time
- **WHEN** the timer loop fires
- **THEN** the system reads `Date.now()` (not an accumulated counter) to evaluate all threshold conditions

### Requirement: Clear active tracker entry
The system SHALL allow a user to manually remove any active tracker entry before its respawn time.

#### Scenario: Manual clear
- **WHEN** user selects an active tracker entry and chooses to remove it
- **THEN** the entry is removed from the active list and no further alerts are emitted for it

### Requirement: Multiple simultaneous trackers
The system SHALL support tracking multiple MVPs concurrently with independent timers.

#### Scenario: Two MVPs tracked simultaneously
- **WHEN** two tracker entries exist with different respawn times
- **THEN** each entry independently triggers its own warning and respawn-ready alerts without interfering with the other
