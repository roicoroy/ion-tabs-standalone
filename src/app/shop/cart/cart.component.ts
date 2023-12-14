import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { CartItem, CartState } from '../store/cart.state';
import { Select, Store } from '@ngxs/store';
import { CartActions } from '../store/cart.actions';
import { Router, RouterLink } from '@angular/router';
import { Product } from 'src/app/shared/wordpress/utils/types/wooCommerceTypes';

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

  @Select(CartState.cartItems) cart$!: Observable<(CartItem & Product)[]>;

  @Select(CartState.cartTotal) total$!: Observable<number>;

  cartItems$!: Observable<CartItem[]>;

  private store = inject(Store);

  private router = inject(Router);

  private readonly ngUnsubscribe = new Subject();

  constructor() { }

  ngOnInit() {
    this.cartItems$ = this.store.select(CartState.getCartItems);
  }

  productDetails(id: number) {
    this.router.navigate(['/product-details', id]);
  }

  onDelete({ productId }: CartItem) {
    console.log(productId);
    this.store.dispatch(new CartActions.RemoveProductFromCart(productId));
  }

  removeFromList({ productId }: CartItem) {
    console.log(productId);
    this.store.dispatch(new CartActions.RemoveProductFromList(productId));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
