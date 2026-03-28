import { Injectable, inject } from '@angular/core';
import { Locale, TranslationKey, TRANSLATIONS } from '../i18n/translations';
import { AppSettingsService } from './app-settings.service';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly appSettings = inject(AppSettingsService);

  readonly locale = this.appSettings.locale;

  setLocale(locale: Locale): void {
    this.appSettings.setLocale(locale);
  }

  /** Returns the translated string for the current locale. Falls back to the key if missing. */
  t(key: TranslationKey): string {
    return TRANSLATIONS[key]?.[this.appSettings.locale()] ?? key;
  }

  /**
   * Returns a translated string with `{placeholder}` tokens replaced by the given values.
   * Example: ti('notif.warning-title', { boss: 'Eddga' }) → '⚠️ Eddga — 5 minutes!'
   */
  ti(key: TranslationKey, vars: Record<string, string>): string {
    let result = this.t(key);
    for (const [k, v] of Object.entries(vars)) {
      result = result.replaceAll(`{${k}}`, v);
    }
    return result;
  }
}
