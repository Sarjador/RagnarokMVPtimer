## Why

GitHub Dependabot reported 9 vulnerabilities (6 high, 2 moderate, 1 low) on push. `npm audit` reveals the full picture: 39 vulnerabilities across 4 dependency root causes. The two that matter most for users are a moderate ASAR integrity bypass in the bundled Electron runtime and high-severity path traversal bugs in `tar` (used by `electron-builder` during packaging). The rest are dev-tooling issues with no production impact.

## What Changes

- **`picomatch` → patch in place**: non-breaking `npm audit fix` resolves 6 high-severity ReDoS/method-injection advisories in Angular CLI devtools. No code changes needed.
- **`electron` → upgrade to latest stable 35.x**: fixes the ASAR integrity bypass (moderate, production runtime). Staying on major 35 avoids breaking changes vs jumping to 41.
- **`electron-builder` → upgrade to `^26.0.0`**: fixes `tar` path traversal (high) and `@tootallnate/once` flow-scoping issues that are transitive through the builder. Dev-only impact.
- **`brace-expansion` / `minimatch`**: residual moderate ReDoS in several devDependency sub-trees; partially resolved by the above upgrades; remainder are dev-only and acceptable risk.

## Capabilities

### New Capabilities
_(none — this is a maintenance change)_

### Modified Capabilities
_(no spec-level behavior changes)_

## Impact

- `package.json` — version constraints updated for `electron` and `electron-builder`.
- `package-lock.json` — regenerated after upgrades.
- No source code changes expected.
- Build and packaging scripts remain unchanged.
