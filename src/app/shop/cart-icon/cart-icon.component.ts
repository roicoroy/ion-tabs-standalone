import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { NavigationService } from 'src/app/shared/utils/navigation.service';
import { Order } from 'src/app/shared/wordpress/utils/types/wooCommerceTypes';
import { CartState } from '../../store/shop/cart.state';
import { IProductsFacadeModel, ProductsFacade } from '../products.facade';

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

  cartItems$!: Observable<any>;

  viewState$: Observable<IProductsFacadeModel>;


  private navitagion = inject(NavigationService);

  private readonly ngUnsubscribe = new Subject();

  constructor(
    private facade: ProductsFacade,
  ) { 
    this.viewState$ = this.facade.viewState$;
  }

  ngOnInit() {
    // this.cartItems$ = this.store.select(CartState.getCart);
    // this.viewState$
    //   .pipe(
    //     takeUntil(this.ngUnsubscribe),
    //     take(1)
    //     )
    //   .subscribe({
    //     next: (vs: any) => {
    //       // this.numberOfCartItems = p?.length;
    //       console.log('open Cart icon', vs);
    //     },
    //     error: (e) => {
    //       console.error(e)
    //     },
    //     complete: () => {
    //     },
    //   });
  }

  // openCart() {
  //   console.log('open Cart icon');
  // }

  checkout() {
    this.navitagion.navigateFlip('checkout/cart-review');
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
