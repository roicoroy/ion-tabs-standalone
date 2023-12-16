import { Injectable, OnDestroy, inject } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { Subject, catchError, takeUntil } from "rxjs";
import { ShippingActions } from "./shipping.actions";
import { WoocommerceShippingService } from "../shipping.service";
import { ErrorLoggingActions } from "src/app/store/errors-logging/errors-logging.actions";

export interface IShippingStateModel {
    shipping_methods: any;
    shipping_classes: any;
    payment_gateways: any;
    shipping_zones: any;
    tax_classes: any;
}

@State<IShippingStateModel>({
    name: 'shipping',
    // defaults: {
    //     customer: null,
    //     customers: []
    // },
})
@Injectable({
    providedIn: 'root'
})
export class ShippingState implements OnDestroy {

    private readonly ngUnsubscribe = new Subject();

    private wooApiSerice = inject(WoocommerceShippingService);

    private store = inject(Store);

    @Selector()
    static getShipping(state: IShippingStateModel) {
        return state.shipping_methods;
    }

    @Action(ShippingActions.RetrieveShippingMethods)
    async retrieveShippingMethods(ctx: StateContext<IShippingStateModel>) {
        console.log('shipping_methods');
        const state = ctx.getState();
        this.wooApiSerice.retrieveShippingMethods()
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(e => {
                    return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                })
            )
            .subscribe((shipping_methods: any) => {
                console.log(shipping_methods);
                return ctx.patchState({
                    ...state,
                    shipping_methods,
                });
            });
    }

    @Action(ShippingActions.RetrieveShippingClasses)
    async retrieveShippingClasses(ctx: StateContext<IShippingStateModel>) {
        console.log('shipping_classes');
        const state = ctx.getState();
        this.wooApiSerice.retrieveShippingClasses()
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(e => {
                    return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                })
            )
            .subscribe((shipping_classes: any) => {
                console.log(shipping_classes);
                return ctx.patchState({
                    ...state,
                    shipping_classes,
                });
            });
    }

    @Action(ShippingActions.RetrievePaymentGateways)
    async retrievePaymentGateways(ctx: StateContext<IShippingStateModel>) {
        console.log('payment_gateways');
        const state = ctx.getState();
        this.wooApiSerice.retrievePaymentGateways()
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(e => {
                    return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                })
            )
            .subscribe((payment_gateways: any) => {
                console.log(payment_gateways);
                return ctx.patchState({
                    ...state,
                    payment_gateways,
                });
            });
    }

    @Action(ShippingActions.RetrieveShippingZones)
    async retrieveShippingZones(ctx: StateContext<IShippingStateModel>) {
        console.log('shipping/zones');
        const state = ctx.getState();
        this.wooApiSerice.retrieveShippingZones()
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(e => {
                    return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                })
            )
            .subscribe((shipping_zones: any) => {
                console.log(shipping_zones);
                return ctx.patchState({
                    ...state,
                    shipping_zones,
                });
            });
    }

    @Action(ShippingActions.RetrieveTaxesClasses)
    async RetrieveTaxesClasses(ctx: StateContext<IShippingStateModel>) {
        console.log('taxes/classes');
        const state = ctx.getState();
        this.wooApiSerice.retrieveTaxesClasses()
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(e => {
                    return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                })
            )
            .subscribe((tax_classes: any) => {
                console.log(tax_classes);
                return ctx.patchState({
                    ...state,
                    tax_classes,
                });
            });
    }


    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
}