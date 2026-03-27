## Requirements

### Requirement: Production runtime has no known high or critical vulnerabilities
The distributed Electron binary SHALL NOT contain dependencies with publicly disclosed high or critical CVEs at the time of release.

#### Scenario: Electron ASAR bypass resolved
- **WHEN** `npm audit` is run after the upgrade
- **THEN** the GHSA-vmqv-hx8q-j7mg advisory (Electron ASAR bypass) is no longer reported

### Requirement: Build tooling has no known high-severity vulnerabilities
Dev dependencies used during packaging SHALL NOT have high-severity CVEs that could compromise the build pipeline or output artifacts.

#### Scenario: tar path traversal resolved
- **WHEN** `npm audit` is run after upgrading electron-builder
- **THEN** the tar-related advisories (GHSA-34x7-hfp2-rc4v and related) are no longer reported

### Requirement: Application build remains functional after dependency upgrades
The Angular production build SHALL succeed without errors after all dependency upgrades.

#### Scenario: Build passes after upgrades
- **WHEN** `npm run build` is executed after all upgrades
- **THEN** the build completes with exit code 0 and produces output in dist/
