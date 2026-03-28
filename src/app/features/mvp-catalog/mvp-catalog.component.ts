import { Component, computed, signal, output, inject, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BossEntry } from '../../core/models/boss.model';
import { BossCatalogService } from '../../core/services/boss-catalog.service';
import { MvpTimerService } from '../../core/services/mvp-timer.service';
import { LocaleService } from '../../core/services/locale.service';
import { BossCardComponent } from '../boss-card/boss-card.component';
import { AddBossFormComponent } from '../boss-search/add-boss-form/add-boss-form.component';

@Component({
  selector: 'app-mvp-catalog',
  standalone: true,
  imports: [FormsModule, BossCardComponent, AddBossFormComponent],
  templateUrl: './mvp-catalog.component.html',
  styleUrl: './mvp-catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MvpCatalogComponent {
  readonly bossSelected = output<BossEntry>();

  private readonly catalog = inject(BossCatalogService);
  private readonly timerService = inject(MvpTimerService);
  private readonly locale = inject(LocaleService);
  readonly t = this.locale.t.bind(this.locale);

  @ViewChild('addFormAnchor') addFormAnchorRef?: ElementRef;
  @ViewChild('addCardBtn') addCardBtnRef?: ElementRef;

  readonly filterQuery = signal('');
  readonly showAddForm = signal(false);

  readonly filteredBosses = computed(() => {
    const q = this.filterQuery().trim().toLowerCase();
    // Reading locale() ensures re-evaluation when locale changes (OnPush)
    void this.locale.locale();
    if (!q) return this.catalog.bosses();
    return this.catalog.bosses().filter((b) =>
      b.bossName.toLowerCase().includes(q) ||
      b.alias.some((a) => a.toLowerCase().includes(q)),
    );
  });

  onFilterInput(value: string): void {
    this.filterQuery.set(value);
  }

  onBossCardSelect(boss: BossEntry): void {
    this.bossSelected.emit(boss);
  }

  onBossCardDelete(boss: BossEntry): void {
    if (!boss.isCustom) return;
    if (!confirm(`Delete custom boss "${boss.bossName}"?`)) return;
    this.catalog.deleteCustomBoss(boss.ID);
    this.timerService.clearByBossId(boss.ID);
  }

  openAddForm(): void {
    this.showAddForm.set(true);
    setTimeout(() => this.addFormAnchorRef?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  }

  onBossSaved(): void {
    this.showAddForm.set(false);
    setTimeout(() => this.addCardBtnRef?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
  }

  onFormCancelled(): void {
    this.showAddForm.set(false);
    setTimeout(() => this.addCardBtnRef?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
  }
}
