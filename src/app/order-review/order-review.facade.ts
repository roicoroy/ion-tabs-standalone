import { Injectable } from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable, combineLatest, map } from "rxjs";
import { Order } from "src/app/shared/wordpress/utils/types/wooCommerceTypes";
import { OrdersState } from "../store/orders/orders.state";

export class IOrderReviewFacadeModel {
    completedOrder: Order;
}

@Injectable({
    providedIn: 'root'
})
export class OrderReviewFacade {

    @Select(OrdersState.getCompletedOrder) completedOrder$!: Observable<Order>;

    readonly viewState$: Observable<IOrderReviewFacadeModel>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.completedOrder$,
            ]
        )
            .pipe(
                map((
                    [
                        completedOrder,
                    ]
                ) => (
                    {
                        completedOrder,
                    }
                ))
            );
    }
}
