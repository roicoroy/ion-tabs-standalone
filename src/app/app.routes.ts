import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/checkout/addresses',
    pathMatch: 'full',
  },
  {
    path: 'checkout',
    // loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    loadChildren: () => import('./checkout-tabs/checkout.routes').then((m) => m.routes),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
];
