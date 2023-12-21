
export interface StripeIntend {
    id?: string;
    object?: string;
    amount: number | any;
    amount_capturable?: number;
    amount_details?: AmountDetails;
    amount_received?: number;
    application?: null;
    application_fee_amount?: null;
    automatic_payment_methods?: AutomaticPaymentMethods;
    canceled_at?: null;
    cancellation_reason?: null;
    capture_method?: string;
    client_secret?: string;
    confirmation_method?: string;
    created?: number;
    currency: string;
    customer?: null;
    description?: null;
    invoice?: null;
    last_payment_error?: null;
    latest_charge?: null;
    livemode?: boolean;
    metadata?: TipOrMetadata;
    next_action?: null;
    on_behalf_of?: null;
    payment_method?: null;
    payment_method_configuration_details?: PaymentMethodConfigurationDetails;
    payment_method_options?: PaymentMethodOptions;
    payment_method_types?: (string)[] | null;
    processing?: null;
    receipt_email?: null;
    review?: null;
    setup_future_usage?: null;
    shipping?: null;
    source?: null;
    statement_descriptor?: null;
    statement_descriptor_suffix?: null;
    status?: string;
    transfer_data?: null;
    transfer_group?: null;
}
export interface AmountDetails {
    tip: TipOrMetadata;
}
export interface TipOrMetadata {
}
export interface AutomaticPaymentMethods {
    allow_redirects: string;
    enabled: boolean;
}
export interface PaymentMethodConfigurationDetails {
    id: string;
    parent?: null;
}
export interface PaymentMethodOptions {
    card: Card;
}
export interface Card {
    installments?: null;
    mandate_options?: null;
    network?: null;
    request_three_d_secure: string;
}


export interface IOrder {
    id?: number;
    parent_id?: number;
    number?: string;
    order_key?: string;
    created_via?: string;
    version?: number;
    status?: string;
    currency?: string;
    date_created?: Date;
    date_created_gmt?: Date;
    date_modified?: Date;
    date_modified_gmt?: Date;
    discount_total?: string;
    discount_tax?: string;
    shipping_total?: string;
    shipping_tax?: string;
    cart_tax?: string;
    total?: string;
    total_tax?: string;
    prices_include_tax?: boolean;
    customer_id?: number;
    customer_ip_address?: string;
    customer_user_agent?: string;
    customer_note?: string;
    billing?: Billing;
    shipping?: Shipping;
    payment_method?: string;
    payment_method_title?: string;
    transaction_id?: string;
    date_paid?: Date;
    date_paid_gmt?: Date;
    date_completed?: Date;
    date_completed_gmt?: Date;
    cart_hash?: string;
    meta_data?: Array<any>;
    line_items?: Array<any>;
    tax_lines?: Array<any>;
    shipping_lines?: Array<any>;
    fee_lines?: Array<any>;
    coupon_lines?: Array<any>;
    refunds?: Array<any>;
    set_paid?: boolean;
}

export interface Address {
    email?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    address_1?: string | null;
    address_2?: string | null;
    city?: string | null;
    postcode?: string | null;
    country?: string | null;
    phone?: string | null;
}

export interface Billing extends Address {

}

export interface Shipping extends Address {

}

export interface OrderItem {
    name: string;
    product_id: number;
    variation_id: number;
    quantity: number;
    tax_class: number;
    subtotal: string;
    subtotal_tax: string;
    total: string;
    total_tax: string;
    taxes: Array<any>;
    meta_data: Array<any>;
    sku: string;
    price: string;
}

export interface OrderTax {
    rate_code: string;
    rate_id: string;
    label: string;
    compound: boolean;
    tax_total: string;
    shipping_tax_total: string;
    meta_data: Array<any>;
}

export interface ListOrderParameters {
    context?: string;
    page?: number;
    per_page?: number;
    search?: string;
    after?: string;
    before?: string;
    exclude?: string[];
    include?: string[];
    offset?: number;
    order?: string;
    orderby?: string;
    parent?: string[];
    parent_exclude?: string[];
    status?: string;
    customer?: number;
    product?: number;
    dp?: number;
}