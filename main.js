const { app, BrowserWindow, ipcMain, Notification, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// ── Windows: set App User Model ID so toast notifications are attributed to this app
// Must be called before app.whenReady()
if (process.platform === 'win32') {
  app.setAppUserModelId('com.romvptimer.app');
}

// ── Single-instance lock ─────────────────────────────────────────────────────
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
}

// ── State file path (resolved after app is ready) ────────────────────────────
let STATE_FILE;
let TEMP_FILE;

function resolveStatePaths() {
  STATE_FILE = path.join(app.getPath('userData'), 'mvp-state.json');
  TEMP_FILE = STATE_FILE + '.tmp';
}

// ── Window ───────────────────────────────────────────────────────────────────
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'RO MVP Timer',
    autoHideMenuBar: true,
    backgroundColor: '#1a1a2e',
  });

  const indexPath = path.join(__dirname, 'dist', 'ro-mvp-timer', 'browser', 'index.html');
  mainWindow.loadFile(indexPath);
}

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.whenReady().then(() => {
  resolveStatePaths();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ── IPC: storage:read ────────────────────────────────────────────────────────
ipcMain.handle('storage:read', () => {
  try {
    if (!fs.existsSync(STATE_FILE)) return null;
    const raw = fs.readFileSync(STATE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    try { fs.unlinkSync(STATE_FILE); } catch { /* ignore */ }
    return null;
  }
});

// ── IPC: storage:write (atomic write via tmp → rename) ───────────────────────
ipcMain.handle('storage:write', (_event, data) => {
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(TEMP_FILE, json, 'utf-8');
  fs.renameSync(TEMP_FILE, STATE_FILE);
});

// ── IPC: dialog:pickAudio ────────────────────────────────────────────────────
ipcMain.handle('dialog:pickAudio', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Seleccionar sonido de alerta',
    filters: [
      { name: 'Audio', extensions: ['mp3', 'ogg', 'wav', 'flac', 'aac', 'webm'] },
    ],
    properties: ['openFile'],
  });
  return result.canceled || result.filePaths.length === 0 ? null : result.filePaths[0];
});

// ── IPC: shell:openExternal (Ko-Fi donation link) ────────────────────────────
// URL is hardcoded here — the renderer passes no URL argument.
ipcMain.handle('shell:openExternal', () => {
  shell.openExternal('https://ko-fi.com/sarjador');
});

// ── IPC: notification:send ───────────────────────────────────────────────────
// Fallback for platforms where renderer-side Notification API is unavailable.
ipcMain.handle('notification:send', (_event, { title, body, silent }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body, silent: !!silent }).show();
  }
});
