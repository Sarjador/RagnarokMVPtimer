## 1. IPC — open external URL

- [x] 1.1 Add `shell` to electron imports in `main.js` and add `ipcMain.handle('shell:openExternal', ...)` handler that calls `shell.openExternal('https://ko-fi.com/sarjador')` (URL hardcoded, not passed from renderer)
- [x] 1.2 Add `openExternal: () => ipcRenderer.invoke('shell:openExternal')` to `contextBridge.exposeInMainWorld` in `preload.js`
- [x] 1.3 Add `openExternal(): Promise<void>` to the `ElectronAPI` interface in `electron.d.ts`

## 2. Translations

- [x] 2.1 Add `footer.support-text` and `footer.kofi-link` to `TranslationKey` union in `translations.ts`
- [x] 2.2 Add EN and ES values for both keys

## 3. Footer UI

- [x] 3.1 Add `<footer class="app-footer">` to `app.html` containing the support text (via `t('footer.support-text')`) and a button/link for Ko-Fi (via `t('footer.kofi-link')`) that calls `openKoFi()`
- [x] 3.2 Add `openKoFi()` method to `App` component (`app.ts`) that calls `window.electronAPI?.openExternal()` with browser fallback `window.open('https://ko-fi.com/sarjador', '_blank')`
- [x] 3.3 Add footer styles to `app.scss`: fixed bottom band, subtle background, muted text, Ko-Fi branded link color; add `padding-bottom` to `.app-content`
