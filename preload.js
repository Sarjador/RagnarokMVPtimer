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

  /** Open the Ko-Fi donation page in the system default browser */
  openExternal: () => ipcRenderer.invoke('shell:openExternal'),

  /** Read user-created custom bosses from userData/customBosses.json; returns null if not found */
  customBossesRead: () => ipcRenderer.invoke('custom-bosses:read'),

  /** Atomically write user-created custom bosses to userData/customBosses.json */
  customBossesWrite: (data) => ipcRenderer.invoke('custom-bosses:write', data),
});
