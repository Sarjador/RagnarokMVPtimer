import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppSettingsService } from '../../core/services/app-settings.service';
import { LocaleService } from '../../core/services/locale.service';
import { StorageService } from '../../core/services/storage.service';
import { MvpTimerService } from '../../core/services/mvp-timer.service';
import { COMMON_TIMEZONES } from '../../core/utils/timezones';
import { getCurrentTimeInTimezone } from '../../core/utils/time-utils';
import { Locale } from '../../core/i18n/translations';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly appSettings = inject(AppSettingsService);
  readonly locale = inject(LocaleService);
  private readonly storage = inject(StorageService);
  private readonly timerService = inject(MvpTimerService);

  readonly t = this.locale.t.bind(this.locale);

  readonly timezones = COMMON_TIMEZONES;
  readonly isElectron = typeof window !== 'undefined' && !!window.electronAPI;

  readonly serverTimezone = this.appSettings.serverTimezone;
  readonly displayTimezone = this.appSettings.displayTimezone;
  readonly customAudioPath = this.appSettings.customAudioPath;
  readonly currentLocale = this.appSettings.locale;

  readonly audioLabel = computed(() => {
    const path = this.appSettings.customAudioPath();
    if (!path) return this.locale.t('audio-label.default');
    return path.replace(/.*[\\/]/, '');
  });

  readonly serverTimePreview = computed(() =>
    getCurrentTimeInTimezone(this.appSettings.serverTimezone(), 'HH:mm:ss'),
  );
  readonly displayTimePreview = computed(() =>
    getCurrentTimeInTimezone(this.appSettings.displayTimezone(), 'HH:mm:ss'),
  );

  onServerTimezoneChange(tz: string): void {
    this.appSettings.setServerTimezone(tz);
    this.persist();
  }

  onDisplayTimezoneChange(tz: string): void {
    this.appSettings.setDisplayTimezone(tz);
    this.persist();
  }

  onLocaleChange(locale: Locale): void {
    this.locale.setLocale(locale);
    this.persist();
  }

  async pickAudio(): Promise<void> {
    const path = await window.electronAPI!.pickAudioFile();
    if (path !== null) {
      this.appSettings.setCustomAudioPath(path);
      this.persist();
    }
  }

  resetAudio(): void {
    this.appSettings.setCustomAudioPath(null);
    this.persist();
  }

  private persist(): void {
    const state = {
      activeEntries: this.timerService.activeEntries(),
      serverTimezone: this.appSettings.serverTimezone(),
      displayTimezone: this.appSettings.displayTimezone(),
      customAudioPath: this.appSettings.customAudioPath() ?? undefined,
      locale: this.appSettings.locale(),
    };
    this.storage.writeState(state);
  }
}
