import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState, IUserResponseModel } from '../auth/store/auth.state';
import { UserResponse } from '../shared/wooApi';

export interface IProfileFacade {
    isLoggedIn: boolean
}

@Injectable({
    providedIn: 'root'
})
export class ProfileFacade {

    @Select(AuthState.isLoggedIn) isLoggedIn$!: Observable<boolean>;

    @Select(AuthState.getUser) user$!: Observable<UserResponse>;

    readonly viewState$: Observable<IProfileFacade>;

    constructor() {
        // this.user$.subscribe((c)=> console.log(c));
        this.viewState$ = combineLatest(
            [
                this.isLoggedIn$,
                this.user$,
            ]
        )
            .pipe(
                map((
                    a,
                    b
                ) => ({
                    isLoggedIn: a[0],
                    user: b
                }))
            ) as any;
    }
}
