## Context

The DiscordRObot project contains a mature MVP timer for Ragnarok Online: a 1-second interval loop that checks active bosses, calculates respawn windows from death time + respawn schedule, and sends Discord channel embeds at the 5-minute warning and respawn-ready moments. The logic is well-tested in production but tightly coupled to Discord.js and a shared JSON file on a VPS.

The target is `ElectronROmvpTimer` — a brand-new, currently empty repo. The tech stack is Angular (frontend/UI) + Electron (desktop shell), which gives us a Node.js runtime in the main process and a Chromium-based renderer for the Angular app.

## Goals / Non-Goals

**Goals:**
- Port the timer engine faithfully (same respawn window math, same alert thresholds)
- Bundle the full boss catalog from `bossList.json` as a static asset
- Replace Discord embeds with native OS desktop notifications + audio alert
- Allow user to configure server timezone and display timezone
- Persist active timers across app restarts using Electron's user data directory
- Package for Windows, macOS, and Linux via `electron-builder`

**Non-Goals:**
- Multi-user or multi-device sync
- Discord integration of any kind
- Backend server or network calls at runtime
- Boss image fetching from RMS at runtime (may use bundled fallback icons)
- Auto-update mechanism (can be added later)

## Decisions

### D1: Angular + Electron via `electron-builder` (not Capacitor, not Tauri)

The repo is named `ElectronROmvpTimer` and the user specified Angular + Electron. `electron-builder` is the de-facto packaging tool for Electron apps, with mature cross-platform support.

**Alternatives considered:**
- Tauri (Rust backend) — smaller bundle but requires Rust toolchain; overkill for a timer app
- Capacitor — targets mobile, not desktop
- NW.js — less ecosystem traction than Electron

### D2: Angular app runs in Electron renderer, timer service runs in renderer process

The timer (`setInterval` 1000ms) and all state live in an Angular service (`MvpTimerService`) inside the renderer process. No IPC needed for the core loop.

**Why renderer instead of main process:**
- Angular's change detection integrates naturally with observables in the renderer
- Timer logic doesn't need native OS access beyond notifications
- Simpler architecture — IPC only needed for: triggering OS notifications and reading/writing the user data file

**IPC surface (renderer → main):**
- `notification:send` — trigger a native OS notification
- `storage:read` — read persisted state from user data directory
- `storage:write` — write state to user data directory
- `audio:play` — play alert sound via Electron shell or HTML5 Audio

### D3: `dayjs` with `dayjs/plugin/timezone` for all time operations

Ported directly from the Discord bot's `timeUtils.js`. `dayjs` is already proven in the source codebase, is tree-shakeable, and handles DST correctly with the timezone plugin.

**Alternative considered:** Luxon — equally capable, but dayjs is already the established choice.

### D4: Native OS notifications via Electron's built-in `Notification` API (renderer-side Web Notifications)

Electron exposes the Web Notifications API in the renderer, which maps to native OS notifications. No extra npm package needed (`node-notifier`, `electron-notifier` are unnecessary).

**Audio alert:** HTML5 `<audio>` element with a bundled `.mp3`/`.ogg` file. Simple, cross-platform, no additional dependencies.

### D5: State persisted as JSON in `app.getPath('userData')`

Mirrors the Discord bot's atomic JSON write pattern. Main process handles all file I/O via IPC handlers. File path: `{userData}/mvp-state.json`.

**Corruption recovery:** If JSON parse fails, reset to empty state (same strategy as the bot's `readMultiServerDataSafe`).

### D6: Boss catalog bundled as Angular asset (`assets/data/bossList.json`)

The catalog is static data (~40KB). Bundling it avoids any network dependency and keeps the app fully offline. Loaded once at startup into `BossCatalogService`.

## Risks / Trade-offs

- **Windows notification focus-steal** → Mitigation: use `silent: true` on the 5-min warning; only the respawn-ready notification plays a sound
- **Long-running timer drift** → Mitigation: use `Date.now()` on each tick (same as bot), not accumulated intervals
- **Electron bundle size (~150MB)** → Accepted trade-off; no mitigation needed for a desktop app
- **Cross-platform audio format support** → Mitigation: bundle both `.mp3` and `.ogg`, pick via `<audio>` source list
- **State file corruption on hard shutdown** → Mitigation: write to `.tmp` then rename (atomic write pattern from bot)

## Migration Plan

1. Scaffold Angular app inside Electron shell (`ng new` + `electron` wiring)
2. Bundle boss catalog asset
3. Implement `MvpTimerService` with ported timer logic
4. Implement `BossCatalogService` (search by name/alias)
5. Implement `TimezoneSettingsService` (load/save user prefs)
6. Wire Electron IPC handlers (notifications, storage, audio)
7. Build Angular UI (boss search, active timer list, settings page)
8. Configure `electron-builder` for Windows/macOS/Linux targets
9. Smoke-test packaging on each platform

No rollback strategy needed — greenfield project.

## Open Questions

- Should the app support multiple simultaneous instances? (Current assumption: no — single instance lock via `app.requestSingleInstanceLock()`)
- What audio clip to use for the alert? (To be sourced/created; a short bell or horn sound fitting RO theme)
- Should the app minimize to system tray? (Nice-to-have; defer to post-MVP)
