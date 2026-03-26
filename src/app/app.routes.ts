import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'timers',
    loadComponent: () =>
      import('./features/timers-page/timers-page.component').then((m) => m.TimersPageComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component').then((m) => m.SettingsComponent),
  },
  { path: '', redirectTo: 'timers', pathMatch: 'full' },
  { path: '**', redirectTo: 'timers' },
];
