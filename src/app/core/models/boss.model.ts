export interface BossEntry {
  ID: number;
  bossName: string;
  HP: number;
  race: string;
  property: string;
  location: string;
  minRespawnTimeScheduleInSeconds: number;
  maxRespawnTimeScheduleInSeconds: number;
  imageUrl: string;
  /** Alternative search names for this boss */
  alias: string[];
  /** Runtime-only flag: true for user-created custom bosses, false for catalog bosses */
  isCustom?: boolean;
}

export interface CustomBossListJson {
  nextCustomId: number;
  bosses: Omit<BossEntry, 'isCustom'>[];
}
