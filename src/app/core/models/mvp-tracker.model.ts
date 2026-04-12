import { BossEntry } from './boss.model';

/** Lifecycle state of a tracker entry */
export type MvpStatus = 'tracking' | 'warning' | 'ready';

export interface MvpTrackerEntry {
  /** Unique ID for this tracking instance */
  id: string;
  boss: BossEntry;
  /** Unix timestamp (seconds) when the boss died */
  deathTime: number;
  /** Unix timestamp (seconds) of minimum respawn time */
  minRespawnTime: number;
  /** Unix timestamp (seconds) of maximum respawn time */
  maxRespawnTime: number;
  /** True after the 5-minute warning has fired — prevents duplicate alerts */
  fiveMinWarningSent: boolean;
  /** Current lifecycle state — drives UI appearance and notification logic */
  status: MvpStatus;
}

export interface AppState {
  activeEntries: MvpTrackerEntry[];
  serverTimezone?: string;
  displayTimezone?: string;
  customAudioPath?: string;
  locale?: 'en' | 'es';
}
