## 1. IPC layer (Electron main + preload)

- [x] 1.1 Add `dialog:pickAudio` IPC handler in `main.js` using `dialog.showOpenDialog` with filters for mp3/ogg/wav/flac/aac/webm; returns absolute path string or `null` on cancel
- [x] 1.2 Expose `pickAudioFile(): Promise<string | null>` on `window.electronAPI` in `preload.js`
- [x] 1.3 Add `pickAudioFile` declaration to `src/electron.d.ts`

## 2. Settings service refactor

- [x] 2.1 Rename `timezone-settings.service.ts` → `app-settings.service.ts`; rename class `TimezoneSettingsService` → `AppSettingsService`
- [x] 2.2 Add `customAudioPath = signal<string | null>(null)` to `AppSettingsService`
- [x] 2.3 Update `AppState` model (`mvp-tracker.model.ts`) to add `customAudioPath?: string`
- [x] 2.4 Update `AppSettingsService.applyState()` to read `customAudioPath` from persisted state (default `null`)
- [x] 2.5 Update all import paths and injection tokens referencing the old class name (`mvp-timer.service.ts`, `notification.service.ts`, `settings.component.ts`, `timer-list.component.ts`)

## 3. Notification service update

- [x] 3.1 Inject `AppSettingsService` in `NotificationService`
- [x] 3.2 In `playAlertSound()`, prepend `customAudioPath()` to the candidate list when non-null, constructing a `file:///` URL from the absolute path

## 4. Settings UI

- [x] 4.1 Add "Alert Sound" section to `settings.component.html` with: current filename label, "Choose file…" button (hidden when no `window.electronAPI`), compatible formats hint (mp3 · ogg · wav · flac · aac · webm), and "Reset" button
- [x] 4.2 Implement `pickAudio()` method in `settings.component.ts` that calls `window.electronAPI.pickAudioFile()` and updates `appSettings.customAudioPath`
- [x] 4.3 Implement `resetAudio()` method that sets `customAudioPath` to `null` and persists state
- [x] 4.4 Style the new "Alert Sound" row in `settings.component.scss` consistent with existing timezone rows

## 5. Persistence

- [x] 5.1 Update `MvpTimerService.persist()` to include `customAudioPath` in the written `AppState`
- [x] 5.2 Verify backward compatibility: load a state file without `customAudioPath` and confirm no error and `customAudioPath` defaults to `null`

## 6. Tests

- [x] 6.1 Update `app-settings.service.spec.ts` (renamed from `timezone-settings.service.spec.ts`) to cover `customAudioPath` signal default and persistence round-trip
- [x] 6.2 Update `notification.service.spec.ts` to verify custom path is prepended to the candidate list
- [x] 6.3 Run full test suite (`npm test -- --watch=false`) and confirm all tests pass
- [x] 6.4 Run `npm run build` and confirm no TypeScript errors
