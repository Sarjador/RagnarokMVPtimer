## MODIFIED Requirements

### Requirement: Boss catalog contains only static data fields
The system SHALL store only static catalog fields in `bossList.json`: `ID`, `bossName`, `HP`, `race`, `property`, `location`, `minRespawnTimeScheduleInSeconds`, `maxRespawnTimeScheduleInSeconds`, `imageUrl`, and `alias`. Runtime tracker state (`deathTime`, `minRespawnTime`, `maxRespawnTime`, `fiveMinWarningSent`) SHALL NOT be present in the catalog file. User-defined bosses SHALL be stored in a separate `customBosses.json` file and SHALL NOT be written to `bossList.json`.

#### Scenario: bossList.json has no runtime fields
- **WHEN** `bossList.json` is parsed
- **THEN** no entry contains `deathTime`, `minRespawnTime`, `maxRespawnTime`, or `fiveMinWarningSent`

#### Scenario: Scraper produces valid catalog entries
- **WHEN** `npm run scrape-bosses` is executed
- **THEN** `bossList.json` is written with all fields matching `BossEntry` schema and no extras, and `customBosses.json` is not touched

#### Scenario: Catalog remains loadable by BossCatalogService
- **WHEN** the Angular app loads
- **THEN** `BossCatalogService` reads `bossList.json` and `customBosses.json` without errors and populates the bosses signal with the merged list
