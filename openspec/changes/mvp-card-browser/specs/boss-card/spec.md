## ADDED Requirements

### Requirement: Boss card displays key boss information
The system SHALL render a `BossCardComponent` for each boss showing: boss portrait image, boss name, element/property badge, race, and respawn window (min–max in minutes).

#### Scenario: Card shows boss image
- **WHEN** a boss card is rendered and `boss.imageUrl` is non-empty
- **THEN** the card displays the boss portrait image

#### Scenario: Card falls back to placeholder when image fails
- **WHEN** the boss image URL is empty or fails to load
- **THEN** the card displays a placeholder silhouette image instead

#### Scenario: Card shows boss name and respawn range
- **WHEN** a boss card is rendered
- **THEN** the card shows the boss name and respawn window as "Xm – Ym"

### Requirement: Boss card emits a select event on interaction
The system SHALL emit a `select` output event carrying the `BossEntry` when the user clicks the card or its "Track" button. The card itself SHALL have no side effects — parent components handle navigation and pre-fill.

#### Scenario: Card click emits select
- **WHEN** the user clicks anywhere on the card body
- **THEN** the `select` output emits the corresponding `BossEntry`

#### Scenario: Track button click emits select
- **WHEN** the user clicks the "Track" button on a card
- **THEN** the `select` output emits the corresponding `BossEntry`
