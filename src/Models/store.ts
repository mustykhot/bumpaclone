import { StringOptionsWithImporter } from "sass";

export interface IStoreProfile {
  id: string;
  name: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  date_of_birth?: string;
  app_flags?: any;
  email: string;
  phone: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  telegram: string;
  new_password: string;
  old_password: string;
  pinterest: string;
  snapchat: string;
  twitter: string;
  avatar?: string;
  created_at?: string;
  email_verified_at?: string;
  is_staff?: Number | string;
  bvn_verified_at?: string;
  nin_verified_at?: string;
  desired_kyc_tier?: number;
}

export interface IStore {
  online: boolean;
  phone: string;
  url: string;
  name: string;
  subdomian: string;
  currency: string;
}

export interface IUserStore {
  store: IStore;
}

export interface ICategory {
  id?: string;
  name: string;
  description: string;
  formattedCreatedAt?: string;
}

export interface ICategories {
  categories: ICategory[];
}

export interface IExpense {
  id?: string;
  expense_category_id: number;
  category?: ICategory;
  amount: string;
  notes: string;
  receipt_url?: string | null;
  formattedExpenseDate: string;
  attachment_receipt?: string | null;
}
export interface IExpenseData {
  data: IExpense[];
  current_page?: number;
  last_page?: number;
}

export interface IExpenses {
  expenses: IExpenseData;
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  phone: string;
}
export interface ITerminal {
  account_name: string;
  account_number: string;
  bank_name: string;
  banner: string;
  created_at: string;
  fee_cap: string | null;
  fee_type: string;
  flat_fee: string;
  id: number;
  percentage_fee: string | null;
  status: string;
  store_id: number;
  terminal_id: string;
  terminal_name: string;
  terminal_type: string;
  terminal_user: string | null;
  updated_at: string;
  whatsapp_number: string[];
}
export type InvoiceType = {
  receipt: {
    download_count?: number;
    max_download?: number;
  };
};
export interface IStoreInformation {
  address_formatted?: string;
  address?: IAddress;
  currency: string;
  logo_url?: string;
  description: string | null;
  currencies?: null;
  phone: string;
  name?: string;
  id?: string;
  url?: string;
  url_link?: string;
  previous_url?: string;
  domain?: string;
  subtitle: string;
  online?: any;
  template?: string;
  message_credits?: string;
  purchased_messaging_credits?: string;
  subdomain?: string;
  terminal?: ITerminal;
  addon_product_count?: number;
  default_no_of_locations?: number;
  default_no_of_staffs?: number;
  cac?: string | null;
  business_name?: string;
  referral_code?: string;
  referral_link?: string;
  has_activated_referral?: number;
  subscription?: {
    subscriptable_id: number;
    plan_id: number;
    amount: string;
    cancelled_at: string;
    channel: string;
    created_at: string;
    ends_at: string;
    grace_period_ends_at: string;
    id: number;
    interval: string;
    is_addon: number;
    plan: Iplan;
    remaining_amount: number;
    no_of_extra_locations: number;
    no_of_locations: number;
    no_of_extra_staffs: number;
    no_of_staffs: number;

    has_activated_trial: boolean;
    available_referral_amount?: number;
  }[];
  settings?: {
    currency: string;
    currency_symbol: string;
    charge_customer?: boolean;
    maintenance_message?: string;
    social?: {
      whatsapp: string;
      snapchat: string;
      telegram: string;
      twitter: string;
      facebook: string;
      instagram: string;
      linkedin: string;
      pinterest: string;
    };
  };
  // meta?: InvoiceType;
  meta?: {
    has_customized?: boolean;
    business_sector?: string;
    onBoard?: {
      bank?: boolean;
      basic_setup?: boolean;
      completed?: boolean;
      completed_store_info?: boolean;
      hasShipping?: boolean;
      payment_method?: boolean;
      created_first_product?: boolean;
      subscribed?: string;
      verify_bvn?: boolean;
      verify_nin?: boolean;
      subscription_intent?: number;
    };
    receipt?: {
      plan_type: string;
      max_download: number;
      download_count: number;
      start_timestamp: string;
    };
  };
}

export interface Iplan {
  amount: string;
  created_at: string;
  currency: string;
  description: string;
  features: string[];
  hierarchy: 1;
  id: 4;
  interval: string;
  is_addon: number;
  is_trial: number;
  name: string;
  plan_code: string;
  slug: string;
  status: string;
  type: string;
}

export interface IBankSettings {
  bank_name: String;
  code: string;
  account_number: string;
  account_name: string;
  slug: string;
}

export interface IBank {
  code: string;
  name: string;
  slug: string;
}

export interface ICurrency {
  id: string;
  name: string;
  code: string;
}
