## Why

The app currently only ships with a fixed catalog of bosses sourced from ratemyserver.net. Players often track private-server exclusive bosses, custom instances, or event MVPs that are not in the standard list. Without a way to add them, users must wait for a catalog update — blocking their tracking workflow.

## What Changes

- A "+" add card appears at the end of the MVP list, always visible after the last boss card
- Clicking the "+" card opens an inline form to enter boss data (name, respawn times, location, image URL, aliases)
- On submit, the new boss is appended to a user-managed custom boss file (`customBosses.json`) and immediately appears in the tracker
- Any custom boss card has a delete/trash icon; clicking it removes that boss from `customBosses.json` and from the active tracker
- Standard/default bosses (from `bossList.json`) show no delete control and cannot be removed by the user

## Capabilities

### New Capabilities

- `custom-boss-catalog`: Persistence layer for user-defined bosses — CRUD operations on `customBosses.json`, separate from the read-only `bossList.json`
- `add-boss-form`: UI form component that collects the required fields to create a new custom boss entry and validates required fields before saving

### Modified Capabilities

- `boss-catalog`: The boss catalog must now merge the standard list with the user's custom list and expose an `isCustom` flag per entry so the UI can conditionally render delete controls

## Impact

- New file: `public/data/customBosses.json` (user-writable, created on first add)
- New Angular component: `AddBossCardComponent` (the "+" card)
- New Angular component: `AddBossFormComponent` (inline form)
- `BossCatalogService` extended to merge standard + custom bosses and expose delete capability
- `StorageService` or a new `CustomBossStorageService` to read/write `customBosses.json`
- `BossEntry` model gains optional `isCustom: boolean` field (runtime-only, not persisted to JSON)
- Timer list component updated to render the "+" card and per-card delete button for custom entries
