export type Locale = 'en' | 'es';

export type TranslationKey =
  // Nav
  | 'nav.timers'
  | 'nav.settings'
  // Boss search
  | 'boss-search.title'
  | 'boss-search.search-placeholder'
  | 'boss-search.death-time-placeholder'
  | 'boss-search.add-btn'
  | 'boss-search.selected-label'
  | 'boss-search.respawn-label'
  | 'boss-search.error-invalid-time'
  | 'boss-search.error-generic'
  // Timer list
  | 'timer-list.title'
  | 'timer-list.clear-all'
  | 'timer-list.empty'
  | 'timer-list.empty-hint'
  | 'timer-list.respawn-label'
  | 'timer-list.remaining'
  | 'timer-list.ready'
  | 'timer-list.remove-title'
  // Settings
  | 'settings.title'
  | 'settings.server-tz-label'
  | 'settings.server-tz-hint'
  | 'settings.display-tz-label'
  | 'settings.display-tz-hint'
  | 'settings.now-label'
  | 'settings.audio-label'
  | 'settings.audio-hint'
  | 'settings.pick-audio'
  | 'settings.reset-audio'
  | 'settings.audio-formats'
  | 'settings.info-example'
  | 'settings.language-label'
  // Notification templates (use {boss}, {location}, {min}, {max} as placeholders)
  | 'notif.warning-title'
  | 'notif.warning-body'
  | 'notif.ready-title'
  | 'notif.ready-body'
  // Audio label
  | 'audio-label.default';

export const TRANSLATIONS: Record<TranslationKey, Record<Locale, string>> = {
  // Nav
  'nav.timers':   { en: 'Timers',        es: 'Timers' },
  'nav.settings': { en: 'Settings',      es: 'Configuración' },

  // Boss search
  'boss-search.title':                 { en: 'Add MVP',                                    es: 'Agregar MVP' },
  'boss-search.search-placeholder':    { en: 'Search MVP (name or alias)…',                es: 'Buscar MVP (nombre o alias)...' },
  'boss-search.death-time-placeholder':{ en: 'Death time (HH:mm)',                         es: 'Hora muerte (HH:mm)' },
  'boss-search.add-btn':               { en: '+ Add',                                      es: '+ Agregar' },
  'boss-search.selected-label':        { en: 'Selected:',                                   es: 'Seleccionado:' },
  'boss-search.respawn-label':         { en: 'Respawn:',                                    es: 'Respawn:' },
  'boss-search.error-invalid-time':    { en: 'Invalid format. Use HH:mm (e.g. 22:30)',      es: 'Formato inválido. Usa HH:mm (ej: 22:30)' },
  'boss-search.error-generic':         { en: 'Error adding MVP',                            es: 'Error al agregar el MVP' },

  // Timer list
  'timer-list.title':      { en: 'Active MVPs',                       es: 'MVPs Activos' },
  'timer-list.clear-all':  { en: 'Clear all',                         es: 'Limpiar todo' },
  'timer-list.empty':      { en: 'No MVPs being tracked.',            es: 'No hay MVPs en seguimiento.' },
  'timer-list.empty-hint': { en: 'Search for an MVP above to start.', es: 'Busca un MVP arriba para comenzar.' },
  'timer-list.respawn-label': { en: 'Respawn',                        es: 'Respawn' },
  'timer-list.remaining':  { en: 'remaining',                         es: 'restante' },
  'timer-list.ready':      { en: 'NOW!',                              es: '¡YA!' },
  'timer-list.remove-title':{ en: 'Remove MVP',                       es: 'Quitar MVP' },

  // Settings
  'settings.title':           { en: 'Settings',                                                                                        es: 'Configuración' },
  'settings.server-tz-label': { en: 'Server timezone',                                                                                 es: 'Zona horaria del servidor' },
  'settings.server-tz-hint':  { en: 'How the death times you enter are interpreted',                                                    es: 'Cómo se interpretan las horas de muerte que introduces' },
  'settings.display-tz-label':{ en: 'Display timezone',                                                                                es: 'Zona horaria de visualización' },
  'settings.display-tz-hint': { en: 'How respawn times are shown in the list',                                                         es: 'Cómo se muestran las horas de respawn en la lista' },
  'settings.now-label':       { en: 'Now:',                                                                                            es: 'Ahora:' },
  'settings.audio-label':     { en: 'Alert sound',                                                                                     es: 'Sonido de alerta' },
  'settings.audio-hint':      { en: 'Sound played when an MVP spawns',                                                                 es: 'Sonido que se reproduce cuando un MVP reaparece' },
  'settings.pick-audio':      { en: 'Choose file…',                                                                                    es: 'Elegir archivo…' },
  'settings.reset-audio':     { en: 'Reset',                                                                                           es: 'Restablecer' },
  'settings.audio-formats':   { en: 'Compatible formats: mp3 · ogg · wav · flac · aac · webm',                                         es: 'Formatos compatibles: mp3 · ogg · wav · flac · aac · webm' },
  'settings.info-example':    { en: 'Example: if the server is <em>America/Sao_Paulo</em> and your display is <em>Europe/Madrid</em>, enter death times in Brazil time and respawns are shown in Spain time.', es: '<strong>Ejemplo:</strong> Si el servidor es <em>America/Sao_Paulo</em> y tu visualización es <em>Europe/Madrid</em>, introduces la hora de muerte en hora de Brasil y los respawns se muestran en hora de España.' },
  'settings.language-label':  { en: 'Language',                                                                                        es: 'Idioma' },

  // Notifications
  'notif.warning-title': { en: '⚠️ {boss} — 5 minutes!',    es: '⚠️ {boss} — ¡5 minutos!' },
  'notif.warning-body':  { en: 'Loc: {location} | Respawn: {min}–{max}', es: 'Loc: {location} | Respawn: {min}–{max}' },
  'notif.ready-title':   { en: '🔥 {boss} — SPAWNED!',       es: '🔥 {boss} — ¡YA RESPAWNEÓ!' },
  'notif.ready-body':    { en: 'Loc: {location} | Since: {min}',         es: 'Loc: {location} | Desde: {min}' },

  // Audio label
  'audio-label.default': { en: 'Default (Murloc)', es: 'Por defecto (Murloc)' },
};
