import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Shipping, Billing, Address } from 'src/app/shared/wooApi';
import { AddressesActions } from './addresses.actions';

export class IAddressesStateModel {
    billing_address!: Billing | null;
    shipping_address!: Shipping | null;
    saved_addresses!: Address[];
}

@State<IAddressesStateModel>({
    name: 'addresses',
    defaults: {
        shipping_address: null,
        billing_address: null,
        saved_addresses: [],
        // shipping_address: {
        //     email: null,
        //     first_name: null,
        //     last_name: null,
        //     address_1: null,
        //     address_2: null,
        //     city: null,
        //     postcode: null,
        //     country: null,
        //     phone: null,
        // },
        // billing_address: {
        //     email: null,
        //     first_name: null,
        //     last_name: null,
        //     address_1: null,
        //     address_2: null,
        //     city: null,
        //     postcode: null,
        //     country: null,
        //     phone: null,
        // },
    }
})
@Injectable()
export class AddressesState {

    private store = inject(Store);

    @Selector()
    static getShipping(state: IAddressesStateModel): Shipping | undefined | null {
        return state.shipping_address;
    }

    @Selector()
    static getBilling(state: IAddressesStateModel): Billing | undefined | null {
        return state.billing_address;
    }

    @Selector()
    static getSavedList(state: IAddressesStateModel): Address[] | undefined | null {
        return state.saved_addresses;
    }

    @Action(AddressesActions.UpdateBillingAddress)
    updateBillingAddress(ctx: StateContext<IAddressesStateModel>, { billing_address }: AddressesActions.UpdateBillingAddress) {
        const state = ctx.getState();
        if (billing_address != null) {
            return ctx.patchState({
                ...state,
                billing_address
            });
        }
    }

    @Action(AddressesActions.ClearBillingAddress)
    clearBillingAddress(ctx: StateContext<IAddressesStateModel>) {
        const state = ctx.getState();
        return ctx.patchState({
            ...state,
            billing_address: null
        });
    }

    @Action(AddressesActions.UpdateShippingAddress)
    updateShippingAddress(ctx: StateContext<IAddressesStateModel>, { shipping_address }: AddressesActions.UpdateShippingAddress) {
        const state = ctx.getState();
        if (shipping_address) {
            return ctx.patchState({
                ...state,
                shipping_address
            });
        }
    }

    @Action(AddressesActions.ClearShippingAddress)
    clearShippingAddress(ctx: StateContext<IAddressesStateModel>) {
        const state = ctx.getState();
        return ctx.patchState({
            ...state,
            shipping_address: null
        });
    }

    @Action(AddressesActions.AddAddressToSavedList)
    addAddressToSavedList(ctx: StateContext<IAddressesStateModel>, { address }: AddressesActions.AddAddressToSavedList) {
        console.log(address);
        let addressesList = [];
        addressesList.push(address);
        return ctx.patchState({
            saved_addresses: addressesList,
        });
    }

    @Action(AddressesActions.RemoveAddressFromSavedList)
    removeAddressFromSavedList(ctx: StateContext<IAddressesStateModel>, { address }: AddressesActions.RemoveAddressFromSavedList) {
        console.log(address);
        // ctx.patchState({
        // });
    }

}
