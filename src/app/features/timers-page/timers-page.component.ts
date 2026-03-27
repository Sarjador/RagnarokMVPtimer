import {
  Component, ChangeDetectionStrategy, signal, ViewChild, inject, ChangeDetectorRef,
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
  @ViewChild(BossSearchComponent) private bossSearch?: BossSearchComponent;

  private readonly locale = inject(LocaleService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly t = this.locale.t.bind(this.locale);

  readonly activeTab = signal<ActiveTab>('catalog');

  setTab(tab: ActiveTab): void {
    this.activeTab.set(tab);
  }

  onBossSelected(boss: BossEntry): void {
    this.activeTab.set('active');
    // detectChanges() forces Angular to render the @if block synchronously,
    // resolving the @ViewChild before we call prefillBoss.
    this.cdr.detectChanges();
    this.bossSearch?.prefillBoss(boss);
  }
}
