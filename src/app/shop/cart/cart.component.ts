import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { CartState } from '../../store/shop/cart.state';
import { Select, Store } from '@ngxs/store';
import { CartActions } from '../../store/shop/cart.actions';
import { Router, RouterLink } from '@angular/router';
import { Order, Product } from 'src/app/shared/wordpress/utils/types/wooCommerceTypes';
import { IProductsFacadeModel, ProductsFacade } from '../products.facade';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterLink
  ]
})
export class CartComponent implements OnInit, OnDestroy {

  // @Select(CartState.cartItems) cartItems$!: Observable<(Order & Product)[]>;

  // @Select(CartState.) cart$!: Observable<any>;

  // @Select(CartState.cartTotal) total$!: Observable<number>;

  // cartItems$!: Observable<CartItem[]>;

  viewState$: Observable<IProductsFacadeModel>;

  private facade = inject(ProductsFacade);

  private store = inject(Store);

  private router = inject(Router);

  private readonly ngUnsubscribe = new Subject();

  constructor() {
    this.viewState$ = this.facade.viewState$;
    this.viewState$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        take(1),
      )
      .subscribe({
        next: (vs: any) => {
          // console.log('vs:::', vs.cart);
        },
        error: (e) => {
          console.error(e)
        },
        complete: () => { },
      });
  }

  ngOnInit() {
    // this.cartItems$ = this.store.select(CartState.getCartItems);
  }

  productDetails(id: number) {
    console.log(id);
    this.router.navigate(['/product-details', id]);
  }

  onDelete(productId: any) {
    // console.log(productId);
    this.store.dispatch(new CartActions.RemoveProductFromCart(productId));
  }

  removeFromList(productId: any) {
    // console.log(productId);
    this.store.dispatch(new CartActions.RemoveProductFromList(productId));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
