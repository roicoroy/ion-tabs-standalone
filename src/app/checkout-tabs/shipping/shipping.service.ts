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

  getShippingDetails(zoneID: string, methodID: string): Observable<any> {
    const url = `shipping/zones/${zoneID}/methods/${methodID}`;
    return this.httpClient.get<any>(url)
      .pipe(catchError(err => this.wooHelper.handleError(err)));
  }

  getAllShippingMethods(zoneId: string): Observable<any> {
    return this.httpClient.get<any>(`shipping/zones/${zoneId}/methods`)
      .pipe(catchError(err => this.wooHelper.handleError(err)));
  }

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
