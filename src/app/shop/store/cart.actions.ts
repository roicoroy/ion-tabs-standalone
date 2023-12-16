import { Order } from "src/app/shared/wordpress/utils/types/wooCommerceTypes";

export namespace CartActions {
    export class LoadCartItems {
        static readonly type = '[CartActions] Load Cart Items';
    }
    export class AddProductToCart {
        static readonly type = '[CartActions] Add Product To Cart';
        constructor(public productId: number, public quantity: number) { }
    }
    export class RemoveProductFromCart {
        static readonly type = '[CartActions] Remove Product From Cart';
        constructor(public productId: number) { }
    }
    export class RemoveProductFromList {
        static readonly type = '[CartActions] Remove Product From List';
        constructor(public productId: number) { }
    }
    export class CreateOrder {
        static readonly type = '[CartActions] Create Order';
        constructor(public payload: Order) { }
    }
    export class UpdateOrder {
        static readonly type = '[CartActions] Update Order';
        constructor(public payload: Order) { }
    }
}