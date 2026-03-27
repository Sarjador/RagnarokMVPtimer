## ADDED Requirements

### Requirement: Catalog tab displays all MVPs as a filterable card grid
The system SHALL render all bosses from `BossCatalogService.bosses()` as a grid of cards in the Catalog tab. The grid SHALL update automatically when new entries are added to the boss list data source — no code changes required.

#### Scenario: Catalog shows all bosses on load
- **WHEN** the user navigates to the Catalog tab
- **THEN** one card is rendered for each entry in the boss list

#### Scenario: New boss in data source appears without code change
- **WHEN** a new entry is added to `public/data/bossList.json`
- **THEN** the card grid includes a card for the new boss on next app load

### Requirement: Search box filters the card grid in real time
The system SHALL provide a text input in the Catalog tab that filters the visible cards by boss name and alias (case-insensitive). Cards not matching the query SHALL be hidden; matching cards SHALL remain visible.

#### Scenario: Query matches boss name
- **WHEN** the user types "Eddga" in the search box
- **THEN** only the Eddga card is visible

#### Scenario: Query matches alias
- **WHEN** a boss has alias "poring king" and the user types "poring king"
- **THEN** the corresponding card is visible

#### Scenario: No match
- **WHEN** the user types a string that matches no boss name or alias
- **THEN** the card grid is empty and an empty-state message is shown

#### Scenario: Cleared search shows all
- **WHEN** the user clears the search input
- **THEN** all boss cards are visible again

### Requirement: Clicking a card initiates death-time entry for that boss
The system SHALL respond to a card click by switching to the Active Timers tab and pre-filling the death-time entry form with the selected boss. The user can then confirm the death time without re-selecting the boss.

#### Scenario: User clicks a boss card
- **WHEN** the user clicks the "Track" button or the card body for a boss
- **THEN** the app switches to the Active Timers tab
- **AND** the boss search input is pre-filled with the selected boss name
- **AND** the death-time input is focused
