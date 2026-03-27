## Why

The app is a free tool with no ads. A small, unobtrusive footer with a Ko-Fi link gives supporters a frictionless path to donate if they find the app valuable, without being intrusive during normal use.

## What Changes

- Add a **fixed footer band** at the bottom of the app shell (visible on all pages).
- The band contains a short thank-you message and a clickable Ko-Fi link (`https://ko-fi.com/sarjador`).
- The link opens in the system browser (not inside the Electron window).
- The message and link label are added to the translation system (EN + ES).
- The footer is styled to be visually subtle — it does not compete with the main content.

## Capabilities

### New Capabilities
- `footer-band`: Persistent fixed footer with donation message and Ko-Fi link.

### Modified Capabilities
- `ui-strings`: New translation keys for the footer message and link label.

## Impact

- `src/app/app.html` — footer element added inside `.app-shell`.
- `src/app/app.scss` — footer styles; `app-content` gets bottom padding so content isn't hidden behind the footer.
- `src/app/core/i18n/translations.ts` — two new keys: `footer.support-text` and `footer.kofi-link`.
- `main.js` — Ko-Fi URL opened via `shell.openExternal` through an existing or new IPC handler.
- `preload.js` / `src/electron.d.ts` — expose `openExternal(url)` if not already present.
