import { TestBed, fakeAsync, flushMicrotasks, discardPeriodicTasks } from '@angular/core/testing';
import { MvpTimerService } from './mvp-timer.service';
import { StorageService } from './storage.service';
import { AppSettingsService } from './app-settings.service';
import { BossEntry } from '../models/boss.model';
import { MvpTrackerEntry } from '../models/mvp-tracker.model';

const MOCK_BOSS: BossEntry = {
  ID: 1511, bossName: 'Amon Ra', HP: 1214138, race: 'Demi-Human', property: 'Fire 3',
  location: 'moc_pryd06', minRespawnTimeScheduleInSeconds: 3600,
  maxRespawnTimeScheduleInSeconds: 4200, imageUrl: '', alias: ['AR'],
};

function makeEntry(overrides: Partial<MvpTrackerEntry> = {}): MvpTrackerEntry {
  const nowSec = Math.floor(Date.now() / 1000);
  return {
    id: crypto.randomUUID(), boss: MOCK_BOSS,
    deathTime: nowSec - 3600, minRespawnTime: nowSec + 3600, maxRespawnTime: nowSec + 4200,
    fiveMinWarningSent: false, status: 'tracking', ...overrides,
  };
}

describe('MvpTimerService', () => {
  let service: MvpTimerService;
  let storageSpy: jasmine.SpyObj<StorageService>;

  beforeEach(fakeAsync(() => {
    storageSpy = jasmine.createSpyObj('StorageService', ['readState', 'writeState']);
    storageSpy.readState.and.returnValue(Promise.resolve(null));
    storageSpy.writeState.and.returnValue(Promise.resolve());

    const tzSpy = jasmine.createSpyObj('AppSettingsService', [], {
      serverTimezone: jasmine.createSpy().and.returnValue('America/Sao_Paulo'),
      displayTimezone: jasmine.createSpy().and.returnValue('Europe/Madrid'),
      customAudioPath: jasmine.createSpy().and.returnValue(null),
      locale: jasmine.createSpy().and.returnValue('en'),
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageSpy },
        { provide: AppSettingsService, useValue: tzSpy },
      ],
    });
    service = TestBed.inject(MvpTimerService);
    flushMicrotasks();
  }));

  afterEach(() => { service.ngOnDestroy(); });

  describe('addMvp', () => {
    it('calculates minRespawnTime as deathTime + minRespawnSchedule', fakeAsync(() => {
      const before = Math.floor(Date.now() / 1000);
      service.addMvp(MOCK_BOSS);
      const entry = service.activeEntries()[0];

      expect(entry.deathTime).toBeGreaterThanOrEqual(before);
      expect(entry.minRespawnTime).toBe(entry.deathTime + MOCK_BOSS.minRespawnTimeScheduleInSeconds);
      expect(entry.maxRespawnTime).toBe(entry.deathTime + MOCK_BOSS.maxRespawnTimeScheduleInSeconds);
      expect(entry.fiveMinWarningSent).toBeFalse();
      discardPeriodicTasks();
    }));

    it('persists state after adding', fakeAsync(() => {
      service.addMvp(MOCK_BOSS);
      expect(storageSpy.writeState).toHaveBeenCalled();
      discardPeriodicTasks();
    }));

    it('supports multiple concurrent entries', fakeAsync(() => {
      service.addMvp(MOCK_BOSS);
      service.addMvp(MOCK_BOSS);
      expect(service.activeEntries().length).toBe(2);
      discardPeriodicTasks();
    }));
  });

  describe('clearMvp', () => {
    it('removes the entry by id', fakeAsync(() => {
      service.addMvp(MOCK_BOSS);
      service.clearMvp(service.activeEntries()[0].id);
      expect(service.activeEntries().length).toBe(0);
      discardPeriodicTasks();
    }));

    it('only removes the specified entry', fakeAsync(() => {
      service.addMvp(MOCK_BOSS);
      service.addMvp(MOCK_BOSS);
      service.clearMvp(service.activeEntries()[0].id);
      expect(service.activeEntries().length).toBe(1);
      discardPeriodicTasks();
    }));
  });

  describe('checkEntries (timer logic)', () => {
    it('emits fiveMinWarning$ and sets fiveMinWarningSent for entry in warning window', () => {
      const nowSec = Math.floor(Date.now() / 1000);
      const entry = makeEntry({ minRespawnTime: nowSec + 4 * 60, maxRespawnTime: nowSec + 11 * 60 });
      (service as any)._entries.set([entry]);

      const warnings: MvpTrackerEntry[] = [];
      service.fiveMinWarning$.subscribe((e) => warnings.push(e));

      (service as any).checkEntries(nowSec);

      expect(warnings.length).toBe(1);
      expect(service.activeEntries()[0].fiveMinWarningSent).toBeTrue();
    });

    it('does not emit fiveMinWarning$ twice for the same entry', () => {
      const nowSec = Math.floor(Date.now() / 1000);
      const entry = makeEntry({ minRespawnTime: nowSec + 4 * 60, maxRespawnTime: nowSec + 11 * 60 });
      (service as any)._entries.set([entry]);

      const warnings: MvpTrackerEntry[] = [];
      service.fiveMinWarning$.subscribe((e) => warnings.push(e));

      (service as any).checkEntries(nowSec);
      (service as any).checkEntries(nowSec + 30);

      expect(warnings.length).toBe(1);
    });

    it('emits respawnReady$ and removes entry when minRespawnTime reached', () => {
      const nowSec = Math.floor(Date.now() / 1000);
      const entry = makeEntry({ minRespawnTime: nowSec - 1, fiveMinWarningSent: true });
      (service as any)._entries.set([entry]);

      const readyIds: string[] = [];
      service.respawnReady$.subscribe((e) => readyIds.push(e.id));

      (service as any).checkEntries(nowSec);

      expect(readyIds).toContain(entry.id);
      // Ready entries stay visible until the user manually clears them
      expect(service.activeEntries().length).toBe(1);
      expect(service.activeEntries()[0].status).toBe('ready');
    });

    it('does not emit warning when entry is outside 5-min window', () => {
      const nowSec = Math.floor(Date.now() / 1000);
      const entry = makeEntry({ minRespawnTime: nowSec + 10 * 60 });
      (service as any)._entries.set([entry]);

      const warnings: MvpTrackerEntry[] = [];
      service.fiveMinWarning$.subscribe((e) => warnings.push(e));

      (service as any).checkEntries(nowSec);

      expect(warnings.length).toBe(0);
    });
  });

  describe('restore on init', () => {
    it('discards expired entries via direct init() call', fakeAsync(() => {
      const expiredEntry = makeEntry({ maxRespawnTime: 1000 });
      storageSpy.readState.and.returnValue(Promise.resolve({
        activeEntries: [expiredEntry],
        serverTimezone: 'America/Sao_Paulo',
        displayTimezone: 'Europe/Madrid',
      }));

      (service as any)._entries.set([]);
      (service as any).init();
      flushMicrotasks();

      expect(service.activeEntries().length).toBe(0);
      discardPeriodicTasks();
    }));

    it('keeps valid future entries via direct init() call', fakeAsync(() => {
      const nowSec = Math.floor(Date.now() / 1000);
      const validEntry = makeEntry({ maxRespawnTime: nowSec + 7200 });
      storageSpy.readState.and.returnValue(Promise.resolve({
        activeEntries: [validEntry],
        serverTimezone: 'America/Sao_Paulo',
        displayTimezone: 'Europe/Madrid',
      }));

      (service as any)._entries.set([]);
      (service as any).init();
      flushMicrotasks();

      expect(service.activeEntries().length).toBe(1);
      discardPeriodicTasks();
    }));
  });
});
