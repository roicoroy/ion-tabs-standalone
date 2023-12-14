import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CheckoutHeaderComponent } from '../header/header.component';
import { Observable, Subject, combineLatest, map, takeUntil, tap } from 'rxjs';
import { CheckoutFooterComponent } from '../checkout-footer/checkout-footer.component';
import { CheckoutTabsService } from '../checkout-tabs.service';
import { AddressesComponent } from 'src/app/addresses/addresses-list/addresses.component';
import { Select } from '@ngxs/store';
import { AddressesState } from 'src/app/addresses/store/addresses.state';
import { Address, Billing, Shipping } from 'src/app/shared/wooApi';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['../checkout.styles.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CheckoutHeaderComponent,
    CheckoutFooterComponent,
    AddressesComponent
  ]
})
export class AddressesPage implements OnInit, OnDestroy {

  @Select(AddressesState.getBilling) billing_address$!: Observable<Billing>;

  @Select(AddressesState.getShipping) shipping_address$!: Observable<Shipping>;

  pageTitle = 'Cart Review Page';

  private service = inject(CheckoutTabsService);

  private loadingController = inject(LoadingController);

  private billing_address!: Address;
  private shipping_address!: Address;

  private readonly ngUnsubscribe = new Subject();

  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();
    const obs$ = combineLatest([this.billing_address$, this.shipping_address$]).pipe(
      map(([
        billing_address$,
        shipping_address$
      ]) => ({
        billing_address: billing_address$,
        shipping_address: shipping_address$,
      }))
    );

    obs$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(async (p: any) => {
          this.billing_address = p.billing_address;
          this.shipping_address = p.shipping_address;
          if ( p.billing_address && p.shipping_address) {
            await this.service.ready(true);
          }
          else {
            await this.service.ready(false);
          }
          await loading.dismiss();
        })
        )
      .subscribe({
        next: async (p: any) => {
          this.billing_address = p.billing_address;
          this.shipping_address = p.shipping_address;
          if ( p.billing_address && p.shipping_address) {
            await this.service.ready(true);
          }
          else {
            await this.service.ready(false);
          }
          await loading.dismiss();
        },
        error: (e) => {
          console.error(e)
        },
        complete: async () => {
          if ( this.billing_address && this.shipping_address) {
            await this.service.ready(true);
          }
          else {
            await this.service.ready(false);
          }
          await loading.dismiss();
        },
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
