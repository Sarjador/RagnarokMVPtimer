import { Injectable, signal, computed } from '@angular/core';
import { BossEntry } from '../models/boss.model';

interface BossListJson {
  bosses: BossEntry[];
}

@Injectable({ providedIn: 'root' })
export class BossCatalogService {
  private readonly _bosses = signal<BossEntry[]>([]);
  private readonly _loaded = signal(false);

  /** All bosses from the catalog. Empty until catalog is loaded. */
  readonly bosses = this._bosses.asReadonly();
  readonly loaded = this._loaded.asReadonly();

  constructor() {
    this.loadCatalog();
  }

  private async loadCatalog(): Promise<void> {
    try {
      const response = await fetch('./data/bossList.json');
      const data: BossListJson = await response.json();
      // Strip runtime-state fields; keep only static boss info
      const entries = data.bosses.map(({ ID, bossName, HP, race, property, location,
        minRespawnTimeScheduleInSeconds, maxRespawnTimeScheduleInSeconds,
        imageUrl, alias }) => ({
        ID, bossName, HP, race, property, location,
        minRespawnTimeScheduleInSeconds, maxRespawnTimeScheduleInSeconds,
        imageUrl, alias: alias ?? [],
      }));
      this._bosses.set(entries);
      this._loaded.set(true);
    } catch (err) {
      console.error('[BossCatalogService] Failed to load boss catalog:', err);
    }
  }

  /**
   * Case-insensitive partial match on `bossName` and `alias`.
   * Empty query returns the full list.
   */
  search(query: string): BossEntry[] {
    const q = query.trim().toLowerCase();
    if (!q) return this._bosses();
    return this._bosses().filter(
      (b) =>
        b.bossName.toLowerCase().includes(q) ||
        b.alias.some((a) => a.toLowerCase().includes(q)),
    );
  }

  /** Returns the boss with the given ID, or undefined. */
  findById(id: number): BossEntry | undefined {
    return this._bosses().find((b) => b.ID === id);
  }
}
