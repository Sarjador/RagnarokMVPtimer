import {
  Component, ChangeDetectionStrategy, signal, inject,
} from '@angular/core';
import { BossEntry } from '../../core/models/boss.model';
import { LocaleService } from '../../core/services/locale.service';
import { BossSearchComponent } from '../boss-search/boss-search.component';
import { TimerListComponent } from '../timer-list/timer-list.component';
import { MvpCatalogComponent } from '../mvp-catalog/mvp-catalog.component';

export type ActiveTab = 'catalog' | 'active';

@Component({
  selector: 'app-timers-page',
  standalone: true,
  imports: [BossSearchComponent, TimerListComponent, MvpCatalogComponent],
  templateUrl: './timers-page.component.html',
  styleUrl: './timers-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimersPageComponent {
  private readonly locale = inject(LocaleService);
  readonly t = this.locale.t.bind(this.locale);

  readonly activeTab = signal<ActiveTab>('catalog');
  readonly prefillBoss = signal<BossEntry | null>(null);

  setTab(tab: ActiveTab): void {
    this.activeTab.set(tab);
  }

  onBossSelected(boss: BossEntry): void {
    this.activeTab.set('active');
    this.prefillBoss.set(boss);
  }
}
