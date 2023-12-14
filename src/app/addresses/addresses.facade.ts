import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest, map } from 'rxjs';
import { Billing, Shipping } from 'src/app/shared/wooApi';
import { AddressesState } from './store/addresses.state';

export interface IAddressesFacadeModel {
    shipping_address: Shipping;
    billing_address: Billing;
}

@Injectable({
    providedIn: 'root'
})
export class AddressesFacade {

    @Select(AddressesState.getShipping) shipping_address$!: Observable<Shipping>;

    @Select(AddressesState.getBilling) billing_address$!: Observable<Billing>;

    readonly viewState$: Observable<IAddressesFacadeModel>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.shipping_address$,
                this.billing_address$,
            ]
        )
            .pipe(
                map((
                    shipping_address,
                    billing_address
                ) => ({
                    shipping_address,
                    billing_address: billing_address
                }))
            ) as any;
    }
}
