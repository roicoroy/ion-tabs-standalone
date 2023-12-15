import { Injectable, OnDestroy, inject } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { AuthService, CreateNonceRes, LoginPayload, UserResponse, WoocommerceCustomerService, WordpressWpUserResponsePayload } from "src/app/shared/wooApi";
import { tap, catchError, Observable, Subject, takeUntil, combineLatest, map, lastValueFrom, of } from "rxjs";
import { AuthActions } from "./auth.actions";
import { IonStorageService } from "src/app/shared/utils/ionstorage.service";
import { Router } from "@angular/router";
import { AlertService } from "src/app/shared/utils/alert.service";
import { LoadingService } from "src/app/shared/utils/loading.service";
import { ErrorLoggingActions } from "src/app/store/errors-logging/errors-logging.actions";
import { AddressesActions } from "src/app/addresses/store/addresses.actions";

export interface IUserResponseModel {
    token: string | null;
    user_display_name: string | null;
    user_email: string | null;
    user_nicename: string | null;
}

export interface IAuthStateModel {
    user: IUserResponseModel,
    isLoggedIn: boolean,
    retrievePasswordResponseCode: number,
    retrievePasswordResponseMessage: string,
    registerPasswordResponseCode: number,
    registerPasswordResponseMessage: string,
}

@State<IAuthStateModel>({
    name: 'auth',
    // defaults: {
    //     user: {
    //         token: null,
    //         user_display_name: null,
    //         user_email: null,
    //         user_nicename: null,
    //     },
    //     isLoggedIn: false,
    // },
})
@Injectable({
    providedIn: 'root'
})
export class AuthState implements OnDestroy {

    private store = inject(Store);

    private router = inject(Router);

    private wooApiAuth = inject(AuthService);

    private wooApiCustomer = inject(WoocommerceCustomerService);

    private ionStorage = inject(IonStorageService);

    private alertService = inject(AlertService);

    private loadingService = inject(LoadingService);

    private readonly ngUnsubscribe = new Subject();

    @Selector()
    static getUser(state: IAuthStateModel): IUserResponseModel {
        return state.user;
    }

    @Selector()
    static getToken(state: IAuthStateModel): string | null {
        return state.user.token;
    }

    @Selector()
    static isLoggedIn(state: IAuthStateModel): boolean {
        return state.isLoggedIn;
    }

    /* 
     * Register
    */
    @Action(AuthActions.Register)
    async register(ctx: StateContext<IAuthStateModel>, { customer }: AuthActions.Register) {
        await this.loadingService.simpleLoader();
        const custs = await lastValueFrom(of(this.wooApiCustomer.createCustomer(customer)));
        custs.subscribe(async (res) => {
            setTimeout(async () => {
                if (res) {
                    const loginPaylod: LoginPayload = {
                        username: customer.email,
                        password: customer.password,
                    };
                    this.store.dispatch(new AuthActions.GetAuthToken(loginPaylod))
                        .subscribe(async () => {
                            this.store.dispatch(new AddressesActions.UpdateBillingAddress(customer.billing));
                            this.store.dispatch(new AddressesActions.UpdateBillingAddress(customer.shipping));
                            // this.store.dispatch(new CustomerActions.CreateCustomer(customer));
                        });
                    await this.loadingService.dismissLoader();
                } else {
                    await this.loadingService.dismissLoader();
                }
            }, 4000);
        });
    }

    /* 
     * Do Login
    */
    @Action(AuthActions.Login)
    async Login(ctx: StateContext<IAuthStateModel>, { loginPayload }: AuthActions.Login) {
        await this.loadingService.simpleLoader();
        this.store.dispatch(new AuthActions.GetAuthToken(loginPayload));
    }

    /* 
     * Auth Token
    */
    @Action(AuthActions.GetAuthToken)
    getAuthToken(ctx: StateContext<IAuthStateModel>, { loginPayload }: AuthActions.GetAuthToken) {
        this.wooApiAuth.getAuthToken(loginPayload)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(e => {
                    ctx.patchState({
                        isLoggedIn: false
                    });
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                    this.loadingService.dismissLoader();
                    return new Observable(obs => obs.error(e));
                })
            )
            .subscribe((user: UserResponse) => {
                if (user) {
                    this.wooApiAuth.setUser({
                        token: user?.token,
                        user_display_name: user?.user_display_name,
                        user_email: user?.user_email,
                        user_nicename: user?.user_nicename,
                    }).then(() => {
                        this.router.navigateByUrl('home').then(() => {
                            return ctx.patchState({
                                user: {
                                    token: user?.token,
                                    user_display_name: user?.user_display_name,
                                    user_email: user?.user_email,
                                    user_nicename: user?.user_nicename,
                                },
                                isLoggedIn: true
                            });
                        });
                    });
                    this.loadingService.dismissLoader();
                } else {
                    this.loadingService.dismissLoader();
                }
            });

    }

    @Action(AuthActions.GenerateAuthCookie)
    generateAuthCookie(ctx: StateContext<IAuthStateModel>, { loginPayload }: AuthActions.GenerateAuthCookie) {
        // console.log(data);
        this.wooApiAuth.generateAuthCookie(loginPayload)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                tap((user: IUserResponseModel) => {
                    console.log(user);
                }),
                catchError(e => {
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                    return new Observable(obs => obs.error(e));
                })
            )
            .subscribe((response) => {
                console.log(response);
            });
    }

    @Action(AuthActions.RetrievePassword)
    async RetrievePassword(ctx: StateContext<IAuthStateModel>, { payload }: AuthActions.RetrievePassword) {
        await this.loadingService.simpleLoader();
        this.wooApiAuth.retrievePassword(payload.username)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(async (e: any) => {
                    ctx.patchState({
                        isLoggedIn: false
                    });
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                    await this.loadingService.dismissLoader();
                    return new Observable(obs => obs.error(e));
                })
            )
            .subscribe(async (response: WordpressWpUserResponsePayload) => {
                await this.loadingService.dismissLoader();
                return ctx.patchState({
                    isLoggedIn: false,
                    retrievePasswordResponseCode: response.code,
                    retrievePasswordResponseMessage: response.message
                })
            });
    }

    @Action(AuthActions.RefresUserState)
    async refresUserState(ctx: StateContext<IAuthStateModel>, { }: AuthActions.RefresUserState) {
        this.ionStorage.getKeyAsObservable('user')
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(e => {
                    ctx.patchState({
                        isLoggedIn: false
                    });
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                    return new Observable(obs => obs.error(e));
                })
            )
            .subscribe((user: UserResponse) => {
                if (user) {
                    ctx.patchState({
                        user: {
                            token: user.token,
                            user_display_name: user.user_display_name,
                            user_email: user.user_email,
                            user_nicename: user.user_nicename,
                        },
                        isLoggedIn: true
                    });
                } else {
                    ctx.patchState({
                        user: {
                            token: null,
                            user_display_name: null,
                            user_email: null,
                            user_nicename: null,
                        },
                        isLoggedIn: false
                    });
                }
            });
    }

    @Action(AuthActions.AuthLogout)
    authLogout(ctx: StateContext<IAuthStateModel>, { }: AuthActions.AuthLogout) {
        return this.ionStorage.storageRemove('user')
            .then(() => {
                return ctx.patchState({
                    user: {
                        token: null,
                        user_display_name: null,
                        user_email: null,
                        user_nicename: null,
                    },
                    isLoggedIn: false
                });
            },
                (e) => {
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                    console.log('Error logging out');
                }
            )
    }

    @Action(AuthActions.CreateNonceAction)
    createNonceAction(ctx: StateContext<IAuthStateModel>, { payload }: AuthActions.CreateNonceAction) {
        this.wooApiAuth.createNonce(payload)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(e => {
                    ctx.patchState({
                        isLoggedIn: false
                    });
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                    return new Observable(obs => obs.error(e));
                })
            )
            .subscribe((res: CreateNonceRes) => {
                console.log(res);
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }

}