## Requirements

### Requirement: A fixed footer band is visible on all pages
The system SHALL render a `<footer>` element pinned to the bottom of the viewport on every page. The footer SHALL NOT obscure main content — `app-content` SHALL have bottom padding equal to the footer height.

#### Scenario: Footer visible on Timers page
- **WHEN** the user is on the Timers page
- **THEN** the footer band is visible at the bottom of the window

#### Scenario: Footer visible on Settings page
- **WHEN** the user navigates to the Settings page
- **THEN** the footer band remains visible at the bottom

### Requirement: Footer contains a donation message and Ko-Fi link
The footer SHALL display a translatable thank-you message and a clickable Ko-Fi link. Both SHALL switch language when the locale changes.

#### Scenario: English footer text
- **WHEN** locale is `'en'`
- **THEN** the footer shows the English support message and Ko-Fi link label

#### Scenario: Spanish footer text
- **WHEN** locale is `'es'`
- **THEN** the footer shows the Spanish support message and Ko-Fi link label

### Requirement: Ko-Fi link opens in the system browser
The system SHALL open `https://ko-fi.com/sarjador` in the OS default browser when the Ko-Fi link is clicked. In Electron, this is done via `shell.openExternal` through a hardcoded IPC handler (no URL is passed from the renderer). In browser fallback, `window.open` is used.

#### Scenario: Click in Electron
- **WHEN** the user clicks the Ko-Fi link inside the Electron app
- **THEN** `shell.openExternal` is called with `https://ko-fi.com/sarjador`
- **AND** the link opens in the system default browser, not inside the app

#### Scenario: Click in browser fallback
- **WHEN** `window.electronAPI` is not present and the user clicks the Ko-Fi link
- **THEN** `window.open('https://ko-fi.com/sarjador', '_blank')` is called
