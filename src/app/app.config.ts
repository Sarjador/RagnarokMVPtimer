import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // withHashLocation: required for Electron's file:// protocol — no HTTP server to handle
    // push-state routing, so we use hash-based URLs (#/timers, #/settings).
    provideRouter(routes, withHashLocation()),
  ],
};
