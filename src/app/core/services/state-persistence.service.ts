import { Injectable, inject, effect, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { AppSettingsService } from './app-settings.service';
import { MvpTimerService } from './mvp-timer.service';
import { AppState } from '../models/mvp-tracker.model';

/**
 * Single source of truth for state persistence.
 *
 * Loads state from disk on init, then automatically persists
 * whenever active entries or settings change.
 */
@Injectable({ providedIn: 'root' })
export class StatePersistenceService {
  private readonly storage = inject(StorageService);
  private readonly appSettings = inject(AppSettingsService);
  private readonly timerService = inject(MvpTimerService);

  private readonly enabled = signal(false);

  constructor() {
    let skipFirst = true;
    effect(() => {
      if (!this.enabled()) return;

      // Read signals to establish dependencies
      const state: AppState = {
        activeEntries: this.timerService.activeEntries(),
        serverTimezone: this.appSettings.serverTimezone(),
        displayTimezone: this.appSettings.displayTimezone(),
        customAudioPath: this.appSettings.customAudioPath() ?? undefined,
        locale: this.appSettings.locale(),
      };

      if (skipFirst) {
        skipFirst = false;
        return;
      }

      this.storage.writeState(state);
    });
  }

  async init(): Promise<void> {
    const state = await this.storage.readState();
    await this.appSettings.loadFromStorage(state);
    await this.timerService.init(state?.activeEntries ?? []);
    this.enabled.set(true);
  }
}
