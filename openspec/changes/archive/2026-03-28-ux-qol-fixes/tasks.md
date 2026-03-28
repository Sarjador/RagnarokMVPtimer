## 1. Locale Init Desync Fix

- [x] 1.1 In `LocaleService`, remove the private `_locale = signal(...)` field
- [x] 1.2 Replace `readonly locale = this._locale.asReadonly()` with `readonly locale = this.appSettings.locale`
- [x] 1.3 Update `t()` to read from `this.appSettings.locale()` instead of `this._locale()`
- [x] 1.4 Update `setLocale()` to call only `this.appSettings.setLocale(locale)` (remove `this._locale.set(locale)`)
- [x] 1.5 Update `ti()` (interpolated translation) to read from `this.appSettings.locale()` if it has its own reference

## 2. Timezone Clock Live Update

- [x] 2.1 In `SettingsComponent.serverTimePreview` computed, add `void this.timerService.currentTimeMs()` as first line to create a 1-second reactive dependency
- [x] 2.2 In `SettingsComponent.displayTimePreview` computed, add the same `void this.timerService.currentTimeMs()` dependency

## 3. Auto-Scroll for Add-Boss Form

- [x] 3.1 In `MvpCatalogComponent`, add a `@ViewChild('addFormAnchor') addFormAnchorRef?: ElementRef` for the form wrapper
- [x] 3.2 Add a `@ViewChild('addCardBtn') addCardBtnRef?: ElementRef` template ref on the "+" button
- [x] 3.3 In `openAddForm()`, after `showAddForm.set(true)`, add `setTimeout(() => this.addFormAnchorRef?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)`
- [x] 3.4 In `onBossSaved()` and `onFormCancelled()`, after `showAddForm.set(false)`, add `setTimeout(() => this.addCardBtnRef?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0)`
- [x] 3.5 Add `#addFormAnchor` template ref to the form wrapper `<div>` in `mvp-catalog.component.html`
- [x] 3.6 Add `#addCardBtn` template ref to the "+" button in `mvp-catalog.component.html`

## 4. i18n — Add Translation Keys

- [x] 4.1 Add `TranslationKey` entries to `translations.ts`: `catalog.add-custom-boss`, `catalog.form.title`, `catalog.form.name-label`, `catalog.form.min-respawn-label`, `catalog.form.max-respawn-label`, `catalog.form.hp-label`, `catalog.form.race-label`, `catalog.form.property-label`, `catalog.form.location-label`, `catalog.form.image-url-label`, `catalog.form.alias-label`, `catalog.form.add-btn`, `catalog.form.cancel-btn`, `catalog.form.alias-hint`
- [x] 4.2 Add EN and ES translations for each new key in the `TRANSLATIONS` constant
- [x] 4.3 In `mvp-catalog.component.html`, replace hardcoded `"Add Custom Boss"` and `"Add Custom Boss"` span text with `{{ t('catalog.add-custom-boss') }}`
- [x] 4.4 In `add-boss-form.component.html`, replace hardcoded form title, all field labels, placeholder hints, "Add Boss" submit button, and "Cancel" button text with `{{ t('catalog.form.*') }}` calls
- [x] 4.5 In `add-boss-form.component.ts`, add `readonly t = this.locale.t.bind(this.locale)` if not already present (it is — verify only)

## 5. Verification

- [x] 5.1 Run `ng build` — zero TypeScript errors
- [ ] 5.2 Manual test: switch to ES — catalog "+" card shows "Agregar Jefe Personalizado", form buttons show "Agregar Jefe" / "Cancelar"
- [ ] 5.3 Manual test: restart app with ES persisted — UI renders in Spanish immediately, Settings shows ES selected
- [ ] 5.4 Manual test: open Settings — HH:MM:SS clocks update the seconds every second
- [ ] 5.5 Manual test: click "+" in catalog — page scrolls to reveal the form; click Cancel — page scrolls back up
