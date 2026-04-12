import { Injectable, signal, computed, inject } from '@angular/core';
import { BossEntry, CustomBossListJson } from '../models/boss.model';
import { StorageService } from './storage.service';
import bossListData from '../../../assets/data/bossList.json';

const CUSTOM_BOSS_ID_START = 900_000;

@Injectable({ providedIn: 'root' })
export class BossCatalogService {
  private readonly storage = inject(StorageService);

  private readonly _bosses = signal<BossEntry[]>([]);
  private readonly _loaded = signal(false);
  private _customData: CustomBossListJson = { nextCustomId: CUSTOM_BOSS_ID_START, bosses: [] };

  /** All bosses (standard + custom) from the catalog. Empty until catalog is loaded. */
  readonly bosses = this._bosses.asReadonly();
  readonly loaded = this._loaded.asReadonly();

  /** Set of IDs belonging to user-created custom bosses */
  readonly customBossIds = computed(
    () => new Set(this._bosses().filter((b) => b.isCustom).map((b) => b.ID)),
  );

  constructor() {
    this.loadCatalog();
  }

  private async loadCatalog(): Promise<void> {
    try {
      const customData = await this.loadCustom();
      this._customData = customData;
      this._bosses.set([
        ...this.loadStandard(),
        ...customData.bosses.map((b) => ({ ...b, isCustom: true as const })),
      ]);
      this._loaded.set(true);
    } catch (err) {
      console.error('[BossCatalogService] Failed to load boss catalog:', err);
    }
  }

  private loadStandard(): BossEntry[] {
    return bossListData.bosses.map(({ ID, bossName, HP, race, property, location,
      minRespawnTimeScheduleInSeconds, maxRespawnTimeScheduleInSeconds,
      imageUrl, alias }) => ({
      ID, bossName, HP, race, property, location,
      minRespawnTimeScheduleInSeconds, maxRespawnTimeScheduleInSeconds,
      imageUrl, alias: alias ?? [],
      isCustom: false,
    }));
  }

  private async loadCustom(): Promise<CustomBossListJson> {
    const data = await this.storage.readCustomBosses();
    if (!data) return { nextCustomId: CUSTOM_BOSS_ID_START, bosses: [] };
    return data;
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

  /** Adds a new user-defined boss to the custom catalog and persists it. */
  addCustomBoss(partial: Omit<BossEntry, 'ID' | 'isCustom'>): void {
    const id = this._customData.nextCustomId;
    const newEntry: BossEntry = { ...partial, ID: id, isCustom: true };
    const { isCustom: _ignored, ...persistEntry } = { ...partial, ID: id, isCustom: true };

    this._customData = {
      nextCustomId: id + 1,
      bosses: [...this._customData.bosses, persistEntry],
    };
    this._bosses.update((prev) => [...prev, newEntry]);
    this.storage.writeCustomBosses(this._customData);
  }

  /**
   * Removes a user-defined boss by ID.
   * No-op if the ID belongs to a standard (non-custom) boss.
   * The caller is responsible for clearing active timers (see BossSearchComponent).
   */
  deleteCustomBoss(id: number): void {
    if (!this.customBossIds().has(id)) return;

    this._customData = {
      ...this._customData,
      bosses: this._customData.bosses.filter((b) => b.ID !== id),
    };
    this._bosses.update((prev) => prev.filter((b) => b.ID !== id));
    this.storage.writeCustomBosses(this._customData);
  }
}
