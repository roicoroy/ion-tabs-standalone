import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { ProductsActions } from '../store/products.actions';
import { Product } from '../products.interface';
import { ProductsState } from '../store/products.state';
import { LoadingController } from '@ionic/angular';
import { CartComponent } from '../cart/cart.component';
import { CartActions } from '../store/cart.actions';
import { CartIconComponent } from '../cart-icon/cart-icon.component';
import { DomSanitizer } from '@angular/platform-browser';

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
    CartIconComponent
  ]
})
export class ProductDetailsPage implements OnInit, OnDestroy {

  // @Select(ProductsState.getSelectedProduct) product$!: Observable<Product>;

  product$!: Observable<Product>;
  
  private activatedRoute = inject(ActivatedRoute);

  private store = inject(Store);

  private loadingController = inject(LoadingController);
  
  private sanitizer = inject(DomSanitizer);
  
  private readonly ngUnsubscribe = new Subject();

  constructor() {
    // this.viewState$ = this.facade.viewState$;
  }

  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.store.dispatch(new ProductsActions.GetProductById(id));
    this.product$ = this.store.select(ProductsState.getSelectedProduct);
    await loading.dismiss();
    // this.product$
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe({
    //     next: (p: Product) => {
    //       console.log('complete', p);
    //     },
    //     error: (e) => {
    //       console.error(e)
    //     },
    //     complete: () => {
    //       // console.info('complete')
    //     },
    //   });
  }

  sanitise(content:any){
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  addToCart(id: number) {
    console.log(id);
    this.store.dispatch(new CartActions.AddProductToCart(id));
  }

  removeFromCart(id: number) {
    console.log(id);
    this.store.dispatch(new CartActions.RemoveProductFromCart(id));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
