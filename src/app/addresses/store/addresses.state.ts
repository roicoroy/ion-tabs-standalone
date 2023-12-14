import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { ICheckoutTabsStateModel } from 'src/app/checkout-tabs/checkout-store/checkout.state';
import { Shipping, Billing } from 'src/app/shared/wooApi';
import { AddressesActions } from './addresses.actions';

export class IAddressesStateModel {
    shipping_address!: Shipping | undefined;
    billing_address!: Billing | undefined;
}

@State<IAddressesStateModel>({
    name: 'addresses',
    defaults: {
        shipping_address: undefined,
        billing_address: undefined,
    }
})
@Injectable()
export class AddressesState {

    private store = inject(Store);

    @Selector()
    static getShipping(state: IAddressesStateModel): Shipping | undefined{
        return state.shipping_address;
    }

    @Selector()
    static getBilling(state: IAddressesStateModel): Billing | undefined{
        return state.billing_address;
    }

    @Action(AddressesActions.UpdateShippingAddress)
    updateShippingAddress(ctx: StateContext<ICheckoutTabsStateModel>, { address }: AddressesActions.UpdateShippingAddress) {
        const state = ctx.getState();
        console.log(address);
    }

    @Action(AddressesActions.UpdateBillingAddress)
    updateBillingAddress(ctx: StateContext<ICheckoutTabsStateModel>, { address }: AddressesActions.UpdateBillingAddress) {
        const state = ctx.getState();
        console.log(address);
    }

}
