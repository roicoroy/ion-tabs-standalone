import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IProductsFacadeModel, ProductsFacade } from '../products.facade';
import { RouterLink } from '@angular/router';
import { Images } from 'src/app/shared/wooApi';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { IAlbum, Lightbox, LightboxModule } from 'ngx-lightbox';
import { NavigationService } from 'src/app/shared/utils/navigation.service';
import { CartIconComponent } from '../../components/cart-components/cart-icon/cart-icon.component';
import { Product } from 'src/app/shared/wordpress/utils/types/wooCommerceTypes';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    RouterLink,
    IonicModule,
    CommonModule,
    FormsModule,
    CartIconComponent,
    LightboxModule
  ]
})
export class ProductListPage implements OnInit, OnDestroy {

  @ViewChild('swiper') swiperRef: ElementRef | undefined;

  swiper?: Swiper;

  viewState$: Observable<IProductsFacadeModel>;

  productsList!: Product[];

  signsGallery: any = [
    {
      src: 'assets/banners/sign-1.png',
      thumb: 'assets/banners/sign-1.png'
    },
    {
      src: 'assets/banners/sign-2.png',
      thumb: 'assets/banners/sign-2.png',
    },
    {
      src: 'assets/banners/sign-3.png',
      thumb: 'assets/banners/sign-3.png'
    },
  ];

  private readonly ngUnsubscribe = new Subject();

  private lightbox = inject(Lightbox);

  private navigationsService = inject(NavigationService);

  constructor(
    private facade: ProductsFacade,
    private store: Store,
  ) {
    this.viewState$ = this.facade.viewState$;

    this.facade.viewState$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (p: IProductsFacadeModel) => {
          this.productsList = p.products;
          // console.log('complete', p);
        },
      });
  }
  
  ngOnInit() {
    this.swiperInit();
  }

  checkoutPage() {
    this.navigationsService.navigateFlip('/checkout/cart-review');
  }
  
  homePage() {
    this.navigationsService.navigateFlip('/home');
  }
  
  openGallery(gallery: Images[] | undefined, index: number): void {
    const album: IAlbum[] | any = gallery?.map((element: any, i) => ({
      src: element.src,
      thumb: element.src,
      caption: element.name,
      downloadUrl: null
    }));

    this.lightbox.open(album, index);
  }

  async swiperInit() {
    const initSwipe = () => {
    }

    this.swiper = new Swiper(".photoSwiper", {
      modules: [Navigation, Pagination],
      navigation: {
        enabled: false,
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
        type: 'bullets',
        renderProgressbar: function (progressbarFillClass) {
          return '<span class="' + progressbarFillClass + '"></span>';
        }
      },
      on: {
        init() {
          initSwipe();
        },
      },
    });
    this.swiper.init();
  }

  onButtonAction(data: any) {
    console.log(data);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
