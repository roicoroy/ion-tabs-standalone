import { Injectable } from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable, combineLatest, map } from "rxjs";
import { CustomerState } from "src/app/store/customer/customer.state";
import { Customer } from "src/app/shared/wordpress/utils/types/wooCommerceTypes";

export class ICartReviewFacadeModel {
    customer: Customer
}

@Injectable({
    providedIn: 'root'
})
export class CartReviewFacade {

    @Select(CustomerState.getCustomer) customer$!: Observable<Customer>;

    readonly viewState$: Observable<ICartReviewFacadeModel>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.customer$,
            ]
        )
            .pipe(
                map((
                    [
                        customer
                    ]
                ) => (
                    {
                        customer
                    }
                ))
            );
    }
}
