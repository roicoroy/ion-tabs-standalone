
import { Injectable, OnDestroy, inject } from '@angular/core';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { CartActions } from './cart.actions';
import { Order } from 'src/app/shared/wordpress/utils/types/wooCommerceTypes';
import { WoocommerceOrderService } from 'src/app/shared/wooApi';
// import { ErrorLoggingActions } from 'src/app/store/errors-logging/errors-logging.actions';
// export interface CartItem {
//     productId: Product["id"];
//     quantity: number;
//     total: number;
//     id?: number;
//     name?: string;
//     price?: number;
// }

// export function createCartItem(params: Partial<Order>) {
//     return {
//         total: 0,
//         quantity: 1,
//         ...params
//     } as Order;
// }

export interface ICartStateModel {
    // cartItems: CartItem[];
    cart: Order
}

@State<ICartStateModel>({
    name: 'cart',
    defaults: {
        // cartItems: [],
        cart: null
    }
})
@Injectable({
    providedIn: 'root'
})
export class CartState implements OnDestroy {

    private store = inject(Store);

    private wooApiOrders = inject(WoocommerceOrderService);

    private readonly ngUnsubscribe = new Subject();

    // @Selector()
    // static getCartItems(state: ICartStateModel): CartItem[] {
    //     return state.cartItems;
    // }

    @Selector()
    static getCart(state: ICartStateModel): Order {
        return state.cart;
    }

    // @Selector([ProductsState])
    // static cartItems(state: ICartStateModel, productState: IProductsStateModel) {
    //     const { cart } = state;
    //     const products = productState.products;
    //     return joinItems(cart, products);
    // }

    // @Selector([ProductsState])
    // static cartTotal(state: ICartStateModel, productState: IProductsStateModel) {
    //     const { cartItems } = state;
    //     const products = productState.products;
    //     return joinItems(cartItems, products).reduce(
    //         (total, item) => total + item.total,
    //         0
    //     );
    // }

    // @Action(CartActions.LoadCartItems)
    // loadCartItems({ getState }: StateContext<ICartStateModel>) {
    //     const { cartItems } = getState();
    //     const products = this.store.selectSnapshot(ProductsState.getProducts);
    //     return joinItems(cartItems, products);
    // }

    @Action(CartActions.AddProductToCart)
    addProductToCart(ctx: StateContext<ICartStateModel>, { productId, quantity }: CartActions.AddProductToCart) {
        // const cartItems = getState().cartItems;
        console.log(productId, quantity);
        const order: Order = {
            customer_id: 22,
            line_items: [
                {
                    product_id: productId,
                    quantity,
                },
            ],
        };
        console.log(order);
    }

    @Action(CartActions.CreateOrder)
    CreateOrder(ctx: StateContext<ICartStateModel>, { payload }: CartActions.CreateOrder) {
        const state = ctx.getState();
        console.log(payload);
        this.wooApiOrders.createOrder(payload)
            .subscribe((order: Order) => {
                console.log(order);
                return ctx.patchState({
                    ...state,
                    cart: order
                });
            })
    }

    @Action(CartActions.UpdateOrder)
    updateOrder(ctx: StateContext<ICartStateModel>, { payload }: CartActions.UpdateOrder) {
        const state = ctx.getState();

        console.log('updateOrder', payload);

        this.wooApiOrders.updateOrder(payload)
            .subscribe((order: Order) => {
                console.log(order);
                return ctx.patchState({
                    ...state,
                    cart: order
                });
            })
    }

    @Action(CartActions.RemoveProductFromCart)
    removeProductFromCart(ctx: StateContext<ICartStateModel>, { productId }: CartActions.RemoveProductFromCart) {
        // const cartItems = ctx.getState().cartItems;

        // const findIndex = cartItems.findIndex(c => productId === c.productId);
        // if (findIndex > -1) {
        //     return ctx.patchState({
        //         cartItems: cartItems.map((i, index) => {
        //             if (index !== findIndex) {
        //                 return i;
        //             }
        //             if (i.quantity === 0) {
        //                 return i;
        //             }
        //             return {
        //                 ...i,
        //                 quantity: i.quantity - 1
        //             };
        //         })
        //     });
        // }

        // const item = createCartItem({
        //     productId: productId
        // });

        // ctx.patchState({
        //     cartItems: [...ctx.getState().cartItems, item]
        // });
    }

    @Action(CartActions.RemoveProductFromList)
    removeProductFromList(ctx: StateContext<ICartStateModel>, { productId }: CartActions.RemoveProductFromList) {
        // const cartItems = ctx.getState().cartItems;
        // const findIndex = cartItems.findIndex(c => productId === c.productId);
        // const removeITem = (productId: number) => {
        //     const res = cartItems.filter(obj => obj.id === productId);
        //     return res;
        // }

        // if (findIndex > -1) {
        //     return ctx.patchState({
        //         cartItems: removeITem(productId),
        //     });
        // }

        // const item = createCartItem({
        //     productId: productId
        // });

        // ctx.patchState({
        //     cartItems: [...ctx.getState().cartItems, item]
        // });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
}