import { Injectable, OnDestroy, inject } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { Billing, ListOrderParameters, WoocommerceCustomerService, WoocommerceOrderService } from "src/app/shared/wooApi";
import { CustomerActions } from "./customer.actions";
import { Customer, Order } from "src/app/shared/wordpress/utils/types/wooCommerceTypes";
import { Subject, catchError, takeUntil } from "rxjs";
import { ErrorLoggingActions } from "src/app/store/errors-logging/errors-logging.actions";
import { AuthState } from "src/app/auth/store/auth.state";

export interface ICustomerStateModel {
    customer: Customer | null;
    customers: Customer[] | null;
    customerOrders: Order[];
}

@State<ICustomerStateModel>({
    name: 'customer',
})
@Injectable({
    providedIn: 'root'
})
export class CustomerState implements OnDestroy {

    private wooApiCustomer = inject(WoocommerceCustomerService);

    private wooApiOrdersService = inject(WoocommerceOrderService);

    private store = inject(Store);

    private addressesList: Billing[] = [];

    private readonly ngUnsubscribe = new Subject();

    @Selector()
    static getCustomer(state: ICustomerStateModel): Customer | null {
        return state.customer;
    }

    @Selector()
    static getCustomers(state: ICustomerStateModel): Customer[] | null {
        return state.customers;
    }

    @Selector()
    static getCustomerOrders(state: ICustomerStateModel): Order[] {
        return state.customerOrders;
    }

    @Action(CustomerActions.CreateCustomer)
    createCustomers(ctx: StateContext<ICustomerStateModel>, { customer }: CustomerActions.CreateCustomer) {
        return this.wooApiCustomer.createCustomer(customer)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError((e: any) => {
                    return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                })
            )
            .subscribe((customer: Customer) => {
                return ctx.patchState({
                    ...ctx.getState(),
                    customer,
                });
            })
    }

    @Action(CustomerActions.RetrieveAllCustomers)
    RetrieveAllCustomers(ctx: StateContext<ICustomerStateModel>) {
        const user = this.store.selectSnapshot(AuthState.getUser);
        this.wooApiCustomer.retrieveAllCustomers()
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError((e: any) => {
                    return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                })
            )
            .subscribe((customers: Customer[]) => {
                this.store.dispatch(new CustomerActions.RetrieveCustomer(user));
                ctx.patchState({
                    customers
                });
            });
    }

    @Action(CustomerActions.RetrieveCustomer)
    retrieveCustomers(ctx: StateContext<ICustomerStateModel>, { user }: CustomerActions.RetrieveCustomer) {
        const state = ctx.getState();
        const customers = this.store.selectSnapshot(CustomerState.getCustomers);
        const results = customers?.filter((customer: any) => customer.email === user.user_email && customer.username === user.user_nicename);
        results?.forEach(result => {
            if (result.email === user.user_email) {
                // console.log(result);
                return ctx.patchState({
                    ...state,
                    customer: result
                });
            }
        });
    }



    @Action(CustomerActions.UpdateCustomerAddress)
    updateCustomers(ctx: StateContext<ICustomerStateModel>, { id, address, addressType }: CustomerActions.UpdateCustomerAddress) {
        const state = ctx.getState();
        let payload: Customer;
        if (addressType === 'billing_address') {
            payload = {
                billing: address
            };
        }
        if (addressType === 'shipping_address') {
            payload = {
                shipping: address
            };
        }
        // console.log(payload);
        this.wooApiCustomer.updateCustomer(Number(id), payload)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError((e: any) => {
                    return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                })
            )
            .subscribe((customer) => {
                return ctx.patchState({
                    ...state,
                    customer,
                });
            });
    }

    @Action(CustomerActions.GetCustomerOrders)
    getCustomerOrders(ctx: StateContext<ICustomerStateModel>) {
        const state = ctx.getState();
        const params: ListOrderParameters = {
            customer: state.customer.id,
        };
        this.wooApiOrdersService.listAllOrders(params)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError((e: any) => {
                    return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                })
            )
            .subscribe((customerOrders: Order[]) => {
                // console.log(customerOrders);
                return ctx.patchState({
                    ...state,
                    customerOrders,
                });
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }

}