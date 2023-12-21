import { IAuthStateModel } from "../auth/store/auth.state";
import { ICustomerStateModel } from "./customer/customer.state";
import { IProductsStateModel } from "./products/products.state";
import { ISettingsModel } from "./settings/settings.state";

export interface IStoreSnapshoModel {
    auth: IAuthStateModel,
    customers: ICustomerStateModel,
    products: IProductsStateModel,
    settings: ISettingsModel;
}