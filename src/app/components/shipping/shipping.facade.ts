import { Injectable } from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable, combineLatest, map } from "rxjs";
import { ShippingState } from "../../store/shipping/shipping.state";
import { CartState } from "src/app/store/cart/cart.state";
import { Order } from "src/app/shared/wordpress/utils/types/wooCommerceTypes";

export class IShippingFacadeModel {
    shipping_methods: any;
    shipping_classes: any;
    payment_gateways: any;
    shipping_zones: any;
    tax_classes: any;
    cart: Order;
    // secret_key: any;
    selected_shipping_line: any;
}

@Injectable({
    providedIn: 'root'
})
export class ShippingFacade {

    @Select(ShippingState.getShippingMethods) shipping_methods$!: Observable<any>;

    @Select(ShippingState.getShippingClasses) shipping_classes$!: Observable<any>;

    @Select(ShippingState.getPaymentGateways) payment_gateways$!: Observable<any>;

    @Select(ShippingState.getShippingZones) shipping_zones$!: Observable<any>;

    @Select(ShippingState.getTaxClasses) tax_classes$!: Observable<any>;

    @Select(CartState.getCart) cart$!: Observable<Order>;

    // @Select(PaymentActions) secret_key$!: Observable<any>;
    
    @Select(ShippingState.getSelectedShippingLines) selected_shipping_line$!: Observable<any>;

    readonly viewState$: Observable<IShippingFacadeModel>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.shipping_methods$,
                this.shipping_classes$,
                this.payment_gateways$,
                this.shipping_zones$,
                this.tax_classes$,
                this.cart$,
                // this.secret_key$,
                this.selected_shipping_line$,
            ]
        )
            .pipe(
                map((
                    [
                        shipping_methods,
                        shipping_classes,
                        payment_gateways,
                        shipping_zones,
                        tax_classes,
                        cart,
                        // secret_key,
                        selected_shipping_line,
                    ]
                ) => (
                    {
                        shipping_methods,
                        shipping_classes,
                        payment_gateways,
                        shipping_zones,
                        tax_classes,
                        cart,
                        // secret_key,
                        selected_shipping_line,
                    }
                ))
            );
    }
}
