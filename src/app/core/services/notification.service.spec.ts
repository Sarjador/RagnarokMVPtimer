import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { NotificationService } from './notification.service';
import { MvpTimerService } from './mvp-timer.service';
import { AppSettingsService } from './app-settings.service';
import { LocaleService } from './locale.service';
import { MvpTrackerEntry } from '../models/mvp-tracker.model';

function makeEntry(): MvpTrackerEntry {
  return {
    id: '1',
    boss: {
      ID: 1, bossName: 'Test', HP: 1000, race: 'Demi-Human', property: 'Fire 1',
      location: 'test', minRespawnTimeScheduleInSeconds: 300,
      maxRespawnTimeScheduleInSeconds: 600, imageUrl: '', alias: [],
    },
    deathTime: 0, minRespawnTime: 300, maxRespawnTime: 600,
    fiveMinWarningSent: false, status: 'tracking',
  };
}

describe('NotificationService', () => {
  let fiveMinWarning$: Subject<MvpTrackerEntry>;
  let respawnReady$: Subject<MvpTrackerEntry>;
  let timerSpy: jasmine.SpyObj<MvpTimerService>;
  let appSettingsSpy: jasmine.SpyObj<AppSettingsService>;
  let localeSpy: jasmine.SpyObj<LocaleService>;

  beforeEach(() => {
    fiveMinWarning$ = new Subject();
    respawnReady$ = new Subject();

    timerSpy = jasmine.createSpyObj('MvpTimerService', [], {
      fiveMinWarning$,
      respawnReady$,
    });

    appSettingsSpy = jasmine.createSpyObj('AppSettingsService', [], {
      displayTimezone: jasmine.createSpy().and.returnValue('UTC'),
      customAudioPath: jasmine.createSpy().and.returnValue(null),
    });

    localeSpy = jasmine.createSpyObj('LocaleService', ['t', 'ti'], {
      locale: jasmine.createSpy().and.returnValue('en'),
    });
    localeSpy.t.and.callFake((key: string) => key);
    localeSpy.ti.and.callFake((key: string) => key);

    TestBed.configureTestingModule({
      providers: [
        { provide: MvpTimerService, useValue: timerSpy },
        { provide: AppSettingsService, useValue: appSettingsSpy },
        { provide: LocaleService, useValue: localeSpy },
      ],
    });

    // Eagerly instantiate to subscribe to subjects
    TestBed.inject(NotificationService);
  });

  it('creates without error', () => {
    const svc = TestBed.inject(NotificationService);
    expect(svc).toBeTruthy();
  });

  it('uses built-in candidates when customAudioPath is null', () => {
    const audioSpy = spyOn(window, 'Audio').and.returnValue({
      volume: 0,
      play: jasmine.createSpy('play').and.returnValue(Promise.resolve()),
    } as any);

    const svc = TestBed.inject(NotificationService);
    (svc as any).playAlertSound();

    expect(audioSpy).toHaveBeenCalledWith(jasmine.stringMatching(/Murloc\.mp3/));
  });

  it('prepends custom path when customAudioPath is set', () => {
    appSettingsSpy.customAudioPath.and.returnValue('C:\\sounds\\my-alert.mp3');

    const audioSpy = spyOn(window, 'Audio').and.returnValue({
      volume: 0,
      play: jasmine.createSpy('play').and.returnValue(Promise.resolve()),
    } as any);

    const svc = TestBed.inject(NotificationService);
    (svc as any).playAlertSound();

    expect(audioSpy.calls.first().args[0]).toContain('C:/sounds/my-alert.mp3');
  });
});
