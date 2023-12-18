import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from 'src/app/shared/wordpress/utils/types/wooCommerceTypes';
import { CartState } from 'src/app/store/shop/cart.state';

export interface IAddToCartFacadeModel {
    cart: Order;
}

@Injectable({
    providedIn: 'root'
})
export class AddToCartFacade {

    @Select(CartState.getCart) cart$!: Observable<Order>;

    readonly viewState$: Observable<IAddToCartFacadeModel>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.cart$,
            ]
        )
            .pipe(
                map((
                    [
                        cart
                    ]
                ) => (
                    {
                        cart
                    }
                ))
            );
    }
}
