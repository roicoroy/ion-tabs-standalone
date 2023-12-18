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
import { LoadingController } from '@ionic/angular';
import { CartIconComponent } from 'src/app/shop/cart-icon/cart-icon.component';
import { CartReviewFacade, ICartReviewFacadeModel } from './cart-review.facade';
import { LineItem, Order } from 'src/app/shared/wordpress/utils/types/wooCommerceTypes';
import { CartActions } from 'src/app/store/shop/cart.actions';

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
    this.viewState$ = this.facade.viewState$;
  }

  createOrder(cartItems: LineItem[], cutomerId: number) {

    console.log(cutomerId);

    const lLineItems = cartItems.map((item) => {
      return {
        product_id: item.id,
        quantity: item.quantity,
      }
    });

    
    this.store.dispatch(new CartActions.CreateCartOrder(lLineItems, cutomerId));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
