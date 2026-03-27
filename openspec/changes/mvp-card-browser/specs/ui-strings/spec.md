## ADDED Requirements

### Requirement: Translation keys exist for all new card-browser UI strings
The system SHALL add translation keys for: tab labels ("Catalog" / "Active Timers"), the card action button ("Track"), the catalog empty-state message, and the catalog search placeholder.

#### Scenario: English tab labels
- **WHEN** locale is `'en'`
- **THEN** the first tab reads "Catalog" and the second tab reads "Active Timers"

#### Scenario: Spanish tab labels
- **WHEN** locale is `'es'`
- **THEN** the first tab reads "Catálogo" and the second tab reads "Timers Activos"

#### Scenario: English card action
- **WHEN** locale is `'en'`
- **THEN** the card button reads "Track"

#### Scenario: Spanish card action
- **WHEN** locale is `'es'`
- **THEN** the card button reads "Trackear"

#### Scenario: Empty state message
- **WHEN** locale is `'en'` and no cards match the search query
- **THEN** the message reads "No MVPs found"

#### Scenario: Empty state message Spanish
- **WHEN** locale is `'es'` and no cards match the search query
- **THEN** the message reads "No se encontraron MVPs"
