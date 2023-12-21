import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxStripeModule, StripePaymentElementComponent, StripeService } from 'ngx-stripe';
import { ConfirmPaymentData, Stripe, StripeCardElement, StripeCardNumberElement, StripeElement, StripeElements, StripeElementsOptions } from '@stripe/stripe-js';
import { Store } from '@ngxs/store';
import { Observable, Subject, catchError, takeUntil } from 'rxjs';
import { IPaymentComponentFacadeModel, PaymentComponentFacade } from './payment.component.facade';
import { Router } from '@angular/router';
import { PaymentActions } from 'src/app/store/payment/payment.actions';
import { Order } from 'src/app/shared/wordpress/utils/types/wooCommerceTypes';
import { WoocommerceHelperService } from 'src/app/shared/wooApi';
import { CartActions } from 'src/app/store/cart/cart.actions';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoadingService } from 'src/app/shared/utils/loading.service';
const stripe = require("stripe")(environment.STRIPE_SECRET_KEY);

@Component({
  selector: 'payment-component',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NgxStripeModule,
  ]
})
export class PaymentComponent implements OnInit, OnDestroy {

  @ViewChild(StripePaymentElementComponent) paymentElement: StripePaymentElementComponent;

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  viewState$!: Observable<IPaymentComponentFacadeModel>;

  elements: StripeElements;

  card: StripeCardElement;

  private facade = inject(PaymentComponentFacade);

  private store = inject(Store);

  private stripeService = inject(StripeService);

  private router = inject(Router);

  private wooHelper = inject(WoocommerceHelperService);

  private loadingService = inject(LoadingService);

  private readonly ngUnsubscribe = new Subject();

  ngOnInit() {
    this.store.dispatch(new PaymentActions.ClearPaymentState());
    this.viewState$ = this.facade.viewState$;
    // this.loadStripe();
  }

  createPaymentIntent(cart: Order): void {
    this.store.dispatch(new PaymentActions.CreatePaymentIntent(cart));
  }

  navigateToOrderReview(orderId: number): void {
    this.router.navigate(['order-review', orderId]);
  }

  async confirmPayment(order: Order) {
    await this.loadingService.simpleLoader();
    return this.stripeService.confirmPayment({
      elements: this.paymentElement?.elements,
      redirect: 'if_required'
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(async (result: any) => {
        // console.log(result);
        if (result.error) {
          this.wooHelper.handleError(result.error);
          this.loadingService.dismissLoader();
        } else if (result.paymentIntent?.status === "succeeded") {
          this.router.navigate(['order-review', order.id]).then(() => {
            this.store.dispatch(new CartActions.ClearCartFromState());
            this.store.dispatch(new PaymentActions.ClearPaymentState());
            this.loadingService.dismissLoader();
          });
        }
      });
  }

  createPaymentToken(order: Order) {
    return this.stripeService
      .createToken(this.card)
      .subscribe(result => {
        // console.log('result', result);
        if (result.token) {
        } else if (result.error) {
          console.log(result.error.message);
        }
      });
  }
  async loadStripe() {
    await this.stripeService.elements(this.elementsOptions)
      .subscribe(elements => {
        this.elements = elements;
        if (!this.card) {
          console.log('creating card')
          this.card = this.elements.create('card', {
            style: {
              base: {
                iconColor: '#666EE8',
                color: '#31325F',
                lineHeight: '40px',
                fontWeight: 300,
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '18px',
                '::placeholder': {
                  color: '#CFD7E0'
                }
              }
            }
          });
          this.card.mount('#card-element');
        }
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch(new PaymentActions.ClearPaymentState());
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}

