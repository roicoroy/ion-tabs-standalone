import { ICheckoutTabs } from "../checkout-tabs.config";

export namespace CheckoutActions {
    export class UpdateCheckoutTabsState {
        static readonly type = '[ChckoutActions] Update Checkout Tabs State';
        constructor(public tabState: ICheckoutTabs, public index?: number) { }
    }
    export class SelectedCheckoutTabsState {
        static readonly type = '[ChckoutActions] Selected Checkout Tabs State';
        constructor(public selectedTab: string,) { }
    }
}