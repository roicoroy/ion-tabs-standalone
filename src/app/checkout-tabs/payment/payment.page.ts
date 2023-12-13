import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CheckoutHeaderComponent } from '../header/header.component';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CheckoutActions } from '../checkout-store/checkout.actions';
import { CheckoutTabsState } from '../checkout-store/checkout.state';
import { ICheckoutTabs } from '../checkout-tabs.config';
import { ICheckoutTabsFacadeModel, CheckoutTabsFacade } from '../checkout.facade';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['../checkout.styles.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,CheckoutHeaderComponent]
})
export class PaymentPage implements OnInit {
  
  pageTitle = 'Payment Page';

  @Select(CheckoutTabsState.getTabsState) tabsState$!: Observable<ICheckoutTabs[]>;

  @Select(CheckoutTabsState.getSelectedTab) selectedTab$!: Observable<string>;

  buttonToggle: boolean = false;

  viewState$!: Observable<ICheckoutTabsFacadeModel>;

  private checkoutTabs: ICheckoutTabs[] = [];

  private store = inject(Store);

  private facade = inject(CheckoutTabsFacade);

  private readonly ngUnsubscribe = new Subject();

  constructor() {
    this.viewState$ = this.facade.viewState$;

    //   this.selectedTab$.subscribe((selectedTab) => {
    //     console.log(selectedTab);
    //   });
  }

  ngOnInit() {
    this.tabsState$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((tabs) => {
        this.checkoutTabs = tabs;
      });
  }

  toogle() {
    this.buttonToggle = !this.buttonToggle
  }
  reviewReady(selectedTab: string): void {
    const result: any = this.checkoutTabs.filter(checkoutTabs => {
      return checkoutTabs?.tab === selectedTab;
    });
    this.toogle();
    const parsed: any = {
      buttonChecked: this.buttonToggle,
      disabled: result[0]?.disabled,
      tab: result[0]?.tab,
      selected: true
    }
    this.store.dispatch(new CheckoutActions.UpdateCheckoutTabsState(parsed));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
