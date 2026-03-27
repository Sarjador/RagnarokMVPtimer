## 1. Safe non-breaking fix

- [x] 1.1 Run `npm audit fix` (no --force) to patch `picomatch` and any other non-breaking advisories
- [x] 1.2 Run `npm audit` and record the remaining advisory count — 39 → 12 (2 low, 1 moderate, 9 high)

## 2. Electron upgrade (production runtime)

- [x] 2.1 Update `electron` version constraint to `^35.0.0` in `package.json`
- [x] 2.2 Run `npm install` to regenerate `package-lock.json` (installed 35.7.5)
- [x] 2.3 Run `npm run build` (Angular build) and confirm no errors
- [x] 2.4 Run `npm audit` and confirm ASAR bypass advisory is gone — 12 → 11

## 3. electron-builder upgrade (packaging)

- [x] 3.1 Update `electron-builder` version constraint to `^26.0.0` in `package.json`
- [x] 3.2 Run `npm install` to regenerate `package-lock.json` (installed 26.8.2)
- [x] 3.3 Run `npm audit` and confirm `tar` and `@tootallnate/once` advisories are resolved — 0 vulnerabilities

## 4. Final verification

- [x] 4.1 Run `npm audit` and document final advisory count — 0 vulnerabilities
- [x] 4.2 Run `npm run build` one final time to confirm clean build — ✓
