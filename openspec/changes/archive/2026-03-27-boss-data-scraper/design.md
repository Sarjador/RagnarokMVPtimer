## Context

The target URL returns an HTML page with a table of all MVP bosses. Each row contains: mob ID (in the image or link URL), name, HP, level, race, element, and respawn time range. The image URL pattern is consistent: `https://file5s.ratemyserver.net/mobs/<ID>.gif`. The `location` field (map name) is available in the individual mob detail page but may require a second request per boss — worth checking if it's in the table.

The scraper will run locally as a one-off Node.js script (no dependencies beyond Node built-ins and optionally `node-fetch` or `https`). It is not bundled into the Electron app.

## Goals / Non-Goals

**Goals:**
- Parse all MVP rows from the ratemyserver.net MVP list page.
- Extract: ID, name, HP, race, element/property, respawn window (min/max in seconds), location.
- Build `imageUrl` from the known CDN pattern.
- Output clean `bossList.json` with no runtime state fields.
- Preserve existing `alias` entries for bosses that already have them (merge strategy).

**Non-Goals:**
- Scheduled/automated scraping (run manually when needed).
- Scraping individual boss detail pages unless the list page lacks a required field.
- Bundling scraper into the Electron app.

## Decisions

### 1. Node.js with built-in `https` — no new dependencies
Use Node.js built-in `https.get()` + `cheerio` for HTML parsing. `cheerio` is already a transitive devDependency of Angular tooling, so no new package needed. If not available, fall back to simple regex on table cells.

*Alternative:* Python with `requests` + `BeautifulSoup`. Rejected — keeps the project single-language and avoids requiring Python in dev setup.

### 2. Alias merge strategy
Read existing `bossList.json` before writing; carry over `alias` arrays keyed by boss ID. New bosses from the scrape get empty `alias: []`.

### 3. Location field
The mob list page shows the primary spawn map in a column. If parseable, use it directly. If not, fall back to empty string (location can be filled manually or from a second request in a future iteration).

### 4. Respawn time parsing
ratemyserver.net shows respawn as "X ~ Y hours" or "X ~ Y minutes". Convert to seconds:
- Hours: `value * 3600`
- Minutes: `value * 60`
- Single value (no range): min = max = value

### 5. Runtime field cleanup
`bossList.json` currently has `deathTime: null`, `minRespawnTime: null`, `maxRespawnTime: null`, `fiveMinWarningSent: false` on every entry. These are `MvpTrackerEntry` fields erroneously stored in the catalog. The scraper output omits them. `BossCatalogService.loadCatalog()` already strips unknown fields, so no service change needed.

## Migration Plan

1. Write `scripts/scrape-bosses.js`.
2. Run it: `node scripts/scrape-bosses.js` — inspect output.
3. Review diff between old and new `bossList.json`.
4. Verify `BossEntry` model matches the clean schema.
5. Run Angular build to confirm no type errors.
6. Update `package.json` with the convenience script.
