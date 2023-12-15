import { Injectable, inject } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { WoocommerceCustomerService } from "src/app/shared/wooApi";
import { CustomerActions } from "./customer.actions";
import { Customer } from "src/app/shared/wordpress/utils/types/wooCommerceTypes";

export interface ICustomerStateModel {
    customer: Customer | null;
}

@State<ICustomerStateModel>({
    name: 'customer',
    defaults: {
        customer: null
    },
})
@Injectable({
    providedIn: 'root'
})
export class CustomerState {
    private wooApi = inject(WoocommerceCustomerService);

    @Selector()
    static getCustomer(state: ICustomerStateModel): Customer | null {
        return state.customer;
    }

    @Action(CustomerActions.CreateCustomer)
    createCustomers(ctx: StateContext<ICustomerStateModel>, { customer }: CustomerActions.CreateCustomer) {
        console.log(customer);
        // ctx.patchState({
        // });
    }
    @Action(CustomerActions.RetrieveAllCustomers)
    RetrieveAllCustomers(ctx: StateContext<ICustomerStateModel>) {
        console.log('RetrieveAllCustomers');
        // ctx.patchState({
        // });
    }

    @Action(CustomerActions.RetrieveCustomer)
    retrieveCustomers(ctx: StateContext<ICustomerStateModel>, { userName }: CustomerActions.RetrieveCustomer) {
        console.log(userName);
        // ctx.patchState({
        // });
    }
    @Action(CustomerActions.UpdateCustomer)
    updateCustomers(ctx: StateContext<ICustomerStateModel>, { id }: CustomerActions.UpdateCustomer) {
        console.log(id);
        // ctx.patchState({
        // });
    }

}