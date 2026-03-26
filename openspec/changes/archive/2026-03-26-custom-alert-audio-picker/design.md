## Context

`NotificationService` currently iterates a hardcoded `AUDIO_CANDIDATES` array (`Murloc.mp3`, `alert.mp3`, `alert.ogg`) and falls back to a Web-Audio beep. There is no user-facing way to change the sound without editing the source.

The app runs in Electron with `contextIsolation: true` and `nodeIntegration: false`, so all Node/Electron APIs must cross the IPC boundary via `contextBridge`. The `dialog` module (for native file pickers) is only available in the main process.

`AppState` (persisted to `userData/mvp-state.json`) already carries `serverTimezone` and `displayTimezone`. A single optional `customAudioPath` string can be added alongside these without breaking existing persisted state.

`TimezoneSettingsService` already owns the timezone signals that are read by other services. Rather than creating yet another service, the custom audio path will be stored there and renamed conceptually to an "app settings" service. Alternatively a dedicated `AudioSettingsService` can be introduced to keep concerns separate — see Decisions.

## Goals / Non-Goals

**Goals:**
- Native OS file-open dialog filtered to supported audio extensions.
- Selected absolute path persisted in `AppState` so it survives app restarts.
- `NotificationService` uses the custom path first, falls back to built-ins.
- Settings UI shows the chosen filename and a Reset button.
- User is informed of compatible formats in the UI.

**Non-Goals:**
- Bundling/copying the chosen file into the app directory.
- Volume control or audio preview in the settings page.
- Storing multiple sounds for different event types.
- Browser (non-Electron) support for the file picker (graceful degradation: hide button).

## Decisions

### 1. IPC channel: `dialog:pickAudio` in main process

Electron's `dialog.showOpenDialog` is only available in the main process. A new `ipcMain.handle('dialog:pickAudio', ...)` handler is added to `main.js`. It returns `null` (user cancelled) or the absolute file path string. Exposed on `window.electronAPI.pickAudioFile(): Promise<string | null>`.

**Alternative considered:** `ipcRenderer.sendSync` — rejected (blocks renderer thread).

### 2. State ownership: extend `TimezoneSettingsService` → rename to `AppSettingsService`

`TimezoneSettingsService` already holds signals for settings persisted in `AppState`. Adding `customAudioPath` as a `WritableSignal<string | null>` there avoids introducing a new service for a single field. The service file will be renamed to `app-settings.service.ts` and the class to `AppSettingsService`; all existing injection sites updated.

**Alternative considered:** separate `AudioSettingsService` — adds a file and injection site for minimal benefit; rejected to keep the settings domain unified.

### 3. `AppState` backward compatibility

`customAudioPath` is added as `customAudioPath?: string`. Existing persisted state without this field deserialises correctly (value is `undefined`, treated as "no custom path").

### 4. Audio file path at runtime

When playing the alert, `NotificationService` prepends the stored absolute path to the `AUDIO_CANDIDATES` array if non-null. `new Audio(path)` works with absolute `file://` paths when running in Electron; the renderer can construct `file:///C:/path/to/file.mp3` from the returned absolute path.

### 5. Supported formats

`dialog.showOpenDialog` `filters` will list: `mp3`, `ogg`, `wav`, `flac`, `aac`, `webm`. These are the formats the Chromium-based renderer supports natively via `HTMLAudioElement`. The UI hint will display the same list.

## Risks / Trade-offs

- **File deleted/moved after selection** → `Audio.play()` rejects, `tryPlayFile` falls through to built-ins. No crash; silent degradation.
- **Absolute path not portable across machines** → By design. State files are per-user, per-machine (stored in `userData`). Not a concern for this use case.
- **Renaming `TimezoneSettingsService`** → Breaking rename across several files. Must update all injection sites and imports atomically. Low risk because TypeScript compiler will catch missing references.

## Migration Plan

1. Rename `timezone-settings.service.ts` → `app-settings.service.ts` (class + token rename).
2. Add `customAudioPath` signal and persistence logic.
3. Add `dialog:pickAudio` IPC handler in `main.js` and expose via `preload.js` / `electron.d.ts`.
4. Update `NotificationService` to prepend custom path.
5. Update Settings component UI.
6. Existing `mvp-state.json` files remain valid — `customAudioPath` is optional.
