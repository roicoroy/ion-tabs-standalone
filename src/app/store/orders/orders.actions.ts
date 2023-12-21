
export namespace OrdersActions {
    export class GetCompletedOrder {
        static type = '[OrdersActions] Get Completed Order';
        constructor(public orderId: string) { }
    }
}