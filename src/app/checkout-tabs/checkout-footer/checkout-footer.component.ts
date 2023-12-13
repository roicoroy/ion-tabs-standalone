import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationService } from 'src/app/shared/utils/navigation.service';

@Component({
  selector: 'checkout-footer',
  templateUrl: './checkout-footer.component.html',
  styleUrls: ['./checkout-footer.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CheckoutFooterComponent implements OnInit {

  @Input() pageTitle!: string;

  private navigationsService = inject(NavigationService);

  constructor() { }

  ngOnInit() { }

  back() {
    this.navigationsService.navControllerDefault('home', 'back');
  }

}
