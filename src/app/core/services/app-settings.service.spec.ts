import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppSettingsService } from './app-settings.service';
import { StorageService } from './storage.service';

describe('AppSettingsService', () => {
  let service: AppSettingsService;
  let storageSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('StorageService', ['readState', 'writeState']);
    storageSpy.readState.and.returnValue(Promise.resolve(null));
    storageSpy.writeState.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: storageSpy }],
    });
    service = TestBed.inject(AppSettingsService);
  });

  it('defaults to America/Sao_Paulo for server timezone', () => {
    expect(service.serverTimezone()).toBe('America/Sao_Paulo');
  });

  it('defaults to Europe/Madrid for display timezone', () => {
    expect(service.displayTimezone()).toBe('Europe/Madrid');
  });

  it('defaults customAudioPath to null', () => {
    expect(service.customAudioPath()).toBeNull();
  });

  it('updates serverTimezone signal when set', () => {
    service.setServerTimezone('Asia/Tokyo');
    expect(service.serverTimezone()).toBe('Asia/Tokyo');
  });

  it('updates displayTimezone signal when set', () => {
    service.setDisplayTimezone('America/New_York');
    expect(service.displayTimezone()).toBe('America/New_York');
  });

  it('updates customAudioPath signal when set', () => {
    service.setCustomAudioPath('/home/user/alert.mp3');
    expect(service.customAudioPath()).toBe('/home/user/alert.mp3');
  });

  it('clears customAudioPath when set to null', () => {
    service.setCustomAudioPath('/home/user/alert.mp3');
    service.setCustomAudioPath(null);
    expect(service.customAudioPath()).toBeNull();
  });

  it('restores persisted timezones from storage', fakeAsync(() => {
    storageSpy.readState.and.returnValue(
      Promise.resolve({
        serverTimezone: 'Asia/Seoul',
        displayTimezone: 'Europe/Paris',
        activeEntries: [],
      }),
    );

    (service as any).loadFromStorage();
    tick();

    expect(service.serverTimezone()).toBe('Asia/Seoul');
    expect(service.displayTimezone()).toBe('Europe/Paris');
  }));

  it('restores persisted customAudioPath from storage', fakeAsync(() => {
    storageSpy.readState.and.returnValue(
      Promise.resolve({
        serverTimezone: 'UTC',
        displayTimezone: 'UTC',
        activeEntries: [],
        customAudioPath: 'C:\\Users\\user\\Music\\alert.mp3',
      }),
    );

    (service as any).loadFromStorage();
    tick();

    expect(service.customAudioPath()).toBe('C:\\Users\\user\\Music\\alert.mp3');
  }));

  it('customAudioPath stays null when not present in persisted state', fakeAsync(() => {
    storageSpy.readState.and.returnValue(
      Promise.resolve({
        serverTimezone: 'UTC',
        displayTimezone: 'UTC',
        activeEntries: [],
        // no customAudioPath field
      }),
    );

    (service as any).loadFromStorage();
    tick();

    expect(service.customAudioPath()).toBeNull();
  }));

  it('defaults locale to en', () => {
    expect(service.locale()).toBe('en');
  });

  it('updates locale signal when set', () => {
    service.setLocale('es');
    expect(service.locale()).toBe('es');
  });

  it('restores persisted locale from storage', fakeAsync(() => {
    storageSpy.readState.and.returnValue(
      Promise.resolve({
        serverTimezone: 'UTC',
        displayTimezone: 'UTC',
        activeEntries: [],
        locale: 'es' as const,
      }),
    );

    (service as any).loadFromStorage();
    tick();

    expect(service.locale()).toBe('es');
  }));

  it('locale defaults to en when not present in persisted state', fakeAsync(() => {
    storageSpy.readState.and.returnValue(
      Promise.resolve({ serverTimezone: 'UTC', displayTimezone: 'UTC', activeEntries: [] }),
    );

    (service as any).loadFromStorage();
    tick();

    expect(service.locale()).toBe('en');
  }));
});
