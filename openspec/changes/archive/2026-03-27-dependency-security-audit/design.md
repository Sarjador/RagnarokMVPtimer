## Context

`npm audit` groups the 39 reported CVEs into 4 distinct dependency roots. Only two have any realistic production risk:

| Root | Severity | Scope | Fix |
|------|----------|-------|-----|
| `picomatch` | HIGH (ReDoS, method injection) | devDependency (Angular CLI) | `npm audit fix` — non-breaking |
| `electron` | MODERATE (ASAR bypass) | **production runtime** | upgrade 33→35 |
| `tar` (via `electron-builder`) | HIGH (path traversal) | devDependency (packaging) | upgrade `electron-builder` 25→26 |
| `brace-expansion`/`minimatch` | MODERATE (ReDoS) | devDependency (Angular CLI, karma) | partially fixed by above; residual is dev-only |

## Goals / Non-Goals

**Goals:**
- Eliminate all production-runtime vulnerabilities (Electron ASAR bypass).
- Eliminate high-severity dev-tool vulnerabilities that run during CI/packaging (`tar`).
- Reduce total advisory count as far as possible without breaking builds.

**Non-Goals:**
- Zero advisories at all cost — some moderate ReDoS in deeply nested devDependencies are acceptable residual risk.
- Migrating to Electron 41 — too large a jump; untested against the Angular 20 renderer.
- Modifying application source code — this is a pure dependency update.

## Decisions

### 1. `npm audit fix` first (picomatch)
Run without `--force` to pick up the safe, non-breaking patches. This resolves the picomatch advisories cleanly.

### 2. `electron` 33 → 35
Electron 35.x is the current stable series as of 2026-03. It includes the ASAR integrity fix and stays on the same Chromium generation as 33, minimising renderer-side breakage risk. After upgrading, run a dev build to confirm the Angular renderer still loads correctly.

*Alternative considered:* upgrade to 41 (what `npm audit fix --force` would install). Rejected — that is 8 major versions ahead, untested, and would require validating IPC APIs, contextIsolation defaults, and renderer behaviour.

### 3. `electron-builder` 25 → 26
Version 26.0.0+ updates `tar` to a non-vulnerable version and replaces `@tootallnate/once`. Only affects the packaging step; no runtime impact. Verify that `npm run make` (or equivalent packaging command) still succeeds after upgrade.

### 4. Verify with `npm audit` after each step
Run audit after each upgrade to confirm advisory count drops and no new issues were introduced.

## Risks / Trade-offs

- **Electron minor API changes** → Mitigation: run dev build and smoke-test IPC calls (`storageRead`, `storageWrite`, `sendNotification`, `pickAudioFile`, `openExternal`) after upgrade.
- **electron-builder behaviour change** → Mitigation: test packaging (`npm run dist` or equivalent) on at least one platform.
- **Residual advisories**: some `brace-expansion`/`minimatch` in Karma and Angular CLI sub-trees may remain. These are dev-only and do not affect the distributed app.

## Migration Plan

1. Run `npm audit fix` (picomatch — non-breaking).
2. Update `electron` constraint to `^35.0.0` in `package.json`, run `npm install`.
3. Update `electron-builder` constraint to `^26.0.0` in `package.json`, run `npm install`.
4. Run `npm audit` to verify advisory reduction.
5. Run `npm run build` (Angular build) to confirm no breakage.
6. Smoke-test the Electron app.
