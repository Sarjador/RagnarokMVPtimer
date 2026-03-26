## MODIFIED Requirements

### Requirement: Alert sound plays on MVP respawn
On MVP respawn the system SHALL play an audio alert. The system SHALL first attempt to play the user-selected custom audio file (if set). If that fails or is not set, it SHALL fall back through the built-in candidate list (`Murloc.mp3`, `alert.mp3`, `alert.ogg`) and finally to a synthesised Web-Audio beep.

#### Scenario: Custom audio path is set and file is accessible
- **WHEN** `customAudioPath` is a non-null, non-empty string
- **AND** the file at that path is readable
- **THEN** the audio at `customAudioPath` plays at volume 0.7

#### Scenario: Custom audio path is set but file is missing
- **WHEN** `customAudioPath` is set but `Audio.play()` rejects
- **THEN** the system falls through to the built-in candidate list
- **AND** eventually to the synthesised beep if all candidates fail

#### Scenario: No custom audio path set
- **WHEN** `customAudioPath` is null or undefined
- **THEN** the system uses the built-in candidate list as before
