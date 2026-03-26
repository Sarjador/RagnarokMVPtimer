import { Injectable } from '@angular/core';
import { AppState } from '../models/mvp-tracker.model';

/**
 * Wraps Electron IPC storage calls. Falls back to a no-op when running
 * outside Electron (e.g., `ng serve` in a browser).
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private get api() {
    return (window as Window & { electronAPI?: Window['electronAPI'] }).electronAPI;
  }

  async readState(): Promise<AppState | null> {
    if (!this.api) return null;
    try {
      return await this.api.storageRead();
    } catch {
      return null;
    }
  }

  async writeState(state: AppState): Promise<void> {
    if (!this.api) return;
    try {
      await this.api.storageWrite(state);
    } catch (err) {
      console.error('[StorageService] writeState failed:', err);
    }
  }
}
