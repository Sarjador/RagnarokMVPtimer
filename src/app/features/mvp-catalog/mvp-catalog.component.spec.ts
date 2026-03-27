import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { MvpCatalogComponent } from './mvp-catalog.component';
import { BossCatalogService } from '../../core/services/boss-catalog.service';
import { LocaleService } from '../../core/services/locale.service';
import { AppSettingsService } from '../../core/services/app-settings.service';
import { BossEntry } from '../../core/models/boss.model';

function makeBoss(id: number, name: string, alias: string[] = []): BossEntry {
  return {
    ID: id, bossName: name, HP: 1000, race: 'Brute', property: 'Fire 1',
    location: 'Test', minRespawnTimeScheduleInSeconds: 60,
    maxRespawnTimeScheduleInSeconds: 120, imageUrl: '', alias,
  };
}

const BOSSES = [
  makeBoss(1, 'Eddga', ['fire cat']),
  makeBoss(2, 'Baphomet', ['bapho']),
  makeBoss(3, 'Dark Lord', []),
];

describe('MvpCatalogComponent', () => {
  let fixture: ComponentFixture<MvpCatalogComponent>;
  let component: MvpCatalogComponent;
  let bossesSignal: ReturnType<typeof signal<BossEntry[]>>;

  beforeEach(async () => {
    bossesSignal = signal<BossEntry[]>(BOSSES);

    const catalogSpy = jasmine.createSpyObj('BossCatalogService', ['search'], {
      bosses: bossesSignal.asReadonly(),
    });

    const appSettingsSpy = jasmine.createSpyObj('AppSettingsService', [], {
      locale: signal('en'),
      displayTimezone: signal('UTC'),
      serverTimezone: signal('UTC'),
      customAudioPath: signal(null),
    });

    const localeSpy = jasmine.createSpyObj('LocaleService', ['t', 'ti'], {
      locale: signal('en'),
    });
    localeSpy.t.and.callFake((key: string) => key);
    localeSpy.ti.and.callFake((key: string) => key);

    await TestBed.configureTestingModule({
      imports: [MvpCatalogComponent],
      providers: [
        { provide: BossCatalogService, useValue: catalogSpy },
        { provide: AppSettingsService, useValue: appSettingsSpy },
        { provide: LocaleService, useValue: localeSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MvpCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows all bosses when filter is empty', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-boss-card');
    expect(cards.length).toBe(3);
  });

  it('filters by boss name (case-insensitive)', () => {
    component.filterQuery.set('eddga');
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('app-boss-card');
    expect(cards.length).toBe(1);
  });

  it('filters by alias', () => {
    component.filterQuery.set('bapho');
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('app-boss-card');
    expect(cards.length).toBe(1);
  });

  it('shows empty state when no match', () => {
    component.filterQuery.set('zzznomatch');
    fixture.detectChanges();
    const empty = fixture.nativeElement.querySelector('.catalog-empty');
    expect(empty).toBeTruthy();
    const cards = fixture.nativeElement.querySelectorAll('app-boss-card');
    expect(cards.length).toBe(0);
  });

  it('shows all bosses again when filter is cleared', () => {
    component.filterQuery.set('eddga');
    fixture.detectChanges();
    component.filterQuery.set('');
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('app-boss-card');
    expect(cards.length).toBe(3);
  });

  it('emits bossSelected when a card emits select', () => {
    let emitted: BossEntry | undefined;
    component.bossSelected.subscribe((b: BossEntry) => (emitted = b));
    component.onBossCardSelect(BOSSES[0]);
    expect(emitted?.bossName).toBe('Eddga');
  });
});
