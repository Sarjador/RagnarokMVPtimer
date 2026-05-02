import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BossCatalogService } from './boss-catalog.service';

describe('BossCatalogService', () => {
  let service: BossCatalogService;

  beforeEach(() => {
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
    expect(service.bosses().length).toBeGreaterThan(0);
    expect(service.loaded()).toBeTrue();
  }));

  describe('search', () => {
    beforeEach(fakeAsync(() => loadInFakeAsync()));

    it('returns full list on empty query', () => {
      expect(service.search('').length).toBe(service.bosses().length);
    });

    it('matches by partial boss name (case-insensitive)', () => {
      const results = service.search('amon');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].bossName).toBe('Amon Ra');
    });

    it('matches by alias (case-insensitive)', () => {
      const results = service.search('baph');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].bossName).toBe('Baphomet');
    });

    it('returns empty array when no match', () => {
      expect(service.search('zznotexist').length).toBe(0);
    });

    it('is case-insensitive', () => {
      expect(service.search('BAPHOMET').length).toBeGreaterThan(0);
      expect(service.search('baphomet').length).toBeGreaterThan(0);
    });
  });
});
