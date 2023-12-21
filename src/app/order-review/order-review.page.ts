import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { OrdersActions } from '../store/orders/orders.actions';
import { Observable, Subject, takeUntil, take } from 'rxjs';
import { IShippingFacadeModel } from '../checkout-tabs/shipping/shipping.facade';
import { IOrderReviewFacadeModel, OrderReviewFacade } from './order-review.facade';

@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.page.html',
  styleUrls: ['./order-review.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterLink
  ]
})
export class OrderReviewPage implements OnInit, OnDestroy {

  viewState$!: Observable<IOrderReviewFacadeModel>;

  private activatedRoute = inject(ActivatedRoute);

  private store = inject(Store);

  private facade = inject(OrderReviewFacade);

  private readonly ngUnsubscribe = new Subject();

  constructor() {
    this.viewState$ = this.facade.viewState$;
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(new OrdersActions.GetCompletedOrder(id));
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
