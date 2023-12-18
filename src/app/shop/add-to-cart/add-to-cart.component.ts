import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { CounterInputComponent } from 'src/app/components/counter-input/counter-input.component';
import { Order } from 'src/app/shared/wordpress/utils/types/wooCommerceTypes';
import { CartActions } from '../../store/shop/cart.actions';

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
export class AddToCartComponent implements OnInit {

  @ViewChild('counterInput') counterInput: CounterInputComponent;

  @Input('product_id') product_id: number;

  private store = inject(Store);

  ngOnInit() {
  }

  addToCart() {
    if (this.counterInput?.counterValue > 0) {
      this.store.dispatch(new CartActions.AddProductToCart(this.product_id, this.counterInput?.counterValue))
    }
  }
}
