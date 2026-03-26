## Why

The existing Ragnarok Online MVP timer lives inside a Discord bot, requiring an active Discord session and internet connectivity just to track boss respawns. A standalone desktop application eliminates that dependency, enabling players to track MVPs locally with native OS notifications and full timezone control.

## What Changes

- New standalone cross-platform desktop application (Windows/macOS/Linux) built with Angular + Electron
- MVP timer logic ported from `DiscordRObot` — same respawn window calculations, same boss data
- Timezone configuration moved from per-guild Discord settings to per-user app settings
- Notifications replaced from Discord channel embeds to native OS desktop notifications + audio alert
- Data persistence moved from shared JSON files on a server to local user data directory

## Capabilities

### New Capabilities

- `mvp-tracker`: Core timer engine — add MVPs with a death time, track respawn windows (min/max), emit alerts at the -5 min warning and at respawn-ready moments
- `boss-catalog`: Searchable database of all Ragnarok Online MVPs with name, aliases, respawn windows, location, and metadata (ported from `bossList.json`)
- `timezone-settings`: User-configurable server timezone and display timezone; persisted locally; used to interpret death-time input and format displayed times
- `desktop-notifications`: Native OS desktop notification at 5-minute warning and respawn-ready events, plus an audible alert sound
- `app-persistence`: Local JSON state storage using Electron's `app.getPath('userData')` — survives app restarts, recovers from corruption

### Modified Capabilities

## Impact

- **New repo**: `ElectronROmvpTimer` (Angular 17+ / Electron 28+)
- **Ported data**: `data/bossList.json` from `DiscordRObot` → bundled as Angular asset
- **Ported logic**: `timeUtils.js`, timer interval loop, respawn calculations
- **Dependencies**: `electron`, `@angular/core`, `dayjs` + `dayjs/plugin/timezone`, `electron-builder` (packaging)
- **No backend**: fully offline, no Discord API, no network calls at runtime
