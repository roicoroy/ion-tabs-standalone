import { Injectable } from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable, combineLatest, map } from "rxjs";
import { ShippingState } from "./store/shipping.state";

export class IShippingFacadeModel {
    shippingMethods: any
}

@Injectable({
    providedIn: 'root'
})
export class ShippingFacade {

    @Select(ShippingState.getShipping) shippingMethods$!: Observable<any>;

    readonly viewState$: Observable<IShippingFacadeModel>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.shippingMethods$,
            ]
        )
            .pipe(
                map((
                    [
                        shippingMethods,
                    ]
                ) => (
                    {
                        shippingMethods,
                    }
                ))
            );
    }
}
