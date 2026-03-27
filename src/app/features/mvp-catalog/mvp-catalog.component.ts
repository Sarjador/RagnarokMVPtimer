import { Component, computed, signal, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BossEntry } from '../../core/models/boss.model';
import { BossCatalogService } from '../../core/services/boss-catalog.service';
import { LocaleService } from '../../core/services/locale.service';
import { BossCardComponent } from '../boss-card/boss-card.component';

@Component({
  selector: 'app-mvp-catalog',
  standalone: true,
  imports: [FormsModule, BossCardComponent],
  templateUrl: './mvp-catalog.component.html',
  styleUrl: './mvp-catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MvpCatalogComponent {
  readonly bossSelected = output<BossEntry>();

  private readonly catalog = inject(BossCatalogService);
  private readonly locale = inject(LocaleService);
  readonly t = this.locale.t.bind(this.locale);

  readonly filterQuery = signal('');

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
}
