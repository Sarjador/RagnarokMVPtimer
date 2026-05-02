import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AppSettingsService } from '../../core/services/app-settings.service';
import { LocaleService } from '../../core/services/locale.service';
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
  private readonly timerService = inject(MvpTimerService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly t = this.locale.t.bind(this.locale);

  /**
   * Unico uso de innerHTML en la app — el contenido proviene de translations.ts
   * que es un archivo estatico hardcodeado en el bundle, no de usuario ni red.
   * Se marca explicito con bypassSecurityTrustHtml para que el code review
   * pueda auditar este patron facilmente (buscar bypassSecurityTrustHtml).
   */
  readonly infoExampleHtml = computed((): SafeHtml => {
    const raw = this.locale.t('settings.info-example');
    return this.sanitizer.bypassSecurityTrustHtml(raw);
  });

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

  readonly serverTimePreview = computed(() => {
    void this.timerService.currentTimeMs();
    return getCurrentTimeInTimezone(this.appSettings.serverTimezone(), 'HH:mm:ss');
  });
  readonly displayTimePreview = computed(() => {
    void this.timerService.currentTimeMs();
    return getCurrentTimeInTimezone(this.appSettings.displayTimezone(), 'HH:mm:ss');
  });

  onServerTimezoneChange(tz: string): void {
    this.appSettings.setServerTimezone(tz);
  }

  onDisplayTimezoneChange(tz: string): void {
    this.appSettings.setDisplayTimezone(tz);
  }

  onLocaleChange(locale: Locale): void {
    this.locale.setLocale(locale);
  }

  async pickAudio(): Promise<void> {
    // pickAudioFile() devuelve solo el nombre del archivo (sin path absoluto).
    // El path absoluto queda en el main process — nunca viaja al renderer.
    const filename = await window.electronAPI!.pickAudioFile();
    if (filename !== null) {
      this.appSettings.setCustomAudioPath(filename);
    }
  }

  resetAudio(): void {
    this.appSettings.setCustomAudioPath(null);
  }
}
