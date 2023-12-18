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
import { AddressesComponent } from '../components/addresses/addresses-list/addresses.component';
import { CustomerState } from '../store/customer/customer.state';
import { CustomerActions } from '../store/customer/customer.actions';
import { IProfileFacade, ProfileFacade } from './profile.facade';

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

  // @Select(AuthState.getUser) user$!: Observable<UserResponse>;

  // @Select(CustomerState.getCustomer) customer$!: Observable<Customer>;

  pageTitle = 'Profile Page';

  viewState$!: Observable<IProfileFacade>;
  
  private facade = inject(ProfileFacade);

  private readonly ngUnsubscribe = new Subject();

  private store = inject(Store);

  ionViewDidEnter() {
    this.viewState$ = this.facade.viewState$;
    this.viewState$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        take(1)
      )
      .subscribe({
        next: (vs: any) => {
          console.log('cvsss', vs);
          if (vs.customer) {
            this.store.dispatch(new CustomerActions.RetrieveCustomer(vs.customer));
          } else {
            this.store.dispatch(new CustomerActions.RetrieveAllCustomers());
          }
        },
        error: (e) => {
          console.error(e)
        },
        complete: () => { },
      });

    // this.user$
    //   .pipe(
    //     takeUntil(this.ngUnsubscribe),
    //     take(1)
    //   )
    //   .subscribe({
    //     next: (p: any) => {
    //       console.log('user', p);
    //       this.store.dispatch(new CustomerActions.RetrieveCustomer(p));
    //     },
    //     error: (e) => {
    //       console.error(e)
    //     },
    //     complete: () => { },
    //   });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
