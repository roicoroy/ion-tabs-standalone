import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUserResponseModel, AuthState } from './auth/store/auth.state';
import { CartState } from './store/cart/cart.state';
import { Order } from './shared/wordpress/utils/types/wooCommerceTypes';

export interface IAppFacadeModel {
    user: IUserResponseModel,
    isLoggedIn: boolean;
    cart: Order;
}

@Injectable({
    providedIn: 'root'
})
export class AppFacade {

    @Select(AuthState.isLoggedIn) isLoggedIn$!: Observable<boolean>;

    @Select(AuthState.getUser) user$!: Observable<IUserResponseModel>;

    @Select(CartState.getCart) cart$!: Observable<Order>;

    readonly viewState$: Observable<any>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.isLoggedIn$,
                this.user$,
                this.cart$,
            ]
        )
            .pipe(
                map((
                    [
                        isLoggedIn,
                        user,
                        cart,
                    ]
                ) => (
                    {
                        isLoggedIn,
                        user,
                        cart,
                    }
                ))
            );
    }
}
