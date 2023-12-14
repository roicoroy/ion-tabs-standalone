import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CartItem, CartState } from '../store';
import { Store } from '@ngxs/store';
import { Product } from '../products.interface';
import { NavigationService } from 'src/app/shared/utils/navigation.service';

@Component({
  selector: 'cart-icon',
  templateUrl: './cart-icon.component.html',
  styleUrls: ['./cart-icon.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ]
})
export class CartIconComponent implements OnInit, OnDestroy {

  numberOfCartItems!: number;

  cartItems$!: Observable<CartItem[]>;

  private store = inject(Store);

  private navitagion = inject(NavigationService);

  private readonly ngUnsubscribe = new Subject();

  constructor() { }

  ngOnInit() {
    this.cartItems$ = this.store.select(CartState.getCartItems);
    this.cartItems$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (p: CartItem[]) => {
          this.numberOfCartItems = p?.length;
        },
        error: (e) => {
          console.error(e)
        },
        complete: () => {
          // console.info('complete')
        },
      });
  }

  openCart() {
    console.log('open Cart icon');
  }

  checkout() {
    this.navitagion.navigateFlip('checkout/cart-review');
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
