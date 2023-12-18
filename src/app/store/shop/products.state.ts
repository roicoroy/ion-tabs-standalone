
import { Injectable, OnDestroy, inject } from '@angular/core';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { tap, catchError, Observable, Subject, takeUntil } from 'rxjs';
import { ProductsActions } from './products.actions';
import { WoocommerceProductsService } from 'src/app/shared/wooApi';
import { Product } from 'src/app/shared/wordpress/utils/types/wooCommerceTypes';

// import { ErrorLoggingActions } from 'src/app/store/errors-logging/errors-logging.actions';

export interface IProductsStateModel {
    products: Product[];
    product: Product;
}

@State<IProductsStateModel>({
    name: 'products',
})
@Injectable({
    providedIn: 'root'
})
export class ProductsState implements OnDestroy {

    private wooProducts = inject(WoocommerceProductsService);

    private readonly ngUnsubscribe = new Subject();

    @Selector()
    static getProducts(state: IProductsStateModel): Product[] {
        return state.products;
    }

    @Selector()
    static getSelectedProduct(state: IProductsStateModel): Product {
        return state.product;
    }

    @Action(ProductsActions.RetrieveProducts)
    retrieveProducts(ctx: StateContext<IProductsStateModel>) {
        // console.log('response');
        this.wooProducts.retrieveProducts()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {
                if (response.products) {
                    return ctx.patchState({
                        products: response.products,
                    });
                }
            });
    }

    @Action(ProductsActions.GetProductById)
    loadData(ctx: StateContext<IProductsStateModel>, { id }: ProductsActions.GetProductById) {
        const state = ctx.getState();
        // console.log(id);
        return this.wooProducts.retrieveProduct(id)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                tap((payload: Product) => {
                    ctx.patchState({
                        ...state,
                        product: payload,
                    });
                })
            );
    }

    @Action(ProductsActions.RemoveSelectedProduct)
    removeSelectedProducts(ctx: StateContext<IProductsStateModel>) {
        // console.log('response');
        return ctx.patchState({
            product: null,
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
}