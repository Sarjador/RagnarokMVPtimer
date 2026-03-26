import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TimezoneSettingsService } from './timezone-settings.service';
import { StorageService } from './storage.service';

describe('TimezoneSettingsService', () => {
  let service: TimezoneSettingsService;
  let storageSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('StorageService', ['readState', 'writeState']);
    storageSpy.readState.and.returnValue(Promise.resolve(null));
    storageSpy.writeState.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: storageSpy }],
    });
    service = TestBed.inject(TimezoneSettingsService);
  });

  it('defaults to America/Sao_Paulo for server timezone', () => {
    expect(service.serverTimezone()).toBe('America/Sao_Paulo');
  });

  it('defaults to Europe/Madrid for display timezone', () => {
    expect(service.displayTimezone()).toBe('Europe/Madrid');
  });

  it('updates serverTimezone signal when set', () => {
    service.setServerTimezone('Asia/Tokyo');
    expect(service.serverTimezone()).toBe('Asia/Tokyo');
  });

  it('updates displayTimezone signal when set', () => {
    service.setDisplayTimezone('America/New_York');
    expect(service.displayTimezone()).toBe('America/New_York');
  });

  it('restores persisted timezones from storage', fakeAsync(() => {
    // Simulate storage returning saved state
    storageSpy.readState.and.returnValue(
      Promise.resolve({
        serverTimezone: 'Asia/Seoul',
        displayTimezone: 'Europe/Paris',
        activeEntries: [],
      }),
    );

    // Trigger the async load manually (as if service was just created with this state)
    (service as any).loadFromStorage();
    tick(); // flush Promise microtasks

    expect(service.serverTimezone()).toBe('Asia/Seoul');
    expect(service.displayTimezone()).toBe('Europe/Paris');
  }));
});
