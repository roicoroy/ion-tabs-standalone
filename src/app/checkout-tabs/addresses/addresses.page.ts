import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CheckoutHeaderComponent } from '../header/header.component';
import { Observable, Subject, combineLatest, map, take, takeUntil, tap } from 'rxjs';
import { CheckoutFooterComponent } from '../checkout-footer/checkout-footer.component';
import { CheckoutTabsService } from '../checkout-tabs.service';
import { AddressesComponent } from 'src/app/components/addresses/addresses-list/addresses.component';
import { Select, Store } from '@ngxs/store';
import { AddressesState } from 'src/app/store/addresses/addresses.state';
import { Address, Billing, Shipping } from 'src/app/shared/wooApi';
import { LoadingController } from '@ionic/angular';
import { IAddressesFacadeModel, AddressesFacade } from 'src/app/components/addresses/addresses.facade';
import { CartAddressesFacade, ICartAddressesFacadeModel } from './cart-addresses.facade';
import { AddressesActions } from 'src/app/store/addresses/addresses.actions';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['../checkout.styles.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CheckoutHeaderComponent,
    CheckoutFooterComponent,
    AddressesComponent
  ]
})
export class AddressesPage implements OnInit, OnDestroy {

  @Select(AddressesState.getBilling) billing_address$!: Observable<Billing>;

  @Select(AddressesState.getShipping) shipping_address$!: Observable<Shipping>;

  pageTitle = 'Cart Review Page';

  viewState$: Observable<ICartAddressesFacadeModel>;

  private store = inject(Store);

  private facade = inject(CartAddressesFacade);

  private service = inject(CheckoutTabsService);

  private loadingController = inject(LoadingController);

  private billing_address!: Address;
  private shipping_address!: Address;

  private readonly ngUnsubscribe = new Subject();

  async ngOnInit() {
    // const loading = await this.loadingController.create();
    // await loading.present();
    this.viewState$ = this.facade.viewState$;
    this.viewState$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        take(1)
      )
      .subscribe({
        next: async (p: any) => {
          // console.log(p.customer.billing);
          console.log(p);
          this.store.dispatch(new AddressesActions.AddAddressToSavedList(p.customer.billing))
          this.store.dispatch(new AddressesActions.AddAddressToSavedList(p.customer.shipping))
        },
      });
  }

  addNewAddressToList() {
  }
  
  addBillingToCart(address: Address) {
    // console.log(address);
    this.store.dispatch(new AddressesActions.UpdateCartBillingAddress(address))
  }

  addShippingToCart(address: Address) {
    // console.log(address);
    this.store.dispatch(new AddressesActions.UpdateCartShippingAddress(address))
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
