import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationService } from '../shared/utils/navigation.service';
import { CartComponent } from '../shop/cart/cart.component';
import { CartIconComponent } from '../shop/cart-icon/cart-icon.component';
import { Store } from '@ngxs/store';
import { ProductsActions } from '../store/products/products.actions';
import { AddressesComponent } from '../components/addresses/addresses-list/addresses.component';
import { AuthActions } from '../auth/store/auth.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule,
    CartComponent,
    CartIconComponent,
    AddressesComponent
  ]
})
export class HomePage implements OnInit {

  private navigationsService = inject(NavigationService);

  constructor(
    private store: Store,
  ) { }

  ionViewWillEnter() {
    this.store.dispatch(new ProductsActions.RetrieveProducts());
  }
  
  ngOnInit() {
  }

  checkoutPage() {
    // this.navigationsService.navigateFlip('/checkout/cart-review');
  }

  loginPage() {
    this.navigationsService.navigateFlip('/login');
  }
  
  addressesPage() {
    this.navigationsService.navigateFlip('/checkout/addresses');
  }
  
  productsListPage() {
    this.navigationsService.navigateFlip('/product-list');
  }
  
  profilePage() {
    this.navigationsService.navigateFlip('/profile');
  }
  logout() {
    this.store.dispatch(new AuthActions.AuthLogout());
    this.navigationsService.navControllerDefault('login')
  }
}
