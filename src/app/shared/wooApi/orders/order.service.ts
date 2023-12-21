import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WoocommerceHelperService } from '../helper.service';
import { ListOrderParameters, IOrder } from './orders.interface';
import { Order } from '../../wordpress/utils/types/wooCommerceTypes';

@Injectable({
  providedIn: 'root'
})
export class WoocommerceOrderService {

  constructor(
    private httpClient: HttpClient,
    private wooHelper: WoocommerceHelperService
  ) { }



  createOrder(order: Order): Observable<Order> {
    return this.httpClient.post<Order>(`orders`, order)
      .pipe(catchError(err => this.wooHelper.handleError(err)));
  }

  retrieveOrder(id: string): Observable<IOrder> {
    return this.httpClient.get<IOrder>(`orders/${id}`)
      .pipe(catchError(err => this.wooHelper.handleError(err)));
  }

  listAllOrders(params?: ListOrderParameters): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`orders`, { params: params as HttpParams || {} })
      .pipe(catchError(err => this.wooHelper.handleError(err)));
  }

  updateOrder(order: Partial<Order>): Observable<Order> {
    // console.log(order);
    return this.httpClient.put<Order>(`orders/${order.id}`, order)
      .pipe(catchError(err => this.wooHelper.handleError(err)));
  }

  deleteOrder(id: string): Observable<IOrder> {
    return this.httpClient.delete<IOrder>(`orders/${id}`)
      .pipe(catchError(err => this.wooHelper.handleError(err)));
  }
}
