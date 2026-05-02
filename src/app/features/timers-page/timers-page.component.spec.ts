import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { signal } from '@angular/core';
import { TimersPageComponent } from './timers-page.component';
import { BossCatalogService } from '../../core/services/boss-catalog.service';
import { MvpTimerService } from '../../core/services/mvp-timer.service';
import { AppSettingsService } from '../../core/services/app-settings.service';
import { LocaleService } from '../../core/services/locale.service';
import { BossEntry } from '../../core/models/boss.model';

function makeBoss(): BossEntry {
  return {
    ID: 1, bossName: 'Eddga', HP: 1000, race: 'Brute', property: 'Fire 1',
    location: 'Payon', minRespawnTimeScheduleInSeconds: 60,
    maxRespawnTimeScheduleInSeconds: 120, imageUrl: '', alias: [],
  };
}

describe('TimersPageComponent', () => {
  let fixture: ComponentFixture<TimersPageComponent>;
  let component: TimersPageComponent;

  beforeEach(async () => {
    const catalogSpy = jasmine.createSpyObj('BossCatalogService', ['search', 'findById'], {
      bosses: signal([makeBoss()]).asReadonly(),
    });

    const timerSpy = jasmine.createSpyObj('MvpTimerService', ['addMvp', 'removeMvp', 'clearAll'], {
      activeEntries: signal([]).asReadonly(),
      currentTimeMs: signal(Date.now()),
      fiveMinWarning$: { subscribe: () => ({ unsubscribe: () => {} }) },
      respawnReady$: { subscribe: () => ({ unsubscribe: () => {} }) },
    });

    const appSettingsSpy = jasmine.createSpyObj('AppSettingsService', ['setLocale'], {
      locale: signal('en'),
      displayTimezone: signal('UTC'),
      serverTimezone: signal('UTC'),
      customAudioPath: signal(null),
    });

    const localeSpy = jasmine.createSpyObj('LocaleService', ['t', 'ti', 'setLocale'], {
      locale: signal('en'),
    });
    localeSpy.t.and.callFake((key: string) => key);
    localeSpy.ti.and.callFake((key: string) => key);

    await TestBed.configureTestingModule({
      imports: [TimersPageComponent],
      providers: [
        { provide: BossCatalogService, useValue: catalogSpy },
        { provide: MvpTimerService, useValue: timerSpy },
        { provide: AppSettingsService, useValue: appSettingsSpy },
        { provide: LocaleService, useValue: localeSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TimersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('defaults to the catalog tab', () => {
    expect(component.activeTab()).toBe('catalog');
  });

  it('renders the catalog panel by default', () => {
    const panel = fixture.nativeElement.querySelector('app-mvp-catalog');
    expect(panel).toBeTruthy();
  });

  it('switches to active timers tab when tab button is clicked', () => {
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.tab-btn');
    buttons[1].click();
    fixture.detectChanges();
    expect(component.activeTab()).toBe('active');
    expect(fixture.nativeElement.querySelector('app-boss-search')).toBeTruthy();
  });

  it('onBossSelected switches to active tab', fakeAsync(() => {
    component.onBossSelected(makeBoss());
    tick(0);
    fixture.detectChanges();
    expect(component.activeTab()).toBe('active');
  }));
});
