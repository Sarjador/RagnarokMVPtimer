## Why

The alert sound is currently hardcoded to try a fixed list of candidate files (`Murloc.mp3`, `alert.mp3`, `alert.ogg`) bundled with the app. Users cannot personalise the audio without manually replacing files on disk. Adding a native file-picker lets each user choose any compatible audio file from their system in one click.

## What Changes

- New "Alert Sound" section in the Settings tab with a **Choose file…** button.
- Clicking the button opens the OS native file-open dialog (filtered to compatible audio formats).
- The selected file path is persisted in `AppState` and used by `NotificationService` for all future alert sounds.
- A text label shows the currently selected file name (or "Default (Murloc)" when none chosen).
- A **Reset** button returns to the default candidate list.
- `NotificationService` reads the stored custom path before falling back to the built-in candidates.
- Compatible formats are shown to the user in the UI hint: `.mp3`, `.ogg`, `.wav`, `.flac`, `.aac`, `.webm`.

## Capabilities

### New Capabilities

- `custom-audio-picker`: Native file-open dialog in Electron that lets the user select an audio file; selected path is persisted and used as the alert sound.

### Modified Capabilities

- `alert-sound-playback`: `NotificationService` must try the user-chosen file first before falling back to the built-in candidate list.
- `app-settings`: Settings component gains an "Alert Sound" row; `AppState` gains a `customAudioPath` field.

## Impact

- **`main.js`**: Add `dialog:pickAudio` IPC handler using `electron.dialog.showOpenDialog`.
- **`preload.js`** / **`src/electron.d.ts`**: Expose `pickAudioFile()` on `window.electronAPI`.
- **`src/app/core/models/mvp-tracker.model.ts`**: Add optional `customAudioPath?: string` to `AppState`.
- **`src/app/core/services/notification.service.ts`**: Read `customAudioPath` from `TimezoneSettingsService` (or a new `SettingsService`) and prepend it to the candidate list.
- **`src/app/features/settings/settings.component.{ts,html,scss}`**: New "Alert Sound" UI section.
- No new npm dependencies required (Electron `dialog` is built-in; Web Audio API already in use).
