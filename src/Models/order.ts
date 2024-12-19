import {
  CustomerType,
  ShippingType,
  TaxType,
  TransactionListType,
} from "services/api.types";

import { IStoreProfile } from "./store";
export type RefundType = {
  amount: string;
  created_at: string;
  id: number;
  order_id: number;
  transaction_date: string;
  updated_at: string;
};
export type LocationType = {
  reason_for_deletion: null;
  is_disabled: number;
  address: string;
  city: string;
  city_id: number;
  country: string;
  country_id: number;
  created_at: string;
  handles_fulfillment: number;
  holds_inventory: number;
  id: any;
  is_active: number;
  is_default: number;
  latitude: any;
  longitude: any;
  name: string;
  state: string;
  state_id: number;
  store_id: number;
  updated_at: string;
  zip: any;
};

export type LocationResponseType = {
  slots: {
    available_location_slots: number;
    default_location: number;
    disabledLocations: number;
    used_location_slots: number;
  };
  data: LocationType[];
  status: string;
};

export type LedgerType = {
  action: "added" | "removed" | "sold" | "reserved";
  created_at: string;
  id: number;
  location_inventory_id: number;
  quantity: number;
  quantity_after: number;
  quantity_before: number;
  source_id: number;
  source_type: string;
  store_id: number;
  updated_at: string;
  user_id: number;
  user: IStoreProfile;
};
export type OrderItemType = {
  description: string;
  discount: null | string;
  discount_type: null | string;
  discount_val: null | string;
  id: number;
  name: string;
  price: string;
  quantity: number;
  tax: null | string;
  thumbnail_url: string;
  total: string;
  unit: string;
  url: string;
  variant: number;
  unavailable_quantity?: number;
  available_quantity: number;
};

export type ShippingRecord = {
  id: number;
  shop_pickup_location_id: number;
  customer_pickup_location_id: number;
  store_id: number;
  order_id: number;
  url: string;
  tracking_number: string;
  logistics_partner: string;
  shipping_provider_id: number;
  shipping_date: string;
  created_at: string;
  updated_at: string;
  shipment: {
    date: string;
    order_id: string;
    status: string;
    connected_account: boolean;
    courier: {
      name: string;
      service_icon: string;
      email: string;
      phone: string;
      tracking_code: string;
      tracking_message: string;
      rider_info: any;
    };
    is_cod_order: boolean;
    is_cod_remitted: boolean;
    ship_from: {
      name: string;
      phone: string;
      email: string;
      address: string;
    };
    ship_to: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
    to_be_processed: string;
    payment: {
      shipping_fee: number;
      currency: string;
    };
    package_status: {
      status: string;
      datetime: string;
    }[];
    insurance: any;
    events: {
      location: string;
      message: string;
      captured: string;
    }[];
    dropoff_station: any;
    pickup_station: any;
    tracking_url: string;
    waybill_document: any;
  }[];
  shipping_provider: {
    id: any;
    name: string;
    class: string;
    is_active: any;
    created_at: string;
    updated_at: string;
  };
};
export type OrderType = {
  isLatest?: boolean;
  order_items: any;
  amount_due: string;
  order_number: string;
  amount_paid: string;
  channel: string;
  should_resolve: 0 | 1;
  coupon_code: null | string;
  proof_of_payment?: string[];
  proof_urls?: string[];
  created_at: string;
  currency_code: string;
  customer_details: string;
  customer_id: number;
  customer_url: string;
  deleted_at: null | string;
  discount: string;
  payment_method?: string;
  discount_per_item: false;
  discount_type: string;
  discount_val: string;
  discount_value: string;
  should_refund: boolean;
  downloadable: number;
  exchange_rate: string;
  exchanged: number;
  customer?: CustomerType;
  files: any[];
  formattedOrderDate: string;
  grand_total: string;
  has_discount: boolean;
  has_tax: boolean;
  history: null | string;
  id: number;
  invoice_id: null | number;
  invoice_pdf: string;
  shipping_slip: string;
  invoice_template_id: number;
  is_guest: number;
  notes: null | string;
  note: string;
  order_date: string;
  order_page: string;
  origin: string;
  payment_status: "PAID" | "UNPAID" | "PENDING" | "PARTIALLY_PAID";
  shipping_details: any;
  shipping_option?: ShippingType;
  shipping_record?: ShippingRecord;
  shipping_price: string;
  shipping_status:
    | "DELIVERED"
    | "UNFULFILLED"
    | "SHIPPED"
    | "RETURNED"
    | "BOOKED_PICKUP"
    | "IN_TRANSIT";
  status: "COMPLETED" | "OPEN" | "CANCELLED" | "PROCESSING";
  store_id: number;
  sub_total: string;
  tax: string;
  tax_per_item: false;
  taxes: TaxType[];
  total: string;
  total_discount: string;
  unique_hash: string;
  updated_at: string;
  url: string;
  items: OrderItemType[];
  transactions?: TransactionListType[];
  refunds?: RefundType[];
  order_history?: {
    created_at: string;
    id: number;
    order: OrderType;
    order_id: number;
    order_number: string;
  }[];
  reserved_until?: string;
};
