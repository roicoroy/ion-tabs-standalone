import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { Observable, Subject, combineLatest, map, take, takeUntil } from 'rxjs';
import { AddressesState } from '../store/addresses.state';
import { Select, Store } from '@ngxs/store';
import { Shipping, Billing, Address } from 'src/app/shared/wooApi';
import { NavigationService } from 'src/app/shared/utils/navigation.service';
import { ModalController } from '@ionic/angular';
import { AddAddressPage } from '../add-address/add-address.page';
import { AddressesFacade, IAddressesFacadeModel } from '../addresses.facade';
import { AddressesActions } from '../store/addresses.actions';
import { CustomerActions } from 'src/app/store/customer/customer.actions';

export enum EAddresses {
  billing_address,
  shipping_address
}

@Component({
  selector: 'addresses-component',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterLink
  ]
})
export class AddressesComponent implements OnInit, OnDestroy {

  @Select(AddressesState.getBilling) billing_address$!: Observable<Billing>;

  @Select(AddressesState.getShipping) shipping_address$!: Observable<Shipping>;

  billing_address!: Address;

  shipping_address!: Address;

  viewState$: Observable<IAddressesFacadeModel>;

  private store = inject(Store);

  private facade = inject(AddressesFacade);

  private modalController = inject(ModalController);

  private readonly ngUnsubscribe = new Subject();

  constructor() {
  }

  ngOnInit() {
    this.viewState$ = this.facade.viewState$;
    // this.viewState$.pipe(
    //   takeUntil(this.ngUnsubscribe),
    //   take(1),
    // )
    //   .subscribe({
    //     next: (res: any) => {
    //     },
    //     error: (e) => {
    //       console.error(e)
    //     },
    //     complete: () => { },
    //   });
  }

  clear(addressType: string) {
    if (addressType === 'billing_address') {
      this.store.dispatch(new AddressesActions.ClearBillingAddress());
    }
    if (addressType === 'shipping_address') {
      this.store.dispatch(new AddressesActions.ClearShippingAddress());
    }
  }
  // address?: Address, 
  async openModalAddressPage(addressType?: string, address?: Address) {
    // console.table(address);
    // console.table(addressType);
    const modal = await this.modalController.create({
      component: AddAddressPage,
      componentProps: {
        address: address ? address : null,
        addressType
      },
      // presentingElement
    });
    await modal.present();
    // console.table(response.data);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
