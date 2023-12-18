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
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./auth/forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },
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
    loadComponent: () => import('./components/addresses/add-address/add-address.page').then( m => m.AddAddressPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage)
  },
];
