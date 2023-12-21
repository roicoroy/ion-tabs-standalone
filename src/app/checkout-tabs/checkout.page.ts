import { Component, EnvironmentInjector, inject } from '@angular/core';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, checkmarkOutline, book, wallet, bicycle, cart } from 'ionicons/icons';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CheckoutHeaderComponent } from './header/header.component';
import { CheckoutTabsFacade, ICheckoutTabsFacadeModel } from './checkout.facade';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { CheckoutActions } from '../store/checkout/checkout.actions';
import { CheckoutTabsService } from './checkout-tabs.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'checkout.page.html',
  styleUrls: ['checkout.styles.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, CheckoutHeaderComponent],
})
export class CheckoutTabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  pageTitle = 'Checkout Tabs'

  viewState$!: Observable<ICheckoutTabsFacadeModel>;

  private facade = inject(CheckoutTabsFacade);

  private store = inject(Store);

  private service = inject(CheckoutTabsService);

  constructor() {
  }

  ionViewWillEnter() {
    this.service.init();
    this.viewState$ = this.facade.viewState$;
    // this.viewState$.subscribe((vs) => {
    //   console.log(JSON.parse(vs.selectedTab));
    // });
  }
  
  onTabsWillChange($event: any) {
    const selectedTab = $event.tab;
    this.store.dispatch(new CheckoutActions.SelectedCheckoutTabsState(selectedTab));
  }
}
