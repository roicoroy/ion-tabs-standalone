import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from '../auth/store/auth.state';
import { UserResponse } from '../shared/wooApi';
import { CustomerState } from '../store/customer/customer.state';
import { Customer } from '../shared/wordpress/utils/types/wooCommerceTypes';

export interface IProfileFacade {
    isLoggedIn: boolean,
    user: UserResponse,
    customer: Customer
}

@Injectable({
    providedIn: 'root'
})
export class ProfileFacade {

    @Select(AuthState.isLoggedIn) isLoggedIn$!: Observable<boolean>;

    @Select(AuthState.getUser) user$!: Observable<UserResponse>;

    @Select(CustomerState.getCustomer) customer$!: Observable<Customer>;

    readonly viewState$: Observable<IProfileFacade>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.isLoggedIn$,
                this.user$,
                this.customer$,
            ]
        )
            .pipe(
                map((
                    [
                        a,
                        b,
                        customer
                    ]
                ) => ({
                    isLoggedIn: a,
                    user: b,
                    customer
                }))
            );
    }
}
