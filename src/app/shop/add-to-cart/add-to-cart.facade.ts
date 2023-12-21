import { Injectable, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { LineItem, Order } from 'src/app/shared/wordpress/utils/types/wooCommerceTypes';
import { CustomerState } from 'src/app/store/customer/customer.state';
import { CartActions } from 'src/app/store/cart/cart.actions';
import { CartState } from 'src/app/store/cart/cart.state';

export interface IAddToCartFacadeModel {
    cart: Order;
}

@Injectable({
    providedIn: 'root'
})
export class AddToCartFacade {

    @Select(CartState.getCart) cart$!: Observable<Order>;

    private store = inject(Store);

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

    updateCart(productId: number, counterValue: number) {
        const customer = this.store.selectSnapshot(CustomerState.getCustomer);
        const cart = this.store.selectSnapshot(CartState.getCart);
        if (!cart) {
            const order: Order = {
                "customer_id": customer.id,
                "line_items": [
                    {
                        "product_id": productId,
                        "quantity": counterValue,
                    },
                ],
            };
            this.store.dispatch(new CartActions.CreateCart(order));
        } else {
            const lineItems: LineItem[] = [{
                "product_id": productId,
                "quantity": counterValue,
            }];
            this.store.dispatch(new CartActions.UpdateOrder(lineItems, customer.id));
        }
    }
}
