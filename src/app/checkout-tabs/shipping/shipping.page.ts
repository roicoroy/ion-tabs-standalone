import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CheckoutHeaderComponent } from '../header/header.component';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { CheckoutTabsService } from '../checkout-tabs.service';
import { CheckoutFooterComponent } from '../checkout-footer/checkout-footer.component';
import { Store } from '@ngxs/store';
import { ShippingActions } from './store/shipping.actions';
import { IShippingFacadeModel, ShippingFacade } from './shipping.facade';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.page.html',
  styleUrls: ['../checkout.styles.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CheckoutHeaderComponent,
    CheckoutFooterComponent
  ]
})
export class ShippingPage implements OnInit {

  pageTitle = 'Shipping Page';

  buttonToggle: boolean = false;

  viewState$!: Observable<IShippingFacadeModel>;

  private facade = inject(ShippingFacade);

  private service = inject(CheckoutTabsService);

  private store = inject(Store);

  private readonly ngUnsubscribe = new Subject();

  ionViewWillEnter() {
    this.store.dispatch(new ShippingActions.RetrieveShippingMethods());
    this.store.dispatch(new ShippingActions.RetrieveShippingClasses());
    this.store.dispatch(new ShippingActions.RetrievePaymentGateways());
    this.store.dispatch(new ShippingActions.RetrieveShippingZones());
    this.store.dispatch(new ShippingActions.RetrieveTaxesClasses());
  }

  ngOnInit() {
    this.viewState$ = this.facade.viewState$;

    this.viewState$.pipe(
      takeUntil(this.ngUnsubscribe),
      take(1),
    )
      .subscribe({
        next: (vs: any) => {
          console.log(vs);
        },
      });
  }

  toogle() {
    this.buttonToggle = !this.buttonToggle
    this.service.ready(this.buttonToggle);
  }
  reviewReady(selectedTab: string): void {
  }

  formReady(ready: boolean) {
    this.service.ready(ready);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }


}
