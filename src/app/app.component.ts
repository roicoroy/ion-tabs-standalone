import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { Store } from '@ngxs/store';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp, call, camera, cameraOutline, cog, cogOutline, home, homeOutline, mail, menu, menuOutline, storefront, storefrontOutline, thumbsUp, thumbsUpOutline, homeSharp, heart, share, create, add, cart, checkmarkOutline, arrowBack, wallet, bicycle, book, triangle, remove } from 'ionicons/icons';

import { AuthActions } from './store/auth/auth.actions';
import { Observable, Subject } from 'rxjs';
import { AppFacade, IAppFacadeModel } from './app.facade';
import { Platform } from '@ionic/angular';
import { KeyboardService } from './shared/native/keyboard/keyboard.service';
import { FcmService } from './shared/fcm.service';
import { NavigationService } from './shared/utils/navigation.service';
import { ProductsActions } from './shop/store/products.actions';

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
    } catch (err) {
      console.log('Error:', err);
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
      create,
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
      bicycle
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}

