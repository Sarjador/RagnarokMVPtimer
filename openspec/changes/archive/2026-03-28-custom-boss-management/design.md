## Context

The app currently loads a read-only `bossList.json` catalog via `BossCatalogService` and uses those entries in the boss search + timer tracker. There is no facility to add, edit, or remove bosses at runtime. The boss-search component lets users pick bosses to track; the timer-list shows active countdowns.

The new feature requires a parallel user-editable catalog (`customBosses.json`) that gets merged with the standard catalog at startup, plus UI to create and delete custom entries.

## Goals / Non-Goals

**Goals:**
- Users can add new boss entries via a "+" card shown at the end of the boss-search grid
- Custom bosses are persisted to `customBosses.json` (separate from `bossList.json`)
- Custom bosses appear in search results alongside standard bosses
- Custom boss cards show a delete control; standard boss cards do not
- Deleting a custom boss removes it from `customBosses.json` and from any active timers

**Non-Goals:**
- Editing existing custom bosses after creation (out of scope for v1)
- Editing or hiding standard bosses
- Syncing custom bosses across devices or machines
- Validating that the location/map name is a real RO map

## Decisions

### D1 — Separate file for custom bosses (`customBosses.json`)

**Decision**: Store user-defined bosses in a separate `customBosses.json` rather than appending to `bossList.json`.

**Rationale**: Keeps the scraped catalog immutable. On `npm run scrape-bosses`, `bossList.json` is regenerated from scratch; merging user data into it would require complex diff logic. A separate file lets the scraper run freely without touching user data.

**Alternative considered**: Single file with a `source` flag. Rejected — scraper would need special handling to preserve user entries.

### D2 — `isCustom` flag as runtime-only (not persisted to JSON)

**Decision**: The `isCustom` boolean is added to the in-memory `BossEntry` model but is NOT written to either JSON file.

**Rationale**: Entries in `customBosses.json` are by definition custom, so the flag is redundant in storage. Adding it to the persisted schema would require migration logic. At load time, `BossCatalogService` sets `isCustom: true` for every entry that came from `customBosses.json` and `isCustom: false` (or absent) for standard entries.

### D3 — `BossCatalogService` owns both catalogs and delete logic

**Decision**: Extend `BossCatalogService` (not a new service) to load and merge both catalogs, expose `addCustomBoss()` and `deleteCustomBoss()` methods, and write changes to `customBosses.json` via `StorageService`.

**Rationale**: The service already owns the boss list signal and search. Adding custom-boss operations here avoids a second service that components would need to inject separately. The catalog boundary (standard vs custom) is an internal concern.

**Alternative considered**: A new `CustomBossService`. Rejected — creates unnecessary coupling and duplication of the boss signal.

### D4 — Custom boss IDs use a negative or high-range integer namespace

**Decision**: Assign custom boss IDs starting from `900000` (incrementing) to avoid collision with real RO mob IDs (which are well under 10 000).

**Rationale**: The existing data model uses `number` for ID. Using a reserved high range avoids breaking changes to the ID type and remains sortable/comparable. The next available ID is stored as `nextCustomId` in `customBosses.json`.

**Alternative considered**: UUID strings. Rejected — would require changing `BossEntry.ID` type from `number` to `string | number`, breaking downstream comparisons.

### D5 — Inline form inside the "+" card, not a modal

**Decision**: The add-boss form expands inline within the boss-search grid (replaces the "+" card with a form card) rather than opening a modal dialog.

**Rationale**: Consistent with the app's minimalist desktop style. No overlay management needed. The form card collapses back to the "+" card on cancel or save.

### D6 — File persistence via Electron IPC (StorageService pattern)

**Decision**: Write `customBosses.json` through the existing `StorageService` (which already handles Electron IPC / `window.electronAPI` for file writes).

**Rationale**: Keeps all file I/O in one place. The Angular app has no direct Node `fs` access; all writes go through `preload.js` IPC.

## Risks / Trade-offs

- **ID collision if user imports a custom JSON manually**: Mitigated by using high-range IDs far from real mob IDs, and validating on load.
- **`customBosses.json` absent on first run**: `BossCatalogService` must handle a missing file gracefully (treat as empty list, not an error).
- **Deleting a custom boss while its timer is active**: The timer entry holds the boss ID; on delete, active timers for that ID should be automatically cleared from `MvpTimerService`.
- **No image for custom bosses**: `imageUrl` is optional in the form; a placeholder image will be shown when absent.

## Migration Plan

No migration required. `customBosses.json` is created on first use. `bossList.json` is unchanged. No existing data is at risk.

## Open Questions

- Should custom bosses be searchable by alias? (Assumed yes — include alias field in the form.)
- Image: allow URL input only, or also a local file picker? (Assumed URL-only for v1 to keep scope tight.)
