import { Customer } from "src/app/shared/wordpress/utils/types/wooCommerceTypes";

export namespace CustomerActions {
    export class CreateCustomer {
        static readonly type = '[CustomerActions] Create Customer';
        constructor(public customer: Customer) { }
    }
    export class RetrieveAllCustomers {
        static readonly type = '[CustomerActions] Retrieve All Customers';
    }
    export class RetrieveCustomer {
        static readonly type = '[CustomerActions] Retrieve Customer';
        constructor(public email: string) { }
    }
    export class UpdateCustomer {
        static readonly type = '[CustomerActions] Update Customer';
        constructor(public id: number) { }
    }
}