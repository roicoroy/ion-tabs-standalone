import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CounterInputComponent } from 'src/app/components/counter-input/counter-input.component';
import { Observable, Subject } from 'rxjs';
import { ICartComponentFacadeModel, CartComponentFacade } from '../cart.component.facade';

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
export class AddToCartComponent implements OnInit, OnDestroy {

  @ViewChild('counterInput') counterInput: CounterInputComponent;

  @Input('product_id') product_id: number;

  viewState$: Observable<ICartComponentFacadeModel>;

  private facade = inject(CartComponentFacade);

  private readonly ngUnsubscribe = new Subject();

  ngOnInit() {
    this.viewState$ = this.facade.viewState$;
    this.facade.getCartById();
  }

  addToCart() {
    if (this.counterInput?.counterValue > 0) {
      this.facade.updateCart(this.product_id, this.counterInput?.counterValue);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
