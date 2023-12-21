import { Order } from "src/app/shared/wordpress/utils/types/wooCommerceTypes";

export namespace PaymentActions {
    export class CreatePaymentIntent {
        static readonly type = '[ShippingActions] Create Payment Intent';
        constructor(public order: Order) { }
    }
    export class ClearPaymentState {
        static readonly type = '[ShippingActions] Clear Payment State';
    }
}