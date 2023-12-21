import { Shipping, Billing } from "src/app/shared/wooApi";

export namespace AddressesActions {

    export class UpdateBillingAddress {
        static type = '[AddressesActions] Update Billing Address';
        constructor(public billing_address: Billing | undefined) { }
    }
    export class UpdateCartBillingAddress {
        static type = '[AddressesActions] Update Cart Billing Address';
        constructor(public billing_address: Billing) { }
    }
    export class UpdateCartShippingAddress {
        static type = '[AddressesActions] Update Cart Shipping Address';
        constructor(public shipping_address: Shipping) { }
    }
    export class UpdateShippingAddress {
        static type = '[AddressesActions] Update Shipping Address';
        constructor(public shipping_address: Shipping | undefined) { }
    }
    export class ClearBillingAddress {
        static type = '[AddressesActions] Clear Billing Address';
    }
    export class ClearShippingAddress {
        static type = '[AddressesActions] Clear Shipping Address';
    }
    export class AddAddressToSavedList {
        static readonly type = '[AddressesActions] Add Address To Saved List';
        constructor(public address: Billing) { }
    }
    export class RemoveAddressFromSavedList {
        static readonly type = '[AddressesActions] Remove Address From Saved List';
        constructor(public address: Billing) { }
    }
}