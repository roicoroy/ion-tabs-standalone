import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AddressesState } from '../store/addresses.state';
import { Select } from '@ngxs/store';
import { Shipping, Billing } from 'src/app/shared/wooApi';

@Component({
  selector: 'addresses-component',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterLink
  ]
})
export class AddressesComponent implements OnInit, OnDestroy {

  @Select(AddressesState.getShipping) shipping_address$!: Observable<Shipping>;

  @Select(AddressesState.getBilling) billing_address$!: Observable<Billing>;

  private readonly ngUnsubscribe = new Subject();

  constructor() {

    this.shipping_address$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (p: Shipping) => {
          console.log('shipping_address', p);
        },
      });

    this.billing_address$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (p: Billing) => {
          console.log('billing_address', p);
        }
      });
  }

  ngOnInit() { }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
