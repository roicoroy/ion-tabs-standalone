
import { Injectable, OnDestroy, inject } from '@angular/core';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { Subject, catchError, takeUntil } from 'rxjs';
import { CartActions } from './cart.actions';
import { LineItem, Order } from 'src/app/shared/wordpress/utils/types/wooCommerceTypes';
import { WoocommerceHelperService, WoocommerceOrderService } from 'src/app/shared/wooApi';
import { LoadingService } from 'src/app/shared/utils/loading.service';
import { state } from '@angular/animations';
import { ErrorLoggingActions } from '../errors-logging/errors-logging.actions';

export interface ICartStateModel {
    cart: Order
}

@State<ICartStateModel>({
    name: 'cart',
    defaults: {
        cart: null
    }
})
@Injectable({
    providedIn: 'root'
})
export class CartState implements OnDestroy {

    private store = inject(Store);

    private wooApiOrders = inject(WoocommerceOrderService);

    private wooHelper = inject(WoocommerceHelperService)

    private loadingService = inject(LoadingService);

    private readonly ngUnsubscribe = new Subject();

    @Selector()
    static getCart(state: ICartStateModel): Order {
        return state.cart;
    }

    @Action(CartActions.CreateCartOrder)
    CreateOrder(ctx: StateContext<ICartStateModel>, { lineItems, cutomerId }: CartActions.CreateCartOrder) {
        const state = ctx.getState();
        const payload: Order = {
            customer_id: cutomerId,
            line_items: lineItems,
        };
        this.wooApiOrders.createOrder(payload)
            .subscribe((order: Order) => {
                console.log('createted Order', order);
                return ctx.patchState({
                    ...state,
                    cart: order
                });
            });
    }

    @Action(CartActions.CreateCart)
    createCart(ctx: StateContext<ICartStateModel>, { order }: CartActions.CreateCart) {
        const state = ctx.getState();
        if (order) {
            this.wooApiOrders.createOrder(order)
                .subscribe((order: Order) => {
                    console.log('Cart Created', order);
                    return ctx.patchState({
                        ...state,
                        cart: order
                    });
                });
        }
    }

    @Action(CartActions.UpdateLineItems)
    async updateLineItems(ctx: StateContext<ICartStateModel>, { lineItems, cutomerId }: CartActions.UpdateLineItems) {
        await this.loadingService.simpleLoader();
        const state = ctx.getState();
        const cart = this.store.selectSnapshot(CartState.getCart);
        try {
            if (cart) {
                const newOrder: Order = {
                    id: cart.id,
                    customer_id: cart.customer_id,
                    line_items: cart.line_items.length > 0 ? sortLineItems(cart.line_items, lineItems[0]) : lineItems,
                }
                if (newOrder) {
                    this.wooApiOrders.updateOrder(newOrder)
                        .subscribe((order: Order) => {
                            console.log('updated Order', order);
                            this.loadingService.dismissLoader();
                            return ctx.patchState({
                                ...state,
                                cart: order
                            });
                        });
                }
            }
        } catch (error: any) {
            this.wooHelper.handleError(error);
            this.loadingService.dismissLoader();
        }
    }

    @Action(CartActions.UpdateCartOrder)
    UpdateCartOrder(ctx: StateContext<ICartStateModel>, { order }: CartActions.UpdateCartOrder) {
        const state = ctx.getState();
        const cart = this.store.selectSnapshot(CartState.getCart);
        if (cart) {
            // console.log(order);
            this.wooApiOrders.updateOrder(order)
                .subscribe((order: Order) => {
                    console.log('UpdateCartOrder', order);
                    return ctx.patchState({
                        ...state,
                        cart: order
                    });
                });
        }
    }

    @Action(CartActions.ClearCartFromState)
    clearCartOrder(ctx: StateContext<ICartStateModel>) {
        return ctx.patchState({
            cart: null
        });
    }

    @Action(CartActions.RemoveProductFromCart)
    removeProductFromCart(ctx: StateContext<ICartStateModel>, { productId }: CartActions.RemoveProductFromCart) {
        console.log(productId);
    }

    @Action(CartActions.RemoveProductFromList)
    removeProductFromList(ctx: StateContext<ICartStateModel>, { productId }: CartActions.RemoveProductFromList) {
        console.log(productId);
    }

    @Action(CartActions.GetCartByIdCart)
    async getCartByIdCart(ctx: StateContext<ICartStateModel>, { cartId }: CartActions.GetCartByIdCart) {
        await this.loadingService.simpleLoader();
        const state = ctx.getState();
        try {
            this.wooApiOrders.retrieveOrder(cartId)
                .pipe(
                    takeUntil(this.ngUnsubscribe),
                    catchError(e => {
                        return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                    })
                )
                .subscribe((order: Order) => {
                    console.log('GetCartByIdCart', order);
                    this.loadingService.dismissLoader();
                    return ctx.patchState({
                        ...state,
                        cart: order,
                    });
                });
        } catch (error: any) {
            this.wooHelper.handleError(error);
            this.loadingService.dismissLoader();
        }
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
}

export const sortLineItems = (lineItems: LineItem[], lineItem: LineItem): LineItem[] => {
    // console.log(lineItems, lineItem);
    let line_items;
    lineItems.forEach((item: LineItem) => {
        if (item.product_id === lineItem.product_id) {
            line_items = [
                {
                    product_id: lineItem.product_id,
                    quantity: item.quantity + lineItem.quantity,
                },
            ];
            // console.log(line_items);
        } else {
            line_items = [
                {
                    product_id: lineItem.product_id,
                    quantity: lineItem.quantity,
                },
            ];
        }
        // console.log(item);
    });
    return line_items
}