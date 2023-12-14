
export namespace CartActions {
    export class LoadCartItems {
        static readonly type = '[CartActions] Load Cart Items';
    }
    export class AddProductToCart {
        static readonly type = '[CartActions] Add Product To Cart';
        constructor(public productId: number) { }
    }
    export class RemoveProductFromCart {
        static readonly type = '[CartActions] Remove Product From Cart';
        constructor(public productId: number) { }
    }
    export class RemoveProductFromList {
        static readonly type = '[CartActions] Remove Product From List';
        constructor(public productId: number) { }
    }
}