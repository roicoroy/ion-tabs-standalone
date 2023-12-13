import { Routes } from '@angular/router';
import { CheckoutTabsPage } from './checkout.page';

export const routes: Routes = [
  {
    path: '',
    component: CheckoutTabsPage,
    children: [
      {
        path: 'addresses',
        loadComponent: () => import('./addresses/addresses.page').then( m => m.AddressesPage)
      },
      {
        path: 'shipping',
        loadComponent: () => import('./shipping/shipping.page').then( m => m.ShippingPage)
      },
      {
        path: 'payment',
        loadComponent: () => import('./payment/payment.page').then( m => m.PaymentPage)
      },
      {
        path: 'cart-review',
        loadComponent: () => import('./cart-review/cart-review.page').then( m => m.CartReviewPage)
      },
      {
        path: '',
        redirectTo: '/cart-review',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/cart-review',
    pathMatch: 'full',
  },
];
