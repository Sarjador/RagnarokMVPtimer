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
}
