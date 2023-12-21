import { Injectable } from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable, combineLatest, map } from "rxjs";
import { ShippingState } from "../../store/shipping/shipping.state";
import { CartState } from "src/app/store/cart/cart.state";
import { Order } from "src/app/shared/wordpress/utils/types/wooCommerceTypes";
import { PaymentState } from "src/app/store/payment/payment.state";

export class IPaymentFacadeModel {
    payment_gateways: any;
    cart: Order;
    payment_secret_key: string;
}

@Injectable({
    providedIn: 'root'
})
export class PaymentFacade {

    @Select(ShippingState.getPaymentGateways) payment_gateways$!: Observable<any>;

    @Select(CartState.getCart) cart$!: Observable<Order>;

    @Select(PaymentState.getPaymentSecretKey) secret_key$!: Observable<string>;

    readonly viewState$: Observable<IPaymentFacadeModel>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.payment_gateways$,
                this.cart$,
                this.secret_key$,
            ]
        )
            .pipe(
                map((
                    [
                        payment_gateways,
                        cart,
                        payment_secret_key,
                    ]
                ) => (
                    {
                        payment_gateways,
                        cart,
                        payment_secret_key,
                    }
                ))
            );
    }
}
