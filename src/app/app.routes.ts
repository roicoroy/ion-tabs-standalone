import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  // {
  //   path: '',
  //   redirectTo: '/checkout/cart-review',
  //   pathMatch: 'full',
  // },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout-tabs/checkout.routes').then((m) => m.routes),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
];
