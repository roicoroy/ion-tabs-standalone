import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/product-list',
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
  {
    path: 'product-list',
    loadComponent: () =>
      import('./shop/product-list/product-list.page').then(m => m.ProductListPage)
  },
  {
    path: 'product-details/:id',
    loadComponent: () =>
      import('./shop/product-details/product-details.page').then(m => m.ProductDetailsPage)
  },
  {
    path: 'add-address/:address',
    loadComponent: () => import('./addresses/add-address/add-address.page').then( m => m.AddAddressPage)
  },
];
