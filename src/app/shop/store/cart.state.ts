
import { Injectable, OnDestroy, inject } from '@angular/core';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { joinItems } from '../products.interface';
import { CartActions } from './cart.actions';
import { IProductsStateModel, ProductsState } from './products.state';
import { Product } from 'src/app/shared/wordpress/utils/types/wooCommerceTypes';
// import { ErrorLoggingActions } from 'src/app/store/errors-logging/errors-logging.actions';
export interface CartItem {
    productId: Product["id"];
    quantity: number;
    total: number;
    id?: number;
    name?: string;
    price?: number;
}

export function createCartItem(params: Partial<CartItem>) {
    return {
        total: 0,
        quantity: 1,
        ...params
    } as CartItem;
}

export interface ICartStateModel {
    cartItems: CartItem[];
}

@State<ICartStateModel>({
    name: 'cart',
    defaults: {
        cartItems: []
    }
})
@Injectable({
    providedIn: 'root'
})
export class CartState implements OnDestroy {

    private store = inject(Store);

    private readonly ngUnsubscribe = new Subject();

    @Selector()
    static getCartItems(state: ICartStateModel): CartItem[] {
        return state.cartItems;
    }

    @Selector([ProductsState])
    static cartItems(state: ICartStateModel, productState: IProductsStateModel) {
        const { cartItems } = state;
        const products = productState.products;
        return joinItems(cartItems, products);
    }

    @Selector([ProductsState])
    static cartTotal(state: ICartStateModel, productState: IProductsStateModel) {
        const { cartItems } = state;
        const products = productState.products;
        return joinItems(cartItems, products).reduce(
            (total, item) => total + item.total,
            0
        );
    }

    @Action(CartActions.LoadCartItems)
    loadCartItems({ getState }: StateContext<ICartStateModel>) {
        const { cartItems } = getState();
        const products = this.store.selectSnapshot(ProductsState.getProducts);
        return joinItems(cartItems, products);
    }

    @Action(CartActions.AddProductToCart)
    addProductToCart({ getState, patchState }: StateContext<ICartStateModel>, { productId }: CartActions.AddProductToCart) {
        const cartItems = getState().cartItems;

        const findIndex = cartItems.findIndex(c => productId === c.productId);
        if (findIndex > -1) {
            return patchState({
                cartItems: cartItems.map((i, index) => {
                    if (index !== findIndex) {
                        return i;
                    }
                    return {
                        ...i,
                        quantity: i.quantity + 1
                    };
                })
            });
        }

        const item = createCartItem({
            productId: productId
        });

        patchState({
            cartItems: [...getState().cartItems, item]
        });
    }

    @Action(CartActions.RemoveProductFromCart)
    removeProductFromCart(ctx: StateContext<ICartStateModel>, { productId }: CartActions.RemoveProductFromCart) {
        const cartItems = ctx.getState().cartItems;

        const findIndex = cartItems.findIndex(c => productId === c.productId);
        if (findIndex > -1) {
            return ctx.patchState({
                cartItems: cartItems.map((i, index) => {
                    if (index !== findIndex) {
                        return i;
                    }
                    if (i.quantity === 0) {
                        return i;
                    }
                    return {
                        ...i,
                        quantity: i.quantity - 1
                    };
                })
            });
        }

        const item = createCartItem({
            productId: productId
        });

        ctx.patchState({
            cartItems: [...ctx.getState().cartItems, item]
        });
    }

    @Action(CartActions.RemoveProductFromList)
    removeProductFromList(ctx: StateContext<ICartStateModel>, { productId }: CartActions.RemoveProductFromList) {
        const cartItems = ctx.getState().cartItems;
        const findIndex = cartItems.findIndex(c => productId === c.productId);
        const removeITem = (productId: number) => {
            const res = cartItems.filter(obj => obj.id === productId);
            return res;
        }

        if (findIndex > -1) {
            return ctx.patchState({
                cartItems: removeITem(productId),
            });
        }

        const item = createCartItem({
            productId: productId
        });

        ctx.patchState({
            cartItems: [...ctx.getState().cartItems, item]
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
}