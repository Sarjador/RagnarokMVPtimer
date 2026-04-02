import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { Locale } from '../i18n/translations';

const DEFAULT_SERVER_TZ = 'America/Sao_Paulo';
const DEFAULT_DISPLAY_TZ = 'Europe/Madrid';

@Injectable({ providedIn: 'root' })
export class AppSettingsService {
  private readonly _serverTimezone = signal(DEFAULT_SERVER_TZ);
  private readonly _displayTimezone = signal(DEFAULT_DISPLAY_TZ);
  private readonly _customAudioPath = signal<string | null>(null);
  private readonly _locale = signal<Locale>('en');

  readonly serverTimezone = this._serverTimezone.asReadonly();
  readonly displayTimezone = this._displayTimezone.asReadonly();
  readonly customAudioPath = this._customAudioPath.asReadonly();
  readonly locale = this._locale.asReadonly();

  constructor(private readonly storage: StorageService) {
    this.loadFromStorage();
  }

  setServerTimezone(tz: string): void {
    this._serverTimezone.set(tz);
  }

  setDisplayTimezone(tz: string): void {
    this._displayTimezone.set(tz);
  }

  setCustomAudioPath(path: string | null): void {
    this._customAudioPath.set(path);
  }

  setLocale(locale: Locale): void {
    this._locale.set(locale);
  }

  async loadFromStorage(): Promise<void> {
    const state = await this.storage.readState();
    if (state?.serverTimezone) this._serverTimezone.set(state.serverTimezone);
    if (state?.displayTimezone) this._displayTimezone.set(state.displayTimezone);
    if (state?.locale) this._locale.set(state.locale);

    if (state?.customAudioPath) {
      // Guardamos solo el nombre de archivo (sin path) — el path absoluto vive
      // unicamente en el main process. Notificamos al main para que resuelva.
      const filename = state.customAudioPath;
      this._customAudioPath.set(filename);
      window.electronAPI?.restoreAudioPath(filename);
    }
  }
}
