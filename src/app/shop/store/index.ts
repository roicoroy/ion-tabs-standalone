import { ProductsState } from "./products.state";
import { CartState } from "./cart.state";

export const ShopState = [ProductsState, CartState];

export * from "./products.actions";
export * from "./products.state";
export * from "./cart.actions";
export * from "./cart.state";
