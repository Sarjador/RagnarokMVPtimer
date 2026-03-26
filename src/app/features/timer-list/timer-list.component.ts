import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { MvpTimerService } from '../../core/services/mvp-timer.service';
import { AppSettingsService } from '../../core/services/app-settings.service';
import { LocaleService } from '../../core/services/locale.service';
import { MvpTrackerEntry, MvpStatus } from '../../core/models/mvp-tracker.model';
import { formatUnixToTime, formatCountdown, remainingMs } from '../../core/utils/time-utils';

interface DisplayEntry {
  raw: MvpTrackerEntry;
  status: MvpStatus;
  minTime: string;
  maxTime: string;
  countdown: string;
}

@Component({
  selector: 'app-timer-list',
  standalone: true,
  imports: [],
  templateUrl: './timer-list.component.html',
  styleUrl: './timer-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerListComponent {
  private readonly timerService = inject(MvpTimerService);
  private readonly tzSettings = inject(AppSettingsService);
  readonly locale = inject(LocaleService);

  readonly t = this.locale.t.bind(this.locale);

  readonly displayEntries = computed<DisplayEntry[]>(() => {
    // Reading currentTimeMs ensures the computed refreshes every second
    this.timerService.currentTimeMs();
    // Reading locale() ensures re-render on locale change
    this.locale.locale();
    const displayTz = this.tzSettings.displayTimezone();

    return this.timerService.activeEntries().map((entry) => ({
      raw: entry,
      status: entry.status,
      minTime: formatUnixToTime(entry.minRespawnTime, displayTz),
      maxTime: formatUnixToTime(entry.maxRespawnTime, displayTz),
      countdown: entry.status === 'ready' ? this.locale.t('timer-list.ready') : formatCountdown(remainingMs(entry.minRespawnTime)),
    }));
  });

  clear(id: string): void {
    this.timerService.clearMvp(id);
  }

  clearAll(): void {
    this.timerService.clearAll();
  }

  trackById(_: number, item: DisplayEntry): string {
    return item.raw.id;
  }
}
