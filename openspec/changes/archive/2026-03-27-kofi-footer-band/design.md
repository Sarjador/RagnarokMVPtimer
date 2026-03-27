## Context

The app shell is defined in `app.html` / `app.scss`. The current layout is a flex column: `nav.app-nav` on top, `main.app-content` below. There is no footer yet. The Electron IPC bridge (`preload.js` → `window.electronAPI`) exposes storage, notification, and audio-picker calls but no URL-opener. The `ElectronAPI` interface in `electron.d.ts` mirrors this bridge.

## Goals / Non-Goals

**Goals:**
- Persistent footer visible on every page, always at the bottom of the viewport.
- Footer contains a thank-you sentence and a Ko-Fi link; both are translatable.
- Link opens `https://ko-fi.com/sarjador` in the system default browser (not in Electron).
- Minimal visual footprint — does not distract from the timer UI.

**Non-Goals:**
- Analytics or click tracking.
- Dismiss / hide button.
- Any other footer content beyond the donation message.

## Decisions

### 1. `shell.openExternal` via IPC
Electron's `shell.openExternal(url)` must be called from the main process (or via privileged preload). We add a new IPC handler `shell:openExternal` in `main.js` that accepts a URL string, validates it is `https://ko-fi.com/sarjador` (hardcoded allowlist — no user-supplied URLs reach this handler), and calls `shell.openExternal`. The renderer calls `window.electronAPI.openExternal()` — no URL argument exposed to the renderer; the URL is fixed in the main process.

*Alternative considered:* expose a generic `openExternal(url)` renderer-callable. Rejected — unnecessarily broad attack surface for an Electron app.

*Browser fallback:* `window.open('https://ko-fi.com/sarjador', '_blank')` when `window.electronAPI` is absent.

### 2. Footer placement: inside `.app-shell`, outside `<router-outlet>`
The footer lives in `app.html` as a `<footer>` sibling to `<main>`. It uses `position: fixed; bottom: 0` so it overlays nothing and stays pinned. `main.app-content` gets `padding-bottom` equal to the footer height (~2.5rem) so the last page content is never hidden.

### 3. Translation
Two keys added:
- `footer.support-text`: The thank-you sentence (e.g. "If you enjoy the app, consider supporting development!")
- `footer.kofi-link`: The link anchor text (e.g. "Buy me a coffee ☕")

The Ko-Fi URL itself is a constant — not translated.

## Migration Plan

1. Add `openExternal` IPC handler to `main.js` (allowlisted to Ko-Fi URL).
2. Expose `openExternal()` on `window.electronAPI` in `preload.js`.
3. Add `openExternal()` to `ElectronAPI` interface in `electron.d.ts`.
4. Add translation keys to `translations.ts`.
5. Add `<footer>` to `app.html` with message and Ko-Fi link button.
6. Add footer styles to `app.scss`; add `padding-bottom` to `app-content`.
