import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CheckoutHeaderComponent } from '../header/header.component';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { CheckoutTabsService } from '../checkout-tabs.service';
import { CheckoutFooterComponent } from '../checkout-footer/checkout-footer.component';
import { Store } from '@ngxs/store';
import { ShippingActions } from '../../store/shipping/shipping.actions';
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

  shipping_lines: any;

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
        // next: (vs: IShippingFacadeModel) => {
        //   console.log(vs.shipping_methods);
        //   console.log(vs.shipping_classes);
        //   console.log(vs.payment_gateways);
        //   console.log(vs.shipping_zones);
        //   console.log(vs.tax_classes);
        //   console.log(vs.cart);
        // },
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

  shippingLinesChange($event: any) {
    const methodId = $event.detail.value;
    console.log($event.detail.value);
    this.store.dispatch(new ShippingActions.UpdateCartShippingLines(methodId));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }


}
