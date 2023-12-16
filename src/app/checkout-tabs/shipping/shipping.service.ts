import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WoocommerceHelperService, IOrder } from 'src/app/shared/wooApi';

@Injectable({
  providedIn: 'root'
})
export class WoocommerceShippingService {

  constructor(
    private httpClient: HttpClient,
    private wooHelper: WoocommerceHelperService
  ) { }

  retrieveShippingMethods(): Observable<any> {
    return this.httpClient.get<any>(`shipping_methods`)
      .pipe(catchError(err => this.wooHelper.handleError(err)));
  }
  
  retrieveShippingClasses(): Observable<any> {
    return this.httpClient.get<any>(`products/shipping_classes`)
      .pipe(catchError(err => this.wooHelper.handleError(err)));
  }
  
  retrievePaymentGateways(): Observable<any> {
    return this.httpClient.get<any>(`payment_gateways`)
      .pipe(catchError(err => this.wooHelper.handleError(err)));
  }
  
  retrieveShippingZones(): Observable<any> {
    return this.httpClient.get<any>(`shipping/zones`)
      .pipe(catchError(err => this.wooHelper.handleError(err)));
  }
  
  retrieveTaxesClasses(): Observable<any> {
    return this.httpClient.get<any>(`taxes/classes`)
      .pipe(catchError(err => this.wooHelper.handleError(err)));
  }
}
