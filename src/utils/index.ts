import moment from "moment";
import React from "react";
import { IConversationsList } from "Models/messenger";
import { OrderType, RefundType } from "Models/order";
import { IStoreInformation } from "Models/store";
import { ErrorType } from "services/api.types";
import store from "store/store";
import { showToast, useAppSelector } from "../store/store.hooks";
import { currencySymbols, IMAGE_TYPES, VIDEO_TYPES } from "./constants/general";

const PDFJS = (window as any).pdfjsLib;

export const CHIP_COLOR: {
  [x: string]:
    | "error"
    | "default"
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | undefined;
} = {
  OPEN: "default",
  PROCESSING: "warning",
  COMPLETED: "success",
  CANCELLED: "error",
  DISPUTED: "error",
  RELEASE: "success",
};
export function hasMatchingId(array: any[], targetId: string | number) {
  if (array && array.length) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === targetId) {
        return true;
      }
    }
    return false;
  } else {
    return false;
  }
}

export const truncateString = (text: string, count: number) => {
  if (text) {
    if (text.length <= count || count === 0) {
      return text;
    }
    return text.slice(0, count) + "...";
  } else {
    return "";
  }
};

export const handleError = (
  err: unknown,
  message?: string,
  duration?: number
) => {
  let error = err as ErrorType;
  if (error?.status === "FETCH_ERROR") {
    showToast(
      message || "Please check your connection and try again...",
      "error",
      duration || 3000
    );
  } else {
    if (error.error && error.error.data && error.error.data.errors) {
      let errorList: any[] = Object.values(error.error.data.errors);
      showToast(errorList[0][0], "error");
    } else if (error.error && error.error.data && error.error.data.message) {
      showToast(message || error?.error.data.message, "error");
    } else {
      showToast(message || "Something went wrong", "error", duration || 3000);
    }
  }
};

export const findFontOption = (value: string, list?: any[]) => {
  if (list?.length) {
    for (let font of list) {
      if (font.value === value) {
        return font;
      }
    }
    return null;
  }
};

export const generateId = (): string => Math.random().toString(36).substr(2, 9);

export const split = (str: string, separator: string): string[] =>
  str.split(separator);

export const formatNumber = (number: number) => {
  return Number(number)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatPrice = (number: number) => {
  const state = store.getState();

  return `${state.auth.store?.settings?.currency_symbol || ""} ${
    number
      ? Number(number)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : 0
  }`;
};

export const formatPriceNoCurrency = (number: number) => {
  return `₦${
    number
      ? Number(number)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : 0
  }`;
};

export const formatTransactionPrice = (number: number, code?: string) => {
  if (code && number !== null && number !== undefined) {
    return `${currencySymbols[code] || ""} ${
      number
        ? Number(number)
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : 0
    }`;
  }
};
export const formatPriceNotFixed = (number: number) => {
  const state = store.getState();

  return `${state.auth.store?.settings?.currency_symbol || ""} ${
    number
      ? Number(number)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : 0
  }`;
};

export const formatPricewrapp = (number: number) => {
  return `${
    number
      ? Number(number)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : 0
  }`;
};

export const getCurrencyFnc = () => {
  const state = store.getState();
  return `${state.auth.store?.settings?.currency_symbol || "₦"} `;
};

// trap spaces in strings
export const trapSpacesForRequiredFields = (
  value: string,
  required: boolean | undefined
) => {
  if (required) {
    return !!value.trim();
  }
};

// remove empty children from and object i.e properties with empty strings, array, or null
export const removeEmpty = (obj: { [x: string]: any }) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => {
      if (typeof v === "number") return true;
      else if (typeof v === "object" && Object.keys(v).length > 0) return true;
      else if (typeof v === "string") return v !== "" && v.length > 0 && v;
      else return "";
    })
  );
};

// currency formatter
export const toCurrency = (country = "en-NG", number: number) => {
  const formatter = new Intl.NumberFormat(country, {
    style: "currency",
    currency: country === "en-NG" ? "NGN" : "GBP",
  });

  return formatter.format(number).split(".00")[0];
};

export function getFileSize(bytes: number, si = true, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes ? bytes.toFixed(dp) + " " + units[u] : "N/A";
}

// generate random number btw 2 numbers
export function randomNumber(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function descendingComparator(a: any, b: any, orderBy: any) {
  return String(a[orderBy])?.localeCompare(String(b[orderBy]), undefined, {
    numeric: true,
  });
}

export function getComparator(order: string, orderBy: string) {
  return order === "desc"
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
export function stableSort(array: any[], comparator: any) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export function mergeObjects(A: any, B: any) {
  // Loop through array B
  for (let bObj of B) {
    // for each object in array B, check if it is a subset of any object in array A
    let isSubset = A.some((aObj: any) => {
      // for each object in A check , check the keys in B object, and check if it is a subset
      return Object.keys(bObj).every((key) => {
        if (key === "price" || key === "quantity" || key === "image") {
          return true;
        } else {
          return aObj[key] === bObj[key] && aObj.hasOwnProperty(key);
        }
      });
    });
    if (isSubset) {
      // this is to return array of matching subsets
      let existingArray = A.filter((aObj: any) => {
        return Object.keys(bObj).every((key) => {
          if (key === "price" || key === "quantity" || key === "image") {
            return true;
          } else {
            return aObj[key] === bObj[key] && aObj.hasOwnProperty(key);
          }
        });
      });
      for (let key in bObj) {
        for (let currentObj of existingArray) {
          currentObj[key] = bObj[key];
        }
      }
    }
  }
  return A;
}

export const translateStatus: (status: number) => {
  label: string;
  color:
    | "error"
    | "default"
    | "success"
    | "warning"
    | "info"
    | "primary"
    | "secondary"
    | undefined;
} = (status: number) => {
  switch (status) {
    case 1:
      return {
        color: "info",
        label: "Published",
      };
    case 0:
      return {
        color: undefined,
        label: "Unpublished",
      };

    default:
      return {
        color: "info",
        label: "N/A",
      };
  }
};
export const colorStatus = (status: any) => {
  switch (status) {
    case "error":
      return "#D90429";
    case "default":
      return "#5C636D";
    case "success":
      return "#009444";
    case "warning":
      return "#FFB60A";
    case "info":
      return "#0059DE";
    case "primary":
      return "#009444";
    case "secondary":
      return "#FF9700";
    case "undefined":
      return "#0059DE";

    default:
      return "#0059DE";
      break;
  }
};
export const translateOrderStatus: (
  status: "COMPLETED" | "OPEN" | "CANCELLED" | "PROCESSING"
) => {
  label: string;
  color:
    | "error"
    | "default"
    | "success"
    | "warning"
    | "info"
    | "primary"
    | "secondary"
    | undefined;
} = (status: "COMPLETED" | "OPEN" | "CANCELLED" | "PROCESSING") => {
  switch (status) {
    case "COMPLETED":
      return {
        color: "success",
        label: "Completed",
      };
    case "OPEN":
      return {
        color: "warning",
        label: "Open",
      };
    case "PROCESSING":
      return {
        color: "info",
        label: "Processing",
      };
    case "CANCELLED":
      return {
        color: "error",
        label: "Cancelled",
      };
    default:
      return {
        color: "info",
        label: "N/A",
      };
  }
};

export const translateShippingStatus: (
  status: "COMPLETED" | "OPEN" | "CANCELLED" | "PROCESSING"
) => {
  label: string;
  color:
    | "error"
    | "default"
    | "success"
    | "warning"
    | "info"
    | "primary"
    | "secondary"
    | undefined;
} = (status: "COMPLETED" | "OPEN" | "CANCELLED" | "PROCESSING") => {
  switch (status) {
    case "COMPLETED":
      return {
        color: "success",
        label: "Completed",
      };
    case "OPEN":
      return {
        color: "warning",
        label: "Open",
      };
    case "PROCESSING":
      return {
        color: "info",
        label: "Processing",
      };
    case "CANCELLED":
      return {
        color: "error",
        label: "Cancelled",
      };
    default:
      return {
        color: "info",
        label: "N/A",
      };
  }
};

export const translateAutomaticShippingStatus: (
  status:
    | "DELIVERED"
    | "UNFULFILLED"
    | "SHIPPED"
    | "RETURNED"
    | "BOOKED_PICKUP"
    | "IN_TRANSIT"
) => {
  label: string;
  color:
    | "error"
    | "default"
    | "success"
    | "warning"
    | "info"
    | "primary"
    | "secondary"
    | undefined;
} = (
  status:
    | "DELIVERED"
    | "UNFULFILLED"
    | "SHIPPED"
    | "RETURNED"
    | "BOOKED_PICKUP"
    | "IN_TRANSIT"
) => {
  switch (status) {
    case "DELIVERED":
      return {
        color: "success",
        label: "Delivered",
      };
    case "BOOKED_PICKUP":
      return {
        color: "warning",
        label: "Booked Pick up",
      };
    case "IN_TRANSIT":
      return {
        color: "warning",
        label: "In Transit",
      };
    case "SHIPPED":
      return {
        color: "info",
        label: "Shipped",
      };
    case "RETURNED":
      return {
        color: "error",
        label: "Returned",
      };
    case "UNFULFILLED":
      return {
        color: "default",
        label: "Unfulfilled",
      };
    default:
      return {
        color: "info",
        label: "N/A",
      };
  }
};

export const translateTransactionStatus: (
  status: "Wallet" | "Online" | "Cash" | "Bank" | "Pos" | "Transfer"
) => {
  label: string;
  color:
    | "error"
    | "default"
    | "success"
    | "warning"
    | "info"
    | "primary"
    | "secondary"
    | undefined;
} = (status: "Wallet" | "Online" | "Cash" | "Bank" | "Pos" | "Transfer") => {
  switch (status) {
    case "Wallet":
      return {
        color: "success",
        label: "Wallet",
      };
    case "Online":
      return {
        color: "default",
        label: "Onlline",
      };
    case "Cash":
      return {
        color: "success",
        label: "Cash",
      };
    case "Bank":
      return {
        color: "warning",
        label: "Bank",
      };
    case "Pos":
      return {
        color: "info",
        label: "Pos",
      };
    case "Transfer":
      return {
        color: "info",
        label: "Transfer",
      };
    default:
      return {
        color: "info",
        label: "N/A",
      };
  }
};

export const translateOrderPaymentStatus: (
  status: "PAID" | "UNPAID" | "PENDING" | "PARTIALLY_PAID"
) => {
  label: string;
  color:
    | "error"
    | "default"
    | "success"
    | "warning"
    | "info"
    | "primary"
    | "secondary"
    | undefined;
} = (status: "PAID" | "UNPAID" | "PENDING" | "PARTIALLY_PAID") => {
  switch (status) {
    case "PAID":
      return {
        color: "success",
        label: "Paid",
      };
    case "UNPAID":
      return {
        color: "error",
        label: "Unpaid",
      };
    case "PENDING":
      return {
        color: "info",
        label: "Pending",
      };
    case "PARTIALLY_PAID":
      return {
        color: "warning",
        label: "Partially Paid",
      };
    default:
      return {
        color: "info",
        label: "N/A",
      };
  }
};

export const translateOrderShippmentStatus: (
  status:
    | "DELIVERED"
    | "UNFULFILLED"
    | "SHIPPED"
    | "RETURNED"
    | "BOOKED_PICKUP"
    | "IN_TRANSIT"
) => {
  label: string;
  color:
    | "error"
    | "default"
    | "success"
    | "warning"
    | "info"
    | "primary"
    | "secondary"
    | undefined;
} = (
  status:
    | "DELIVERED"
    | "UNFULFILLED"
    | "SHIPPED"
    | "RETURNED"
    | "BOOKED_PICKUP"
    | "IN_TRANSIT"
) => {
  switch (status) {
    case "DELIVERED":
      return {
        color: "success",
        label: "Delivered",
      };
    case "UNFULFILLED":
      return {
        color: "warning",
        label: "Unfulfilled",
      };
    case "SHIPPED":
      return {
        color: "info",
        label: "Shipped",
      };
    case "RETURNED":
      return {
        color: "error",
        label: "Returned",
      };
    case "BOOKED_PICKUP":
      return {
        color: "warning",
        label: "Booked Pick up",
      };
    case "IN_TRANSIT":
      return {
        color: "warning",
        label: "In Transit",
      };
    default:
      return {
        color: "warning",
        label: "Unfulfilled",
      };
    // default:
    //   return {
    //     color: "info",
    //     label: "N/A",
    //   };
  }
};

export const zoomPercent = (value: any) => {
  return `${Math.round(Number(value) * 10)}`;
};

export const translateDiscountStatus: (status: number) => {
  label: string;
  color:
    | "error"
    | "default"
    | "success"
    | "warning"
    | "info"
    | "primary"
    | "secondary"
    | undefined;
} = (status: number) => {
  switch (status) {
    case 1:
      return {
        color: "success",
        label: "Active",
      };
    case 0:
      return {
        color: "error",
        label: "Inactive",
      };

    default:
      return {
        color: "info",
        label: "N/A",
      };
  }
};

export const translateReferralStatus: (status: "successful" | "pending") => {
  label: string;
  color: "success" | "warning" | "info" | undefined;
} = (status: "successful" | "pending") => {
  switch (status) {
    case "successful":
      return {
        color: "success",
        label: "Successful",
      };
    case "pending":
      return {
        color: "warning",
        label: "Pending",
      };
    default:
      return {
        color: "info",
        label: "N/A",
      };
  }
};

export const extractOrderDetailsFromString = (inputString: string) => {
  const linkRegex = /(https?:\/\/[^\s]+)/;
  const priceRegex = /Total Price: (₦[0-9.]+)/;

  const linkMatch = inputString.match(linkRegex);
  const priceMatch = inputString.match(priceRegex);

  const link = linkMatch ? linkMatch[0] : "";
  const totalPrice = priceMatch ? priceMatch[1] : "";

  return { link, totalPrice };
};

export function extractLinkFromString(str: string) {
  const regex = /(?:<a\s+href='([^']+)'[^>]*>.*?<\/a>)|(https?:\/\/[^\s'>]+)/;
  const match = str?.match(regex);
  if (match) {
    return match[0];
  }

  return null;
}
export const capitalizeText = (text: string) => {
  if (text?.length) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  } else {
    return "";
  }
};

export const createOrderMessage = (orderResponse: any) => {
  const name = `${orderResponse?.data?.customer.first_name} ${orderResponse?.data?.customer.last_name}`;

  let messageString = `Hi ${name},\n\nI have created an order for you:\n\n`;

  orderResponse?.data?.items?.forEach((orderItem: any) => {
    messageString += `${orderItem.name} x ${orderItem.quantity}: ${formatPrice(
      Number(orderItem.price)
    )}\n`;
  });

  if (!!Number(orderResponse?.data?.discount_val)) {
    messageString += `Discount: -${formatPrice(
      Number(orderResponse?.data?.discount)
    )}${
      orderResponse?.data?.discount_type === "percentage"
        ? ` (${orderResponse?.data?.discount_val}%)`
        : ""
    }\n`;
  }

  if (!!orderResponse?.data?.shipping_option) {
    const shippingOption = orderResponse?.data?.shipping_option;
    messageString += `Shipping Fee: ${shippingOption.price_formatted}${
      shippingOption.visible
        ? ` (${shippingOption.name}${
            !!shippingOption.description
              ? ` - ${shippingOption.description}`
              : ""
          })`
        : ""
    }\n`;
  }

  if (orderResponse?.data?.has_tax) {
    messageString += `Tax: ${formatPrice(orderResponse?.data?.tax)}\n`;
  }

  messageString += `\nTotal Price: ${formatPrice(
    Number(orderResponse?.data?.total)
  )}${orderResponse?.data?.payment_status === "PAID" ? " (PAID)" : ""}\n\n`;

  if (orderResponse?.data?.payment_status === "PARTIALLY_PAID") {
    messageString += `You've paid: ${formatPrice(
      Number(orderResponse?.data?.amount_paid)
    )}\n`;
    messageString += `Balance to be paid: ${formatPrice(
      Number(orderResponse?.data?.amount_due)
    )}\n\n`;
  }

  messageString += `${
    orderResponse?.data?.payment_status === "PAID"
      ? "You can view the order here;"
      : `Kindly confirm the order and ${
          orderResponse?.data?.payment_status === "PARTIALLY_PAID"
            ? "complete the"
            : "make"
        } payment here:`
  }\n`;
  messageString += orderResponse?.data?.order_page;

  return messageString;
};

export function observeNewLines(str: string) {
  return str.replace(/\n/g, "<br>");
}

export function observeNewLinesOrder(text: string) {
  // Regular expression to detect URLs in the text
  const urlRegex = /(?:https?|ftp):\/\/[\w/\-?=%.]+\.[\w/\-?=%.]+/g;

  // Replace URLs with anchor tags in the text
  const urlText = text.replace(
    urlRegex,
    (url) =>
      `<a target="_blank" class="ig-actions-url" href="${url}">${url}</a>`
  );
  const replacedText = urlText.replace(/\n/g, "<br>");

  return replacedText;
}

export const selectedProductsMessages = (selectedProductsObject: any) => {
  let messageString = ``;
  if (selectedProductsObject.length) {
    const selectedProducts = selectedProductsObject;
    selectedProducts.forEach((selectedProduct: any, index: number) => {
      const productName = selectedProduct?.name,
        productPrice = formatPrice(Number(selectedProduct?.price)),
        productLink = selectedProduct?.url;
      messageString += `${
        index !== 0 ? "\n" : ""
      }${productName}\n${productPrice}\n${productLink}\n`;
      // if (index == selectedProductsObject.length - 1) {
      //   messageString += "\n";
      // }
    });

    return messageString;
  }

  return messageString;
};

export const selectedPaymentMessage = (selectedOrder: any) => {
  let messageString = `Kindly use the link below to make payment for your order.\n\n`;

  messageString += `${selectedOrder.order_page}/n/n`;

  return messageString;
};

export function parseString(inputString: string, selectedCurrentStore: any) {
  const productList = inputString.split("\n\n");
  const resultList: any = [];

  productList.forEach((productInfo) => {
    const [productName, productPriceWithCurrency, productLink] =
      productInfo.split("\n");

    const currencySymbol =
      productPriceWithCurrency.match(/[^\d,.]+/)?.[0] || "";
    const productPrice = productPriceWithCurrency
      .replace(currencySymbol, "")
      .trim();

    const productInfoObject = {
      productName: productName.trim(),
      productPrice,
      productLink: productLink.trim(),
      currencySymbol,
    };

    resultList.push(productInfoObject);
  });

  return resultList;
}

export const removeFirstZero = (phone?: string) => {
  if (phone) {
    return phone.slice(1);
  }
};

export function mergeArraysOfVariation(A: any, B: any) {
  let C: any[] = [];
  A.forEach((a: any) => {
    const matchingB = B.find((b: any) => {
      return compareVariants(a.variant, b.variant);
    });

    if (matchingB) {
      C.push({
        variant: matchingB.variant,
        image: matchingB.image,
        cost: matchingB.cost,
        price: matchingB.price,
        stock: matchingB.stock,
        sales: matchingB.sales,
        id: matchingB.id,
      });
    } else {
      C.push({
        variant: a.variant,
        image: a.image,
        cost: a.cost,
        price: a.price,
        stock: a.stock,
        sales: a.sales,
        id: a.id,
      });
    }
  });

  return C;
}

const compareVariants = (variantA: any, variantB: any) => {
  return (
    normalizeVariant(variantA).toLowerCase() ===
    normalizeVariant(variantB).toLowerCase()
  );
};

const normalizeVariant = (variant: any) => {
  return variant.replace(/-/g, "").toLowerCase();
};

export const convertToImage = async (uri: any) => {
  let _PDF_DOC = await PDFJS.getDocument({ url: uri });

  return _PDF_DOC;
};

export async function renderPage(pdf: any) {
  const imagesList = [];
  const canvas = document.createElement("canvas");
  canvas.setAttribute("className", "canv");
  let canv = document.querySelector(".canv");

  for (let i = 1; i <= pdf.numPages; i++) {
    var page = await pdf.getPage(i);
    var viewport = page.getViewport({ scale: 1 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    var render_context = {
      canvasContext: canvas.getContext("2d"),
      viewport: viewport,
    };

    await page.render(render_context).promise;
    let img = canvas.toDataURL("image/png");
    imagesList.push(img);
  }

  return imagesList;
}

export const groupMessageDays = (data: any) => {
  const messageMap = new Map();

  data.forEach((message: any) => {
    const createdTime = new Date(message.created_time);
    const day =
      moment(createdTime).format("LL") === moment(Date.now()).format("LL")
        ? "Today"
        : moment(createdTime).format("LL");

    if (!messageMap.has(day)) {
      messageMap.set(day, []);
    }

    messageMap.get(day).push(message);
  });

  const dateArray = Array.from(messageMap, ([day, messages]) => ({
    day,
    messages,
  }));

  return dateArray;
};

export const base64ToBlob = (base64String: any, mimeType: any) => {
  const byteCharacters = atob(base64String);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
};
export const formatWalletBalance = (num: number) => {
  const formatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(num);
  // Extract the Naira symbol, whole number part, and decimal part
  const [, rest] = formatted.split("₦");
  const [whole, decimal] = rest.split(".");
  return {
    whole,
    decimal,
  };
};
export function hasScriptTags(inputStr: string) {
  // Convert the input string and the target strings to lowercase for case-insensitive comparison
  const inputStrLower = inputStr.toLowerCase();
  const startTag = "<script>";
  const endTag = "</script>";
  if (inputStrLower.includes(startTag) && inputStrLower.includes(endTag)) {
    return true;
  }

  return false;
}

export const calculateTotalAmount = (transactions?: RefundType[]) => {
  if (transactions && transactions.length) {
    let totalAmount = 0.0;
    transactions.forEach((transaction) => {
      totalAmount += parseFloat(transaction.amount);
    });
    return totalAmount;
  } else {
    return 0;
  }
};

export function isValidNumber(value: any) {
  return typeof value === "number" && !isNaN(value);
}
const convertStringsToArray = (mimeTypesString: string): string[] => {
  return mimeTypesString.split(",").map((type) => type.trim());
};
export const isImageOrVideo = (file: File): "image" | "video" | "" => {
  const imageMimeTypes = convertStringsToArray(IMAGE_TYPES);
  const videoMimeTypes = convertStringsToArray(VIDEO_TYPES);

  // Check MIME type
  if (imageMimeTypes.includes(file.type)) {
    return "image";
  } else if (videoMimeTypes.includes(file.type)) {
    return "video";
  }

  return "";
};
export function timeToSeconds(timeObj: {
  days: number;
  hours: number;
  minutes: number;
}) {
  const { days, hours, minutes } = timeObj;

  const daysInSeconds = days * 24 * 60 * 60;
  const hoursInSeconds = hours * 60 * 60;
  const minutesInSeconds = minutes * 60;

  const totalSeconds = daysInSeconds + hoursInSeconds + minutesInSeconds;
  return totalSeconds;
}

export function secondsToTime(seconds: number) {
  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds %= 24 * 60 * 60;

  const hours = Math.floor(seconds / (60 * 60));
  seconds %= 60 * 60;

  const minutes = Math.floor(seconds / 60);
  return { days: `${days}`, hours: `${hours}`, minutes: `${minutes}` };
}

export const validatePhoneNumber = (
  value: string,
  isNigerianNumber: boolean
): string | true => {
  const cleanedValue = value.replace(/\s/g, "");
  const nigerianCode = "+234";
  const minLengthWithoutZero = 10;
  const minLengthWithZero = 11;
  const minLengthNonNigerian = 9;
  const maxLengthNonNigerian = 15;

  let formattedValue = cleanedValue;
  if (
    formattedValue.startsWith("234") &&
    !formattedValue.startsWith(nigerianCode)
  ) {
    formattedValue = nigerianCode + formattedValue.slice(3);
  }

  if (formattedValue.startsWith(nigerianCode)) {
    const numberWithoutCode = formattedValue
      .slice(nigerianCode.length)
      .replace(/\D/g, "");

    if (numberWithoutCode.startsWith("0")) {
      if (numberWithoutCode.length !== minLengthWithZero) {
        return `Phone number must be ${minLengthWithZero} digits long after the country code`;
      }
    } else {
      if (numberWithoutCode.length !== minLengthWithoutZero) {
        return `Phone number must be ${minLengthWithoutZero} digits long after the country code`;
      }
    }
    return true;
  }

  if (
    !isNigerianNumber &&
    cleanedValue.length >= minLengthNonNigerian &&
    cleanedValue.length <= maxLengthNonNigerian
  ) {
    return true;
  }

  if (isNigerianNumber) {
    return "Phone number must start with +234";
  }

  return `Phone number must be between ${minLengthNonNigerian} and ${maxLengthNonNigerian} digits`;
};

export const formatPhoneNumber = (phone: string | undefined): string => {
  if (!phone) return "";

  const formattedPhone = phone.replace(/\s/g, "");
  const nigerianCode = "+234";

  if (
    formattedPhone.startsWith("234") &&
    !formattedPhone.startsWith(nigerianCode)
  ) {
    return nigerianCode + formattedPhone.slice(3);
  }

  if (formattedPhone.startsWith(nigerianCode + "0")) {
    return nigerianCode + formattedPhone.slice(nigerianCode.length + 1);
  }

  return formattedPhone;
};

export function isIdInList(objects: any[], id: string | number) {
  return objects.some((object) => object.id === id);
}

export function areObjectsEqual(obj1: any, obj2: any) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}
export const checkValidShippingAddress = (order: OrderType) => {
  if (
    order?.shipping_details &&
    order?.shipping_details?.city &&
    order?.shipping_details?.country &&
    order?.shipping_details?.first_name &&
    order?.shipping_details?.last_name &&
    order?.shipping_details?.phone &&
    order?.shipping_details?.state &&
    order?.shipping_details?.street
  ) {
    return true;
  } else {
    return false;
  }
};
