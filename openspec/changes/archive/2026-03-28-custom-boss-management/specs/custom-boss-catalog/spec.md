## ADDED Requirements

### Requirement: Custom bosses are stored in a separate file
The system SHALL persist user-defined boss entries in `customBosses.json` (alongside `bossList.json`), containing `{ nextCustomId: number, bosses: BossEntry[] }`. This file SHALL be created automatically on first custom boss addition and SHALL NOT be modified by `npm run scrape-bosses`.

#### Scenario: First custom boss triggers file creation
- **WHEN** a user adds the first custom boss and `customBosses.json` does not exist
- **THEN** the system creates `customBosses.json` with `nextCustomId` and the new entry, without errors

#### Scenario: Missing file is treated as empty list
- **WHEN** the app starts and `customBosses.json` does not exist
- **THEN** `BossCatalogService` loads zero custom entries and reports no error

#### Scenario: Custom bosses use high-range IDs
- **WHEN** a new custom boss is created
- **THEN** its `ID` is ≥ 900000 and does not collide with any entry already in `bossList.json`

### Requirement: Custom boss entries can be deleted
The system SHALL provide a `deleteCustomBoss(id: number)` method on `BossCatalogService` that removes the entry from the merged boss signal, writes the updated list to `customBosses.json`, and removes any active timer for that boss ID.

#### Scenario: Deleting a custom boss removes it from the UI
- **WHEN** the user deletes a custom boss
- **THEN** that boss no longer appears in the boss-search grid or the active timer list

#### Scenario: Standard bosses cannot be deleted
- **WHEN** `deleteCustomBoss` is called with an ID belonging to a standard boss
- **THEN** the system ignores the call and no file is written

#### Scenario: Deleting a custom boss with an active timer
- **WHEN** the user deletes a custom boss that has a running timer
- **THEN** the timer entry is removed from `MvpTimerService` simultaneously

### Requirement: Custom bosses merge with standard catalog
`BossCatalogService` SHALL load both `bossList.json` and `customBosses.json` at startup and expose a single merged signal. Each entry from `customBosses.json` SHALL carry `isCustom: true` in memory; standard entries SHALL carry `isCustom: false`.

#### Scenario: Merged list appears in search
- **WHEN** the app loads and the user opens boss search
- **THEN** both standard and custom bosses appear in search results

#### Scenario: isCustom flag drives delete control visibility
- **WHEN** the timer-list or boss-search renders a boss card
- **THEN** the delete control is visible only if `boss.isCustom === true`
