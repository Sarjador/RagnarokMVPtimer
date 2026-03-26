/** Type declarations for the Electron IPC bridge exposed via preload.js */
interface ElectronAPI {
  storageRead(): Promise<import('./app/core/models/mvp-tracker.model').AppState | null>;
  storageWrite(data: import('./app/core/models/mvp-tracker.model').AppState): Promise<void>;
  sendNotification(opts: { title: string; body: string; silent?: boolean }): Promise<void>;
  /** Opens the OS native file-open dialog filtered to audio formats. Returns absolute path or null if cancelled. */
  pickAudioFile(): Promise<string | null>;
}

interface Window {
  electronAPI?: ElectronAPI;
}
