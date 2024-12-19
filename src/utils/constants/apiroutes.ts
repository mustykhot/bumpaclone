export const AUTHROUTES = {
  LOGINROUTE: "auth/login",
  FORGOTPASSWORD: "auth/password/email",
  RESETPASSWORD: "auth/reset/password",
  REGISTER: "auth/register",
  VERYFYMAIL: "auth/email/verify",
  VERIFY_STAFF: "auth/staff/verify",
  REQUEST_OTP: "auth/send-otp",
  PREVALIDATE_SIGNUP: "auth/register-user/prevalidate",
  SUGGEST_PLAN: "auth/register-user/suggestplan",
  SETUP_STORE_BASIC: "auth/setup-store/basic_setup",
  SETUP_STORE_BANK: "auth/setup-store/bank",
  SETUP_STORE_PAYMENT_METHOD: "auth/setup-store/payment_method",
  SETUP_STORE_SHIPPING_METHOD: "auth/setup-store/hasShipping",
  SETUP_STORE_ACTIVATE_FREE_TRIAL: "auth/setup-store/completed_free_trial",
};

export const USERROUTES = {
  USERDETAILS: "settings/profile",
  STATSVIEWS: "stats/views",
  STATISTICSALL: "stats/all",
  STATISTICS: "stats",
  STATISTICSHOME: "stats/home",
  ANALYTICS: "analytics",
  ANALYTICSV2: "analytics/v2",
  ANALYTICSSUMMARY: "analytics/summary",
  TRANSACTIONSUMMARY: "transactions/summary",
};

export const PRODUCTROUTES = {
  PRODUCT: "products",
  VARIATIONS: "product_variations",
  UPLOADMEDIA: "media/upload",
  DELETEMEDIA: "media",
  BULKDELETEPRODUCT: "product",
};
export const EXPORTCSVROUTE = {
  EXPORT: "customers/export",
};
export const TOKENROUTES = {
  UPDATEDEVICETOKEN: "setpushtoken",
};

export const SETTINGSROUTES = {
  GET_STORE_PROFILE: "settings/profile",
  DELETE_STORE_PROFILE: "settings/delete-account",
  RESTORE_STORE_PROFILE: "settings/restore-account",
  UPLAOD_PROFILE_AVATAR: "settings/profile/upload-avatar",
  SET_MAINTENANCE_MODE: "settings/maintenance-mode",
  GET_EXPENSES: "expenses",
  CATEGORIES: "categories",
  STORE_INFORMATION: "settings/store",
  STORE_UPLOAD_LOGO: "settings/store/upload-logo",
  BANK: "banks",
  SETTINGS_BANK: "settings/bank",
  STORE_PASSWORD: "settings/password",
  CURRENCIES: "currencies",
};

export const NOTIFICATIONROUTES = {
  GET_NOTIFICATIONS: "notifications",
  MARK_ALL_READ: "notifications/mark-all-read",
  DISMISS_NOTIFICATION: " ",
  MARK_ONE_READ: "notifications",
};

export const SUBSCRIPTIONROUTES = {
  PLANS: "subscription/plan",
  INITITATEPAYMENT: "subscription/initiate/payment",
  RENEW: "subscription/renew",
  DISCOUNT: "subscription/discount/validity",
  PAYMENTHISTORY: "subscription/payment/history",
  UNSUBSCRIBE: "subscription/cancel",
  UPGRADEPLAN: "subscription/upgrade",
};

export const ORDERSROUTES = {
  ORDERS: "orders",
  ACTIONS: "orders/actions",
  PAYMENT: "payment-request",
  REFUND: "refunds",
};

export const LOCATIONROUTES = {
  NEW_LOCATION: "settings/location/history",
  REACTIVATE: "settings/locations/reactivate",
  LOCATION: "locations",
  USERLOCATION: "locations/users/info",
  INVENTORYTRANSFER: "inventory/transfer",
  GETEXTRALOCATIONAMT: "subscription/addon/subscription/prorated-amount",
  MAKEPAYMENT: "subscription/initiate/payment",
};

export const CUSTOMERROUTES = {
  CUSTOMER: "customers",
  SINGLECUSTOMER: "customer",
  CUSTOMERGROUP: "v2/customers/groups",
  SINGLECUSTOMERGROUP: "/customers/groups",
  CREATECUSTOMERGROUP: "customers/groups/addcustomers",
  NEWSLETTERLIST: "newsletter/subscribers",
  INVALIDCUSTOMERS: "customers/invalid-contacts",
};

export const COUNTRIESROUTES = {
  COUNTRIES: "country/all",
  STATES: "country/states",
};

export const TAXROUTES = {
  TAX: "taxes",
};

export const SHIPPINGROUTES = {
  SHIPPING: "shippings",
  DUPLICATESHIPPING: "shippings/duplicate",
  SETTINGS: "settings/shipping",
  SHIPBUBBLE: "settings/shipping/shipbubble/settings",
  CREATEAUTOMATEDSHIPPING: "automated-shipping/shipbubble/create",
};

export const NOTEROUTES = {
  NOTE: "invoicenotes",
};

export const TRANSACTIONROUTES = {
  TRANSACTION: "transactions",
  SETTLEMENT: "settlements",
  SINGLE_SETTLEMENT: "settlements",
};

export const COLLECTIONROUTES = {
  COLLECTION: "tags",
  UPLAOD_COLLECTION_IMAGE: "tags/image/upload",
};

export const INTEGRATIONROUTES = {
  PAYMENT: "integrations/settings/payments",
  PAYMENT_METHODS: "integrations/settings/payment-methods",
  PIXELCODE: "integrations/facebook/pixel",
  DISCONNECTPIXEL: "integrations/facebook/pixel/disconnect",
  METAINTEGRATION: "integrations/fbe",
  METACALLBACK: "callback/fbe",
  DISCONNECTMETA: "integrations/fbe/disconnect",
  INTEGRATION_SCRIPT: "integrations",
  SAVE_SCRIPT: "integrations/script",
  DISCONNECT_SCRIPT: "integrations/script/remove",
};

export const MARKETINGROUTES = {
  CAMPAIGN: "campaign",
  UPLOAD_CAMPAIGN_IMAGE: "/campaign/media",
  PURCHASECREDIT: "campaign/messaging-credits/buy",
  CREDITPLANS: "campaign/messaging-credits/plans",
};

export const DISCOUNTROUTES = {
  DISCOUNT: "v2/discounts",
};

export const PAGINATEDDISCOUNTROUTES = {
  DISCOUNT: "v2/1/discounts",
};

export const DOMAINROUTES = {
  DOMAIN: "domain-integration",
};
export const INVENTORYSETTINGSROUTES = {
  INVENTORYSETTINGS: "inventory/settings",
};

export const COUPONROUTES = {
  COUPON: "v2/coupons",
};

export const PAGINATEDCOUPONROUTES = {
  COUPON: "v2/1/coupons",
};

export const STAFFROUTES = {
  STAFF: "/settings/staff",
  REACTIVATE: "/settings/staff/reactivate",
  RESENDMAIL: "/settings/staff/resend_email",
};

export const APPFLAGROUTES = {
  APPFLAG: "set/appflags",
};

export const CUSTOMISATION_ROUTES = {
  CUSTOMISATION: "/customize",
  THEMES: "/themes",
};

export const WALLET_ROUTES = {
  WALLETDETAILS: "wallets/:provider/details",
  BVNLOOKUP: "wallets/bvn",
  VERIFYBVNOTP: "wallets",
  SETTRANSACTIONPIN: "settings/transaction-pin",
  CHANGEPIN: "settings/transaction-pin",
  SETLIMIT: "wallets/fincra/transaction-limit",
  LISTBANKS: "wallets/fincra/transaction-limit",
  LOOKUPACCOUNTS: "wallets/bank-accounts",
  GET_ACCOUNT_STATEMENT: "wallets/fincra/statements/",
};

export const KYC_ROUTES = {
  LINKBVN: "kyc/linkBVN",
  LINKNIN: "kyc/linkNIN",
  VERIFYCAC: "kyc/verifyCAC",
};

export const REFERRAL_ROUTES = {
  ACTIVATE_REFERRAL: "v2/referrals/activate",
  ANALYTICS: "v2/referrals/analytics",
  STORE_REFERALS: "v2/referrals",
  URL_SHORTERNER: "v2/referrals/shorten-url",
};

export const TERMINAL_ROUTES = {
  GET_CHECKOUT_TERMINALS: "store/checkout-terminal",
  GET_STORE_TERMINALS: "store/terminals",
  CHECK_LINK: "store/terminal/check-link",
  LINK_TERMINAL: "store/terminal/link",
  GET_TERMINAL: "store/terminal/create",
  ADD_NOTIFICATION_NUMBER: "store/terminal/notification-number/add",
  REMOVE_NOTIFICATION_NUMBER: "store/terminal/notification-number/remove",
};
