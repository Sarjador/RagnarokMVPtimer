import { TestBed } from '@angular/core/testing';
import { LocaleService } from './locale.service';
import { AppSettingsService } from './app-settings.service';

describe('LocaleService', () => {
  let service: LocaleService;
  let appSettingsSpy: jasmine.SpyObj<AppSettingsService>;

  beforeEach(() => {
    appSettingsSpy = jasmine.createSpyObj('AppSettingsService', ['setLocale'], {
      locale: jasmine.createSpy().and.returnValue('en'),
    });

    TestBed.configureTestingModule({
      providers: [{ provide: AppSettingsService, useValue: appSettingsSpy }],
    });
    service = TestBed.inject(LocaleService);
  });

  it('default locale is en', () => {
    expect(service.locale()).toBe('en');
  });

  it('t() returns correct English string', () => {
    expect(service.t('nav.settings')).toBe('Settings');
  });

  it('t() returns correct Spanish string after setLocale("es")', () => {
    service.setLocale('es');
    expect(service.t('nav.settings')).toBe('Configuración');
  });

  it('t() returns correct English timer-list.ready', () => {
    expect(service.t('timer-list.ready')).toBe('NOW!');
  });

  it('t() returns correct Spanish timer-list.ready', () => {
    service.setLocale('es');
    expect(service.t('timer-list.ready')).toBe('¡YA!');
  });

  it('setLocale() switches locale signal', () => {
    service.setLocale('es');
    expect(service.locale()).toBe('es');
    service.setLocale('en');
    expect(service.locale()).toBe('en');
  });

  it('setLocale() delegates to AppSettingsService', () => {
    service.setLocale('es');
    expect(appSettingsSpy.setLocale).toHaveBeenCalledWith('es');
  });

  it('ti() interpolates placeholders', () => {
    expect(service.ti('notif.warning-title', { boss: 'Eddga' })).toBe('⚠️ Eddga — 5 minutes!');
  });

  it('ti() interpolates placeholders in Spanish', () => {
    service.setLocale('es');
    expect(service.ti('notif.warning-title', { boss: 'Eddga' })).toBe('⚠️ Eddga — ¡5 minutos!');
  });
});
