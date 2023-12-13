import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationService } from '../shared/utils/navigation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {

  private navigationsService = inject(NavigationService);

  constructor() { }

  ngOnInit() {
  }

  checkoutPage() {
    this.navigationsService.navigateFlip('/checkout/cart-review');
  }
}
