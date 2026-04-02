# ⚔️ RO MVP Timer

Desktop application to track MVP boss respawns in **Ragnarok Online**.  
Built with **Angular 20** + **Electron 35** — runs on Windows, macOS and Linux.

---

## What does it do?

When an MVP dies in-game, you register the death time and the app automatically calculates the respawn window. It alerts you with a desktop notification and a sound when the boss is about to appear.

### Basic flow

```
1. Search for the MVP (by name or alias)
2. Enter the death time (HH:mm) — or use the current time
3. The app calculates min/max respawn and starts the countdown
4. 5 minutes before respawn → warning notification
5. At minimum respawn time → notification + alert sound
```

---

## Features

### Timer tracker
- Real-time countdown for each active MVP
- Three visual states: **tracking** → **warning** (5 min before) → **ready** (spawned!)
- Min/max respawn window support
- Manual death time (HH:mm) or automatic (now)
- Individual or bulk timer clearing

### Boss catalog
- Full list of standard in-game MVPs with stats (HP, race, property, map)
- Search by name or alias with autocomplete (up to 10 suggestions)
- Catalog view to browse all available MVPs

### Custom bosses
- Create custom bosses with name, min/max respawn, HP, race, property, map and image
- Alias support for easier searching
- Delete custom bosses (also clears their active timers)
- Persisted in a separate file (`customBosses.json`)

### Notifications
- Native OS notifications via Electron (works even when the window is minimized)
- Fallback to Web Notification API when running in a browser

### Alert sound
- Default sound included (`alerta.mp3`)
- File picker to choose your own sound
- Supported formats: **mp3 · ogg · wav · flac · aac · webm**
- Fallback to a Web Audio generated beep if no file is available

### Settings
- **Server timezone**: how the death times you enter are interpreted
- **Display timezone**: how respawn times are shown in the list
- Real-time preview of the current time in each timezone
- **Language**: English / Spanish
- All settings are persisted automatically

### Other features
- Single instance lock (if already open, focuses the existing window)
- Persistent state between sessions (atomic writes: tmp → rename)
- Strict Content Security Policy (no external connections)
- Distributable builds for Windows (`.exe`), macOS (`.dmg`) and Linux (`.AppImage`)

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 20 (standalone components, signals) |
| Desktop | Electron 35 |
| Styles | SCSS |
| Dates/times | Day.js |
| Packaging | electron-builder |
| Tests | Karma + Jasmine |

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

---

## Installation

```bash
# Clone the repository
git clone https://github.com/sarjador/RagnarokMVPtimer.git
cd RagnarokMVPtimer

# Install dependencies
npm install
```

---

## Available scripts

| Command | Description |
|---------|-------------|
| `npm start` | Angular dev server (browser, `http://localhost:4200`) |
| `npm run electron:serve` | Dev build + launch Electron |
| `npm run electron:build` | Production build (without packaging) |
| `npm run electron:dist` | Production build + generate installer |
| `npm test` | Run unit tests with Karma |
| `npm run scrape-bosses` | Script to update the boss catalog from the web |

---

## Development

### Browser mode

```bash
npm start
```

Opens `http://localhost:4200` in the browser. Notifications use the browser's Web Notification API in this mode.

### Electron mode (recommended)

```bash
npm run electron:serve
```

Compiles Angular in development mode and launches Electron with the full app, including native notifications, custom sound and state persistence.

---

## Build distribution

```bash
npm run electron:dist
```

Installers are generated in the `release/` folder:

| Platform | Format |
|---------|--------|
| Windows | NSIS installer (`.exe`) |
| macOS | Disk Image (`.dmg`) |
| Linux | AppImage (`.AppImage`) |

---

## Project structure

```
RagnarokMVPtimer/
├── main.js                     # Electron main process (IPC, window, storage)
├── preload.js                  # Secure bridge between main and renderer (contextBridge)
├── public/
│   ├── audio/alerta.mp3        # Default alert sound
│   └── data/bossList.json      # Standard MVP catalog
├── src/
│   └── app/
│       ├── core/
│       │   ├── i18n/           # Translations (ES / EN)
│       │   ├── models/         # Interfaces: BossEntry, MvpTrackerEntry, AppState
│       │   ├── services/       # Business logic (timers, catalog, notifications, settings)
│       │   └── utils/          # Time utils, validators, timezones
│       └── features/
│           ├── boss-search/    # MVP search and death registration
│           ├── boss-card/      # Individual MVP card in the catalog
│           ├── mvp-catalog/    # Full catalog view
│           ├── timer-list/     # Active timers list
│           ├── timers-page/    # Main page (search + timers)
│           └── settings/       # Timezone, audio and language settings
└── openspec/                   # Change specifications (feature history)
```

---

## Data persistence

The app saves data in Electron's **userData** folder (varies by OS):

| OS | Path |
|----|------|
| Windows | `%APPDATA%\ro-mvp-timer\` |
| macOS | `~/Library/Application Support/ro-mvp-timer/` |
| Linux | `~/.config/ro-mvp-timer/` |

Generated files:

- `mvp-state.json` — active timers, timezone config, language and audio settings
- `customBosses.json` — user-created custom bosses

All writes are **atomic** (write tmp → rename) to avoid corruption if the app closes unexpectedly.

---

## Adding a custom alert sound

1. Open **Settings** in the app
2. Click **"Choose file…"** in the sound section
3. Select an audio file (mp3, ogg, wav, flac, aac, webm)
4. The filename is saved and restored on the next session

> The absolute file path **never** leaves the Electron main process for security reasons.

---

## Tests

```bash
npm test
```

Runs unit tests with Karma and Jasmine. Tests cover the main services (timer, catalog, notifications, settings, timezone).

---

## Support the project

If you find the app useful, consider buying me a coffee ☕  
👉 [ko-fi.com/sarjador](https://ko-fi.com/sarjador)

---

## License

Private project. All rights reserved.

---
---

# ⚔️ RO MVP Timer — Español

Aplicación de escritorio para trackear el respawn de MVPs en **Ragnarok Online**.  
Construida con **Angular 20** + **Electron 35** — funciona en Windows, macOS y Linux.

---

## ¿Qué hace?

Cuando un MVP muere en el juego, registras la hora de muerte y la app calcula automáticamente la ventana de respawn. Te avisa con una notificación de escritorio y un sonido de alerta cuando el boss está por aparecer.

### Flujo básico

```
1. Buscas el MVP (por nombre o alias)
2. Ingresas la hora de muerte (HH:mm) — o usas la hora actual
3. La app calcula min/max respawn y arranca el countdown
4. A los 5 minutos del respawn → notificación de advertencia
5. Al llegar al respawn mínimo → notificación + sonido de alerta
```

---

## Funcionalidades

### Tracker de timers
- Countdown en tiempo real para cada MVP activo
- Tres estados visuales: **tracking** → **warning** (5 min antes) → **ready** (¡ya respawneó!)
- Soporte para ventana de respawn min/max
- Hora de muerte manual (HH:mm) o automática (ahora)
- Limpieza individual o masiva de timers

### Catálogo de bosses
- Lista completa de MVPs estándar del juego con stats (HP, raza, propiedad, mapa)
- Búsqueda por nombre o alias con autocompletado (hasta 10 sugerencias)
- Vista de catálogo para explorar todos los MVPs disponibles

### Bosses personalizados
- Crear bosses custom con nombre, respawn min/max, HP, raza, propiedad, mapa e imagen
- Soporte de aliases para búsqueda más fácil
- Eliminar bosses custom (limpia también sus timers activos)
- Persistencia en archivo separado (`customBosses.json`)

### Notificaciones
- Notificaciones nativas del SO vía Electron (funciona aunque la ventana esté minimizada)
- Fallback a Web Notification API si se usa en navegador

### Sonido de alerta
- Sonido por defecto incluido (`alerta.mp3`)
- Picker de archivo para elegir tu propio sonido
- Formatos soportados: **mp3 · ogg · wav · flac · aac · webm**
- Fallback a beep generado por Web Audio si no hay archivo disponible

### Configuración
- **Timezone del servidor**: cómo se interpretan las horas de muerte que ingresas
- **Timezone de visualización**: cómo se muestran los horarios de respawn
- Preview en tiempo real de la hora actual en cada zona horaria
- **Idioma**: Español / English
- Toda la configuración se persiste automáticamente

### Otras características
- Instancia única (si ya está abierta, enfoca la ventana existente)
- Estado persistente entre sesiones (escrituras atómicas: tmp → rename)
- Content Security Policy estricta (sin conexiones externas)
- Builds distribuibles para Windows (`.exe`), macOS (`.dmg`) y Linux (`.AppImage`)

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 20 (standalone components, signals) |
| Desktop | Electron 35 |
| Estilos | SCSS |
| Fechas/horas | Day.js |
| Empaquetado | electron-builder |
| Tests | Karma + Jasmine |

---

## Requisitos previos

- **Node.js** v18 o superior
- **npm** v9 o superior

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/sarjador/RagnarokMVPtimer.git
cd RagnarokMVPtimer

# Instalar dependencias
npm install
```

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo Angular (navegador, `http://localhost:4200`) |
| `npm run electron:serve` | Build dev + lanzar Electron |
| `npm run electron:build` | Build de producción (sin empaquetar) |
| `npm run electron:dist` | Build de producción + generar instalador |
| `npm test` | Ejecutar tests unitarios con Karma |
| `npm run scrape-bosses` | Script para actualizar el catálogo de bosses desde la web |

---

## Desarrollo

### Modo navegador

```bash
npm start
```

Abre `http://localhost:4200` en el navegador. Las notificaciones usan la Web Notification API del navegador en este modo.

### Modo Electron (recomendado)

```bash
npm run electron:serve
```

Compila Angular en modo desarrollo y lanza Electron con la app completa, incluyendo notificaciones nativas, sonido personalizado y persistencia de estado.

---

## Generar distribución

```bash
npm run electron:dist
```

Los instaladores se generan en la carpeta `release/`:

| Plataforma | Formato |
|-----------|---------|
| Windows | Instalador NSIS (`.exe`) |
| macOS | Disk Image (`.dmg`) |
| Linux | AppImage (`.AppImage`) |

---

## Estructura del proyecto

```
RagnarokMVPtimer/
├── main.js                     # Proceso principal de Electron (IPC, ventana, storage)
├── preload.js                  # Bridge seguro entre main y renderer (contextBridge)
├── public/
│   ├── audio/alerta.mp3        # Sonido de alerta por defecto
│   └── data/bossList.json      # Catálogo de MVPs estándar
├── src/
│   └── app/
│       ├── core/
│       │   ├── i18n/           # Traducciones (ES / EN)
│       │   ├── models/         # Interfaces: BossEntry, MvpTrackerEntry, AppState
│       │   ├── services/       # Lógica de negocio (timers, catálogo, notificaciones, settings)
│       │   └── utils/          # Time utils, validadores, timezones
│       └── features/
│           ├── boss-search/    # Búsqueda y registro de muerte de un MVP
│           ├── boss-card/      # Tarjeta individual de un MVP en el catálogo
│           ├── mvp-catalog/    # Vista del catálogo completo
│           ├── timer-list/     # Lista de timers activos
│           ├── timers-page/    # Página principal (search + timers)
│           └── settings/       # Configuración de timezone, audio e idioma
└── openspec/                   # Especificaciones de cambios (historial de features)
```

---

## Persistencia de datos

La app guarda los datos en la carpeta **userData** de Electron (varía según el SO):

| SO | Ruta |
|----|------|
| Windows | `%APPDATA%\ro-mvp-timer\` |
| macOS | `~/Library/Application Support/ro-mvp-timer/` |
| Linux | `~/.config/ro-mvp-timer/` |

Archivos generados:

- `mvp-state.json` — timers activos, configuración de timezone, idioma y audio
- `customBosses.json` — bosses personalizados del usuario

Todas las escrituras son **atómicas** (write tmp → rename) para evitar corrupción si la app se cierra inesperadamente.

---

## Agregar sonido de alerta personalizado

1. Abrí **Settings** en la app
2. Hacer click en **"Choose file…"** en la sección de sonido
3. Selecciona un archivo de audio (mp3, ogg, wav, flac, aac, webm)
4. El nombre del archivo queda guardado y se restaura en la próxima sesión

> El path absoluto del archivo **nunca** sale del proceso principal de Electron por razones de seguridad.

---

## Tests

```bash
npm test
```

Ejecuta los tests unitarios con Karma y Jasmine. Los tests cubren los servicios principales (timer, catálogo, notificaciones, settings, timezone).

---

## Apoyar el proyecto

Si la app te es útil, podés invitarme un café ☕  
👉 [ko-fi.com/sarjador](https://ko-fi.com/sarjador)

---

## Licencia

Proyecto privado. Todos los derechos reservados.
