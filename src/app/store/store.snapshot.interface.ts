import { IAuthStateModel } from "../auth/store/auth.state";
import { ICustomerStateModel } from "../profile/customer/customer.state";
import { IProductsStateModel } from "../shop/store/products.state";
import { ISettingsModel } from "./settings/settings.state";

export interface IStoreSnapshoModel {
    auth: IAuthStateModel,
    customers: ICustomerStateModel,
    products: IProductsStateModel,
    settings: ISettingsModel;
}