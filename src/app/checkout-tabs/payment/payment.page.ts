import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CheckoutHeaderComponent } from '../header/header.component';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { CheckoutTabsService } from '../checkout-tabs.service';
import { CheckoutFooterComponent } from '../checkout-footer/checkout-footer.component';
import { IPaymentFacadeModel, PaymentFacade } from './payment.facade';
import { NgxsModule, Store } from '@ngxs/store';
import { ShippingActions } from 'src/app/store/shipping/shipping.actions';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { PaymentActions } from 'src/app/store/payment/payment.actions';
import { PaymentComponent } from 'src/app/components/payment/payment.component';
import { ShippingComponent } from 'src/app/components/shipping/shipping.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['../checkout.styles.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CheckoutHeaderComponent,
    CheckoutFooterComponent,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    PaymentComponent,
    ShippingComponent
  ]
})
export class PaymentPage implements OnInit {



  pageTitle = 'Payment Page';

  buttonToggle: boolean = false;

  viewState$!: Observable<IPaymentFacadeModel>;

  private facade = inject(PaymentFacade);

  private store = inject(Store);

  private service = inject(CheckoutTabsService);

  private readonly ngUnsubscribe = new Subject();

  ngOnInit() {
    this.viewState$ = this.facade.viewState$;
    // this.store.dispatch(new ShippingActions.RetrievePaymentGateways());
    // this.viewState$.pipe(
    //   takeUntil(this.ngUnsubscribe),
    //   take(1),
    // )
    //   .subscribe({
    //     next: (vs: IPaymentFacadeModel) => {
    //       // console.log(vs.cart);
    //       // console.log(vs.payment_secret_key);
    //     },
    //   });
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
