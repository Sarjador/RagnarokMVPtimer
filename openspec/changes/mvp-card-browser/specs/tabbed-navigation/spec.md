## ADDED Requirements

### Requirement: Timers page has two tabs: Catalog and Active Timers
The system SHALL replace the current single-view Timers page with a two-tab layout. The first tab SHALL be "Catalog" (card browser) and the second tab SHALL be "Active Timers" (timer list). The active tab SHALL be visually highlighted.

#### Scenario: Default tab on page load
- **WHEN** the user navigates to the Timers page
- **THEN** the Catalog tab is active by default

#### Scenario: Switching tabs
- **WHEN** the user clicks the "Active Timers" tab
- **THEN** the Active Timers panel is shown and the Catalog panel is hidden

#### Scenario: Tab state is not persisted
- **WHEN** the app is restarted
- **THEN** the Catalog tab is active (default state, not remembered)

### Requirement: Card click switches to Active Timers tab
The system SHALL automatically switch to the Active Timers tab when the user clicks a boss card in the Catalog.

#### Scenario: Card click causes tab switch
- **WHEN** the user clicks a boss card in the Catalog tab
- **THEN** the Active Timers tab becomes active
- **AND** the boss search form is pre-filled with the selected boss
