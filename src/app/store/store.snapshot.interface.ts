import { IAuthStateModel } from "../auth/store/auth.state";
import { IProductsStateModel } from "../shop/store/products.state";
import { ICustomerStateModel } from "./customer/customer.state";
import { ISettingsModel } from "./settings/settings.state";

export interface IStoreSnapshoModel {
    auth: IAuthStateModel,
    customer: ICustomerStateModel,
    products: IProductsStateModel,
    settings: ISettingsModel
}