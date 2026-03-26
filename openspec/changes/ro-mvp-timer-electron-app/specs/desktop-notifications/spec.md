## ADDED Requirements

### Requirement: Five-minute warning desktop notification
The system SHALL send a native OS desktop notification when the 5-minute warning threshold is reached for an active tracker entry.

#### Scenario: Warning notification shown
- **WHEN** the mvp-tracker emits a 5-minute warning event for a boss
- **THEN** a native OS desktop notification appears with the boss name, location, and min/max respawn time range formatted in the display timezone

#### Scenario: Warning notification shown when app is minimized
- **WHEN** the application window is minimized or in the background
- **THEN** the 5-minute warning notification still appears at the OS level

### Requirement: Respawn-ready desktop notification
The system SHALL send a native OS desktop notification when the respawn-ready threshold is reached for an active tracker entry.

#### Scenario: Respawn notification shown
- **WHEN** the mvp-tracker emits a respawn-ready event for a boss
- **THEN** a native OS desktop notification appears with the message indicating the boss is ready to respawn now

### Requirement: Audible alert on respawn-ready
The system SHALL play an audible alert sound when the respawn-ready notification fires.

#### Scenario: Sound plays on respawn
- **WHEN** a respawn-ready event fires
- **THEN** the system plays a bundled alert sound file (`.mp3` or `.ogg`)

#### Scenario: Sound not played on warning
- **WHEN** a 5-minute warning event fires
- **THEN** the system SHALL NOT play the audible alert (notification only, no sound)

### Requirement: Notifications work without app focus
The system SHALL deliver desktop notifications regardless of whether the application window has focus.

#### Scenario: Notification while window unfocused
- **WHEN** the user is using another application and a notification threshold is reached
- **THEN** the OS notification appears in the system notification area
