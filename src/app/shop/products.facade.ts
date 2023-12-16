import { Injectable, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductsState } from './store/products.state';
import { Order, Product } from '../shared/wordpress/utils/types/wooCommerceTypes';
import { CartState } from './store';

export interface IProductsFacadeModel {
    products: Product[];
    cart: Order;
}

@Injectable({
    providedIn: 'root'
})
export class ProductsFacade {

    @Select(ProductsState.getProducts) products$!: Observable<Product[]>;

    @Select(CartState.getCart) cart$!: Observable<Order>;

    readonly viewState$: Observable<IProductsFacadeModel>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.products$,
                this.cart$,
            ]
        )
            .pipe(
                map((
                    [
                        products,
                        cart
                    ]
                ) => ({
                    products: products,
                    cart
                }))
            );
    }
}
