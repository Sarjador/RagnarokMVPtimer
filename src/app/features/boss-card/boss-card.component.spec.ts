import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BossCardComponent } from './boss-card.component';
import { BossEntry } from '../../core/models/boss.model';
import { LocaleService } from '../../core/services/locale.service';
import { AppSettingsService } from '../../core/services/app-settings.service';
import { signal } from '@angular/core';

function makeBoss(overrides: Partial<BossEntry> = {}): BossEntry {
  return {
    ID: 1,
    bossName: 'Eddga',
    HP: 100000,
    race: 'Brute',
    property: 'Fire 1',
    location: 'Payon Forest',
    minRespawnTimeScheduleInSeconds: 3600,
    maxRespawnTimeScheduleInSeconds: 7200,
    imageUrl: 'https://example.com/eddga.png',
    alias: ['fire cat'],
    ...overrides,
  };
}

describe('BossCardComponent', () => {
  let fixture: ComponentFixture<BossCardComponent>;
  let component: BossCardComponent;

  beforeEach(async () => {
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
      imports: [BossCardComponent],
      providers: [
        { provide: AppSettingsService, useValue: appSettingsSpy },
        { provide: LocaleService, useValue: localeSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BossCardComponent);
    component = fixture.componentRef.setInput('boss', makeBoss()) as unknown as BossCardComponent;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the boss name', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.card-name')?.textContent).toContain('Eddga');
  });

  it('emits select when card body is clicked', () => {
    let emitted: BossEntry | undefined;
    component.select.subscribe((b: BossEntry) => (emitted = b));
    fixture.nativeElement.querySelector('.boss-card').click();
    expect(emitted?.bossName).toBe('Eddga');
  });

  it('emits select when Track button is clicked', () => {
    let emitted: BossEntry | undefined;
    component.select.subscribe((b: BossEntry) => (emitted = b));
    fixture.nativeElement.querySelector('.card-track-btn').click();
    expect(emitted?.bossName).toBe('Eddga');
  });

  it('shows placeholder on image error', () => {
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    img.dispatchEvent(new Event('error'));
    expect(img.src).toContain('boss-placeholder.svg');
  });

  it('shows respawn range as "Xm – Ym" when min != max', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.card-respawn')?.textContent).toContain('60m – 120m');
  });
});
