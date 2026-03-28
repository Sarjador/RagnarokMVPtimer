## 1. Data Model & Storage

- [x] 1.1 Add optional `isCustom?: boolean` to `BossEntry` interface in `boss.model.ts`
- [x] 1.2 Define `CustomBossListJson` interface `{ nextCustomId: number, bosses: BossEntry[] }` in `boss.model.ts`
- [x] 1.3 Add `writeCustomBosses(data)` method to `StorageService` using Electron IPC (mirrors existing read pattern)
- [x] 1.4 Add `readCustomBosses()` method to `StorageService` (returns `CustomBossListJson | null` if file missing)
- [x] 1.5 Add IPC handler in `main.js` for `write-custom-bosses` channel (write to `customBosses.json` in user data dir or `public/data/`)

## 2. BossCatalogService Extension

- [x] 2.1 Load `customBosses.json` alongside `bossList.json` on init; treat missing file as empty list
- [x] 2.2 Merge standard + custom entries into the `_bosses` signal; set `isCustom: true` on custom entries
- [x] 2.3 Implement `addCustomBoss(partial: Omit<BossEntry, 'ID' | 'isCustom'>): void` — assigns next ID, appends to custom list, persists via StorageService
- [x] 2.4 Implement `deleteCustomBoss(id: number): void` — removes from custom list, persists, updates `_bosses` signal; no-op if ID is standard
- [x] 2.5 Expose `customBossIds` computed signal (Set of custom IDs) for template use

## 3. MvpTimerService Integration

- [x] 3.1 When `deleteCustomBoss` is called, clear any active timer entry that references that boss ID from `MvpTimerService`

## 4. Add-Boss Form Component

- [x] 4.1 Generate `AddBossFormComponent` (`src/app/features/boss-search/add-boss-form/`)
- [x] 4.2 Build template with fields: bossName (required), minRespawnTimeScheduleInSeconds (required), maxRespawnTimeScheduleInSeconds (required), HP, race, property, location, imageUrl, alias (comma-separated)
- [x] 4.3 Add reactive form with validators: bossName non-empty, both respawn times positive integers, max ≥ min
- [x] 4.4 On submit: call `BossCatalogService.addCustomBoss()`, emit `(saved)` output event, reset form
- [x] 4.5 On cancel: emit `(cancelled)` output event
- [x] 4.6 Style the form card to match the existing boss card dimensions

## 5. Add-Boss Card ("+" Card)

- [x] 5.1 Add `showAddForm` boolean state to `BossSearchComponent`
- [x] 5.2 Render a "+" placeholder card at the end of the boss grid (always visible, not filtered)
- [x] 5.3 Toggle `showAddForm` on "+" card click; when true, replace "+" card with `<app-add-boss-form>`
- [x] 5.4 Handle `(saved)` and `(cancelled)` events from `AddBossFormComponent` to collapse back to "+" card

## 6. Delete Control on Boss Cards

- [x] 6.1 In `BossSearchComponent` template, show a trash/delete icon button on cards where `boss.isCustom === true`
- [x] 6.2 Clicking the delete button calls `BossCatalogService.deleteCustomBoss(boss.ID)` with a confirmation step (simple `confirm()` dialog or inline confirm state)

## 7. Styles & UX Polish

- [x] 7.1 Style the "+" add card (dashed border, centered "+" icon, hover effect) in `boss-search.component.scss`
- [x] 7.2 Style the delete button on custom boss cards (small, top-right corner, red on hover)
- [x] 7.3 Show a placeholder image (CSS icon or default SVG) when `imageUrl` is empty

## 8. IPC Wiring (Electron)

- [x] 8.1 Expose `writeCustomBosses` and `readCustomBosses` in `preload.js` via `contextBridge`
- [x] 8.2 Register IPC handlers in `main.js` for both channels; write to the same directory as `bossList.json`
- [x] 8.3 Update `electron.d.ts` to include the new `electronAPI` methods

## 9. Verification

- [x] 9.1 Run `ng build` — zero TypeScript errors
- [ ] 9.2 Manual test: add a custom boss, verify it appears in search and timer list
- [ ] 9.3 Manual test: delete a custom boss with an active timer — timer clears automatically
- [ ] 9.4 Manual test: standard bosses show no delete button
- [ ] 9.5 Manual test: restart the app — custom bosses persist from `customBosses.json`

