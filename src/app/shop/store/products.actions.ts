import { Product } from "src/app/shared/wordpress/utils/types/wooCommerceTypes";

export namespace ProductsActions {
    export class RetrieveProducts {
        static readonly type = '[Products] Get Products';
    }
    export class GetProductById {
        static readonly type = '[Result] Get Product By Id';
        constructor(public id: any) { }
    }
    export class SetSelectedProducts {
        static readonly type = '[Result] Set Selected Products';
        constructor(public payload: Product) { }
    }
    export class RemoveSelectedProducts {
        static readonly type = '[Result] Remove Selected Products';
    }
}