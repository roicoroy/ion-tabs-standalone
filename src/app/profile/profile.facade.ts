import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from '../auth/store/auth.state';
import { UserResponse } from '../shared/wooApi';
import { CustomerState } from '../store/customer/customer.state';
import { Customer, Order } from '../shared/wordpress/utils/types/wooCommerceTypes';

export interface IProfileFacade {
    isLoggedIn: boolean,
    user: UserResponse,
    customer: Customer,
    customerOrders: Order[]
}

@Injectable({
    providedIn: 'root'
})
export class ProfileFacade {

    @Select(AuthState.isLoggedIn) isLoggedIn$!: Observable<boolean>;

    @Select(AuthState.getUser) user$!: Observable<UserResponse>;

    @Select(CustomerState.getCustomer) customer$!: Observable<Customer>;

    @Select(CustomerState.getCustomerOrders) customerOrders$!: Observable<Order[]>;

    readonly viewState$: Observable<IProfileFacade>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.isLoggedIn$,
                this.user$,
                this.customer$,
                this.customerOrders$,
            ]
        )
            .pipe(
                map((
                    [
                        a,
                        b,
                        customer,
                        customerOrders
                    ]
                ) => ({
                    isLoggedIn: a,
                    user: b,
                    customer,
                    customerOrders
                }))
            );
    }
}
