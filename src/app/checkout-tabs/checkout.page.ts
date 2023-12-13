import { Component, EnvironmentInjector, inject } from '@angular/core';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, checkmarkOutline, book, wallet, bicycle, cart } from 'ionicons/icons';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CheckoutHeaderComponent } from './header/header.component';
import { CheckoutTabsFacade, ICheckoutTabsFacadeModel } from './checkout.facade';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { CheckoutActions } from './checkout-store/checkout.actions';

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

  constructor() {
    addIcons({
      triangle,
      ellipse,
      square,
      checkmarkOutline,
      book,
      cart,
      wallet,
      bicycle
    });
  }

  ionViewWillEnter() {
    this.viewState$ = this.facade.viewState$;
  }


  // ionTabsDidChange($event: any) {
  //   const selectedTab = $event.tab;
  //   this.store.dispatch(new CheckoutActions.SelectedCheckoutTabsState(selectedTab));
  // }

}
