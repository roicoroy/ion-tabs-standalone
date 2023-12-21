import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { KeypadModule } from '../shared/native/keyboard/keypad.module';
import { Observable, Subject, take, takeUntil } from 'rxjs';

import { AddressesComponent } from '../components/addresses/addresses-list/addresses.component';
import { CustomerActions } from '../store/customer/customer.actions';
import { IProfileFacade, ProfileFacade } from './profile.facade';
import { ListOrderParameters, WoocommerceOrderService } from '../shared/wooApi';

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

  pageTitle = 'Profile Page';

  viewState$!: Observable<IProfileFacade>;

  private facade = inject(ProfileFacade);

  private readonly ngUnsubscribe = new Subject();

  private store = inject(Store);

  ngOnInit() {
    this.store.dispatch(new CustomerActions.RetrieveAllCustomers());
    this.store.dispatch(new CustomerActions.GetCustomerOrders());
    this.viewState$ = this.facade.viewState$;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
