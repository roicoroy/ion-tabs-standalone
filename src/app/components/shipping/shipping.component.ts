import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { IonicModule } from '@ionic/angular';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ShippingActions } from 'src/app/store/shipping/shipping.actions';
import { IShippingFacadeModel, ShippingFacade } from './shipping.facade';
import { CartActions } from 'src/app/store/cart/cart.actions';

@Component({
  selector: 'shipping-component',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    ReactiveFormsModule
  ]
})
export class ShippingComponent implements OnInit, OnDestroy {
  viewState$!: Observable<IShippingFacadeModel>;

  selected_shipping_line: any;

  methodId: string = '';

  zoneID: string = '';

  private facade = inject(ShippingFacade);

  private store = inject(Store);

  private sanitizer = inject(DomSanitizer);

  private readonly ngUnsubscribe = new Subject();

  constructor() { }


  ionViewWillEnter() {

  }

  ngOnInit() {
    this.store.dispatch(new ShippingActions.RetrieveShippingMethods());
    // this.store.dispatch(new ShippingActions.RetrieveShippingClasses());
    this.store.dispatch(new ShippingActions.RetrievePaymentGateways());
    this.store.dispatch(new ShippingActions.RetrieveShippingZones());
    // this.store.dispatch(new ShippingActions.RetrieveTaxesClasses());
    this.viewState$ = this.facade.viewState$;

    this.viewState$.pipe(
      takeUntil(this.ngUnsubscribe),
      take(1),
    ).subscribe({
      next: (vs: any) => {
        if (vs.selected_shipping_line) {
          this.selected_shipping_line = vs.selected_shipping_line;
        }
      },
    });
  }

  shippingZones($event: any) {
    this.zoneID = $event.target.value.id;
    console.log(this.zoneID);
    this.store.dispatch(new ShippingActions.GetAllShippingMethods(this.zoneID));
  }

  shippingLinesChange($event: any) {
    this.methodId = $event.target.value.id;
    console.log('this.methodId', this.methodId);
    // console.log('this.methodId', this.methodId);
    // this.store.dispatch(new ShippingActions.UpdateCartShippingLines(method));
  }

  paymentGatewaysChange($event: any) {
    console.log($event.detail.value);
    // const methodId = $event.detail.value;
    // this.store.dispatch(new ShippingActions.UpdateCartPaymentGateways(methodId));
  }

  sanitise(content: any) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
