import { Injectable, signal, effect } from '@angular/core';
import { StorageService } from './storage.service';

const DEFAULT_SERVER_TZ = 'America/Sao_Paulo';
const DEFAULT_DISPLAY_TZ = 'Europe/Madrid';

@Injectable({ providedIn: 'root' })
export class TimezoneSettingsService {
  private readonly _serverTimezone = signal(DEFAULT_SERVER_TZ);
  private readonly _displayTimezone = signal(DEFAULT_DISPLAY_TZ);

  readonly serverTimezone = this._serverTimezone.asReadonly();
  readonly displayTimezone = this._displayTimezone.asReadonly();

  constructor(private readonly storage: StorageService) {
    this.loadFromStorage();
  }

  setServerTimezone(tz: string): void {
    this._serverTimezone.set(tz);
  }

  setDisplayTimezone(tz: string): void {
    this._displayTimezone.set(tz);
  }

  private async loadFromStorage(): Promise<void> {
    const state = await this.storage.readState();
    if (state?.serverTimezone) this._serverTimezone.set(state.serverTimezone);
    if (state?.displayTimezone) this._displayTimezone.set(state.displayTimezone);
  }
}
