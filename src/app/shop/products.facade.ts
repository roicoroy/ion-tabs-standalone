import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductsState } from '../store/shop/products.state';
import { Order, Product } from '../shared/wordpress/utils/types/wooCommerceTypes';
import { CartState } from '../store/shop/cart.state';

export interface IProductsFacadeModel {
    products: Product[];
    product: Product;
    cart: Order;
}

@Injectable({
    providedIn: 'root'
})
export class ProductsFacade {

    @Select(ProductsState.getProducts) products$!: Observable<Product[]>;

    @Select(ProductsState.getSelectedProduct) product$!: Observable<Product>;

    @Select(CartState.getCart) cart$!: Observable<Order>;

    readonly viewState$: Observable<IProductsFacadeModel>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.products$,
                this.product$,
                this.cart$,
            ]
        )
            .pipe(
                map((
                    [
                        products,
                        product,
                        cart
                    ]
                ) => ({
                    products,
                    product,
                    cart
                }))
            );
    }
}
