const { app, BrowserWindow, ipcMain, Notification, dialog, shell, session } = require('electron');
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
let CUSTOM_BOSSES_FILE;
let CUSTOM_BOSSES_TEMP;

function resolveStatePaths() {
  STATE_FILE = path.join(app.getPath('userData'), 'mvp-state.json');
  TEMP_FILE = STATE_FILE + '.tmp';
  CUSTOM_BOSSES_FILE = path.join(app.getPath('userData'), 'customBosses.json');
  CUSTOM_BOSSES_TEMP = CUSTOM_BOSSES_FILE + '.tmp';
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

  // ── Content Security Policy ──────────────────────────────────────────────
  // Restringe la ejecucion de scripts, carga de recursos y conexiones de red
  // al origen propio (file://) para mitigar XSS y exfiltracion de datos.
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          [
            "default-src 'self'",
            "script-src 'self'",
            "style-src 'self' 'unsafe-inline'",   // Angular necesita estilos inline
            "img-src 'self' https: data:",         // imagenes remotas http/https y data URIs de imagen
            "media-src 'self' file:",              // audio local via file://
            "connect-src 'none'",                  // sin fetch/XHR a URLs externas
            "frame-src 'none'",
            "object-src 'none'",
          ].join('; '),
        ],
      },
    });
  });

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
    try {
      const corruptName = `${STATE_FILE}.corrupt.${Date.now()}`;
      fs.renameSync(STATE_FILE, corruptName);
    } catch { /* ignore */ }
    return null;
  }
});

// ── IPC: storage:write (atomic write via tmp → rename) ───────────────────────
const MAX_STATE_BYTES = 2 * 1024 * 1024; // 2 MB — suficiente para miles de entradas

ipcMain.handle('storage:write', (_event, data) => {
  const json = JSON.stringify(data, null, 2);
  if (Buffer.byteLength(json, 'utf-8') > MAX_STATE_BYTES) {
    throw new Error('storage:write rejected: payload exceeds size limit');
  }
  fs.writeFileSync(TEMP_FILE, json, 'utf-8');
  fs.renameSync(TEMP_FILE, STATE_FILE);
});

// ── IPC: dialog:pickAudio ────────────────────────────────────────────────────
// Retorna solo el nombre del archivo (sin path) al renderer para preservar
// la privacidad del usuario (no exponer la estructura del filesystem).
// El path absoluto se almacena en memoria en el main process (audioFilePath).
let audioFilePath = null; // path absoluto — solo vive en el main process

ipcMain.handle('dialog:pickAudio', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Seleccionar sonido de alerta',
    filters: [
      { name: 'Audio', extensions: ['mp3', 'ogg', 'wav', 'flac', 'aac', 'webm'] },
    ],
    properties: ['openFile'],
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  audioFilePath = result.filePaths[0];
  return path.basename(audioFilePath); // solo el nombre al renderer
});

// ── IPC: audio:getPath ────────────────────────────────────────────────────────
// El renderer solicita el file:// URL para reproducir el audio.
// Solo se devuelve si el path fue elegido en esta sesion via el dialogo oficial.
ipcMain.handle('audio:getPath', () => {
  if (!audioFilePath) return null;
  return `file:///${audioFilePath.replace(/\\/g, '/')}`;
});

// ── IPC: audio:restorePath ────────────────────────────────────────────────────
// Al iniciar la app, el renderer envia el nombre de archivo guardado para que
// el main process pueda buscarlo en userData si existe una copia alli.
// Esto permite persistencia entre sesiones sin exponer paths absolutos.
ipcMain.handle('audio:restorePath', (_event, filename) => {
  if (!filename || typeof filename !== 'string') return;
  // Solo aceptamos nombres de archivo simples (sin separadores de path)
  const safeName = path.basename(filename);
  if (safeName !== filename) return; // rechazar si contenia separadores
  const candidate = path.join(app.getPath('userData'), 'audio', safeName);
  if (fs.existsSync(candidate)) {
    audioFilePath = candidate;
  }
});

// ── IPC: shell:openExternal (Ko-Fi donation link) ────────────────────────────
// URL is hardcoded here — the renderer passes no URL argument.
ipcMain.handle('shell:openExternal', () => {
  shell.openExternal('https://ko-fi.com/sarjador');
});

// ── IPC: custom-bosses:read ──────────────────────────────────────────────────
ipcMain.handle('custom-bosses:read', () => {
  try {
    if (!fs.existsSync(CUSTOM_BOSSES_FILE)) return null;
    const raw = fs.readFileSync(CUSTOM_BOSSES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
});

// ── IPC: custom-bosses:write (atomic write via tmp → rename) ─────────────────
const MAX_CUSTOM_BOSSES_BYTES = 512 * 1024; // 512 KB — amplio margen para bosses custom

ipcMain.handle('custom-bosses:write', (_event, data) => {
  const json = JSON.stringify(data, null, 2);
  if (Buffer.byteLength(json, 'utf-8') > MAX_CUSTOM_BOSSES_BYTES) {
    throw new Error('custom-bosses:write rejected: payload exceeds size limit');
  }
  fs.writeFileSync(CUSTOM_BOSSES_TEMP, json, 'utf-8');
  fs.renameSync(CUSTOM_BOSSES_TEMP, CUSTOM_BOSSES_FILE);
});

// ── IPC: notification:send ───────────────────────────────────────────────────
// Fallback for platforms where renderer-side Notification API is unavailable.
ipcMain.handle('notification:send', (_event, { title, body, silent }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body, silent: !!silent }).show();
  }
});
