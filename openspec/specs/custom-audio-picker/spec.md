## ADDED Requirements

### Requirement: User can open native file picker to select alert audio
The system SHALL expose a "Choose file…" button in the Settings tab that opens the OS native file-open dialog, filtered to supported audio formats (mp3, ogg, wav, flac, aac, webm). This button SHALL only be rendered when `window.electronAPI` is available.

#### Scenario: User selects a valid audio file
- **WHEN** the user clicks "Choose file…"
- **THEN** the OS native file-open dialog opens, filtered to mp3/ogg/wav/flac/aac/webm
- **AND WHEN** the user confirms a file selection
- **THEN** the filename is displayed in the settings row
- **AND** the absolute path is persisted in `AppState.customAudioPath`

#### Scenario: User cancels the dialog
- **WHEN** the user opens the dialog and then cancels without selecting a file
- **THEN** the previously selected audio (or default) remains unchanged

#### Scenario: No Electron environment
- **WHEN** the app is running in a browser (no `window.electronAPI`)
- **THEN** the file picker button is not rendered

### Requirement: User can reset audio to default
The system SHALL provide a "Reset" button (or link) adjacent to the file picker that clears `customAudioPath` and reverts to the built-in candidate list.

#### Scenario: User resets to default
- **WHEN** the user clicks "Reset"
- **THEN** `customAudioPath` is set to `null` in `AppState`
- **AND** the label shows "Default (Murloc)"

### Requirement: UI displays supported formats hint
The settings row SHALL display the list of compatible audio formats to guide the user.

#### Scenario: Hint is always visible
- **WHEN** the Settings tab is open
- **THEN** a hint text lists: mp3, ogg, wav, flac, aac, webm
