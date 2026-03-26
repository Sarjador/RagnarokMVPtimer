const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  /** Read persisted app state from userData/mvp-state.json */
  storageRead: () => ipcRenderer.invoke('storage:read'),

  /** Atomically write app state to userData/mvp-state.json */
  storageWrite: (data) => ipcRenderer.invoke('storage:write', data),

  /** Send a native OS notification (fallback for renderer-side Notification API) */
  sendNotification: (opts) => ipcRenderer.invoke('notification:send', opts),

  /** Open the OS native file-open dialog filtered to audio formats; returns absolute path or null */
  pickAudioFile: () => ipcRenderer.invoke('dialog:pickAudio'),
});
