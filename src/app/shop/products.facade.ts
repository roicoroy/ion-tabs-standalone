import { Injectable, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/shared/wooApi';
import { ProductsState } from './store/products.state';

export interface IProductsFacadeModel {
    products: Product[];
}

@Injectable({
    providedIn: 'root'
})
export class ProductsFacade {

    @Select(ProductsState.getProducts) products$!: Observable<Product[]>;
    
    @Select(ProductsState.getSelectedProduct) product$!: Observable<Product>;
    // product$!: Observable<Product>;

    // private store = inject(Store);
    
    readonly viewState$: Observable<IProductsFacadeModel>;

    constructor() {
        // this.product$ = this.store.select(ProductsState.getSelectedProduct);
        this.viewState$ = combineLatest(
            [
                this.products$,
            ]
        )
            .pipe(
                map((
                    products,
                ) => ({
                    products: products[0],
                }))
            );
    }
}
