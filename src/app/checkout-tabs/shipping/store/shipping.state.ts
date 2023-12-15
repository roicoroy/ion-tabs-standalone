import { Injectable, OnDestroy } from "@angular/core";
import { State } from "@ngxs/store";
import { Subject } from "rxjs";

export interface IShippingStateModel {
}

@State<IShippingStateModel>({
    name: 'customer',
    // defaults: {
    //     customer: null,
    //     customers: []
    // },
})
@Injectable({
    providedIn: 'root'
})
export class CustomerState implements OnDestroy {

    private readonly ngUnsubscribe = new Subject();

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
}