import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AddressesState } from '../../../store/addresses/addresses.state';
import { Select, Store } from '@ngxs/store';
import { Shipping, Billing, Address } from 'src/app/shared/wooApi';
import { ModalController } from '@ionic/angular';
import { AddAddressPage } from '../add-address/add-address.page';
import { AddressesFacade, IAddressesFacadeModel } from '../addresses.facade';
import { AddressesActions } from '../../../store/addresses/addresses.actions';

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
    //       console.log(res);
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

  async openModalAddressPage(addressType?: string, address?: Address) {
    const modal = await this.modalController.create({
      component: AddAddressPage,
      componentProps: {
        address: address ? address : null,
        addressType
      },
    });
    await modal.present();
    // console.table(response.data);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
