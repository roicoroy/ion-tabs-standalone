import { Injectable, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SettingsState } from '../store/settings/settings.state';
import { AuthActions } from '../auth/store/auth.actions';
import { AuthState } from '../auth/store/auth.state';

export interface ISeetingsFacadeState {
    isLoggedIn: boolean,
    fcmToken: string,
}

@Injectable({
    providedIn: 'root'
})
export class SettingsFacade {

    @Select(AuthState.isLoggedIn) isLoggedIn$!: Observable<boolean>;

    @Select(SettingsState.getFcmToken) fcmToken$!: Observable<string>;

    private store = inject(Store);

    readonly viewState$: Observable<ISeetingsFacadeState>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.isLoggedIn$,
                this.fcmToken$,
            ]
        ).pipe(
            map((
                [
                    isLoggedIn,
                    fcmToken
                ]
            ) => ({
                isLoggedIn,
                fcmToken
            }))
        );
    }

    appLogout() {
        this.store.dispatch(new AuthActions.AuthLogout());
    }

    loadApp() {
        this.store.dispatch(new AuthActions.RefresUserState());
    }

    appUploadProfileImage(formData: FormData) {
        console.log(formData);
        // return this.store.dispatch(new UserProfileActions.UploadImage(formData))
    }

    setDarkMode(isDarkMode: boolean) {
        // return this.store.dispatch(new UserProfileActions.UpdateDarkMode(isDarkMode))
    }

    // setFCMStatus(pushAccepted: boolean) {
        
    // }
}
