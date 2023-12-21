import { Injectable } from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable, combineLatest, map } from "rxjs";
import { AddressesState } from "src/app/store/addresses/addresses.state";
import { CustomerState } from "src/app/store/customer/customer.state";
import { Address } from "src/app/shared/wooApi";
import { Customer, Order } from "src/app/shared/wordpress/utils/types/wooCommerceTypes";
import { CartState } from "src/app/store/cart/cart.state";

export class ICartAddressesFacadeModel {
    cart: Order;
    customer: Customer;
    saved_addresses: Address[];
}

@Injectable({
    providedIn: 'root'
})
export class CartAddressesFacade {

    @Select(CartState.getCart) cart$!: Observable<Order>;

    @Select(CustomerState.getCustomer) customer$!: Observable<Customer>;
    
    @Select(AddressesState.getSavedList) saved_addresses$!: Observable<Address[]>;

    readonly viewState$: Observable<ICartAddressesFacadeModel>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.cart$,
                this.customer$,
                this.saved_addresses$,
            ]
        )
            .pipe(
                map((
                    [
                        cart,
                        customer,
                        saved_addresses
                    ]
                ) => (
                    {
                        cart,
                        customer,
                        saved_addresses
                    }
                ))
            );
    }
}
