import {
  Component, computed, signal, inject, ChangeDetectionStrategy, ViewChild, ElementRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BossEntry } from '../../core/models/boss.model';
import { BossCatalogService } from '../../core/services/boss-catalog.service';
import { MvpTimerService } from '../../core/services/mvp-timer.service';
import { LocaleService } from '../../core/services/locale.service';
import { isValidTimeFormat } from '../../core/utils/time-utils';

@Component({
  selector: 'app-boss-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './boss-search.component.html',
  styleUrl: './boss-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BossSearchComponent {
  @ViewChild('deathTimeInput') private deathTimeInputRef?: ElementRef<HTMLInputElement>;

  private readonly catalog = inject(BossCatalogService);
  private readonly timerService = inject(MvpTimerService);
  readonly locale = inject(LocaleService);

  readonly t = this.locale.t.bind(this.locale);

  readonly query = signal('');
  readonly deathTime = signal('');
  readonly selectedBoss = signal<BossEntry | null>(null);
  readonly timeError = signal('');
  readonly showDropdown = signal(false);

  readonly searchResults = computed(() => {
    const q = this.query();
    if (q.length < 1) return [];
    return this.catalog.search(q).slice(0, 10);
  });

  onQueryInput(value: string): void {
    this.query.set(value);
    this.selectedBoss.set(null);
    this.showDropdown.set(true);
    this.timeError.set('');
  }

  selectBoss(boss: BossEntry): void {
    this.selectedBoss.set(boss);
    this.query.set(boss.bossName);
    this.showDropdown.set(false);
  }

  onDeathTimeInput(value: string): void {
    this.deathTime.set(value);
    this.timeError.set('');
  }

  submit(): void {
    const boss = this.selectedBoss();
    if (!boss) return;

    const dt = this.deathTime().trim();
    if (dt && !isValidTimeFormat(dt)) {
      this.timeError.set(this.locale.t('boss-search.error-invalid-time'));
      return;
    }

    try {
      this.timerService.addMvp(boss, dt || undefined);
      this.query.set('');
      this.deathTime.set('');
      this.selectedBoss.set(null);
      this.timeError.set('');
    } catch (err: unknown) {
      this.timeError.set(err instanceof Error ? err.message : this.locale.t('boss-search.error-generic'));
    }
  }

  prefillBoss(boss: BossEntry): void {
    this.selectBoss(boss);
    this.timeError.set('');
    setTimeout(() => this.deathTimeInputRef?.nativeElement.focus(), 50);
  }

  closeDropdown(): void {
    setTimeout(() => this.showDropdown.set(false), 150);
  }

  respawnRange(boss: BossEntry): string {
    const min = Math.floor(boss.minRespawnTimeScheduleInSeconds / 60);
    const max = Math.floor(boss.maxRespawnTimeScheduleInSeconds / 60);
    return min === max ? `${min} min` : `${min}–${max} min`;
  }
}
