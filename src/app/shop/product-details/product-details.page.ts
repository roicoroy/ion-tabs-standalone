import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { ProductsActions } from '../../store/products/products.actions';
import { LoadingController } from '@ionic/angular';
import { CartComponent } from '../../components/cart-components/cart/cart.component';
import { CartIconComponent } from '../../components/cart-components/cart-icon/cart-icon.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Product } from 'src/app/shared/wordpress/utils/types/wooCommerceTypes';
import { AddToCartComponent } from '../../components/cart-components/add-to-cart/add-to-cart.component';
import { IProductsFacadeModel, ProductsFacade } from '../products.facade';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CartComponent,
    CartIconComponent,
    AddToCartComponent,
  ]
})
export class ProductDetailsPage implements OnInit, OnDestroy {

  product$!: Observable<Product>;

  viewState$: Observable<IProductsFacadeModel>;

  private activatedRoute = inject(ActivatedRoute);

  private store = inject(Store);

  private facade = inject(ProductsFacade);

  private sanitizer = inject(DomSanitizer);

  private readonly ngUnsubscribe = new Subject();

  async ngOnInit() {
    this.viewState$ = this.facade.viewState$;
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string
    if (id) {
      this.store.dispatch(new ProductsActions.GetProductById(id));
    }
  }

  sanitise(content: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(content);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ProductsActions.RemoveSelectedProduct);
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
