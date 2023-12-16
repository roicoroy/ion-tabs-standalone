import { Address, Billing, UserResponse } from "src/app/shared/wooApi";
import { Customer } from "src/app/shared/wordpress/utils/types/wooCommerceTypes";

export namespace CustomerActions {
    export class CreateCustomer {
        static readonly type = '[CustomerActions] Create Customer';
        constructor(public customer: Customer) { }
    }
    export class RetrieveCustomer {
        static readonly type = '[CustomerActions] Retrieve Customer';
        constructor(public user: UserResponse) { }
    }
    export class RetrieveAllCustomers {
        static readonly type = '[CustomerActions] Retrieve All Customers';
    }
    export class UpdateCustomerAddress {
        static readonly type = '[CustomerActions] Update Customer Address';
        constructor(public id: string, public address: Address, public addressType: string) { }
    }
}