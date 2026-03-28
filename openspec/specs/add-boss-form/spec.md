## Requirements

### Requirement: Add-boss card is always visible at the end of the boss grid
The system SHALL render a special "+" card as the last item in the boss-search grid. The card SHALL be visible at all times (not filtered out by search queries).

#### Scenario: "+" card is visible with empty search
- **WHEN** the boss-search grid is rendered with no search query
- **THEN** a "+" card appears after all boss cards

#### Scenario: "+" card is always the last item
- **WHEN** the user types a search query that filters the list
- **THEN** the "+" card remains visible as the last item regardless of query

### Requirement: Clicking the add card opens an inline form
The system SHALL replace the "+" card with an inline form card when clicked. The form SHALL collapse back to the "+" card on cancel or successful save.

#### Scenario: Form opens on click
- **WHEN** the user clicks the "+" card
- **THEN** the "+" card transforms into an inline form card with input fields

#### Scenario: Cancel closes the form
- **WHEN** the user clicks "Cancel" in the open form
- **THEN** the form collapses back to the "+" card with no data saved

### Requirement: Add-boss form collects required and optional fields
The form SHALL require `bossName`, `minRespawnTimeScheduleInSeconds`, and `maxRespawnTimeScheduleInSeconds`. It SHALL offer optional fields for `HP`, `race`, `property`, `location`, `imageUrl`, and `alias` (comma-separated).

#### Scenario: Submit blocked when required fields are empty
- **WHEN** the user submits the form with `bossName` or either respawn time empty
- **THEN** the system displays a validation error and does not save

#### Scenario: Successful submission saves and closes form
- **WHEN** the user fills all required fields and clicks "Add Boss"
- **THEN** the boss is saved to `customBosses.json`, the new card appears in the grid, and the form collapses to the "+" card

#### Scenario: Alias input parsed from comma-separated string
- **WHEN** the user enters `"AR, Amon"` in the alias field and submits
- **THEN** the saved entry has `alias: ["AR", "Amon"]` (trimmed, no empty strings)

#### Scenario: Missing imageUrl uses placeholder
- **WHEN** the user submits without providing an `imageUrl`
- **THEN** the saved entry has `imageUrl: ""` and the boss card renders a placeholder image
