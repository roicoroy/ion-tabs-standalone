import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { ICheckoutTabs, checkoutTabs } from '../checkout-tabs.config';
import { CheckoutActions } from './checkout.actions';

export class ICheckoutTabsStateModel {
    checkoutTabs!: ICheckoutTabs[];
    selectedTab: string | undefined;
}

@State<ICheckoutTabsStateModel>({
    name: 'checkoutTabs',
    defaults: {
        checkoutTabs,
        selectedTab: checkoutTabs[0].tab,
    }
})
@Injectable()
export class CheckoutTabsState {

    private store = inject(Store);

    @Selector()
    static getTabsState(state: ICheckoutTabsStateModel): ICheckoutTabs[] {
        return state.checkoutTabs;
    }

    @Selector()
    static getSelectedTab(state: ICheckoutTabsStateModel): string | undefined {
        return state.selectedTab;
    }

    @Action(CheckoutActions.UpdateCheckoutTabsState)
    updateCheckoutTabsState(ctx: StateContext<ICheckoutTabsStateModel>, { tabState }: CheckoutActions.UpdateCheckoutTabsState) {
        const state = ctx.getState();
        const checkoutTabs: any = this.store.selectSnapshot((state: ICheckoutTabsStateModel) => state.checkoutTabs);
        const update = (checkoutTabs: ICheckoutTabs[], updatedData: ICheckoutTabs) => {
            return checkoutTabs.map((tab) => {
                if (tab.tab === updatedData.tab) {
                    return { ...tab, ...updatedData };
                }
                return tab;
            });
        }
        return ctx.patchState({
            ...state,
            checkoutTabs: update(checkoutTabs.checkoutTabs, tabState)
        });
    }

    @Action(CheckoutActions.SelectedCheckoutTabsState)
    selectedCheckoutTabsState(ctx: StateContext<ICheckoutTabsStateModel>, { selectedTab }: CheckoutActions.SelectedCheckoutTabsState) {
        const state = ctx.getState();
        return ctx.patchState({
            ...state,
            selectedTab,
        });
    }

}
