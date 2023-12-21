import { Injectable, inject } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable, combineLatest, map } from "rxjs";
import { CartState } from "src/app/store/cart/cart.state";
import { LineItem, Order } from "src/app/shared/wordpress/utils/types/wooCommerceTypes";
import { CartActions } from "src/app/store/cart/cart.actions";
import { CustomerState } from "src/app/store/customer/customer.state";

export class ICartComponentFacadeModel {
    cart: Order;
}

@Injectable({
    providedIn: 'root'
})
export class CartComponentFacade {

    @Select(CartState.getCart) cart$!: Observable<Order>;

    private store = inject(Store);

    readonly viewState$: Observable<ICartComponentFacadeModel>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.cart$,
            ]
        )
            .pipe(
                map((
                    [
                        cart,
                    ]
                ) => (
                    {
                        cart,
                    }
                ))
            );
    }

    getCartById() {
        const cart = this.store.selectSnapshot(CartState.getCart);
        if (cart?.id) {
            this.store.dispatch(new CartActions.GetCartByIdCart(cart.id));
        }
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
            this.store.dispatch(new CartActions.UpdateLineItems(lineItems, customer.id));
        }
    }

}
