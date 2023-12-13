import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CheckoutHeaderComponent } from '../header/header.component';
import { Subject } from 'rxjs';
import { CheckoutTabsService } from '../checkout-tabs.service';
import { CheckoutFooterComponent } from '../checkout-footer/checkout-footer.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['../checkout.styles.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CheckoutHeaderComponent,
    CheckoutFooterComponent
  ]
})
export class PaymentPage implements OnInit {

  pageTitle = 'Payment Page';

  buttonToggle: boolean = false;

  private service = inject(CheckoutTabsService);

  private readonly ngUnsubscribe = new Subject();

  ngOnInit() {
  }

  toogle() {
    this.buttonToggle = !this.buttonToggle
    this.service.ready(this.buttonToggle);
  }
  reviewReady(selectedTab: string): void {
  }

  formReady(ready: boolean) {
    this.service.ready(ready);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
