import { Injectable, signal, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { BossEntry } from '../models/boss.model';
import { MvpTrackerEntry, MvpStatus, AppState } from '../models/mvp-tracker.model';
import { timeStringToUnix } from '../utils/time-utils';
import { StorageService } from './storage.service';
import { AppSettingsService } from './app-settings.service';

const FIVE_MIN_SECS = 5 * 60;
const POLL_INTERVAL_MS = 1000;

@Injectable({ providedIn: 'root' })
export class MvpTimerService implements OnDestroy {
  private readonly _entries = signal<MvpTrackerEntry[]>([]);
  /** Current wall-clock time in ms — updated every second by the timer loop */
  readonly currentTimeMs = signal(Date.now());

  /** Emits the entry when its 5-minute warning fires */
  readonly fiveMinWarning$ = new Subject<MvpTrackerEntry>();
  /** Emits the entry when it first reaches its respawn time */
  readonly respawnReady$ = new Subject<MvpTrackerEntry>();

  readonly activeEntries = this._entries.asReadonly();

  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly storage: StorageService,
    private readonly appSettings: AppSettingsService,
  ) {
    this.init();
  }

  async init(): Promise<void> {
    const state = await this.storage.readState();
    if (state?.activeEntries) {
      const now = Date.now() / 1000;
      const valid = state.activeEntries
        // Discard entries past their max respawn window
        .filter((e) => e.maxRespawnTime > now || e.status === 'ready')
        // Ensure status field exists for state persisted before this field was added
        .map((e) => ({ ...e, status: e.status ?? ('tracking' as MvpStatus) }));
      this._entries.set(valid);
    }
    this.startLoop();
  }

  /**
   * Adds an MVP tracker entry. If `deathTimeHHmm` is provided it is parsed in
   * the current serverTimezone; otherwise the current time is used.
   */
  addMvp(boss: BossEntry, deathTimeHHmm?: string): void {
    const serverTz = this.appSettings.serverTimezone();
    const deathTime = deathTimeHHmm
      ? timeStringToUnix(deathTimeHHmm, serverTz)
      : Math.floor(Date.now() / 1000);

    const entry: MvpTrackerEntry = {
      id: crypto.randomUUID(),
      boss,
      deathTime,
      minRespawnTime: deathTime + boss.minRespawnTimeScheduleInSeconds,
      maxRespawnTime: deathTime + boss.maxRespawnTimeScheduleInSeconds,
      fiveMinWarningSent: false,
      status: 'tracking',
    };

    this._entries.update((prev) => [...prev, entry]);
    this.persist();
  }

  /** Removes a tracker entry by ID (works for any status). */
  clearMvp(id: string): void {
    this._entries.update((prev) => prev.filter((e) => e.id !== id));
    this.persist();
  }

  /** Removes all active tracker entries. */
  clearAll(): void {
    this._entries.set([]);
    this.persist();
  }

  startLoop(): void {
    if (this.intervalId !== null) return; // prevent double-start
    this.intervalId = setInterval(() => {
      const nowMs = Date.now();
      this.currentTimeMs.set(nowMs);
      this.checkEntries(nowMs / 1000);
    }, POLL_INTERVAL_MS);
  }

  checkEntries(nowSec: number): void {
    let changed = false;
    const updated: MvpTrackerEntry[] = [];

    for (const entry of this._entries()) {
      // Already in 'ready' state — keep it visible until user clears it
      if (entry.status === 'ready') {
        updated.push(entry);
        continue;
      }

      // Transition to 'ready': min respawn time reached
      if (nowSec >= entry.minRespawnTime) {
        const readyEntry: MvpTrackerEntry = { ...entry, status: 'ready' };
        this.respawnReady$.next(readyEntry);
        updated.push(readyEntry);
        changed = true;
        continue;
      }

      // Transition to 'warning': 5 minutes before min respawn
      if (!entry.fiveMinWarningSent && nowSec >= entry.minRespawnTime - FIVE_MIN_SECS) {
        const warned: MvpTrackerEntry = { ...entry, fiveMinWarningSent: true, status: 'warning' };
        this.fiveMinWarning$.next(warned);
        updated.push(warned);
        changed = true;
        continue;
      }

      updated.push(entry);
    }

    if (changed) {
      this._entries.set(updated);
      this.persist();
    }
  }

  private persist(): void {
    const state: AppState = {
      activeEntries: this._entries(),
      serverTimezone: this.appSettings.serverTimezone(),
      displayTimezone: this.appSettings.displayTimezone(),
      customAudioPath: this.appSettings.customAudioPath() ?? undefined,
      locale: this.appSettings.locale(),
    };
    this.storage.writeState(state);
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.fiveMinWarning$.complete();
    this.respawnReady$.complete();
  }
}
