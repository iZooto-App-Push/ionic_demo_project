import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'second-screen',
    loadComponent: () => import('./second-screen/second-screen.page').then( m => m.SecondScreenPage)
  },
  {
    path: 'second-screen',
    loadComponent: () => import('./second-screen/second-screen.page').then( m => m.SecondScreenPage)
  },
];
