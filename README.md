# ⚔️ RO MVP Timer

Desktop application to track MVP boss respawns in **Ragnarok Online**.
Built with **Angular 20** + **Electron 35** — runs on Windows, macOS and Linux.

---

## Table of contents

1. [What does it do?](#what-does-it-do)
2. [Features](#features)
3. [Tech stack](#tech-stack)
4. [Quick start](#quick-start)
5. [Development](#development)
6. [Building executables](#building-executables)
7. [Project structure](#project-structure)
8. [Data persistence](#data-persistence)
9. [Adding a custom alert sound](#adding-a-custom-alert-sound)
10. [Troubleshooting](#troubleshooting)
11. [Contributing](#contributing)
12. [Support the project](#support-the-project)
13. [License](#license)

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

## Quick start

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

> **Note:** It is recommended to use Node.js via [nvm](https://github.com/nvm-sh/nvm) (Linux/macOS) or [nvm-windows](https://github.com/coreybutler/nvm-windows) to manage Node versions easily.

### Step-by-step installation

```bash
# 1. Clone the repository
git clone https://github.com/sarjador/RagnarokMVPtimer.git
cd RagnarokMVPtimer

# 2. Install dependencies
npm install

# 3. Start the development server (browser mode)
npm start
```

Open `http://localhost:4200` in your browser.

---

## Development

### Browser mode (quick preview)

```bash
npm start
```

Opens `http://localhost:4200` in the browser. Notifications use the browser's Web Notification API in this mode. No Electron features (native notifications, file access, persistent window) are available.

### Electron mode (full app)

```bash
npm run electron:serve
```

Compiles Angular in development mode and launches Electron with the full app, including:
- Native OS notifications
- Custom sound file access
- State persistence
- Window management (minimize, close, single instance)

### Available scripts

| Command | Description |
|---------|-------------|
| `npm start` | Angular dev server (browser, `http://localhost:4200`) |
| `npm run electron:serve` | Dev build + launch Electron |
| `npm run electron:build` | Production build of Angular (outputs to `dist/`) |
| `npm run electron:dist` | Production build + package as distributable |
| `npm test` | Run unit tests with Karma |
| `npm run scrape-bosses` | Update the boss catalog from external sources |

---

## Building executables

### All platforms

First, ensure all dependencies are installed:

```bash
npm install
```

Then run the production build + packaging:

```bash
npm run electron:build          # Build Angular app only
npm run electron:dist           # Build + package for current OS
```

The packaged files will be created in the `release/` folder.

### Windows (.exe)

#### Requirements
- Windows 10 or higher
- No additional tooling required (electron-builder handles everything)

#### Build

```bash
npm run electron:dist
```

electron-builder will produce an **NSIS installer** (`.exe`) inside `release/`.

To build only for Windows on a non-Windows machine, you can set the target explicitly:

```bash
npx electron-builder --win
```

#### Output
```
release/
└── RO MVP Timer Setup 0.1.0.exe
```

### macOS (.dmg)

#### Requirements
- macOS 10.15 (Catalina) or higher
- Node.js installed (for building)
- Optional: `brew install create-dmg` for better DMG appearance

#### Build

```bash
npm run electron:dist
```

electron-builder will produce a **Disk Image** (`.dmg`) inside `release/`.

To build only for macOS on a non-macOS machine:

```bash
npx electron-builder --mac
```

#### Output
```
release/
└── RO MVP Timer-0.1.0.dmg
```

> **Note:** If you are not on macOS, the `.dmg` target is skipped by default. Use `--mac` to force inclusion, but the resulting DMG may not be code-signed.

### Linux (.AppImage)

#### Requirements
- Any modern Linux distribution with glibc 2.28+ (Ubuntu 20.04+, Fedora 30+, etc.)
- No additional tooling required

#### Build

```bash
npm run electron:dist
```

electron-builder will produce an **AppImage** (`.AppImage`) inside `release/`.

To build only for Linux:

```bash
npx electron-builder --linux
```

To target a specific Linux format:

```bash
npx electron-builder --linux AppImage   # Most portable
npx electron-builder --linux deb        # Debian/Ubuntu
npx electron-builder --linux rpm        # Red Hat/Fedora
```

#### Output
```
release/
└── RO MVP Timer-0.1.0.AppImage
```

### Cross-platform build table

| Platform | Build command | Output file | Code signing |
|----------|--------------|-------------|--------------|
| Windows | `npx electron-builder --win` | `.exe` (NSIS) | Requires Windows |
| macOS | `npx electron-builder --mac` | `.dmg` | Requires macOS + Apple ID |
| Linux | `npx electron-builder --linux` | `.AppImage` | Works on any OS |

### Version bump

electron-builder reads the version from `package.json`. Update the `version` field before building a new release:

```json
"version": "0.2.0"
```

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
│   ├── app/
│   │   ├── core/
│   │   │   ├── i18n/           # Translations (ES / EN)
│   │   │   ├── models/         # Interfaces: BossEntry, MvpTrackerEntry, AppState
│   │   │   ├── services/       # Business logic (timers, catalog, notifications, settings)
│   │   │   └── utils/          # Time utils, validators, timezones
│   │   └── features/
│   │       ├── boss-search/    # MVP search and death registration
│   │       ├── boss-card/      # Individual MVP card in the catalog
│   │       ├── mvp-catalog/    # Full catalog view
│   │       ├── timer-list/     # Active timers list
│   │       ├── timers-page/    # Main page (search + timers)
│   │       └── settings/      # Timezone, audio and language settings
│   ├── app.config.ts           # Angular app configuration
│   ├── app.routes.ts           # Angular routing
│   ├── app.ts                  # Root component
│   └── index.html              # HTML entry point
├── angular.json                # Angular CLI configuration
├── package.json                # Project metadata and scripts
├── tsconfig.json               # TypeScript base config
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

## Troubleshooting

### `npm install` fails with peer dependency errors

```bash
# Try with legacy peer deps flag
npm install --legacy-peer-deps
```

### `ng serve` or `npm start` throws "command not found: ng"

```bash
# The Angular CLI is installed locally in node_modules/.bin
npx ng serve

# Or use the npm script directly
npm start
```

### Electron app crashes on startup

1. Check the console output in the terminal where you ran `npm run electron:serve`
2. Verify that `main.js` and `preload.js` have no syntax errors
3. Make sure the `dist/` folder exists (run `npm run electron:build` first)

### Notifications not appearing (Windows)

- Go to **Settings → Notifications** in Windows
- Search for "RO MVP Timer" and enable notifications
- Check that Do Not Disturb is off

### Notifications not appearing (macOS)

- Go to **System Settings → Notifications**
- Find "RO MVP Timer" and allow notifications
- Check that Focus mode is not blocking the app

### App window is blank or white

This usually means the Angular build failed or loaded incorrectly. Try:

```bash
# Clean and rebuild
rm -rf dist/ release/
npm run electron:build
npm run electron:serve
```

### macOS: "RO MVP Timer cannot be opened because it is from an unidentified developer"

1. Right-click the `.dmg` file → **Open**
2. Click **Open** in the dialog
3. Alternatively: **System Settings → Privacy & Security → Open Anyway**

### Linux: AppImage won't launch

Make the file executable:

```bash
chmod +x "RO MVP Timer-0.1.0.AppImage"
./"RO MVP Timer-0.1.0.AppImage"
```

---

## Tests

```bash
npm test
```

Runs unit tests with Karma and Jasmine. Tests cover the main services (timer, catalog, notifications, settings, timezone).

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and commit: `git commit -m "Add my feature"`
4. Push to your fork: `git push origin feature/my-feature`
5. Open a Pull Request against `develop`

Please keep the code style consistent with the project's Prettier and ESLint configuration.

---

## Support the project

If you find RO MVP Timer useful and want to support its development, your contribution is very much appreciated!

Every coffee, tip, or support message keeps the motivation going ☕

👉 **[ko-fi.com/sarjador](https://ko-fi.com/sarjador)**

---

## License

Private project. All rights reserved.

---

---

# ⚔️ RO MVP Timer — Español

Aplicación de escritorio para trackear el respawn de MVPs en **Ragnarok Online**.
Construida con **Angular 20** + **Electron 35** — funciona en Windows, macOS y Linux.

---

## Tabla de contenidos

1. [¿Qué hace?](#qué-hace)
2. [Funcionalidades](#funcionalidades)
3. [Stack tecnológico](#stack-tecnológico)
4. [Inicio rápido](#inicio-rápido)
5. [Desarrollo](#desarrollo)
6. [Compilar ejecutables](#compilar-ejecutables)
7. [Estructura del proyecto](#estructura-del-proyecto)
8. [Persistencia de datos](#persistencia-de-datos)
9. [Agregar sonido de alerta personalizado](#agregar-sonido-de-alerta-personalizado)
10. [Solución de problemas](#solución-de-problemas)
11. [Contribuir](#contribuir)
12. [Apoyar el proyecto](#apoyar-el-proyecto)
13. [Licencia](#licencia)

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

## Inicio rápido

### Requisitos previos

- **Node.js** v18 o superior
- **npm** v9 o superior

> **Recomendación:** Usa [nvm](https://github.com/nvm-sh/nvm) (Linux/macOS) o [nvm-windows](https://github.com/coreybutler/nvm-windows) para gestionar versiones de Node.js fácilmente.

### Instalación paso a paso

```bash
# 1. Clonar el repositorio
git clone https://github.com/sarjador/RagnarokMVPtimer.git
cd RagnarokMVPtimer

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo (modo navegador)
npm start
```

Abrí `http://localhost:4200` en tu navegador.

---

## Desarrollo

### Modo navegador (vista rápida)

```bash
npm start
```

Abre `http://localhost:4200` en el navegador. Las notificaciones usan la Web Notification API del navegador en este modo. No hay acceso a funciones de Electron (notificaciones nativas, acceso a archivos, ventana persistente).

### Modo Electron (app completa)

```bash
npm run electron:serve
```

Compila Angular en modo desarrollo y lanza Electron con la app completa, incluyendo:
- Notificaciones nativas del SO
- Acceso a archivos de sonido personalizados
- Persistencia de estado
- Gestión de ventana (minimizar, cerrar, instancia única)

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo Angular (navegador, `http://localhost:4200`) |
| `npm run electron:serve` | Build dev + lanzar Electron |
| `npm run electron:build` | Build de producción de Angular (salida a `dist/`) |
| `npm run electron:dist` | Build de producción + empaquetar como distribuible |
| `npm test` | Ejecutar tests unitarios con Karma |
| `npm run scrape-bosses` | Actualizar el catálogo de bosses desde fuentes externas |

---

## Compilar ejecutables

### Todas las plataformas

Primero, asegurate de que las dependencias estén instaladas:

```bash
npm install
```

Después ejecutá el build de producción + empaquetado:

```bash
npm run electron:build          # Solo build de Angular
npm run electron:dist          # Build + empaquetar para el SO actual
```

Los archivos empaquetados se crean en la carpeta `release/`.

### Windows (.exe)

#### Requisitos
- Windows 10 o superior
- No se necesita tooling adicional (electron-builder maneja todo)

#### Build

```bash
npm run electron:dist
```

electron-builder produce un **instalador NSIS** (`.exe`) dentro de `release/`.

Para buildear solo para Windows en una máquina que no sea Windows:

```bash
npx electron-builder --win
```

#### Salida
```
release/
└── RO MVP Timer Setup 0.1.0.exe
```

### macOS (.dmg)

#### Requisitos
- macOS 10.15 (Catalina) o superior
- Node.js instalado (para buildear)
- Opcional: `brew install create-dmg` para mejor apariencia del DMG

#### Build

```bash
npm run electron:dist
```

electron-builder produce un **Disk Image** (`.dmg`) dentro de `release/`.

Para buildear solo para macOS en una máquina que no sea macOS:

```bash
npx electron-builder --mac
```

#### Salida
```
release/
└── RO MVP Timer-0.1.0.dmg
```

> **Nota:** Si no estás en macOS, el target `.dmg` se saltea por defecto. Usá `--mac` para forzar la inclusión, pero el DMG resultante puede no estar code-signed.

### Linux (.AppImage)

#### Requisitos
- Cualquier distribución Linux moderna con glibc 2.28+ (Ubuntu 20.04+, Fedora 30+, etc.)
- No se necesita tooling adicional

#### Build

```bash
npm run electron:dist
```

electron-builder produce un **AppImage** (`.AppImage`) dentro de `release/`.

Para buildear solo para Linux:

```bash
npx electron-builder --linux
```

Para apuntar a un formato Linux específico:

```bash
npx electron-builder --linux AppImage   # Más portable
npx electron-builder --linux deb        # Debian/Ubuntu
npx electron-builder --linux rpm        # Red Hat/Fedora
```

#### Salida
```
release/
└── RO MVP Timer-0.1.0.AppImage
```

### Tabla de compilación cruzada

| Plataforma | Comando de build | Archivo de salida | Code signing |
|------------|-----------------|-------------------|--------------|
| Windows | `npx electron-builder --win` | `.exe` (NSIS) | Requiere Windows |
| macOS | `npx electron-builder --mac` | `.dmg` | Requiere macOS + Apple ID |
| Linux | `npx electron-builder --linux` | `.AppImage` | Funciona en cualquier SO |

### Cambiar versión

electron-builder lee la versión de `package.json`. Actualizá el campo `version` antes de buildear un nuevo release:

```json
"version": "0.2.0"
```

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
│   ├── app/
│   │   ├── core/
│   │   │   ├── i18n/           # Traducciones (ES / EN)
│   │   │   ├── models/         # Interfaces: BossEntry, MvpTrackerEntry, AppState
│   │   │   ├── services/       # Lógica de negocio (timers, catálogo, notificaciones, settings)
│   │   │   └── utils/          # Time utils, validadores, timezones
│   │   └── features/
│   │       ├── boss-search/    # Búsqueda y registro de muerte de un MVP
│   │       ├── boss-card/      # Tarjeta individual de un MVP en el catálogo
│   │       ├── mvp-catalog/    # Vista del catálogo completo
│   │       ├── timer-list/     # Lista de timers activos
│   │       ├── timers-page/   # Página principal (search + timers)
│   │       └── settings/       # Configuración de timezone, audio e idioma
│   ├── app.config.ts           # Configuración de Angular
│   ├── app.routes.ts           # Ruteo de Angular
│   ├── app.ts                  # Componente raíz
│   └── index.html              # Punto de entrada HTML
├── angular.json                # Configuración de Angular CLI
├── package.json                # Metadatos del proyecto y scripts
├── tsconfig.json               # Configuración base de TypeScript
└── openspec/                  # Especificaciones de cambios (historial de features)
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

## Solución de problemas

### `npm install` falla con errores de peer dependencies

```bash
# Probá con el flag legacy peer deps
npm install --legacy-peer-deps
```

### `ng serve` o `npm start` dice "command not found: ng"

```bash
# Angular CLI está instalado localmente en node_modules/.bin
npx ng serve

# O usá el script de npm directamente
npm start
```

### La app Electron crashea al iniciar

1. Revisá la salida de consola en la terminal donde corriste `npm run electron:serve`
2. Verificá que `main.js` y `preload.js` no tengan errores de sintaxis
3. Asegurate de que la carpeta `dist/` exista (corré `npm run electron:build` primero)

### Las notificaciones no aparecen (Windows)

- Andá a **Configuración → Notificaciones** en Windows
- Buscá "RO MVP Timer" y habilitá las notificaciones
- Verificá que el modo No Molestar esté desactivado

### Las notificaciones no aparecen (macOS)

- Andá a **Configuración del Sistema → Notificaciones**
- Buscá "RO MVP Timer" y permití notificaciones
- Verificá que el modo Focus no esté bloqueando la app

### Ventana de la app en blanco o blanca

Esto suele significar que el build de Angular falló o no se cargó correctamente. Intentá:

```bash
# Limpiar y rebuild
rm -rf dist/ release/
npm run electron:build
npm run electron:serve
```

### macOS: "RO MVP Timer no puede abrirse porque es de un desarrollador no identificado"

1. Hacé click derecho en el archivo `.dmg` → **Abrir**
2. Hacé click en **Abrir** en el diálogo
3. Alternativamente: **Configuración del Sistema → Privacidad y Seguridad → Abrir de todos modos**

### Linux: AppImage no ejecuta

Hacé el archivo ejecutable:

```bash
chmod +x "RO MVP Timer-0.1.0.AppImage"
./"RO MVP Timer-0.1.0.AppImage"
```

---

## Tests

```bash
npm test
```

Ejecuta los tests unitarios con Karma y Jasmine. Los tests cubren los servicios principales (timer, catálogo, notificaciones, settings, timezone).

---

## Contribuir

1. Hacé un fork del repositorio
2. Creá una rama para tu feature: `git checkout -b feature/mi-feature`
3. Hacé tus cambios y commiteá: `git commit -m "Add mi feature"`
4. Pusheá a tu fork: `git push origin feature/mi-feature`
5. Abrí un Pull Request contra `develop`

Por favor, mantené el estilo de código consistente con la configuración de Prettier y ESLint del proyecto.

---

## Apoyar el proyecto

Si RO MVP Timer te resulta útil y querés apoyar su desarrollo, tu contribución es muy apreciada!

Cada café, donación o mensaje de apoyo mantiene la motivación viva ☕

👉 **[ko-fi.com/sarjador](https://ko-fi.com/sarjador)**

---

## Licencia

Proyecto privado. Todos los derechos reservados.
