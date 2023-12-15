import { Shipping, Billing } from "src/app/shared/wooApi";

export namespace AddressesActions {

    export class UpdateBillingAddress {
        static type = '[ChckoutActions] Selected Checkout Tabs State';
        constructor(public billing_address: Billing | undefined) { }
    }
    export class UpdateShippingAddress {
        static type = '[ChckoutActions] Update Checkout Tabs State';
        constructor(public shipping_address: Shipping | undefined) { }
    }
    export class ClearBillingAddress {
        static type = '[ChckoutActions] Clear Billing Address';
    }
    export class ClearShippingAddress {
        static type = '[ChckoutActions] Clear Shipping Address';
    }
}