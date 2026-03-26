import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BossSearchComponent } from '../boss-search/boss-search.component';
import { TimerListComponent } from '../timer-list/timer-list.component';

@Component({
  selector: 'app-timers-page',
  standalone: true,
  imports: [BossSearchComponent, TimerListComponent],
  templateUrl: './timers-page.component.html',
  styleUrl: './timers-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimersPageComponent {}
