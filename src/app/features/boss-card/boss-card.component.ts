import { Component, input, output, ChangeDetectionStrategy, inject } from '@angular/core';
import { BossEntry } from '../../core/models/boss.model';
import { LocaleService } from '../../core/services/locale.service';

@Component({
  selector: 'app-boss-card',
  standalone: true,
  templateUrl: './boss-card.component.html',
  styleUrl: './boss-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BossCardComponent {
  readonly boss = input.required<BossEntry>();
  readonly select = output<BossEntry>();
  readonly deleteCard = output<BossEntry>();

  private readonly locale = inject(LocaleService);
  readonly t = this.locale.t.bind(this.locale);

  readonly placeholderUrl = 'images/boss-placeholder.svg';
  private errorHandled = false;

  onImgError(event: Event): void {
    if (this.errorHandled) return;
    this.errorHandled = true;
    const img = event.target as HTMLImageElement;
    img.src = this.placeholderUrl;
  }

  respawnRange(): string {
    const b = this.boss();
    const min = Math.floor(b.minRespawnTimeScheduleInSeconds / 60);
    const max = Math.floor(b.maxRespawnTimeScheduleInSeconds / 60);
    return min === max ? `${min}m` : `${min}m – ${max}m`;
  }

  onSelect(): void {
    this.select.emit(this.boss());
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.deleteCard.emit(this.boss());
  }
}
