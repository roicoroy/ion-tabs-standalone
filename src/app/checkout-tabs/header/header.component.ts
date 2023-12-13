import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationService } from 'src/app/shared/utils/navigation.service';

@Component({
  selector: 'checkout-header',
  templateUrl: './header.component.html',
  styleUrls: ['../checkout.styles.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CheckoutHeaderComponent implements OnInit {

  @Input() pageTitle!: string;

  private navigationsService = inject(NavigationService);

  constructor() { }

  ngOnInit() { }

  segmentChanged($event: any) {
    // console.log($event);
  }

  back() {
    this.navigationsService.navControllerDefault('product-list', 'back');
  }

}
