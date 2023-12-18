import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { CounterInputComponent } from 'src/app/components/counter-input/counter-input.component';
import { Order } from 'src/app/shared/wordpress/utils/types/wooCommerceTypes';
import { CartActions } from '../../store/shop/cart.actions';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { IAddToCartFacadeModel, AddToCartFacade } from './add-to-cart.facade';
import { IProductsFacadeModel } from '../products.facade';

@Component({
  selector: 'add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CounterInputComponent
  ]
})
export class AddToCartComponent implements OnInit,OnDestroy {

  @ViewChild('counterInput') counterInput: CounterInputComponent;

  @Input('product_id') product_id: number;
  
  viewState$: Observable<IAddToCartFacadeModel>;

  private facade = inject(AddToCartFacade);

  private store = inject(Store);

  private readonly ngUnsubscribe = new Subject();

  ngOnInit() {
    this.viewState$ = this.facade.viewState$;

    this.viewState$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        take(1)
      )
      .subscribe({
        next: async (vs: IAddToCartFacadeModel) => {
          console.log('cart', vs.cart);
          // if (id && !vs.product) {
          //   await loading.dismiss();
          // } else {
          //   await loading.dismiss();
          // }
        },
      });
  }

  addToCart() {
    if (this.counterInput?.counterValue > 0) {
      this.store.dispatch(new CartActions.AddProductToCart(this.product_id, this.counterInput?.counterValue))
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
