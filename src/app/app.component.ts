import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp, call, camera, cameraOutline, cog, cogOutline, home, homeOutline, mail, menu, menuOutline, storefront, storefrontOutline, thumbsUp, thumbsUpOutline, homeSharp, heart, share, create, add, cart, checkmarkOutline, arrowBack, wallet, bicycle, book, triangle, remove, informationCircleOutline, eyeOffOutline, eyeOutline, card } from 'ionicons/icons';

import { Observable, Subject } from 'rxjs';
import { AppFacade, IAppFacadeModel } from './app.facade';
import { Platform } from '@ionic/angular';
import { NavigationService } from './shared/utils/navigation.service';
import { AuthActions } from './auth/store/auth.actions';
import { FcmService } from './shared/fcm.service';
import { LanguageService } from './shared/language/language.service';
import { KeyboardService } from './shared/native/keyboard/keyboard.service';
import { ThemeService } from './shared/utils/theme.service';
import { ProductsActions } from './store/products/products.actions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet],
})
export class AppComponent implements OnInit, OnDestroy {
  public appPages = [
    { title: 'Nd Graphics', url: '/nd-graphics', icon: 'bookmark' },
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Woo', url: '/product-list', icon: 'storefront' },
    { title: 'Checkout', url: '/checkout/tabs/addresses', icon: 'paper-plane' },
    { title: 'Blog', url: '/posts', icon: 'archive' },
    { title: 'Settings', url: '/settings', icon: 'cog' },
  ];

  viewState$!: Observable<IAppFacadeModel>;

  private store = inject(Store);

  private router = inject(Router);

  private facade = inject(AppFacade);

  public platform = inject(Platform);

  private language = inject(LanguageService);

  private theme = inject(ThemeService);

  private keyboardService = inject(KeyboardService);

  private fcm = inject(FcmService);

  private navigationsService = inject(NavigationService);

  private readonly ngUnsubscribe = new Subject();

  constructor() {
    this.viewState$ = this.facade.viewState$;
    // this.viewState$.subscribe(vs=>{
    //   console.log('@@@@:: ', vs);
    // });
  }

  checkoutPage() {
    this.navigationsService.navigateFlip('/checkout/cart-review');
  }

  async ngOnInit() {
    await this.appInit();
  }

  async appInit() {
    try {
      this.iconsInit();

      this.language.initTranslate();

      this.theme.themeInit();

      if (this.platform.is('hybrid')) {
        if (this.platform.is('android') || this.platform.is('ios')) {
          this.keyboardService.setAccessoryBarVisible(true).catch(() => { });
          this.keyboardService.initKeyboardListeners();
          this.fcm.listenersPushInit();
        }
      }

      this.store.dispatch(new AuthActions.RefresUserState());

      this.store.dispatch(new ProductsActions.RetrieveProducts());

    } catch (err) {
      console.log('This is normal in a browser', err);
    }
  }

  logout() {
    this.store.dispatch(new AuthActions.AuthLogout());
    this.router.navigateByUrl('login')
  }

  iconsInit() {
    return addIcons({
      remove,
      cart,
      card,
      create,
      informationCircleOutline,
      add,
      share,
      homeSharp,
      home,
      storefront,
      camera,
      heart,
      menu,
      mail,
      cog,
      thumbsUp,
      homeOutline,
      storefrontOutline,
      cameraOutline,
      menuOutline,
      mailOutline,
      cogOutline,
      thumbsUpOutline,
      call,
      mailSharp,
      paperPlaneOutline,
      paperPlaneSharp,
      heartOutline,
      heartSharp,
      archiveOutline,
      archiveSharp,
      trashOutline,
      trashSharp,
      warningOutline,
      warningSharp,
      bookmarkOutline,
      bookmarkSharp,
      checkmarkOutline,
      arrowBack,
      wallet,
      book,
      triangle,
      bicycle,
      eyeOffOutline,
      eyeOutline

      
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}

