import { ImageUrl } from "components/forms/UploadMultipleProductImage";
import { PaginationMeta, PermissionsType } from "../Models/index";
import { IStoreInformation, Iplan } from "Models/store";
import { OrderType } from "Models/order";

export type SearchDomainType = {
  domainName: string;
  isAvailable: boolean;
  price: number;
  currency: string;
};
export type LocationType = {
  name: string;
  address: string;
  country?: string;
  state?: string;
  city?: string;
  id: string;
  is_default?: number;
  country_id: number;
  state_id: number;
  city_id: number;
};
export type DnsHostType = {
  address: string;
  associated_app_title: string;
  friendly_name: string;
  host_id: string;
  is_active: boolean;
  is_ddns_enabled: boolean;
  mx_pref: string;
  name: string;
  ttl: string;
  type: string;
};
export type SingleDomainType = {
  created_at: string;
  domain_name: string;
  duration: number;
  expired_at: string;
  is_alive: number;
  is_premium: boolean;
  owner_name: string;
  registrar_lock: number;
  renewal_date: string;
  status: string;
  has_expired: boolean;
  meta: [];
};
export type domainListType = {
  auto_renew: boolean;
  can_manage_dns: boolean;
  created_at: string;
  domain_expires_at: string;
  domain_name: string;
  domain_provider: string;
  has_expired: boolean;
  id: number;
  is_live: number;
  next_renewal_date: string;
  registrar_lock: number;
  registration_date: string;
  should_renew: boolean;
  status: string;
  store_id: number;
  was_integrated: number;
  whoisguardEnable: any;
};

export type domainPaymentListType = {
  amount: string;
  authorization_url: string;
  channel: string;
  currency: string;
  domain_name: string;
  duration: string;
  id: number;
  initiated_at: string;
  payment_date: string;
  plan_id: number;
  provider: string;
  providerCharge: string;
  status: string;
  store_id: number;
  type: string;
};

export type InitiateDomainPaymentType = {
  domain: string;
  first_name: string;
  last_name: string;
  email_address: string;
  billing?: {
    address: string;
    state: string;
    city: string;
    zip_code: string;
  };
};

export type ErrorType = {
  error: {
    data: {
      status: string;
      message: string;
      errors?: any;
    };
    status: number;
  };
  status: number | string;
};

export type TransactionField = {
  order_id: string;
  transaction_date: string;
  amount: number;
  method: string;
  customer_id?: string;
  notes?: string;
};

export type LoginType = {
  access_token: string;
  expires_in: number;
  store_id: number;
  permissions: PermissionsType;
  store: IStoreInformation;
  location: LocationType;
  userAssignedLocations: LocationType[];
  assigned_locations: LocationType[];
  logged_in_location: LocationType;
  meta: {
    first_logged_in: string | null;
    has_logged_in: number;
    first_login: boolean;
  };
};

export type VerifyOtpType = {
  message?: string;
  "register-link"?: string;
};

export type meta = {
  status_code: number;
  success: boolean;
  message?: string;
  token?: string;
  pagination?: PaginationMeta;
};

export type FileRes = {
  _id: string;
  name: string;
  key: string;
  url: string;
  user: string;
  createdAt: string;
  mime_type: string;
};

export type CreateProductFeildsPayload = {
  productType?: string;
  title: string;
  description?: string;
  stock?: number;
  cost?: number;
  details?: string;
  unit?: string;
  price: number;
  sales?: number;
  images?: any[];
  image?: string;
  options?: { name: string; values: string[] }[] | [];
  variations?: any[];
  tax?: { name: string; tax: string; id: number };
  // collection: string;
  // status: string;
  //
  sku?: string;
  // relatedProducts?: string[];
};

export type EditProductFeildsPayload = {
  productType?: string;
  status?: number;
  title?: string;
  description?: string;
  stock?: number;
  cost?: number;
  details?: string;
  unit?: string;
  price?: number;
  sales?: number;
  images?: any[];
  image?: string;
  options?: { name: string; values: string[] }[] | [];
  variations?: any[];
  tax?: { name: string; tax: string; id: number };
  // collection: string;
  // status: string;
  //
  sku?: string;
  // relatedProducts?: string[];
};

export type ProductType = {};
export type NEWSLETTERTYPE = {
  id: number;
  store_id: number;
  name: string | null;
  email: string;
  phone: string;
  subscribed_at: string | null;
  verified_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  contact: string;
};
export type CampaignParamsType = {
  invalidEmailsCount: number;
  invalidPhonesCount: number;
};

export type CustomerType = {
  id: number;
  store_id: number;
  channel: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  alternative_phone: string;
  handle: string;
  balance: string;
  addresses: [];
  avatar: string | null;
  notes: string;
  email_verified_at: null | string;
  cart_session_id: null | string;
  currency: string;
  push_token: null | string;
  provider: null | string;
  provider_id: null | string;
  deleted_at: null | string;
  created_at: string;
  updated_at: string;
  welcome_valid_until: null | string;
  last_purchase: string;
  default: number;
  name: string;
  order_count?: number | string;
  email_valid?: boolean;
  phone_valid?: boolean;
  campaignParams?: any;
  data?: [];
  total?: number;
  address?: {
    first_name: string;
    last_name: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    phone: string;
    company: string;
    type: string;
  };
  billing_address: {
    first_name: string;
    last_name: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    phone: string;
    company: string;
    type: string;
  };
  shipping_address: {
    first_name: string;
    last_name: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    phone: string;
    company: string;
    type: string;
  };
  has_address: boolean;
  groups: string[];
  customer_social_credentials: string[];
};

export type CustomersResponseType = {
  data: CustomerType[];
  current_page: number;
  last_page: number;
  campaignParams: CampaignParamsType;
  total: number;
};

export type GetCustomersResponseType = {
  customers?: CustomersResponseType;
};

export type AddNewCustomerPayload = {
  name: string;
  phone: string;
  email?: string;
  handle?: string;
  notes?: string;
  addresses?: {
    zip?: number;
    city?: string;
    type?: string;
    phone?: string;
    state?: string;
    street?: string;
    country?: string;
    default?: number;
    last_name?: string;
    first_name?: string;
  }[];
  groups?: string[];
};

export type CustomerGroupType = {
  id: number;
  store_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  customers_count: number;
  customers: CustomerType[];
  data: CustomerType[];
  current_page: number;
  last_page: number;
  campaignParams: CampaignParamsType;
  total: number;
};

export type CountryType = {
  id: number;
  code: string;
  name: string;
  phonecode: number;
};

export type TaxType = {
  id: number;
  store_id: number;
  name: string;
  percent: number;
  compound_tax: number;
  collective_tax: number;
  description: string;
  created_at: string;
  updated_at: string;
  flags?: {
    pos_apply: boolean;
    storefront_apply: boolean;
  };
};

export type NoteType = {
  id: number;
  store_id: number;
  title: string;
  content: string;
  active: 0 | 1;
  created_at: string;
  updated_at: string;
};

export type ShippingType = {
  percent(arg0: string, percent: any): unknown;
  id: number;
  store_id: number;
  name: string;
  visible: number;
  price: string;
  description: string;
  created_at: string;
  updated_at: string;
  location_id: number;
  price_formatted: string;
  is_free?: 1 | 0;
  status?: 1 | 0;
  conditions?: { minimum_cart: number };
};

export type ShipBubbleType = {
  img: string;
  name: string;
  price: string;
};

export type CollectionType = {
  id: number;
  store_id: number;
  tag: string;
  created_at: string;
  updated_at: string;
  products_count: number;
  url: string;
  products: any[];
  description: string;
  image_path?: string;
};

export type MetaIntegration = {
  success: boolean;
  integration?: {
    id: string;
    store_id: number;
    client_id: string;
    page_id: string;
    igid: string;
    token: string;
    page_access_token: string;
    avatar: null | string;
    expires_at: string;
    provider: string;
    scopes: string[];
    created_at: string;
    updated_at: string;
    status: null | string;
    debug_message: null | string;
  };
};

export type CreateDiscountFormType = {
  type: string;
  description: string;
  value: number;
  valid_from: string;
  valid_till: string;
  max_discount?: number;
  products?: string[];
  products_variations?: string[];
  collections?: string[];
  all?: boolean;
};

export type CreateCouponFormType = {
  code: string;
  type: string;
  description: string;
  value: number;
  valid_from: string;
  valid_till: string;
  minimum_value: number;
  max_discount?: number;
  products?: string[];
  products_variations?: string[];
  collections?: string[];
  all?: boolean;
};

export type DiscountType = {
  collections_count: number;
  created_at: string;
  deleted_at: null | string;
  description: string;
  id: number;
  is_active: boolean;
  max_discount: null | string;
  product_variations?: any[];
  collections?: CollectionType[];
  products?: any[];
  status: string;
  live_status: number;
  store_id: number;
  type: string;
  updated_at: string;
  url: string;
  valid_from: string;
  valid_till: string;
  value: string;
  product_variations_count?: number;
  products_count?: number;
  real_status: number;
};

export type CouponType = {
  collections_count: number;
  real_status: number;
  created_at: string;
  deleted_at: null | string;
  description: string;
  class: string;
  code: string;
  id: number;
  is_valid: boolean;
  live_status: number;
  max_uses: null | string;
  minimum_type: string;
  minimum_value: string;
  max_discount: null | string;
  total_usage: number;
  product_variations?: any[];
  collections?: CollectionType[];
  products?: any[];
  status: string;
  store_id: number;
  type: string;
  updated_at: string;
  url: string;
  valid_from: string;
  valid_till: string;
  value: string;
  product_variations_count?: number;
  products_count?: number;
  max_per_customer?: number;
};

export type PaymentHistory = {
  amount: string;
  channel: string;
  created_at: string;
  currency: string;
  provider: string;
  status: string;
  plan: Iplan;
};

export type TransactionListType = {
  recipient: any;
  id: number;
  transaction_id: number;
  store_id: number;
  customer_id: number;
  channel: string;
  order_id: number;
  amount: string;
  type: string;
  status: string;
  ref: string;
  transId: string;
  method: string;
  transaction_date: string;
  notes: null | string;
  settled: 0;
  amount_settled: string;
  settled_at: null;
  settlement_id: null | string;
  created_at: string;
  updated_at: string;
  currency: string;
  deleted_at: null;
  customer: CustomerType;
  order: OrderType;
  is_customer_charged: boolean | null;
  meta?: {
    narration: string;
    sender_bank: string;
    sender_bank_account_number: string;
    sender_country: string;
    sender_name: string;
  };
};

export type SettlementListType = {
  transaction_date: any;
  id: number;
  total: string;
  status: string;
  created_at: string;
  updated_at: string;
  transactions: TransactionListType[];
  account_name: string;
  account_number: string;
  bank: string;
  settlements: {
    id: number;
    store_id: number;
    transaction_id: number;
    amount: string;
    status: string;
    settlement_batch_id: number;
    account_name: string;
    account_number: string;
    bank: string;
    created_at: string;
    updated_at: string;
  }[];
};
export type homeStatsKeys = {
  month: number;
  week: number;
  today: number;
};
// export type HomeStatsKey = keyof typeof homeStatsType;

export type HomeStatsType = {
  new_customers: homeStatsKeys;
  offline_transactions: homeStatsKeys;
  online_transactions: homeStatsKeys;
  orders: homeStatsKeys;
  product_sold: homeStatsKeys;
  total_owed: homeStatsKeys;
  total_sales: homeStatsKeys;
  website_visit: homeStatsKeys;
};

export type MediaType = {
  succes: string;
  image: {
    name: string;
    path: string;
    thumbnail_path: string;
  };
};
export type domainType =
  | "store"
  | "bank"
  | "account"
  | "firstAction"
  | "orders"
  | "orderShipping"
  | "products";
export type TodosType = {
  action: {
    domain: domainType;
    filter_field?: string;
    filter_value?: string;
  };
  id: string;
  label: string;
  priority: number;
  status: boolean;
};

export type ThemeOptionType = {
  id: number;
  slug: string;
  name: string;
  description: string;
  preview_image: string;
  options: {
    faq: {
      list: { title: string; content: string }[];
      show: boolean;
    };
    font: {
      label: string;
      value: string;
    };
    favicon: string | null;
    about_us: {
      show: boolean;
      title: null | string;
      content: null | string;
    };
    newsletter: {
      desc: null | string;
      show: boolean;
      title: null | string;
    };
    regulations: {
      list: { desc: string; title: string }[];
      show: boolean;
    };
    theme_color: string;
    social_links: {
      show: boolean;
      links: { name: string; handle: string }[];
    };
    store_banner: null | string;
    terms_of_use: {
      show: boolean;
      content: null | string;
    };
    testimonials: {
      show: boolean;
      comments: {
        comment: string;
        image: string;
        name: string;
      }[];
    };
    homepage_hero: {
      list: {
        desc: string;
        media: string;
        media_type: string;
        title: string;
        video_type: string;
      }[];
      show: boolean;
    };
    return_policy: {
      show: boolean;
      content: null | string;
    };
    brands_section: {
      show: boolean;
      brands: { logo: string; name: string }[];
    };
    countdown_section: {
      show: boolean;
      title: null | string;
      link_to: {
        tag: null | string;
        product_id: null | string;
        product_name: null | string;
        product_slug: null | string;
      };
      bg_image: null | string;
      end_date: null | string;
      sub_title: null | string;
    };
    instagram_preview: {
      show: boolean;
    };
    products_highlight: {
      randomise: false;
      categorise: false;
      featured_products: any[];
    };
    featured_collections: CollectionType[];
  };
};

export type ThemeType = {
  active: boolean;
  description: string;
  id: number;
  name: string;
  options: ThemeOptionType;
  preview_image: string;
  slug: string;
  price: string;
  secondary_image: string;
};
export interface InventorySettingsChild {
  id: number;
  parent_id: number | null;
  section_id: number;
  name: string;
  description: string;
  code: string;
  type: string;
  default_value: string;
  extra_info: string | null;
  created_at: string;
  updated_at: string;
  value: string | null;
  options: any[];
}

export interface InventorySettingsSection {
  section: string;
  id: number;
  parent_id: number | null;
  section_id: number;
  name: string;
  description: string;
  code: string;
  type: string;
  default_value: string;
  extra_info: string | null;
  created_at: string;
  updated_at: string;
  value: string | null;
  children: InventorySettingsChild[];
  options: any[];
}

export interface InventorySettingsType {
  [key: string]: InventorySettingsSection[];
}

export interface IShippingSettings {
  use_delivery_timeline?: boolean;
  delivery_days?: {
    day: string;
    times: { startTime: string; endTime: string; id: string }[];
  }[];
  same_day_delivery?: boolean;
  processing_days?: string;
  reminder_days?: number | string;
  checkout_note?: string | null;
  automated_shipping?: boolean;
  automated_shipping_location_type?: string;
  automated_shipping_locations?: any[];
  default_weight_kg: number | string;
  shipping_mode?: string;
}

export interface IShipBubbleSetting {
  couriers: any[];
  default_box_size: string;
  custom_box_size: {
    height: string;
    width: string;
    weight: string;
    length: string;
    name?: string;
  };
  shipping_categories: any[];
}

export type PickupLocationType = {
  country_id: any;
  id: number;
  is_dispatch: 1 | 0;
  locationable_id: number;
  location_id: number;
  phone: string;
  city_id: string;
  state_id: string;
  address: string;
  landmark: string;
  opening_hour: string;
  closing_hour: string;
  location: {
    id: number;
    name: string;
    country: string;
    state: string;
    city: string;
  };
};

export type CourierType = {
  courier_id: string;
  courier_name: string;
  courier_image: string;
  service_code: string;
  insurance: {
    code: string;
    fee: number;
  };
  discount: {
    percentage: number;
    symbol: string;
    discounted: number;
  };
  service_type: string;
  waybill: boolean;
  dropoff_station: any;
  pickup_station: any;
  delivery_eta: string;
  currency: string;
  vat: number;
  total: number;
};
export type ReferralAnalyticsType = {
  total_referrals: number;
  total_earned: number;
  pending_payment: number;
  earned_referrals: number;
  pending_referrals: number;
};

export type PaymentMethodsResponse = {
  success: boolean;
  data: {
    online: {
      paystack: {
        display_name: string;
        display: boolean;
        enabled: boolean;
        charge_customer: boolean;
      };
    };
    offline: {
      terminal: {
        display_name: string;
        display: boolean;
        enabled: boolean;
        charge_customer: boolean;
      };
      bank_transfer: {
        display_name: string;
        display: boolean;
        enabled: boolean;
        charge_customer: boolean;
      };
    };
  };
};
