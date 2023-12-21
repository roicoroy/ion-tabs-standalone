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

  cardNumberElement: StripeCardNumberElement;

  shipping_zones: any;

  stripe_selected: boolean = false

  gateway_instructions: string = ''

  cart_total: number;

  shipping_cost: number = 0;

  private facade = inject(PaymentComponentFacade);

  private store = inject(Store);

  private stripeService = inject(StripeService);

  private router = inject(Router);

  private wooHelper = inject(WoocommerceHelperService);

  private readonly ngUnsubscribe = new Subject();

  constructor(
    private httpClient: HttpClient,
  ) { }

  ngOnInit() {
    this.viewState$ = this.facade.viewState$;
    // this.viewState$.pipe(
    //   takeUntil(this.ngUnsubscribe),
    //   take(1),
    // )
    //   .subscribe({
    //     next: (vs: IPaymentComponentFacadeModel) => {
    //       console.log(vs);
    //     },
    //   });
    this.loadStripe();
  }

  createPaymentIntent(cart: Order): void {
    this.store.dispatch(new PaymentActions.CreatePaymentIntent(cart));
  }

  navigateToOrderReview(orderId: number): void {
    // console.log(orderId);
    this.router.navigate(['order-review', orderId]);
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


  async confirm(order: Order, clientSecret: string) {

  }

  async initEmbeddedCheckout(clientSecret: string) {
    // const checkout = await stripe.initEmbeddedCheckout();
    // console.log(stripe);
    const data =     {
      clientSecret,
    };
    this.stripeService.initCustomCheckout(data)
    // this.stripeService.initEmbeddedCheckout(data)
      .subscribe((check) => {
        console.log(check);
      });

  }


  async confirmCardPayment(order?: Order, clientSecret?: string) {
    // create Stripe confirm payment method data
    // TODO add more data for Stripe to hold if necessary.  Receipt email is usually a good idea
    const paymentMethod = {
      payment_method: {
        card: this.paymentElement?.elements,
        // billing_details: {},
        // shipping: {},
        // receipt_email: ''
      },
    };
    // use Stripe client secret to process card payment method
    try {
      // stripe.createPa
      const result = await stripe.confirmCardPayment(clientSecret, paymentMethod);
      console.log(result);

      if (result.error) {
        throw new Error(result.error.message);
      }
      return result;
    } catch (error: any) {
      throw new Error(error);
    }
  }



  confirmPayment(order: Order) {
    // this.stripeService.stripe.c
    return this.stripeService.confirmPayment({
      elements: this.paymentElement?.elements,
      redirect: 'if_required'
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(async (result: any) => {
        console.log(result);
        if (result.paymentIntent) {
          // console.log(result.paymentIntent);
        } if (result.error) {
          this.wooHelper.handleError(result.error);
          // this.store.dispatch(new PaymentActions.ClearPaymentState());
          // this.store.dispatch(new CartActions.ClearCartFromState())
        } else if (result.paymentIntent?.status === "succeeded") {
          // console.log(result.paymentIntent.id);
          this.navigateToOrderReview(order.id);
          this.store.dispatch(new CartActions.ClearCartFromState())
        }
      });
  }

  createPaymentToken(order: Order) {
    return this.stripeService
      .createToken(this.card)
      .subscribe(result => {
        // console.log('result', result);
        if (result.token) {
          // this.stripeService.retrieveOrder(order.id);
          this.sendToken(result.token.id, order.id);
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
          // this.sendToken(result.token.id, order_id)
        } else if (result.error) {
          console.log(result.error.message);
        }
      });
  }

  sendToken(token: any, order_id: any) {
    let data = {
      order_id: order_id,
      payment_token: token,
      payment_method: 'stripe'
    }
    var url = 'wp-json/wc/v2/stripe_payment';
    // console.log('send token', data)
    return this.httpClient.post<any>(url, data)
      .pipe(catchError(err => this.wooHelper.handleError(err)))
      .subscribe((res) => {
        console.log(res);
      });

  }

  sendTokenToServer(token: any, order_id: any) {

    var url = environment.origin + '/wp-json/wc/v2/stripe_payment';

    var formData = new FormData();

    formData.append("order_id", order_id);
    formData.append("payment_token", token);
    formData.append("payment_method", 'stripe');

    var request = new XMLHttpRequest();
    request.open("POST", 'stripe_payment');
    request.send(formData);
    request.onload = (e) => {
      if (request.readyState === 4) {
        if (request.status === 200) {
          console.log(request)
          alert(request.responseText);
        } else {
          console.log("Error", request)
          alert(request.responseText);
        }
      }
    };

  }

  ngOnDestroy(): void {
    this.store.dispatch(new PaymentActions.ClearPaymentState());
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}

