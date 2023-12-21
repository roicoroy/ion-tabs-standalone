import { Injectable } from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable, combineLatest, map } from "rxjs";
import { CartState } from "src/app/store/cart/cart.state";
import { Order } from "src/app/shared/wordpress/utils/types/wooCommerceTypes";
import { PaymentState } from "src/app/store/payment/payment.state";

export class IPaymentComponentFacadeModel {
    cart: Order;
    payment_secret_key: string;
}

@Injectable({
    providedIn: 'root'
})
export class PaymentComponentFacade {

    @Select(CartState.getCart) cart$!: Observable<Order>;

    @Select(PaymentState.getPaymentSecretKey) payment_secret_key$!: Observable<string>;

    readonly viewState$: Observable<IPaymentComponentFacadeModel>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.cart$,
                this.payment_secret_key$,
            ]
        )
            .pipe(
                map((
                    [
                        cart,
                        payment_secret_key,
                    ]
                ) => (
                    {
                        cart,
                        payment_secret_key,
                    }
                ))
            );
    }
}
