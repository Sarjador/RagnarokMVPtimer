## 1. Scraper script

- [x] 1.1 Create `scripts/scrape-bosses.js`: fetch the ratemyserver.net MVP list page using Node.js built-in `https`
- [x] 1.2 Parse the HTML table rows to extract: mob ID, name, HP, race, element/property, respawn range, location
- [x] 1.3 Convert respawn text ("X ~ Y hours" / "X ~ Y minutes") to min/max seconds
- [x] 1.4 Build `imageUrl` as `https://file5s.ratemyserver.net/mobs/<ID>.gif`
- [x] 1.5 Merge existing `alias` arrays from current `bossList.json` (keyed by ID); new bosses get `alias: []`
- [x] 1.6 Write clean output to `public/data/bossList.json` (no runtime state fields)
- [x] 1.7 Add `"scrape-bosses": "node scripts/scrape-bosses.js"` to `scripts` in `package.json`

## 2. Run and validate

- [x] 2.1 Run `npm run scrape-bosses` and verify the output file is valid JSON with the expected schema
- [x] 2.2 Check that runtime fields (`deathTime`, `minRespawnTime`, `maxRespawnTime`, `fiveMinWarningSent`) are absent from the output
- [x] 2.3 Verify boss count and spot-check a few entries (name, HP, respawn times, imageUrl)

## 3. Model cleanup

- [x] 3.1 Confirm `src/app/core/models/boss.model.ts` has no runtime state fields; remove any if present
- [x] 3.2 Run `npm run build` to confirm no TypeScript errors after model/data cleanup
