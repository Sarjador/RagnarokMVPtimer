/** Type declarations for the Electron IPC bridge exposed via preload.js */
interface ElectronAPI {
  storageRead(): Promise<import('./app/core/models/mvp-tracker.model').AppState | null>;
  storageWrite(data: import('./app/core/models/mvp-tracker.model').AppState): Promise<void>;
  sendNotification(opts: { title: string; body: string; silent?: boolean }): Promise<void>;
  /** Opens the OS native file-open dialog filtered to audio formats. Returns filename only (no path) or null if cancelled. */
  pickAudioFile(): Promise<string | null>;
  /** Request the file:// URL for the current audio selection. Resolved in the main process; never exposes the absolute path to the renderer. */
  getAudioPath(): Promise<string | null>;
  /** On startup: send the saved filename so the main process can try to resolve it. */
  restoreAudioPath(filename: string): Promise<void>;
  /** Opens the Ko-Fi donation page in the system default browser. */
  openExternal(): Promise<void>;
  /** Reads user-created custom bosses from userData/customBosses.json. Returns null if file not found. */
  customBossesRead(): Promise<import('./app/core/models/boss.model').CustomBossListJson | null>;
  /** Atomically writes user-created custom bosses to userData/customBosses.json. */
  customBossesWrite(data: import('./app/core/models/boss.model').CustomBossListJson): Promise<void>;
}

interface Window {
  electronAPI?: ElectronAPI;
}
