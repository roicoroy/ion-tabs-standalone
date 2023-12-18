import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { Shipping, Billing } from 'src/app/shared/wooApi';
import { NgxsFormPluginModule, SetFormDirty, UpdateFormValue } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AddressesActions } from '../store/addresses.actions';
import { EAddresses } from '../addresses-list/addresses.component';
import { CheckoutTabsService } from 'src/app/checkout-tabs/checkout-tabs.service';
import { IAddressesFacadeModel, AddressesFacade } from '../addresses.facade';
import { AuthActions } from 'src/app/auth/store/auth.actions';
import { CustomerActions } from 'src/app/store/customer/customer.actions';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    ReactiveFormsModule
  ]
})
export class AddAddressPage implements OnInit, OnDestroy {

  @Input() address!: Shipping | Billing;

  @Input() addressType!: string;

  addressForm: FormGroup;

  shipping_address$!: Observable<Shipping>;

  billing_address$!: Observable<Billing>;

  address_validation_messages = {
    'email': [
      { type: 'required', message: 'Name is required.' }
    ],
    'first_name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'last_name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'address_1': [
      { type: 'required', message: 'Name is required.' }
    ],
    'address_2': [
      { type: 'required', message: 'Name is required.' }
    ],
    'city': [
      { type: 'required', message: 'Name is required.' }
    ],
    'postcode': [
      { type: 'required', message: 'Name is required.' }
    ],
    'country': [
      { type: 'required', message: 'Name is required.' }
    ],
    'phone': [
      { type: 'required', message: 'Name is required.' }
    ],
  };

  viewState$: Observable<IAddressesFacadeModel>;

  private facade = inject(AddressesFacade);

  private formBuilder = inject(FormBuilder);

  private store = inject(Store);

  customerId: string;

  private readonly ngUnsubscribe = new Subject();

  constructor(
    private modalController: ModalController,
  ) {

    this.viewState$ = this.facade.viewState$;

    this.viewState$.pipe(
      takeUntil(this.ngUnsubscribe),
      take(1),
    )
      .subscribe({
        next: (res: any) => {
          // console.log('user', res.customer.id);
          this.customerId = res.customer.id
        },
      });

    this.addressForm = this.formBuilder.group({
      email: new FormControl(null, Validators.required),
      first_name: new FormControl(null, Validators.required),
      last_name: new FormControl(null, Validators.required),
      address_1: new FormControl(null, Validators.required),
      address_2: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      postcode: new FormControl(null, Validators.required),
      country: new FormControl(''),
      phone: new FormControl(null, Validators.compose([
        Validators.required,
      ])),
    });
  }

  ionViewWillEnter() {
    if (this.address) {
      this.store.dispatch([
        new UpdateFormValue({
          path: "addresses.addressForm",
          value: {
            email: this.address.email,
            first_name: this.address.first_name,
            last_name: this.address.last_name,
            address_1: this.address.address_1,
            address_2: this.address.address_2,
            city: this.address.city,
            postcode: this.address.postcode,
            country: this.address.country,
            phone: this.address.phone,
          },
        }),
        new SetFormDirty("addresses.addressForm")
      ]);
    }
  }

  ngOnInit() {
  }

  async updateBilling() {
    if (this.addressForm.valid && this.customerId) {
      const updated: string = "Billing Address Updated";
      this.store.dispatch(new AddressesActions.UpdateBillingAddress(this.addressForm.value));
      this.store.dispatch(new CustomerActions.UpdateCustomerAddress(this.customerId, this.addressForm.value, this.addressType));
      await this.modalController.dismiss(updated);
    } else {
      const updated: string = "Billing Address NOT Updated";
      await this.modalController.dismiss(updated);
    }
  }

  async updateShipping() {
    if (this.addressForm.valid && this.customerId) {
      const updated: string = "Shipping Address Updated";
      this.store.dispatch(new AddressesActions.UpdateShippingAddress(this.addressForm.value));
      this.store.dispatch(new CustomerActions.UpdateCustomerAddress(this.customerId, this.addressForm.value, this.addressType));
      await this.modalController.dismiss(updated);
    } else {
      const updated: string = "Shipping Address NOT Updated";
      await this.modalController.dismiss(updated);
    }
  }

  async submit() {
    if (this.addressType === 'billing_address') {
      this.updateBilling();
    }
    if (this.addressType === 'shipping_address') {
      this.updateShipping();
    }
  }

  async dismiss() {
    const dismiss: string = "Modal Dismissed";
    await this.modalController.dismiss(dismiss);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
    this.store.dispatch([
      new UpdateFormValue({
        path: "addresses.addressForm",
        value: {
          email: null,
          first_name: null,
          last_name: null,
          address_1: null,
          address_2: null,
          city: null,
          postcode: null,
          country: null,
          phone: null,
        },
      }),
      new SetFormDirty("addresses.addressForm")
    ]);
  }
}
