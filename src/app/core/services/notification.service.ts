import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MvpTrackerEntry } from '../models/mvp-tracker.model';
import { MvpTimerService } from './mvp-timer.service';
import { AppSettingsService } from './app-settings.service';
import { LocaleService } from './locale.service';
import { formatUnixToTime } from '../utils/time-utils';

// Audio files to try in order (user can add any of these to public/audio/)
const AUDIO_CANDIDATES = [
  './audio/Murloc.mp3',
  './audio/alert.mp3',
  './audio/alert.ogg',
];

@Injectable({ providedIn: 'root' })
export class NotificationService implements OnDestroy {
  private readonly subs = new Subscription();
  private audioCtx: AudioContext | null = null;

  constructor(
    timerService: MvpTimerService,
    private readonly appSettings: AppSettingsService,
    private readonly locale: LocaleService,
  ) {
    this.subs.add(
      timerService.fiveMinWarning$.subscribe((entry) => this.onFiveMinWarning(entry)),
    );
    this.subs.add(
      timerService.respawnReady$.subscribe((entry) => this.onRespawnReady(entry)),
    );
  }

  private onFiveMinWarning(entry: MvpTrackerEntry): void {
    const displayTz = this.appSettings.displayTimezone();
    const minTime = formatUnixToTime(entry.minRespawnTime, displayTz);
    const maxTime = formatUnixToTime(entry.maxRespawnTime, displayTz);
    this.sendNotification(
      this.locale.ti('notif.warning-title', { boss: entry.boss.bossName }),
      this.locale.ti('notif.warning-body', { location: entry.boss.location, min: minTime, max: maxTime }),
      true,
    );
  }

  private onRespawnReady(entry: MvpTrackerEntry): void {
    const displayTz = this.appSettings.displayTimezone();
    const minTime = formatUnixToTime(entry.minRespawnTime, displayTz);
    this.sendNotification(
      this.locale.ti('notif.ready-title', { boss: entry.boss.bossName }),
      this.locale.ti('notif.ready-body', { location: entry.boss.location, min: minTime }),
      false,
    );
    this.playAlertSound();
  }

  /**
   * Sends a notification. In Electron, always goes through the main-process
   * IPC handler (most reliable path, works when window is minimized).
   * Falls back to Web Notification API when running in a browser.
   */
  private sendNotification(title: string, body: string, silent: boolean): void {
    if (window.electronAPI) {
      // Electron: delegate to main process — works regardless of focus/minimize state
      window.electronAPI.sendNotification({ title, body, silent }).catch((err) =>
        console.error('[Notifications] IPC error:', err),
      );
      return;
    }
    // Browser fallback
    if (typeof Notification === 'undefined') return;
    const send = () => new Notification(title, { body, silent });
    if (Notification.permission === 'granted') {
      send();
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((p) => { if (p === 'granted') send(); });
    }
  }

  /**
   * Plays an alert sound. Tries each bundled audio file in turn;
   * falls back to a synthesised Web-Audio beep if none is found.
   *
   * El path absoluto del audio personalizado NUNCA vive en el renderer:
   * se solicita al main process via IPC (audio:getPath) para evitar
   * exponer rutas del filesystem al contexto web.
   */
  private async playAlertSound(): Promise<void> {
    const hasCustom = !!this.appSettings.customAudioPath();
    if (hasCustom && window.electronAPI) {
      const fileUrl = await window.electronAPI.getAudioPath();
      const candidates = fileUrl ? [fileUrl, ...AUDIO_CANDIDATES] : AUDIO_CANDIDATES;
      this.tryPlayFile(candidates, 0);
    } else {
      this.tryPlayFile(AUDIO_CANDIDATES, 0);
    }
  }

  private tryPlayFile(candidates: string[], index: number): void {
    if (index >= candidates.length) {
      this.playBeep();
      return;
    }
    const audio = new Audio(candidates[index]);
    audio.volume = 0.7;
    audio.play().catch(() => this.tryPlayFile(candidates, index + 1));
  }

  private playBeep(): void {
    try {
      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        this.audioCtx = new AudioContext();
      }
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch (err) {
      console.warn('[NotificationService] Could not play fallback beep:', err);
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.audioCtx?.close();
  }
}
