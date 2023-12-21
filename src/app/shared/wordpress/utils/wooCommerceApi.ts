import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { Order } from "./types/wooCommerceTypes";
import { environment } from "src/environments/environment";

// initialise the WooCommerceRestApi //
// NOTE: must execute these API calls server-side because env vars only available there and it is more secure
// let api:any;
const api = new WooCommerceRestApi({
  url: environment.origin!,
  consumerKey: environment.woocommerce.consumer_key!,
  consumerSecret: environment.woocommerce.consumer_secret!,
  version: "wc/v3",
});

// fetch all products from WooCommerce //
export async function fetchWooCommerceProducts() {
  try {
    const response = await api.get("products");
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
}

// create new WooCommerce order by passing in required data object //
export async function createWooCommerceOrder(data: Order) {
  try {
    const response = await api.post("orders", data);
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function retrieveProductById(productId: string) {
  try {
    const response = await api.get(`products/${productId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }

}

export const postShippingMethods = async (methodId: string) => {
  try {
    const response = await api.get(`shipping_methods/${methodId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
}