import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckoutTabsState } from './checkout-store/checkout.state';
import { ICheckoutTabs } from './checkout-tabs.config';

export class ICheckoutTabsFacadeModel {
    tabsState!: ICheckoutTabs[];
    selectedTab!: string;
}

@Injectable({
    providedIn: 'root'
})
export class CheckoutTabsFacade {

    @Select(CheckoutTabsState.getTabsState) tabsState$!: Observable<boolean>;

    @Select(CheckoutTabsState.getSelectedTab) selectedTab$!: Observable<string>;

    readonly viewState$: Observable<ICheckoutTabsFacadeModel>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.tabsState$,
                this.selectedTab$,
            ]
        )
            .pipe(
                map((
                    [
                        tabsState,
                        selectedTab
                    ]
                ) => (
                    {
                        tabsState: tabsState,
                        selectedTab,
                    }))
            ) as unknown as any;
    }
}
