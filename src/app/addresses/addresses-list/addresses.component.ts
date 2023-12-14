import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AddressesState } from '../store/addresses.state';
import { Select, Store } from '@ngxs/store';
import { Shipping, Billing } from 'src/app/shared/wooApi';
import { NavigationService } from 'src/app/shared/utils/navigation.service';
import { ModalController } from '@ionic/angular';
import { AddAddressPage } from '../add-address/add-address.page';
import { IAddressesFacadeModel } from '../addresses.facade';
import { AddressesActions } from '../store/addresses.actions';

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

  private navigation = inject(NavigationService);

  private store = inject(Store);

  private modalController = inject(ModalController);

  private readonly ngUnsubscribe = new Subject();

  // constructor() {
  //   // this.shipping_address$
  //   //   .pipe(takeUntil(this.ngUnsubscribe))
  //   //   .subscribe({
  //   //     next: (p: Shipping) => {
  //   //       console.log('shipping_address', p);
  //   //     },
  //   //   });
  //   // this.billing_address$
  //   //   .pipe(takeUntil(this.ngUnsubscribe))
  //   //   .subscribe({
  //   //     next: (p: Billing) => {
  //   //       console.log('billing_address', p);
  //   //     }
  //   //   });
  // }

  ngOnInit() { }

  clear(addressType: string) {
    if (addressType === 'billing_address') {
      this.store.dispatch(new AddressesActions.ClearBillingAddress());
    }
    if (addressType === 'shipping_address') {
      this.store.dispatch(new AddressesActions.ClearShippingAddress());
    }
  }

  async openModalAddressPage(address: any, addressType: string) {
    const presentingElement: HTMLElement = document.querySelector('.main-content')!;
    const modal = await this.modalController.create({
      component: AddAddressPage,
      componentProps: {
        address,
        addressType
      },
      // presentingElement
    });
    await modal.present();
    const response = await modal.onDidDismiss();
    console.table(response.data);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
