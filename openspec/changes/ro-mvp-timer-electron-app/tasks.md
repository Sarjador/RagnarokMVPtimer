## 1. Project Scaffold

- [x] 1.1 Initialize Angular app inside the repo (`ng new ro-mvp-timer --routing --style=scss --standalone`)
- [x] 1.2 Add Electron dependency and create `main.js` (Electron entry point with BrowserWindow setup)
- [x] 1.3 Add `electron-builder` dev dependency and configure `angular.json` output path for Electron
- [x] 1.4 Add npm scripts: `electron:serve` (dev), `electron:build` (prod), `electron:dist` (packaged)
- [x] 1.5 Configure single-instance lock via `app.requestSingleInstanceLock()` in main process
- [ ] 1.6 Verify app launches in Electron shell showing default Angular page

## 2. Boss Catalog Asset

- [x] 2.1 Copy `bossList.json` from `DiscordRObot/data/` into `src/assets/data/bossList.json`
- [x] 2.2 Create `BossCatalogService` that loads the JSON asset via `HttpClient` on init
- [x] 2.3 Implement `search(query: string)` method — case-insensitive partial match on `bossName` and `aliases`
- [x] 2.4 Write unit tests for `BossCatalogService.search()` covering: partial name match, alias match, no-match, empty query

## 3. Time Utilities

- [x] 3.1 Add `dayjs` + `dayjs/plugin/timezone` + `dayjs/plugin/utc` dependencies
- [x] 3.2 Create `time-utils.ts` — port `timeStringToUnix`, `formatUnixToTime`, `convertTimeBetweenTimezones` from `DiscordRObot/src/util/timeUtils.js`
- [x] 3.3 Write unit tests for `time-utils.ts` covering: HH:mm → Unix in given timezone, Unix → formatted time in display timezone, DST edge cases

## 4. Timezone Settings Service

- [x] 4.1 Create `TimezoneSettingsService` with `serverTimezone` and `displayTimezone` signals/observables
- [x] 4.2 Set defaults: `serverTimezone = 'America/Sao_Paulo'`, `displayTimezone = 'Europe/Madrid'`
- [x] 4.3 Wire load/save to Electron IPC `storage:read` / `storage:write` (implement IPC handlers in main process)
- [x] 4.4 Write unit tests: defaults on first load, persisted values restored, timezone change updates observable

## 5. Electron IPC — Storage

- [x] 5.1 Implement `storage:read` IPC handler in `main.js` — reads `{userData}/mvp-state.json`, returns parsed JSON or `null`
- [x] 5.2 Implement `storage:write` IPC handler — atomic write (write to `.tmp`, rename to target)
- [x] 5.3 Add corruption recovery: if JSON parse fails in `storage:read`, return `null` and delete corrupt file
- [x] 5.4 Create `StorageService` in renderer that wraps IPC calls with typed read/write methods

## 6. MVP Timer Service

- [x] 6.1 Create `MvpTimerService` with `activeEntries` signal (array of tracker entries)
- [x] 6.2 Implement `addMvp(boss, deathTimeHHmm?)` — calculates `minRespawnTime` and `maxRespawnTime` using boss schedule + `time-utils`
- [x] 6.3 Implement `clearMvp(id)` — removes entry from active list
- [x] 6.4 Implement `startLoop()` — `setInterval(1000ms)` that reads `Date.now()` and checks all entries
- [x] 6.5 Emit 5-min warning event when `currentTime >= (minRespawnTime - 300_000)` and `!fiveMinWarningSent`
- [x] 6.6 Emit respawn-ready event when `currentTime >= minRespawnTime`, then clear entry
- [x] 6.7 On init: restore persisted entries from `StorageService`, discard expired ones, start loop
- [x] 6.8 On state change: persist updated state via `StorageService`
- [x] 6.9 Write unit tests: respawn calculation, 5-min threshold fires once, respawn-ready clears entry, expired entries discarded on restore

## 7. Electron IPC — Notifications & Audio

- [x] 7.1 Implement `notification:send` IPC handler in `main.js` using Electron `Notification` class
- [x] 7.2 Add bundled alert sound file to `src/assets/audio/alert.mp3` (and `alert.ogg` for fallback)
- [x] 7.3 Create `NotificationService` in renderer — wraps IPC call for OS notifications and plays `<audio>` for alert sound
- [x] 7.4 Wire `NotificationService` to `MvpTimerService` events: 5-min warning → OS notification only, respawn-ready → OS notification + audio
- [ ] 7.5 Test that OS notifications appear when app window is minimized (manual smoke test)

## 8. Angular UI — Boss Search & Add

- [x] 8.1 Create `BossSearchComponent` — text input with reactive autocomplete using `BossCatalogService.search()`
- [x] 8.2 Add time input field for optional HH:mm death time with validation
- [x] 8.3 On boss select + submit: call `MvpTimerService.addMvp()`, clear form
- [x] 8.4 Display error message for invalid time input

## 9. Angular UI — Active Timer List

- [x] 9.1 Create `TimerListComponent` — displays all active tracker entries
- [x] 9.2 Each entry shows: boss name, location, min/max respawn times (formatted in display timezone), countdown to min respawn
- [x] 9.3 Add "Clear" button per entry that calls `MvpTimerService.clearMvp()`
- [x] 9.4 Highlight entries in warning state (within 5-min window) visually

## 10. Angular UI — Settings Page

- [x] 10.1 Create `SettingsComponent` with two timezone dropdowns (server timezone, display timezone)
- [x] 10.2 Populate dropdowns with a curated list of common IANA timezone strings (or full list)
- [x] 10.3 On change: update `TimezoneSettingsService`, persist immediately
- [x] 10.4 Show current time in both timezones as live preview

## 11. Packaging

- [x] 11.1 Configure `electron-builder` in `package.json` for Windows (NSIS), macOS (DMG), Linux (AppImage) targets
- [x] 11.2 Ensure assets (`bossList.json`, audio files) are included in the packaged build
- [ ] 11.3 Run `electron:dist` and verify installer on Windows
- [ ] 11.4 Verify app runs without errors on a clean machine (no dev dependencies)
