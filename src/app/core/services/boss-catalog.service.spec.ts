import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BossCatalogService } from './boss-catalog.service';
import { BossEntry } from '../models/boss.model';

const MOCK_BOSSES: BossEntry[] = [
  {
    ID: 1511, bossName: 'Amon Ra', HP: 1214138, race: 'Demi-Human', property: 'Fire 3',
    location: 'moc_pryd06', minRespawnTimeScheduleInSeconds: 3600,
    maxRespawnTimeScheduleInSeconds: 4200, imageUrl: '', alias: ['AR'],
  },
  {
    ID: 1112, bossName: 'Baphomet', HP: 3632000, race: 'Demon', property: 'Dark 3',
    location: 'prt_maze03', minRespawnTimeScheduleInSeconds: 7200,
    maxRespawnTimeScheduleInSeconds: 7800, imageUrl: '', alias: ['Baph', 'Bap'],
  },
  {
    ID: 1373, bossName: 'Dark Lord', HP: 3632000, race: 'Undead', property: 'Dark 3',
    location: 'gl_chyard', minRespawnTimeScheduleInSeconds: 7200,
    maxRespawnTimeScheduleInSeconds: 7800, imageUrl: '', alias: ['DL'],
  },
];

function setupFetchSpy(): void {
  spyOn(window, 'fetch').and.returnValue(
    Promise.resolve({
      json: () => Promise.resolve({ bosses: MOCK_BOSSES }),
    } as Response),
  );
}

describe('BossCatalogService', () => {
  let service: BossCatalogService;

  beforeEach(() => {
    setupFetchSpy();
    TestBed.configureTestingModule({});
    service = TestBed.inject(BossCatalogService);
  });

  /** Re-trigger loadCatalog inside fakeAsync so tick() can flush the Promises */
  function loadInFakeAsync(): void {
    (service as any)._bosses.set([]);
    (service as any)._loaded.set(false);
    (service as any).loadCatalog();
    tick(); // flush two levels of Promise.resolve
    tick();
  }

  it('loads catalog on init', fakeAsync(() => {
    loadInFakeAsync();
    expect(service.bosses().length).toBe(3);
    expect(service.loaded()).toBeTrue();
  }));

  describe('search', () => {
    beforeEach(fakeAsync(() => loadInFakeAsync()));

    it('returns full list on empty query', () => {
      expect(service.search('').length).toBe(3);
    });

    it('matches by partial boss name (case-insensitive)', () => {
      const results = service.search('amon');
      expect(results.length).toBe(1);
      expect(results[0].bossName).toBe('Amon Ra');
    });

    it('matches by alias (case-insensitive)', () => {
      const results = service.search('baph');
      expect(results.length).toBe(1);
      expect(results[0].bossName).toBe('Baphomet');
    });

    it('returns empty array when no match', () => {
      expect(service.search('zznotexist').length).toBe(0);
    });

    it('is case-insensitive', () => {
      expect(service.search('BAPHOMET').length).toBe(1);
      expect(service.search('baphomet').length).toBe(1);
    });
  });
});
