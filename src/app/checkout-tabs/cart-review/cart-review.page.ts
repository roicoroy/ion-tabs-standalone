import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { CheckoutHeaderComponent } from '../header/header.component';
import { CheckoutTabsService } from '../checkout-tabs.service';
import { CheckoutFooterComponent } from '../checkout-footer/checkout-footer.component';
import { CartComponent } from 'src/app/shop/cart/cart.component';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { CartActions, } from 'src/app/shop/store';
import { LoadingController } from '@ionic/angular';
import { CartIconComponent } from 'src/app/shop/cart-icon/cart-icon.component';
import { CartReviewFacade, ICartReviewFacadeModel } from './cart-review.facade';
import { Order } from 'src/app/shared/wordpress/utils/types/wooCommerceTypes';

@Component({
  selector: 'app-cart-review',
  templateUrl: './cart-review.page.html',
  styleUrls: ['./cart-review.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterLink,
    CartComponent,
    CartIconComponent,
    CheckoutHeaderComponent,
    CheckoutFooterComponent
  ]
})
export class CartReviewPage implements OnInit, OnDestroy {

  // @Select(CartState.cartTotal) total$!: Observable<number>;

  // @Select(CartState.getCartItems) cartItems$!: Observable<CartItem[]>;

  pageTitle = 'Cart Review Page';

  viewState$!: Observable<ICartReviewFacadeModel>;

  private facade = inject(CartReviewFacade);

  private service = inject(CheckoutTabsService);

  private loadingController = inject(LoadingController);

  private store = inject(Store);

  private readonly ngUnsubscribe = new Subject();

  async ngOnInit() {
    // const loading = await this.loadingController.create();
    // await loading.present();
    // this.total$
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe({
    //     next: async (p: number) => {
    //       const ready: boolean = p === 0 ? false : true;
    //       this.service.ready(ready);
    //       // await loading.dismiss();
    //     },
    //     error: (e) => {
    //       console.error(e)
    //     },
    //     complete: async () => {
    //       // await loading.dismiss();
    //     },
    //   });

    this.viewState$ = this.facade.viewState$;

    // this.viewState$.pipe(
    //   takeUntil(this.ngUnsubscribe),
    //   take(1),
    // )
    //   .subscribe({
    //     next: (vs: any) => {
    //       console.log(vs);
    //     },
    //   });
  }

  createOrder(cartItems: Order[], cutomerId: number) {

    console.log(cutomerId);

    const lLineItems = cartItems.map((item) => {
      return {
        product_id: item.id,
        quantity: item.quantity,
      }
    });
    // console.log(lLineItems);

    const data: Order = {
      customer_id: cutomerId,
      payment_method: "bacs",
      payment_method_title: "Direct Bank Transfer",
      set_paid: true,
      billing: {
        first_name: "John",
        last_name: "Doe",
        address_1: "969 Market",
        address_2: "",
        city: "San Francisco",
        state: "CA",
        postcode: "94103",
        country: "US",
        email: "john.doe@example.com",
        phone: "(555) 555-5555"
      },
      shipping: {
        first_name: "John",
        last_name: "Doe",
        address_1: "969 Market",
        address_2: "",
        city: "San Francisco",
        state: "CA",
        postcode: "94103",
        country: "US"
      },
      line_items: lLineItems,
      shipping_lines: [
        {
          method_id: "flat_rate",
          method_title: "Flat Rate",
          total: "10.00"
        }
      ]
    };
    console.log(data);
    this.store.dispatch(new CartActions.CreateOrder(data));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
