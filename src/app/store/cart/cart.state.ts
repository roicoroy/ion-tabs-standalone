
import { Injectable, OnDestroy, inject } from '@angular/core';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { CartActions } from './cart.actions';
import { LineItem, Order } from 'src/app/shared/wordpress/utils/types/wooCommerceTypes';
import { WoocommerceOrderService } from 'src/app/shared/wooApi';
import { CustomerState } from 'src/app/store/customer/customer.state';
import { LoadingService } from 'src/app/shared/utils/loading.service';

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

    private loadingService = inject(LoadingService);

    private readonly ngUnsubscribe = new Subject();

    @Selector()
    static getCart(state: ICartStateModel): Order {
        return state.cart;
    }

    // @Action(CartActions.AddProductToCart)
    // addProductToCart(ctx: StateContext<ICartStateModel>, { productId, quantity }: CartActions.AddProductToCart) {
    //     // console.log(productId, quantity);
    //     const customer = this.store.selectSnapshot(CustomerState.getCustomer);
    //     // console.log(customer.id);
    //     const cart = this.store.selectSnapshot(CartState.getCart);
    //     const line_items = [
    //         {
    //             product_id: productId,
    //             quantity,
    //         },
    //     ]
    //     if (cart && customer?.id) {
    //         // update Cart items
    //         this.store.dispatch(new CartActions.UpdateOrder(line_items, customer.id));
    //     } else if (!cart && customer?.id) {
    //         // Create cart
    //         this.store.dispatch(new CartActions.CreateCartOrder(line_items, customer.id));
    //     } else {
    //         alert('login first')
    //     }
    // }

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
                    // console.log('CartActions.CreateCart', order);
                    return ctx.patchState({
                        ...state,
                        cart: order
                    });
                });
        }
    }

    @Action(CartActions.UpdateOrder)
    updateOrder(ctx: StateContext<ICartStateModel>, { lineItems, cutomerId }: CartActions.UpdateOrder) {
        const state = ctx.getState();
        // console.log('updateOrder', lineItems, cutomerId);
        // console.log('updateOrder', payload.quantity);
        const cart = this.store.selectSnapshot(CartState.getCart);
        // console.log(cart);
        if (cart) {
            const newOrder: Order = {
                // ...cart,
                id: cart.id,
                customer_id: cart.customer_id,
                line_items: sortLineItems(cart.line_items, lineItems[0]),
            }
            console.log(newOrder);
            this.wooApiOrders.updateOrder(newOrder)
                .subscribe((order: Order) => {
                    console.log('updated Order', order);
                    return ctx.patchState({
                        ...state,
                        cart: order
                    });
                });
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
    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
}

export const sortLineItems = (lineItems: LineItem[], lineItem: LineItem): LineItem[] => {
    console.log(lineItems, lineItem);
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