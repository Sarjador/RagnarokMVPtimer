import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { StatePersistenceService } from './core/services/state-persistence.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAppInitializer(() => inject(StatePersistenceService).init()),
    // withHashLocation: required for Electron's file:// protocol — no HTTP server to handle
    // push-state routing, so we use hash-based URLs (#/timers, #/settings).
    provideRouter(routes, withHashLocation()),
  ],
};
