import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
// Storage
import { IonicStorageModule } from '@ionic/storage-angular';
// Store
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { CheckoutTabsState } from './app/checkout-tabs/checkout-store/checkout.state';
import { ProductsState } from './app/shop/store/products.state';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { WooInterceptor } from './app/shared/wooApi/woo.interceptor';
import { register } from 'swiper/element/bundle';
import { CartState } from './app/shop/store/cart.state';
import { AddressesState } from './app/addresses/store/addresses.state';
register();

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WooInterceptor,
      multi: true
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    importProvidersFrom(
      HttpClientModule,
      NgxsStoragePluginModule.forRoot({
        key: [
          'checkoutTabs',
          'products',
          'cart',
          'addresses'
        ]
      })),
    importProvidersFrom(
      NgxsModule.forRoot(
        [
          CheckoutTabsState,
          ProductsState,
          CartState,
          AddressesState
        ],
        { developmentMode: false }
      ),
      NgxsReduxDevtoolsPluginModule.forRoot(),
      NgxsLoggerPluginModule.forRoot({
        disabled: true,
      }),
      NgxsFormPluginModule.forRoot(),
      IonicStorageModule.forRoot()

    ),
    provideRouter(routes),
  ],
});
