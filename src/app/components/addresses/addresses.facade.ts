import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest, map } from 'rxjs';
import { Billing, Shipping, UserResponse } from 'src/app/shared/wooApi';
import { AddressesState } from './store/addresses.state';
import { CustomerActions } from '../../store/customer/customer.actions';
import { Customer } from '../../shared/wordpress/utils/types/wooCommerceTypes';
import { CustomerState } from '../../store/customer/customer.state';

export interface IAddressesFacadeModel {
    shipping_address: Shipping;
    billing_address: Billing;
    customer: any
}

@Injectable({
    providedIn: 'root'
})
export class AddressesFacade {

    @Select(AddressesState.getShipping) shipping_address$!: Observable<Shipping>;

    @Select(AddressesState.getBilling) billing_address$!: Observable<Billing>;

    @Select(CustomerState.getCustomer) customer$!: Observable<any>;

    

    readonly viewState$: Observable<IAddressesFacadeModel>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.shipping_address$,
                this.billing_address$,
                this.customer$,
            ]
        )
            .pipe(
                map((
                    [
                        shipping_address,
                        billing_address,
                        customer,
                    ]
                ) => ({
                    shipping_address: shipping_address,
                    billing_address: billing_address,
                    customer: customer
                }))
            ) as any;
    }
}
