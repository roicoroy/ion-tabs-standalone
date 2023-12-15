import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule, Select, Store } from '@ngxs/store';
import { KeypadModule } from '../shared/native/keyboard/keypad.module';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { AuthState } from '../auth/store/auth.state';
import { UserResponse } from '../shared/wooApi';

import { Customer } from '../shared/wordpress/utils/types/wooCommerceTypes';
import { AddressesComponent } from '../addresses/addresses-list/addresses.component';
import { AddressesActions } from '../addresses/store/addresses.actions';
import { CustomerState } from './customer/customer.state';
import { CustomerActions } from './customer/customer.actions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    KeypadModule,
    AddressesComponent
  ]
})
export class ProfilePage implements OnInit, OnDestroy {

  @Select(AuthState.getUser) user$!: Observable<UserResponse>;

  @Select(CustomerState) customer$!: Observable<Customer>;

  pageTitle = 'Profile Page';

  private readonly ngUnsubscribe = new Subject();

  private store = inject(Store);

  ionViewWillEnter() {
    this.user$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        take(1)
      )
      .subscribe({
        next: (p: UserResponse) => {
          // console.log('complete', p);
          // this.store.dispatch(new CustomerActions.RetrieveAllCustomers());
          // this.store.dispatch(new CustomerActions.RetrieveCustomer(p.user_email));
        },
        error: (e) => {
          console.error(e)
        },
        complete: () => { },
      });

    this.customer$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        take(1)
      )
      .subscribe({
        next: (p: Customer) => {
          this.store.dispatch(new AddressesActions.UpdateBillingAddress(p.billing));
          this.store.dispatch(new AddressesActions.UpdateShippingAddress(p.shipping));
          console.log('complete', p);
        }
      });
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
