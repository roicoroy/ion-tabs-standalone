import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { CheckoutHeaderComponent } from '../header/header.component';
import { CheckoutFooterComponent } from '../checkout-footer/checkout-footer.component';
import { CartComponent } from 'src/app/components/cart-components/cart/cart.component';
import { RouterLink } from '@angular/router';
import { CartIconComponent } from 'src/app/components/cart-components/cart-icon/cart-icon.component';
import { CartReviewFacade, ICartReviewFacadeModel } from './cart-review.facade';
import { CheckoutTabsService } from '../checkout-tabs.service';

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
    CartIconComponent,
    CheckoutHeaderComponent,
    CheckoutFooterComponent
  ]
})
export class CartReviewPage implements OnInit, OnDestroy {

  pageTitle = 'Cart Review Page';

  viewState$!: Observable<ICartReviewFacadeModel>;

  private facade = inject(CartReviewFacade);
  
  private service = inject(CheckoutTabsService);

  private readonly ngUnsubscribe = new Subject();

  async ngOnInit() {
    this.viewState$ = this.facade.viewState$;
    this.formReady(true);
  }

  formReady(ready: boolean) {
    this.service.ready(ready);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
