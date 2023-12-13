import { Injectable, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CheckoutTabsState } from './checkout-store/checkout.state';
import { ICheckoutTabs } from './checkout-tabs.config';
import { CheckoutActions } from './checkout-store/checkout.actions';

@Injectable({
  providedIn: 'root'
})
export class CheckoutTabsService implements OnDestroy {

  @Select(CheckoutTabsState.getTabsState) tabsState$!: Observable<ICheckoutTabs[]>;

  @Select(CheckoutTabsState.getSelectedTab) selectedTab$!: Observable<string>;

  private store = inject(Store);

  private router = inject(Router);

  private readonly ngUnsubscribe = new Subject();

  private checkoutTabs: ICheckoutTabs[] = [];
  
  private selectedTab!: string;


  init() {
    this.selectedTab$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((tab) => {
        this.selectedTab = tab;
      });
    this.tabsState$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((tabs) => {
        this.checkoutTabs = tabs;
      });
  }

  ready(ready: boolean) {
    const result: any = this.checkoutTabs.filter(checkoutTabs => {
      return checkoutTabs?.tab === this.selectedTab;
    });
    // console.log(result);
    const parsed: any = {
      buttonChecked: ready,
      disabled: result[0]?.disabled,
      tab: result[0]?.tab,
      selected: true
    }
    console.log(parsed);
    this.store.dispatch(new CheckoutActions.UpdateCheckoutTabsState(parsed));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
