import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { Observable, Subject, combineLatest, map, takeUntil } from 'rxjs';
import { AddressesState } from '../store/addresses.state';
import { Select, Store } from '@ngxs/store';
import { Shipping, Billing, Address } from 'src/app/shared/wooApi';
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

  private billing_address!: Address;
  private shipping_address!: Address;

  private navigation = inject(NavigationService);

  private store = inject(Store);

  private modalController = inject(ModalController);

  private readonly ngUnsubscribe = new Subject();

  constructor() {
  }

  ngOnInit() { }

  clear(addressType: string) {
    if (addressType === 'billing_address') {
      this.store.dispatch(new AddressesActions.ClearBillingAddress());
    }
    if (addressType === 'shipping_address') {
      this.store.dispatch(new AddressesActions.ClearShippingAddress());
    }
  }
  // address?: Address, 
  async openModalAddressPage(addressType?: string) {
    // console.table(address);
    // console.table(addressType);
    const presentingElement: HTMLElement = document.querySelector('.main-content')!;
    const mockAddress: Address = {
      email: 'ee@ee.com',
      first_name: 'Rest ppp',
      last_name: 'Rest ppp',
      address_1: 'Rest ppp',
      address_2: 'Rest ppp',
      postcode: 'Rest ppp',
      city: 'Rest ppp',
      country: 'Rest ppp',
      phone: 'Rest ppp',
    }
    const modal = await this.modalController.create({
      component: AddAddressPage,
      componentProps: {
        address: mockAddress,
        addressType
      },
      // presentingElement
    });
    await modal.present();
    const response = await modal.onDidDismiss();
    // console.table(response.data);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
