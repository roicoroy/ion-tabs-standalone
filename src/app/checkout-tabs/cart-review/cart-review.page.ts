import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CheckoutHeaderComponent } from '../header/header.component';
import { CheckoutTabsService } from '../checkout-tabs.service';
import { CheckoutFooterComponent } from '../checkout-footer/checkout-footer.component';
import { CartComponent } from 'src/app/shop/cart/cart.component';
import { RouterLink } from '@angular/router';
import { Select } from '@ngxs/store';
import { CartState } from 'src/app/shop/store';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-cart-review',
  templateUrl: './cart-review.page.html',
  styleUrls: ['./cart-review.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterLink,
    CartComponent,
    CheckoutHeaderComponent,
    CheckoutFooterComponent
  ]
})
export class CartReviewPage implements OnInit, OnDestroy {

  @Select(CartState.cartTotal) total$!: Observable<number>;

  pageTitle = 'Cart Review Page';

  private service = inject(CheckoutTabsService);

  private loadingController = inject(LoadingController);

  private readonly ngUnsubscribe = new Subject();

  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.total$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: async (p: number) => {
          const ready: boolean = p === 0 ? false : true;
          this.service.ready(ready);
          await loading.dismiss();
        },
        error: (e) => {
          console.error(e)
        },
        complete: async () => {
          await loading.dismiss();
        },
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
