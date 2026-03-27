import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NotificationService } from './core/services/notification.service';
import { LocaleService } from './core/services/locale.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  // Eagerly inject NotificationService so it subscribes to timer events at startup
  private readonly notifications = inject(NotificationService);
  readonly locale = inject(LocaleService);

  readonly t = this.locale.t.bind(this.locale);

  ngOnInit(): void {
    // NotificationService is initialized via injection; nothing else needed here.
  }

  openKoFi(): void {
    if (window.electronAPI) {
      window.electronAPI.openExternal();
    } else {
      window.open('https://ko-fi.com/sarjador', '_blank');
    }
  }
}
