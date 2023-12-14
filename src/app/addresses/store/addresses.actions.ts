import { Shipping, Billing } from "src/app/shared/wooApi";

export namespace AddressesActions {
    export class UpdateShippingAddress {
        static type = '[ChckoutActions] Update Checkout Tabs State';
        constructor(public address: Shipping) { }
    }
    export class UpdateBillingAddress {
        static type = '[ChckoutActions] Selected Checkout Tabs State';
        constructor(public address: Billing) { }
    }
}