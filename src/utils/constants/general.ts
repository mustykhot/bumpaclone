import { FeatureType } from "Models";
import { createClient } from "contentful";
import animationData from "assets/images/confetti.json";
import { OrderItemType } from "Models/order";

export const alt_image_url =
  "https://salescabal.s3.eu-west-3.amazonaws.com/default.png";
export const IMG_BASE_URL = "https://salescabal.s3.eu-west-3.amazonaws.com";

export const API_URL = "https://jp.bumpa.xyz/api/";

// export const API_URL = import.meta.env.VITE_REACT_APP_BUMBA_WEB_BASE_URL;
export const REDIRECT_URL = import.meta.env.VITE_REACT_APP_BUMPA_REDIRECT_URL;

export const CURRENCIES: Record<string, string> = {
  USD: "$",
  NGN: "₦",
  EUR: "",
};
export const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const TRANSACTION_MODES = [
  { label: "Bank Transfer", value: "BANK" },
  { label: "Cash", value: "CASH" },
  { label: "Pos", value: "POS" },
];

export const SHIPPINGSTATUS = [
  { label: "Delivered", value: "DELIVERED" },
  { label: "Unfulfiled", value: "UNFULFILLED" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Returned", value: "RETURNED" },
];
export const ORDERSTATUS = [
  { label: "Completed", value: "COMPLETED" },
  { label: "Open", value: "OPEN" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Processing", value: "PROCESSING" },
];

export const SALESCHANNEL = [
  {
    value: "walk-in",
    key: "Physical Sale",
  },
  {
    value: "instagram",
    key: "Instagram",
  },
  {
    value: "whatsapp",
    key: "Whatsapp",
  },
  {
    value: "facebook",
    key: "Facebook",
  },
  {
    value: "flutterwave",
    key: "Flutterwave",
  },

  {
    value: "jiji",
    key: "Jiji",
  },
  {
    value: "jumia",
    key: "Jumia",
  },
  {
    value: "konga",
    key: "Konga",
  },
  {
    value: "paystack",
    key: "Paystack",
  },
  {
    value: "snapchat",
    key: "Snapchat",
  },
  {
    value: "twitter",
    key: "Twitter",
  },

  {
    value: "others",
    key: "Others",
  },
];

export const SALESCHANNELFILTER = [
  {
    value: "walk-in",
    key: "Physical Sale",
  },
  {
    value: "pos",
    key: "POS",
  },
  {
    value: "website",
    key: "Website",
  },
  {
    value: "instagram",
    key: "Instagram",
  },
  {
    value: "whatsapp",
    key: "Whatsapp",
  },
  {
    value: "facebook",
    key: "Facebook",
  },
  {
    value: "flutterwave",
    key: "Flutterwave",
  },

  {
    value: "jiji",
    key: "Jiji",
  },
  {
    value: "jumia",
    key: "Jumia",
  },
  {
    value: "konga",
    key: "Konga",
  },
  {
    value: "paystack",
    key: "Paystack",
  },
  {
    value: "snapchat",
    key: "Snapchat",
  },
  {
    value: "twitter",
    key: "X/Twitter",
  },

  {
    value: "others",
    key: "Others",
  },
];

export const FEATURESLIST: FeatureType[] = [
  {
    title: "Selling Online",
    features: [
      "Website Customisation",
      "Custom Domain Name",
      "SSL Certificate",
      "Business logo on website link (Favicon)",
    ],
    starter: ["mark", "Can be purchased separately.", "mark", "cancel"],
    pro: ["mark", "Free com.ng domain on 1 year plan.", "mark", "mark"],
    growth: [
      "mark",
      "Free .com.ng domain (renewal not inclusive)",
      "mark",
      "mark",
    ],
  },
  {
    title: "Inventory Management",
    features: [
      "Add & manage  products",
      "Bulk Product Edit",
      "Product Variations",
      "Products & Orders Export",
      "Barcode scanner software",
    ],
    starter: ["mark", "cancel", "mark", "cancel", "cancel"],
    pro: ["mark", "mark", "mark", "cancel", "cancel"],
    growth: ["mark", "mark", "mark", "mark", "mark"],
  },
  {
    title: "Sales Management",
    features: [
      "Bulk Order Edit",
      "Sales Records",
      "Invoices & Receipts",
      "Discounts & Coupons",
      "Limit Coupon Use Per customer",
      "In-store checkout software (Point of Sale)",
    ],
    starter: [
      "cancel",
      "Unlimited sales records",
      "1,000 Invoices/Receipts monthly",
      "Unlimited discounts & coupons",
      "cancel",
      "cancel",
    ],
    pro: [
      "mark",
      "Unlimited sales records",
      "2,000 Invoices/Receipts monthly",
      "Unlimited discounts & coupons",
      "mark",
      "cancel",
    ],
    growth: [
      "mark",
      "Unlimited sales records",
      "5,000 Invoices/Receipts monthly",
      "Unlimited discounts & coupons",
      "mark",
      "mark",
    ],
  },
  {
    title: "Payments",
    features: [
      "Online Payment Gateway",
      "Bumpa Wallet",
      "Bumpa Terminal",
      "Currencies Supported",
    ],
    starter: ["mark", "mark", "Available on request", "Naira"],
    pro: [
      "mark",
      "mark",
      "mark",
      "Naira + US payments (only naira settlements)",
    ],
    growth: [
      "mark",
      "mark",
      "mark",
      "Naira + US Dollar (payment and settlement)",
    ],
  },
  {
    title: "Customer Relationship Management",
    features: ["Bulk SMS/Emails", "Customer Records", "Customer Groups"],
    starter: [
      "100 messaging credits monthly",
      "Unlimited customer records monthly",
      "5 customer groups",
    ],
    pro: [
      "200 messaging credits monthly",
      "Unlimited customer records monthly",
      "20 customer groups",
    ],
    growth: [
      "1,000 messaging credits monthly",
      "Unlimited customer records monthly",
      "100 customer groups",
    ],
  },
  {
    title: "Business Operations",
    features: [
      "Staff Account",
      "Business Analytics",
      "Expense Records",
      "Multiple locations management",
    ],
    starter: ["cancel", "Limited Analytics", "mark", "cancel"],
    pro: ["3 staff accounts", "Comprehensive Analytics", "mark", "cancel"],
    growth: [
      "5 staff accounts *Additional charge for extra staff*",
      "Comprehensive Analytics",
      "mark",
      "2 locations *Additional charge for extra locations*",
    ],
  },
  {
    title: "Supported Tools",
    features: [
      "Facebook Pixel",
      "Instagram DM Connection",
      "Google Analytics",
      "Woo Commerce",
      "Shipping Integration",
    ],
    starter: [
      "mark",
      "cancel",
      "cancel",
      "cancel",
      "ShipBubble, Fez Delivery (one year plan)",
    ],
    pro: [
      "mark",
      "mark",
      "mark",
      "cancel",
      "ShipBubble, Fez (more coming soon)",
    ],
    growth: [
      "mark",
      "mark",
      "mark",
      "Can integrate Woo Commerce at a fee",
      "ShipBubble, Fez (more coming soon)",
    ],
  },
  {
    title: "Technical Support",
    features: ["Assisted Migration from other tools", "Customer Support"],
    starter: ["cancel", "Priority Support"],
    pro: ["cancel", "Priority Support"],
    growth: ["mark", "Account Manager + Dedicated WhatsApp Helpline."],
  },
];

export const MobileList = [
  {
    category: "Selling Online",
    feature: "Website Customization",
    starter: ["mark"],
    pro: ["mark"],
    growth: ["mark"],
  },

  {
    feature: "Custom domain name",
    starter: ["Can be purchased seperately"],
    pro: ["Free com.ng domain on 1 year plan"],
    growth: ["Free com.ng domain"],
  },
  {
    feature: "SSL Certificate",
    starter: ["mark"],
    pro: ["mark"],
    growth: ["mark"],
  },
  {
    feature: "Business logo on website link (Favicon)",
    starter: ["cancel"],
    pro: ["mark"],
    growth: ["mark"],
  },
  {
    category: "Inventory Management",
    feature: "Add & Manage Products",
    starter: ["mark"],
    pro: ["mark"],
    growth: ["mark"],
  },
  {
    feature: "Bulk Product Edit",
    starter: ["cancel"],
    pro: ["mark"],
    growth: ["mark"],
  },
  {
    feature: "Product Variations",
    starter: ["mark"],
    pro: ["mark"],
    growth: ["mark"],
  },
  {
    feature: "Products & Orders Export",
    starter: ["cancel"],
    pro: ["cancel"],
    growth: ["mark"],
  },
  {
    feature: "Barcode scanner software",
    starter: ["cancel"],
    pro: ["cancel"],
    growth: ["mark"],
  },
  {
    category: "Sales Management",
    feature: "Sales Records",
    starter: ["Unlimited Sales Records"],
    pro: ["Unlimited Sales Records"],
    growth: ["Unlimited Sales Records"],
  },
  {
    feature: "Bulk Order Edit",
    starter: ["cancel"],
    pro: ["mark"],
    growth: ["mark"],
  },
  {
    feature: "Business Invoice & Receipts",
    starter: ["1,000 Invoices/Receipts monthly"],
    pro: ["2,000 Invoices/Receipts monthly"],
    growth: ["5,000 Invoices/Receipts monthly"],
  },
  {
    feature: "Discounts & Coupons",
    starter: ["Unlimited discounts & coupons"],
    pro: ["Unlimited discounts & coupons"],
    growth: ["Unlimited discounts & coupons"],
  },
  {
    feature: "Limit Coupon Use Per Customer",
    starter: ["cancel"],
    pro: ["cancel"],
    growth: ["mark"],
  },
  {
    feature: "In-store checkout software (Point of Sale)",
    starter: ["cancel"],
    pro: ["cancel"],
    growth: ["mark"],
  },
  {
    category: "Payments",
    feature: "Online Payment Gateway",
    starter: ["mark"],
    pro: ["mark"],
    growth: ["mark"],
  },
  {
    feature: "Bumpa Wallet",
    starter: ["mark"],
    pro: ["mark"],
    growth: ["mark"],
  },
  {
    feature: "Bumpa Terminal",
    starter: ["cancel"],
    pro: ["mark"],
    growth: ["mark"],
  },
  {
    feature: "Currencies Supported",
    starter: ["Naira"],
    pro: ["Naira + US payments (only naira settlements)"],
    growth: ["Naira + US Dollar (payment and settlement)"],
  },
  {
    category: "Customer Relationship Management",
    feature: "Bulk SMS/Emails",
    starter: ["100 Messaging Credits onthly"],
    pro: ["200 Messaging Credits monthly"],
    growth: ["1,000 Messaging Credits monthly"],
  },
  {
    feature: "Customer Records",
    starter: ["Unlimited Customer Records"],
    pro: ["Unlimited Customer Records"],
    growth: ["Unlimited Customer Records"],
  },
  {
    feature: "Customer Groups",
    starter: ["5 5ustomer Groups"],
    pro: ["20 Customer Groups"],
    growth: ["100 Customer Groups"],
  },

  {
    category: "Business Operations",
    feature: "Staff Account",
    starter: ["cancel"],
    pro: ["3 Staff Account"],
    growth: ["5 Staff Account"],
  },
  {
    feature: "Business Analytics",
    starter: ["Limited Analytics"],
    pro: ["Comprehensive Analytics"],
    growth: ["Comprehensive Analytics"],
  },
  {
    feature: "Expense Records",
    starter: ["mark"],
    pro: ["mark"],
    growth: ["mark"],
  },
  {
    feature: "Transaction Reconciliation",
    starter: ["cancel"],
    pro: ["cancel"],
    growth: ["mark"],
  },
  {
    feature: "Multiple Locations Management",
    starter: ["cancel"],
    pro: ["cancel"],
    growth: ["2 Locations"],
  },
  {
    category: "Supported Tools",
    feature: "Facebook Pixel",
    starter: ["mark"],
    pro: ["mark"],
    growth: ["mark"],
  },
  {
    feature: "Google Analytics",
    starter: ["cancel"],
    pro: ["mark"],
    growth: ["mark"],
  },
  {
    feature: "Woo Commerce",
    starter: ["cancel"],
    pro: ["cancel"],
    growth: ["Can integrate Woo Commerce at a fee"],
  },
  {
    feature: "Shipping Integration",
    starter: [["ShipBubble", "Fez Delivery (one year plan)"]],
    pro: [["ShipBubble", "Fez Delivery (more coming soon)"]],
    growth: [["ShipBubble", "Fez Delivery (more coming soon)"]],
  },
  {
    category: "Technical Support",
    feature: "Assisted Migration from other tools",
    starter: ["cancel"],
    pro: ["cancel"],
    growth: ["mark"],
  },
  {
    feature: "Customer Support",
    starter: ["Email/In App Support"],
    pro: ["Priority Support"],
    growth: ["Account Manager + Dedicated WhatsApp Helpline. "],
  },
];
export function hasNullOrEmptyPriceOrStock(array: any[]) {
  for (let item of array) {
    if (
      item.price === undefined ||
      item.price === null ||
      item.price === "" ||
      item.stock === undefined ||
      item.stock === null ||
      item.stock === ""
    ) {
      return true;
    }
  }
  return false;
}
export function hasNullOrEmptyPrice(array: any[]) {
  for (let item of array) {
    if (
      item.price === undefined ||
      item.price === null ||
      item.price === "" ||
      Number(item.price) === 0
    ) {
      return true;
    }
  }
  return false;
}
export const getObjWithValidValues = (obj: any) => {
  const validKeyValues: any = {};
  for (const key in obj) {
    const value = obj[key];
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "undefined" &&
      value !== "null"
    ) {
      validKeyValues[key] = value;
    }
  }
  return validKeyValues;
};

export const getObjWithValidValuesAndList = (obj: any) => {
  const validKeyValues: any = {};
  for (const key in obj) {
    const value = obj[key];
    if (
      value !== undefined &&
      value !== null &&
      value?.length !== 0 &&
      value !== "" &&
      value !== "null"
    ) {
      validKeyValues[key] = value;
    }
  }
  return validKeyValues;
};

export const OPACITYVARIANT = {
  init: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

// Last year's starting and ending dates
export const lastYearStart = new Date(new Date().getFullYear() - 1, 0, 1);
export const lastYearEnd = new Date(new Date().getFullYear() - 1, 11, 31);

// This year's starting and ending dates
export const thisYearStart = new Date(new Date().getFullYear(), 0, 1);
export const thisYearEnd = new Date(new Date().getFullYear(), 11, 31);

// Last week's starting and ending dates
export const lastWeekStart = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate() - new Date().getDay() - 7
);
export const lastWeekEnd = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate() - new Date().getDay() - 1
);

// Calculate the start and end dates of the week
export const thisWeekStart = new Date(
  new Date().setDate(new Date().getDate() - new Date().getDay())
);
export const thisWeekEnd = new Date(
  new Date().setDate(new Date().getDate() - new Date().getDay() + 6)
);

// This month's starting and ending dates
export const thisMonthStart = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  1
);
export const thisMonthEnd = new Date(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  0
);

// Last month's starting and ending dates
export const lastMonthStart = new Date(
  new Date().getFullYear(),
  new Date().getMonth() - 1,
  1
);
export const lastMonthEnd = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  0
);

// Last quarter's starting and ending dates
export const lastQuarterStart = new Date(
  new Date().getFullYear(),
  new Date().getMonth() - 3 - (new Date().getMonth() % 3),
  1
);
export const lastQuarterEnd = new Date(
  lastQuarterStart.getFullYear(),
  lastQuarterStart.getMonth() + 3,
  0
);

// This quarter's starting and ending dates
export const thisQuarterStart = new Date(
  new Date().getFullYear(),
  new Date().getMonth() - (new Date().getMonth() % 3),
  1
);

export const thisQuarterEnd = new Date(
  thisQuarterStart.getFullYear(),
  thisQuarterStart.getMonth() + 3,
  0
);

export function getDaysBetweenDates(date1: any, date2: any) {
  // Convert the dates to timestamps
  const timestamp1 = new Date(date1).getTime();
  const timestamp2 = new Date(date2).getTime();

  // Calculate the difference in milliseconds
  const difference = Math.abs(timestamp2 - timestamp1);

  // Convert milliseconds to days
  const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

  return days;
}

export const client = createClient({
  space: "3c192pdrgjge",
  accessToken: "kP_joekPayuUA_d41n9Iq7a0toqHyhCTdwOVKrD6cTk",
});

export const IMAGEURL = "https://salescabal.s3.eu-west-3.amazonaws.com";

export const convertAddress = (address: any) => {
  if (address) {
    const addressParts = [
      address?.street,
      address?.city,
      address?.state,
      address?.country,
    ];

    return addressParts.filter((part) => part).join(", ");
  } else {
    return "";
  }
};

export const convertAddressToCopy = (address: any) => {
  if (address) {
    const addressParts = [
      address?.street,
      address?.city,
      address?.state,
      address?.country,
      address?.zip,
    ];

    return addressParts.filter((part) => part).join(", ");
  } else {
    return "";
  }
};

export const convertLocationAddress = (address: any) => {
  if (address) {
    const addressParts = [
      address?.address || address?.street,
      address?.city,
      address?.state,
      address?.country,
    ];

    return addressParts.filter((part) => part).join(", ");
  } else {
    return "";
  }
};

export const META_INTEGRATION_SCOPES_REQUIRED = [
  "instagram_basic",
  "instagram_manage_messages",
  "pages_manage_metadata",
  "public_profile",
];

export const META_INTEGRATION_SCOPES = [
  "pages_show_list",
  "instagram_basic",
  "instagram_manage_messages",
  "pages_manage_metadata",
  "pages_read_engagement",
  "public_profile",
];
export const PAYSTACKREDIRECTURL = "https://www.google.com/`,";
export const generateRandomCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
};

export const getFbeV2Url = (store: {
  name: string;
  url_link: string;
  id: string;
}) => {
  const FB_APP_ID = 2202083849941964;
  const FB_REDIRECT_URI = `${REDIRECT_URL}dashboard/apps`;
  const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const businessId = store?.name
    .split(" ")
    .join("-")
    .concat("-bumpa-shop")
    .toLowerCase();
  const FBE_V2_URL_EXTRAS = {
    setup: {
      external_business_id: businessId,
      timezone: TIMEZONE,
      currency: "NGN",
      business_vertical: "ECOMMERCE",
    },
    business_config: {
      business: {
        name: store.name,
      },
      messenger_chat: {
        enabled: true,
        domains: [store?.url_link],
      },
      page_cta: {
        enabled: true,
        cta_button_text: "Shop Now",
        cta_button_url: store?.url_link,
        below_button_text: "Powered by Bumpa",
      },
      messenger_menu: {
        enabled: true,
        cta_button_text: "Shop Now",
        cta_button_url: store?.url_link,
      },
      ig_cta: {
        enabled: true,
        cta_button_text: "Shop Now",
        cta_button_url: store?.url_link,
      },
    },
    repeat: false,
  };
  const redirectUri = encodeURIComponent(FB_REDIRECT_URI);
  const extras = encodeURIComponent(JSON.stringify(FBE_V2_URL_EXTRAS));
  const FBE_V2_URL = `https://facebook.com/dialog/oauth?client_id=${FB_APP_ID}&display=page&redirect_uri=${redirectUri}&state=${
    store.id
  }&response_type=token&scope=${META_INTEGRATION_SCOPES.join(",")}`;
  return FBE_V2_URL;
};

export const currencySymbols: { [key: string]: string } = {
  AED: "د.إ",
  AFN: "؋",
  ALL: "L",
  AMD: "֏",
  ANG: "ƒ",
  AOA: "Kz",
  ARS: "$",
  AUD: "$",
  AWG: "ƒ",
  AZN: "₼",
  BAM: "KM",
  BBD: "$",
  BDT: "৳",
  BGN: "лв",
  BHD: ".د.ب",
  BIF: "FBu",
  BMD: "$",
  BND: "$",
  BOB: "Bs.",
  BRL: "R$",
  BSD: "$",
  BTN: "Nu.",
  BWP: "P",
  BYN: "Br",
  BZD: "$",
  CAD: "$",
  CDF: "FC",
  CHF: "CHF",
  CLP: "$",
  CNY: "¥",
  COP: "$",
  CRC: "₡",
  CUP: "$",
  CVE: "$",
  CZK: "Kč",
  DJF: "Fdj",
  DKK: "kr",
  DOP: "$",
  DZD: "د.ج",
  EGP: "£",
  ERN: "Nfk",
  ETB: "Br",
  EUR: "€",
  FJD: "$",
  FKP: "£",
  FOK: "kr",
  GBP: "£",
  GEL: "₾",
  GGP: "£",
  GHS: "₵",
  GIP: "£",
  GMD: "D",
  GNF: "FG",
  GTQ: "Q",
  GYD: "$",
  HKD: "$",
  HNL: "L",
  HRK: "kn",
  HTG: "G",
  HUF: "Ft",
  IDR: "Rp",
  ILS: "₪",
  IMP: "£",
  INR: "₹",
  IQD: "ع.د",
  IRR: "﷼",
  ISK: "kr",
  JEP: "£",
  JMD: "$",
  JOD: "د.ا",
  JPY: "¥",
  KES: "Sh",
  KGS: "с",
  KHR: "៛",
  KID: "$",
  KMF: "CF",
  KRW: "₩",
  KWD: "د.ك",
  KYD: "$",
  KZT: "₸",
  LAK: "₭",
  LBP: "ل.ل",
  LKR: "Rs",
  LRD: "$",
  LSL: "L",
  LYD: "ل.د",
  MAD: "د.م.",
  MDL: "L",
  MGA: "Ar",
  MKD: "ден",
  MMK: "K",
  MNT: "₮",
  MOP: "P",
  MRU: "UM",
  MUR: "₨",
  MVR: "Rf",
  MWK: "MK",
  MXN: "$",
  MYR: "RM",
  MZN: "MT",
  NAD: "$",
  NGN: "₦",
  NIO: "C$",
  NOK: "kr",
  NPR: "₨",
  NZD: "$",
  OMR: "ر.ع.",
  PAB: "B/.",
  PEN: "S/",
  PGK: "K",
  PHP: "₱",
  PKR: "₨",
  PLN: "zł",
  PYG: "₲",
  QAR: "ر.ق",
  RON: "lei",
  RSD: "дин",
  RUB: "₽",
  RWF: "FRw",
  SAR: "ر.س",
  SBD: "$",
  SCR: "₨",
  SDG: "ج.س.",
  SEK: "kr",
  SGD: "$",
  SHP: "£",
  SLE: "Le",
  SLL: "Le",
  SOS: "Sh",
  SRD: "$",
  SSP: "£",
  STN: "Db",
  SYP: "£",
  SZL: "L",
  THB: "฿",
  TJS: "ЅМ",
  TMT: "m",
  TND: "د.ت",
  TOP: "T$",
  TRY: "₺",
  TTD: "$",
  TVD: "$",
  TWD: "$",
  TZS: "Sh",
  UAH: "₴",
  UGX: "Sh",
  USD: "$",
  UYU: "$U",
  UZS: "сўм",
  VES: "Bs.S",
  VND: "₫",
  VUV: "VT",
  WST: "T",
  XAF: "FCFA",
  XCD: "$",
  XOF: "CFA",
  XPF: "₣",
  YER: "﷼",
  ZAR: "R",
  ZMW: "ZK",
  ZWL: "$",
};

export function rearrangeProducts(products: OrderItemType[]) {
  function hasUnavailableQuantity(product: OrderItemType) {
    return product.unavailable_quantity
      ? product.unavailable_quantity > 0
      : false;
  }
  const unavailableProducts = products.filter(hasUnavailableQuantity);
  const availableProducts = products.filter(
    (product) => !hasUnavailableQuantity(product)
  );
  return [...unavailableProducts, ...availableProducts];
}

export const PAGEUPDATEVERSIONS = {
  INVENTORYSETTING: 1,
  ORDERSPAGE: 2,
  CUSTOMERPAGE: 1,
  GENERALUPDATE: 4,
  STAFF_WARNING_BANNER: 1,
  LOCATION_WARNING_BANNER: 1,
  STAFFPAGE: 1,
  LOCATIONPAGE: 1,
  SIDEBARUPDATE: 1,
  CAMPAINGPAGE: 1,
};

export const FONT_FAMILY_OPTIONS = [
  {
    label: "Aleo",
    value: `"Aleo", serif`,
  },
  {
    label: "Cormorant Infant",
    value: `"Cormorant Infant", serif`,
  },
  {
    label: "Crimson Text",
    value: `"Crimson Text", serif`,
  },
  {
    label: "Inter",
    value: `"Inter", sans-serif`,
  },
  {
    label: "Josefin Sans",
    value: `"Josefin Sans", sans-serif`,
  },
  {
    label: "Jost",
    value: `"Jost", sans-serif`,
  },
  {
    label: "Kameron",
    value: `"Kameron", serif`,
  },
  {
    label: "Libre Baskerville",
    value: `"Libre Baskerville", serif`,
  },
  {
    label: "Lora",
    value: `"Lora", serif`,
  },
  {
    label: "Mulish",
    value: `"Mulish", sans-serif`,
  },
  {
    label: "Noto Serif",
    value: `"Noto Serif", serif`,
  },
  {
    label: "Open Sans",
    value: `"Open Sans", sans-serif`,
  },
  {
    label: "Oswald",
    value: `"Oswald", sans-serif`,
  },
  {
    label: "Philosopher",
    value: `"Philosopher", sans-serif`,
  },
  {
    label: "Plus Jakarta Sans",
    value: `"Plus Jakarta Sans", sans-serif`,
  },
  {
    label: "Poppins",
    value: `"Poppins", sans-serif`,
  },
  {
    label: "PT Serif",
    value: `"PT Serif", serif`,
  },
  {
    label: "Quicksand",
    value: `"Quicksand", sans-serif`,
  },
  {
    label: "Shippori Mincho",
    value: `"Shippori Mincho", serif`,
  },
  {
    label: "Work Sans",
    value: `"Work Sans", sans-serif`,
  },
];

export const CONFIG_KEYS = {
  favicon: "favicon",
  themeColor: "theme_color",
  font: "font",
  store_banner: "store_banner",
  homepageHero: "homepage_hero",
  featuredCollections: "featured_collections",
  brandsSection: "brands_section",
  productsHighlight: "products_highlight",
  countdownSection: "countdown_section",
  socialLinks: "social_links",
  instagramPreview: "instagram_preview",
  newsletter: "newsletter",
  testimonials: "testimonials",
  regulations: "regulations",
  aboutUs: "about_us",
  returnPolicy: "return_policy",
  termsOfUse: "terms_of_use",
  faq: "faq",
  sizeGuard: "size_guard",
};

export const IMAGE_TYPES = "image/png, image/jpeg";

export const VIDEO_TYPES = "video/mp4, video/webm, video/ogg";

export const THEMECATEGORY = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Fashion",
    value: "fashion",
  },
  {
    label: "Electronics",
    value: "electronics",
  },
  {
    label: "Gadgets",
    value: "gadgets",
  },
];

export function areObjsValuesEqual<T>(
  obj1: Record<string, T>,
  obj2: Record<string, T>
): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if both objects have the same number of keys
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Check if all values are the same (deep comparison)
  for (let key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    // If both values are objects, do a recursive check
    if (
      typeof val1 === "object" &&
      val1 !== null &&
      typeof val2 === "object" &&
      val2 !== null
    ) {
      if (
        !areObjsValuesEqual(
          val1 as Record<string, unknown>,
          val2 as Record<string, unknown>
        )
      ) {
        return false;
      }
    } else if (val1 !== val2) {
      return false;
    }
  }

  return true;
}
