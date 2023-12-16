import { Injectable, OnDestroy, inject } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { Billing, WoocommerceCustomerService } from "src/app/shared/wooApi";
import { CustomerActions } from "./customer.actions";
import { Customer } from "src/app/shared/wordpress/utils/types/wooCommerceTypes";
import { Subject, catchError, takeUntil } from "rxjs";
import { ErrorLoggingActions } from "src/app/store/errors-logging/errors-logging.actions";

export interface ICustomerStateModel {
    customer: Customer | null;
    customers: Customer[] | null;
}

@State<ICustomerStateModel>({
    name: 'customer',
    defaults: {
        customer: null,
        customers: null,
    },
})
@Injectable({
    providedIn: 'root'
})
export class CustomerState implements OnDestroy {

    private wooApiCustomer = inject(WoocommerceCustomerService);

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
        this.wooApiCustomer.retrieveAllCustomers()
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError((e: any) => {
                    return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                })
            )
            .subscribe((customers: Customer[]) => {
                return ctx.patchState({
                    customers
                });
            });
    }

    @Action(CustomerActions.RetrieveCustomer)
    retrieveCustomers(ctx: StateContext<ICustomerStateModel>, { user }: CustomerActions.RetrieveCustomer) {
        const state = ctx.getState();
        // console.log(user);
        const customers = this.store.selectSnapshot(CustomerState.getCustomers);
        // console.log(customers);
        const results = customers?.filter((customer: any) => customer.email === user.user_email && customer.username === user.user_nicename);
        // console.log(results[0]?.billing);
        // const billing = this.store.selectSnapshot(AddressesState.getBilling);
        // const shipping = this.store.selectSnapshot(AddressesState.getShipping);
        // const savedAddressesList = this.store.selectSnapshot(AddressesState.getSavedList);
        // console.log(savedAddressesList);
        // if (savedAddressesList) {
        //     // this.store.dispatch(new CustomerActions.AddAddressToSavedList(results[0]?.billing));
        // }
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

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }

}