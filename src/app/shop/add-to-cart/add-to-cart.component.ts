import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CounterInputComponent } from 'src/app/components/counter-input/counter-input.component';
import { Observable, Subject } from 'rxjs';
import { IAddToCartFacadeModel, AddToCartFacade } from './add-to-cart.facade';

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

  viewState$: Observable<IAddToCartFacadeModel>;

  private facade = inject(AddToCartFacade);

  private readonly ngUnsubscribe = new Subject();

  ngOnInit() {
    this.viewState$ = this.facade.viewState$;
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
