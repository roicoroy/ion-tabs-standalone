import { LineItem, Order } from "src/app/shared/wordpress/utils/types/wooCommerceTypes";

export namespace CartActions {
    export class LoadCartItems {
        static readonly type = '[CartActions] Load Cart Items';
    }
    export class RemoveProductFromCart {
        static readonly type = '[CartActions] Remove Product From Cart';
        constructor(public productId: number) { }
    }
    export class RemoveProductFromList {
        static readonly type = '[CartActions] Remove Product From List';
        constructor(public productId: number) { }
    }
    export class CreateCartOrder {
        static readonly type = '[CartActions] Create Cart Order';
        constructor(public lineItems: LineItem[], public cutomerId: number) { }
    }
    export class UpdateLineItems {
        static readonly type = '[CartActions] Update Line Items';
        constructor(public lineItems: LineItem[], public cutomerId: number) { }
    }
    export class CreateCart {
        static readonly type = '[CartActions] Create Cart';
        constructor(public order: Order) { }
    }
    export class UpdateCartOrder {
        static readonly type = '[CartActions] Update Cart Order';
        constructor(public order: Order) { }
    }
    export class ClearCartFromState {
        static readonly type = '[CartActions] Clear Cart From State';
    }
    export class GetCartByIdCart {
        static readonly type = '[CartActions] Get Cart By Id Cart';
        constructor(public cartId: any) { }
    }
}
