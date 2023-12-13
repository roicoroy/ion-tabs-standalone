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

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    importProvidersFrom(
      NgxsStoragePluginModule.forRoot({
        key: [
          'checkoutTabs'
        ]
      })),
    importProvidersFrom(
      NgxsModule.forRoot(
        [
          CheckoutTabsState,
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
