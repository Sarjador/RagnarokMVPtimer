import {
  Component, output, inject, ChangeDetectionStrategy,
} from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { BossCatalogService } from '../../../core/services/boss-catalog.service';
import { LocaleService } from '../../../core/services/locale.service';

function maxGeMin(group: AbstractControl): ValidationErrors | null {
  const min = Number(group.get('minRespawnMin')?.value);
  const max = Number(group.get('maxRespawnMin')?.value);
  if (!isNaN(min) && !isNaN(max) && max < min) {
    return { maxLessThanMin: true };
  }
  return null;
}

@Component({
  selector: 'app-add-boss-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-boss-form.component.html',
  styleUrl: './add-boss-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBossFormComponent {
  private readonly catalog = inject(BossCatalogService);
  readonly locale = inject(LocaleService);
  readonly t = this.locale.t.bind(this.locale);

  readonly saved = output<void>();
  readonly cancelled = output<void>();

  readonly form = new FormGroup({
    bossName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(1)] }),
    minRespawnMin: new FormControl<number | null>(null, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]),
    maxRespawnMin: new FormControl<number | null>(null, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]),
    HP: new FormControl<number | null>(null, [Validators.min(0)]),
    race: new FormControl('', { nonNullable: true }),
    property: new FormControl('', { nonNullable: true }),
    location: new FormControl('', { nonNullable: true }),
    imageUrl: new FormControl('', { nonNullable: true }),
    alias: new FormControl('', { nonNullable: true }),
  }, { validators: maxGeMin });

  get nameInvalid(): boolean {
    const c = this.form.get('bossName')!;
    return c.invalid && c.touched;
  }

  get minInvalid(): boolean {
    const c = this.form.get('minRespawnMin')!;
    return c.invalid && c.touched;
  }

  get maxInvalid(): boolean {
    const c = this.form.get('maxRespawnMin')!;
    return (c.invalid && c.touched) || (this.form.hasError('maxLessThanMin') && c.touched);
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const v = this.form.getRawValue();
    const aliasArr = v.alias
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    this.catalog.addCustomBoss({
      bossName: v.bossName.trim(),
      HP: v.HP ?? 0,
      race: v.race.trim(),
      property: v.property.trim(),
      location: v.location.trim(),
      minRespawnTimeScheduleInSeconds: Number(v.minRespawnMin) * 60,
      maxRespawnTimeScheduleInSeconds: Number(v.maxRespawnMin) * 60,
      imageUrl: v.imageUrl.trim(),
      alias: aliasArr,
    });

    this.form.reset();
    this.saved.emit();
  }

  cancel(): void {
    this.form.reset();
    this.cancelled.emit();
  }
}
