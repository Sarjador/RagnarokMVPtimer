## Why

The current `bossList.json` was manually curated (85 bosses) and contains runtime tracker state fields (`deathTime`, `minRespawnTime`, `maxRespawnTime`, `fiveMinWarningSent`) that do not belong in the static catalog — they are `MvpTrackerEntry` concerns. Additionally, the image URLs already point to ratemyserver.net, so scraping the full MVP list from there gives us an authoritative, maintainable source for boss stats that can be re-run whenever the game updates.

## What Changes

- Add a **Node.js scraper script** (`scripts/scrape-bosses.js`) that:
  - Fetches `https://ratemyserver.net/index.php?page=mob_db&mvp=1&mob_search=Search&sort_r=0`
  - Parses all MVP rows from the HTML table (boss ID, name, HP, race, element, location, respawn times)
  - Builds image URLs using the known pattern: `https://file5s.ratemyserver.net/mobs/<ID>.gif`
  - Outputs a clean `public/data/bossList.json` with only static catalog fields
- **Remove runtime state fields** from `bossList.json` (`deathTime`, `minRespawnTime`, `maxRespawnTime`, `fiveMinWarningSent`) — these never belonged there.
- **Update `BossEntry` model** to remove any runtime fields if present.
- Add a `npm run scrape-bosses` script entry to `package.json`.

## Capabilities

### New Capabilities
- `boss-data-scraper`: Runnable Node.js script to refresh boss catalog from ratemyserver.net.

### Modified Capabilities
- `boss-catalog`: `bossList.json` schema cleaned — runtime state fields removed; data now authoritative from ratemyserver.net.

## Impact

- `scripts/scrape-bosses.js` — new scraper utility (run manually, not bundled into the app).
- `public/data/bossList.json` — regenerated with clean schema.
- `src/app/core/models/boss.model.ts` — remove runtime fields if still present.
- `package.json` — add `scrape-bosses` script.
- No changes to Angular components or services — `BossCatalogService` already reads only static fields.
