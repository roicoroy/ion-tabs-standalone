import { Injectable, OnDestroy, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Order } from 'src/app/shared/wordpress/utils/types/wooCommerceTypes';
import { OrdersActions } from './orders.actions';
import { WoocommerceOrderService } from 'src/app/shared/wooApi';
import { Subject, catchError, takeUntil } from 'rxjs';
import { ErrorLoggingActions } from '../errors-logging/errors-logging.actions';

export class IOrdersStateModel {
    completedOrder: Order;
}

@State<IOrdersStateModel>({
    name: 'order',
})
@Injectable()
export class OrdersState implements OnDestroy {

    private readonly ngUnsubscribe = new Subject();

    private store = inject(Store);

    private wooApiSerice = inject(WoocommerceOrderService);

    @Selector()
    static getCompletedOrder(state: IOrdersStateModel): Order {
        return state.completedOrder;
    }

    @Action(OrdersActions.GetCompletedOrder)
    getOrder(ctx: StateContext<IOrdersStateModel>, { orderId }: OrdersActions.GetCompletedOrder) {
        const state = ctx.getState();
        this.wooApiSerice.retrieveOrder(orderId)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(e => {
                    return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                })
            )
            .subscribe((order: any) => {
                console.log('GetOrder', order);
                return ctx.patchState({
                    ...state,
                    completedOrder: order,
                });
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }

}
