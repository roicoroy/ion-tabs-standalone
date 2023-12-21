import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { OrdersActions } from '../store/orders/orders.actions';
import { Observable, Subject } from 'rxjs';
import { IOrderReviewFacadeModel, OrderReviewFacade } from './order-review.facade';
import { LoadingService } from '../shared/utils/loading.service';

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

  private loadingService = inject(LoadingService);

  private readonly ngUnsubscribe = new Subject();

  constructor() {
    this.viewState$ = this.facade.viewState$;
  }

  async ngOnInit() {
    await this.loadingService.simpleLoader();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(new OrdersActions.GetCompletedOrder(id));
      await this.loadingService.dismissLoader();
    } else {
      await this.loadingService.dismissLoader();
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
