import { LOCALE_ID, enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { WooInterceptor } from './app/shared/wooApi/woo.interceptor';
import { register } from 'swiper/element/bundle';
import { CartState } from './app/shop/store/cart.state';
import { AddressesState } from './app/addresses/store/addresses.state';
import { AuthState } from './app/auth/store/auth.state';
import { ErrorsLoggingState } from './app/store/errors-logging/errors-logging.state';
import { KeyboardState } from './app/store/keyboard/keyboard.state';
import { SettingsState } from './app/store/settings/settings.state';
import { KeypadModule } from './app/shared/native/keyboard/keypad.module';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
register();
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import localePt from '@angular/common/locales/pt';
import localeEn from '@angular/common/locales/en';
import { IMAGE_CONFIG, registerLocaleData } from '@angular/common';
registerLocaleData(localeEn, 'en');
registerLocaleData(localePt, 'pt');
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
import { NgxStripeModule } from 'ngx-stripe';
import { CustomerState } from './app/checkout-tabs/shipping/store/shipping.state';

defineCustomElements(window);
if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: LOCALE_ID, useValue: 'en' },
    {
      // https://angular.io/guide/image-directive
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true
      }
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WooInterceptor,
      multi: true
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    importProvidersFrom(
      HttpClientModule,
      NgxStripeModule.forRoot(environment.STRIPE_PUBLISHABLE_KEY),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
        }
      }),
      BrowserAnimationsModule,
      HttpClientModule,
      KeypadModule,
      NgxsStoragePluginModule.forRoot({
        key: [
          'auth',
          'customer',
          'products',
          'settings',
          'errors',
          'keyboard',
          'checkoutTabs',
          'cart',
          'addresses',
        ]
      })),
    importProvidersFrom(
      NgxsModule.forRoot(
        [
          AuthState,
          CustomerState,
          ProductsState,
          SettingsState,
          ErrorsLoggingState,
          KeyboardState,
          CheckoutTabsState,
          CartState,
          AddressesState,
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
