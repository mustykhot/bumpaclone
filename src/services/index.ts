import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import {
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/dist/query";
import {
  logOut,
  setStoreDetails,
  setUserDetails,
} from "../store/slice/AuthSlice";
import { RootState } from "store/store.types";
import {
  AddNewCustomerPayload,
  CollectionType,
  CountryType,
  CouponType,
  CourierType,
  CreateCouponFormType,
  CreateDiscountFormType,
  CreateProductFeildsPayload,
  CustomerGroupType,
  CustomerType,
  DiscountType,
  DnsHostType,
  EditProductFeildsPayload,
  GetCustomersResponseType,
  HomeStatsType,
  IShipBubbleSetting,
  IShippingSettings,
  InitiateDomainPaymentType,
  InventorySettingsSection,
  InventorySettingsType,
  MediaType,
  MetaIntegration,
  NEWSLETTERTYPE,
  NoteType,
  PaymentHistory,
  PickupLocationType,
  ReferralAnalyticsType,
  PaymentMethodsResponse,
  SearchDomainType,
  SettlementListType,
  ShippingType,
  SingleDomainType,
  TaxType,
  ThemeOptionType,
  ThemeType,
  TodosType,
  TransactionField,
  TransactionListType,
  domainListType,
  domainPaymentListType,
} from "./api.types";
import {
  PRODUCTROUTES,
  USERROUTES,
  SETTINGSROUTES,
  NOTIFICATIONROUTES,
  SUBSCRIPTIONROUTES,
  ORDERSROUTES,
  CUSTOMERROUTES,
  COUNTRIESROUTES,
  TAXROUTES,
  SHIPPINGROUTES,
  TRANSACTIONROUTES,
  COLLECTIONROUTES,
  INTEGRATIONROUTES,
  MARKETINGROUTES,
  DISCOUNTROUTES,
  COUPONROUTES,
  STAFFROUTES,
  APPFLAGROUTES,
  AUTHROUTES,
  CUSTOMISATION_ROUTES,
  TOKENROUTES,
  DOMAINROUTES,
  LOCATIONROUTES,
  WALLET_ROUTES,
  PAGINATEDDISCOUNTROUTES,
  PAGINATEDCOUPONROUTES,
  INVENTORYSETTINGSROUTES,
  NOTEROUTES,
  KYC_ROUTES,
  EXPORTCSVROUTE,
  REFERRAL_ROUTES,
  TERMINAL_ROUTES,
} from "utils/constants/apiroutes";
import {
  IBank,
  IBankSettings,
  ICategory,
  ICurrency,
  IStoreProfile,
} from "Models/store";
import { API_URL } from "utils/constants/general";
import {
  IUserStore,
  ICategories,
  IExpenses,
  IStoreInformation,
} from "Models/store";
import { Base64type } from "components/forms/UploadMultipleProductImage";
import { CustomerGroupSubmitFields } from "pages/Dashboard/Customers/AddCustomerGroup";
import { CreateTaxFeilds } from "pages/Dashboard/Store/StoreTaxes/CreateTax";
import { CreateShippingFeilds } from "pages/Dashboard/Store/ShippingFee/CreateShipping";
import { EditShippingFeilds } from "pages/Dashboard/Store/ShippingFee/ListOfShippings/EditShipping";
import { EditTaxFeilds } from "pages/Dashboard/Store/StoreTaxes/ListTaxes/EditTaxModal";
import { ExpenseFeilds } from "pages/Dashboard/Store/Expenses/CreateExpense";
import {
  LocationResponseType,
  LocationType,
  OrderType,
  LedgerType,
} from "Models/order";
import { CreateCollectionField } from "pages/Dashboard/Products/CreateCollection";
import { ICampaign } from "Models/marketing";
import {
  ICreateStaffPayload,
  IGetStaffAccountsResponse,
  IUpdateStaffPayload,
} from "Models/staff";
import { AppNotificationProps } from "Templates/DashboardLayout/Navbar/Notifications/appnotification";
import { IColor, ILayout } from "Models/customisation";
import { showToast } from "store/store.hooks";
import { TransactionType, UpdateStockType } from "Models";
import { ValidDiscountType } from "pages/Auth/Signup/plan";
import { CreateLocationFields } from "pages/Dashboard/Location/CreateLocation";
import { customerType } from "pages/Dashboard/Discounts/widgets/customers/CustomersList";
import { PosItemsType } from "store/slice/PosSlice";
import { ChangePinFields } from "pages/Dashboard/Wallet/WalletModals/PinModals/ChangePinModal";
import { limitFields } from "pages/Dashboard/Wallet/WalletModals/TransactionModals/ModifyLimitModal";
import { WalletDetailsType, WalletTransactionDetailsType } from "Models/wallet";
import { InvoiceNoteFields } from "pages/Dashboard/Orders/CreateInvoiceNote";
import { CacField } from "pages/Dashboard/KYC/CacModal";
import { PickupField } from "pages/Dashboard/Store/GeneralSettings/components/ShippingSettings/widget/CreatePickupModal";
import {
  UpdateGeneralShippingSettingsField,
  UpdateShipbubbleShippingSettingsField,
} from "pages/Dashboard/Store/GeneralSettings/components/ShippingSettings/settings";
import { CourierFormType } from "pages/Dashboard/Orders/CreateOrder/automatedShippingModal";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, api) => {
    const { auth } = api.getState() as RootState;
    if (auth.token) {
      headers.set("authorization", `Bearer ${auth.token}`);
      headers.set("Access-Control-Allow-Origin", `*`);
      headers.set("Accept", `application/json`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  let err = result?.error as any;
  if (err && err.error && err.error.statusCode === 401) {
    // logout
    showToast("Your session has expired, please log in again.", "error");
    setTimeout(() => {
      api.dispatch(logOut({ redirect: true }));
    }, 1000);
  }

  return result;
};

export const generalApi = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "generalApi",
  tagTypes: [
    "userData",
    "product",
    "notifications",
    "storeProfile",
    "plans",
    "expenses",
    "categories",
    "orders",
    "customer",
    "group",
    "countries",
    "tax",
    "shipping",
    "transaction",
    "collections",
    "store_information",
    "bank_settings",
    "payment_setting",
    "payment_methods",
    "pixel",
    "meta_integration",
    "campaigns",
    "discount",
    "coupon",
    "staff",
    "customisation",
    "instagram",
    "domain",
    "allAnalytics",
    "token",
    "location",
    "wallet",
    "beneficiary-list",
    "unpaid-request",
    "integration_script",
    "inventory_setting",
    "product_setting",
    "notes",
    "pickup",
    "checkout_terminal",
  ],
  endpoints: (builder) => ({
    getLoggedInUser: builder.query<IStoreProfile, void>({
      query: () => ({
        url: USERROUTES.USERDETAILS,
      }),
      async onCacheEntryAdded(id, { dispatch, cacheDataLoaded }) {
        try {
          const { data } = await cacheDataLoaded;
          dispatch(setUserDetails(data));
        } catch (err) {}
      },
      providesTags: ["userData"],
    }),

    verifyMail: builder.query<{}, string>({
      query: (url) => ({
        url: url,
      }),
    }),

    getApikey: builder.query<any, string>({
      query: (url) => ({
        url: url,
      }),
      providesTags: ["token"],
    }),

    generateApiKey: builder.mutation<
      {
        token: string;
        token_type: string;
        expires_at: string;
        token_name: string;
      },
      { token_name: string }
    >({
      query: (body) => ({
        url: `auth/token`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["token"],
    }),

    analytics: builder.query<{}, { from_date?: string; to_date?: string }>({
      query: ({ from_date = "", to_date = "" }) => ({
        url: `${USERROUTES.ANALYTICS}?from_date=${from_date}&to_date=${to_date}`,
      }),
    }),

    allAnalyticsSummary: builder.query<
      { title: string; value: string | number }[],
      { type: string; location_id?: number | string | null }
    >({
      query: ({ type, location_id }) => ({
        url: `${USERROUTES.ANALYTICSV2}/${type}/summary?${
          location_id && location_id !== undefined
            ? `location_id=${location_id}`
            : ""
        }`,
      }),
      providesTags: ["allAnalytics"],
    }),

    transactionSummary: builder.query<any, void>({
      query: () => ({
        url: `${USERROUTES.TRANSACTIONSUMMARY}`,
      }),
      providesTags: ["allAnalytics"],
    }),
    resolveOrder: builder.mutation<
      any,
      {
        id: string;
        body: {
          action: string;
        };
      }
    >({
      query: ({ id, body }) => ({
        url: `${ORDERSROUTES.ORDERS}/${id}/resolve`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["transaction", "orders"],
    }),
    matchOrder: builder.mutation<
      any,
      {
        order_id: string | number;
        transaction_id: string | number;
        customer_id?: string | number;
      }
    >({
      query: (body) => ({
        url: "match-order",
        method: "POST",
        body,
      }),
      invalidatesTags: ["transaction", "orders"],
    }),
    salesAnalytics: builder.query<
      { data: any; range: any },
      {
        type: string;
        from?: string;
        to?: string;
        compare_to?: string;
        compare_from?: string;
        dataset?: string;
        location_id?: number | string | null;
      }
    >({
      query: ({
        type,
        from = "",
        to = "",
        compare_to = "",
        compare_from = "",
        dataset = "",
        location_id = "",
      }) => ({
        url: `${
          USERROUTES.ANALYTICSV2
        }/${type}?from=${from}&to=${to}&compare_to=${compare_to}&compare_from=${compare_from}&dataset=${dataset}${
          location_id && location_id !== undefined
            ? `&location_id=${location_id}`
            : ""
        }`,
      }),
      providesTags: ["allAnalytics"],
    }),

    statsview: builder.query<{}, void>({
      query: () => ({
        url: USERROUTES.STATSVIEWS,
      }),
    }),
    statsall: builder.query<{}, void>({
      query: () => ({
        url: USERROUTES.STATSVIEWS,
      }),
    }),
    statshome: builder.query<{ stats: HomeStatsType }, number | undefined>({
      query: (location_id) => ({
        url: `${USERROUTES.STATISTICSHOME}?${
          location_id && location_id !== undefined
            ? `location_id=${location_id}`
            : ""
        }`,
      }),
    }),

    analyticssummary: builder.query<{}, void>({
      query: () => ({
        url: USERROUTES.ANALYTICSSUMMARY,
      }),
    }),

    postProductImage: builder.mutation<
      { image: { name: string; path: string; thumbnail_path?: string } },
      Base64type
    >({
      query: (body) => ({
        url: PRODUCTROUTES.UPLOADMEDIA,
        method: "POST",
        body,
      }),
    }),
    deleteProductImage: builder.mutation<
      { image: { name: string; path: string } },
      string
    >({
      query: (path) => ({
        url: `${PRODUCTROUTES.UPLOADMEDIA}/${path}`,
        method: "DELETE",
      }),
    }),

    // Start of Store Product Endpoint
    getProduct: builder.query<
      { products?: any; items: any },
      {
        limit?: number;
        page?: number;
        search?: string;
        status?: string;
        collection?: string;
        customer_id?: string;
        barcodes?: string;
        location_id?: number | string | null;
        variations?: boolean | null;
        exclude_collection?: string | null;
        min_stock?: number | null;
        max_stock?: number | null;
      }
    >({
      query: ({
        limit = 10,
        page = 1,
        search = "",
        status = "",
        collection = "",
        customer_id = "",
        barcodes = "",
        location_id = "",
        variations = null,
        min_stock = null,
        max_stock = null,
        exclude_collection = null,
      }) => ({
        url: `v2/${
          PRODUCTROUTES.PRODUCT
        }?search=${search}&customer_id=${customer_id}${
          variations !== null ? `&variations=${variations}` : ""
        }${min_stock !== null ? `&min_stock=${min_stock}` : ""}${
          max_stock !== null ? `&max_stock=${max_stock}` : ""
        }${collection !== null ? `&collection=${collection}` : ""}${
          exclude_collection !== null
            ? `&exclude_collection=${exclude_collection}`
            : ""
        }${
          location_id && location_id !== undefined
            ? `&location_id=${location_id}`
            : ""
        }&limit=${limit}&page=${page} ${
          status ? `&status=${status}` : ""
        } &collection=${collection}&orderBy=desc&orderByField=created_at&barcodes=${barcodes}`,
      }),
      providesTags: ["product"],
    }),

    getProductLedger: builder.query<
      {
        ledger_history?: {
          history?: {
            data: LedgerType[];
            current_page: number;
            last_page: number;
            per_page: number;
          };
          total_removed: number;
          total_returned: number;
          total_sold: number;
          total_added: number;
        };
      },
      {
        limit?: number;
        page?: number;
        search?: string;
        location_id?: number | string | null;
        from_date?: string;
        to_date?: string;
        action?: string;
        id: number | string | undefined;
      }
    >({
      query: ({
        limit = 10,
        page = 1,
        location_id = "",
        from_date,
        to_date,
        id,
        action,
      }) => ({
        url: `${PRODUCTROUTES.PRODUCT}/${id}/histories?${
          location_id && location_id !== undefined
            ? `location_id=${location_id}`
            : ""
        }&limit=${limit}&page=${page}${
          action ? `&action=${action}` : ""
        }&from_date=${from_date}&to_date=${to_date}`,
      }),
      providesTags: ["product"],
    }),
    getSingleProductLedgerSummary: builder.query<
      {
        product_history: {
          product_removed: number;
          product_returned: number;
          total_products: number;
          total_sold: number;
        };
        status: boolean;
      },
      { id: string | undefined; location_id?: number | string | null }
    >({
      query: ({ id, location_id = "" }) => ({
        url: `${PRODUCTROUTES.PRODUCT}/${id}/histories/summary?${
          location_id && location_id !== undefined
            ? `location_id=${location_id}`
            : ""
        }`,
      }),
      providesTags: ["product"],
    }),

    getSingleVariationLedgerSummary: builder.query<
      {
        summary: {
          total_sold: number;
          total_removed: number;
          total_returned: number;
        };
        status: boolean;
      },
      { id: string | undefined; location_id?: number | string | null }
    >({
      query: ({ id, location_id = "" }) => ({
        url: `${PRODUCTROUTES.VARIATIONS}/${id}/histories/summary?${
          location_id && location_id !== undefined
            ? `location_id=${location_id}`
            : ""
        }`,
      }),
      providesTags: ["product"],
    }),

    getVariationProductLedger: builder.query<
      {
        ledger_history?: {
          history?: {
            data: LedgerType[];
            current_page: number;
            last_page: number;
            per_page: number;
          };
          total_removed: number;
          total_returned: number;
          total_sold: number;
          total_added: number;
        };
      },
      {
        limit?: number;
        page?: number;
        search?: string;
        location_id?: number | string | null;
        from_date?: string;
        to_date?: string;
        action?: string;
        id: number | string | undefined;
      }
    >({
      query: ({
        limit = 10,
        page = 1,
        location_id = "",
        from_date,
        to_date,
        id,
        action,
      }) => ({
        url: `${PRODUCTROUTES.VARIATIONS}/${id}/histories?${
          location_id && location_id !== undefined
            ? `location_id=${location_id}`
            : ""
        }&limit=${limit}&page=${page}${
          action ? `&action=${action}` : ""
        }&from_date=${from_date}&to_date=${to_date}`,
      }),
      providesTags: ["product"],
    }),

    getSingleProduct: builder.query<
      { product: any },
      { id: string | undefined; location_id: any }
    >({
      query: ({ id, location_id }) => ({
        url: `v2/${PRODUCTROUTES.PRODUCT}/${id}${
          location_id && location_id !== undefined
            ? `?location_id=${location_id}`
            : ""
        }`,
      }),
      providesTags: ["product"],
    }),

    getSingleProductVariation: builder.query<
      { product_variations: any },
      { id: string | undefined; location_id: any }
    >({
      query: ({ id, location_id }) => ({
        url: `${PRODUCTROUTES.VARIATIONS}/${id}${
          location_id && location_id !== undefined
            ? `?location_id=${location_id}`
            : ""
        }`,
      }),
      providesTags: ["product"],
    }),

    getSingleProductActivities: builder.query<
      {
        product_activities: {
          product_added: {
            week_summary: number;
            last_activity: { quantity: number; created_at: string };
          };
          product_removed: {
            week_summary: number;
            last_activity: { quantity: number; created_at: string };
          };
          product_returned: {
            week_summary: number;
            last_activity: { quantity: number; created_at: string };
          };
          product_sold: {
            week_summary: number;
            last_activity: { quantity: number; created_at: string };
          };
        };
        status: boolean;
      },
      string | undefined
    >({
      query: (id) => ({
        url: `${PRODUCTROUTES.PRODUCT}/${id}/activities`,
      }),
      providesTags: ["product"],
    }),

    getSingleProductHistory: builder.query<
      {
        product_history: {
          product_removed: number;
          product_returned: number;
          total_products: number;
          total_sold: number;
        };
        status: boolean;
      },
      string | undefined
    >({
      query: (id) => ({
        url: `${PRODUCTROUTES.PRODUCT}/${id}/history`,
      }),
      providesTags: ["product"],
    }),

    getSingleProductHistoryByStatus: builder.query<
      { product_activities: any },
      { id: string | undefined; status: string; page?: number }
    >({
      query: ({ id, status, page = 1 }) => ({
        url: `${PRODUCTROUTES.PRODUCT}/${id}/history/${status}?page=${page}`,
      }),
      providesTags: ["product"],
    }),

    linkExistingBarcode: builder.mutation<
      { product: any },
      {
        body: {
          barcode?: string;
          product_variations?: { id: number | string; barcode: string }[];
        };
        id: number;
      }
    >({
      query: ({ body, id }) => ({
        url: `${PRODUCTROUTES.PRODUCT}/${id}/barcodes/link`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["product", "allAnalytics"],
    }),

    updateProductStock: builder.mutation<
      { product: any },
      { body: UpdateStockType; id: number }
    >({
      query: ({ body, id }) => ({
        url: `${PRODUCTROUTES.PRODUCT}/${id}/stock`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["product", "allAnalytics"],
    }),

    printBarCode: builder.mutation<
      { data: any[] },
      {
        product_ids?: string[];
        product_variation_ids?: string[];
        location_id?: number | string | null;
        config: {
          name: boolean;
          price: boolean;
          copy_per_product: number;
        };
      }
    >({
      query: (body) => ({
        url: `${PRODUCTROUTES.PRODUCT}/barcodes/print`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["product"],
    }),

    exportCsv: builder.mutation<void, void>({
      query: () => ({
        url: EXPORTCSVROUTE.EXPORT,
        method: "POST",
      }),
    }),

    createProduct: builder.mutation<
      { product: any },
      CreateProductFeildsPayload
    >({
      query: (body) => ({
        url: PRODUCTROUTES.PRODUCT,
        method: "POST",
        body,
      }),
      invalidatesTags: ["product", "collections", "allAnalytics"],
    }),
    bulkEditProduct: builder.mutation<{}, { products: any[] }>({
      query: (body) => ({
        url: `product/bulk`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["product", "collections", "allAnalytics"],
    }),
    editProduct: builder.mutation<
      {},
      { body: EditProductFeildsPayload; id: string | undefined }
    >({
      query: ({ body, id }) => ({
        url: `${PRODUCTROUTES.PRODUCT}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["product", "collections", "allAnalytics"],
    }),
    deleteProduct: builder.mutation<{}, string>({
      query: (id) => ({
        url: `${PRODUCTROUTES.PRODUCT}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        "product",
        "discount",
        "coupon",
        "orders",
        "allAnalytics",
      ],
    }),

    deleteBulkProduct: builder.mutation<{}, string[]>({
      query: (ids) => {
        const queryString = ids.map((id) => `products[]=${id}`).join("&");
        return {
          url: `${PRODUCTROUTES.BULKDELETEPRODUCT}/bulk?${queryString}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [
        "product",
        "discount",
        "coupon",
        "orders",
        "allAnalytics",
      ],
    }),

    // End of Store Product Endpoint

    // Start of Collection
    getCollections: builder.query<
      { tags: CollectionType[] },
      { search?: string }
    >({
      query: ({ search = "" }) => ({
        // url: `${PRODUCTROUTES.PRODUCT}?search=${search}&limit=${limit}&page=${page}&orderBy=desc&orderByField=created_at`,
        url: `v2/${COLLECTIONROUTES.COLLECTION}?search=${search}`,
      }),
      providesTags: ["collections", "product"],
    }),
    createCollection: builder.mutation<{}, CreateCollectionField>({
      query: (body) => ({
        url: COLLECTIONROUTES.COLLECTION,
        method: "POST",
        body,
      }),
      invalidatesTags: ["collections", "product", "allAnalytics"],
    }),
    getSingleCollection: builder.query<
      { collection: CollectionType },
      string | undefined
    >({
      query: (id) => ({
        url: `${COLLECTIONROUTES.COLLECTION}/${id}`,
      }),
      providesTags: ["collections"],
    }),

    editCollection: builder.mutation<
      {},
      { body: CreateCollectionField; id: string | undefined }
    >({
      query: ({ body, id }) => ({
        url: `${COLLECTIONROUTES.COLLECTION}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["collections", "product", "allAnalytics"],
    }),
    deleteCollection: builder.mutation<{}, string | undefined>({
      query: (id) => ({
        url: `${COLLECTIONROUTES.COLLECTION}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["collections", "product", "allAnalytics"],
    }),

    deleteProductFromCollection: builder.mutation<
      {},
      { body: { products: string[] }; id: string | undefined }
    >({
      query: ({ body, id }) => ({
        url: `${COLLECTIONROUTES.COLLECTION}/${id}/remove-products`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["collections", "product", "allAnalytics"],
    }),

    // End of Collection

    // Start of Store Profile Endpoint
    getStoreProfile: builder.query<IStoreProfile, void>({
      query: () => ({
        url: SETTINGSROUTES.GET_STORE_PROFILE,
      }),
      providesTags: ["storeProfile"],
    }),

    updateStoreProfile: builder.mutation<{ user: IStoreProfile }, {}>({
      query: (body) => ({
        url: SETTINGSROUTES.GET_STORE_PROFILE,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["userData", "storeProfile"],
    }),

    uploadProfileAvatar: builder.mutation<any, any>({
      query: (body) => ({
        url: SETTINGSROUTES.UPLAOD_PROFILE_AVATAR,
        method: "POST",
        body,
      }),
      invalidatesTags: ["storeProfile"],
    }),

    deleteStoreProfile: builder.mutation<void, void>({
      query: () => ({
        url: SETTINGSROUTES.DELETE_STORE_PROFILE,
        method: "POST",
      }),
      invalidatesTags: ["storeProfile"],
    }),

    restoreStoreProfile: builder.mutation<void, void>({
      query: () => ({
        url: SETTINGSROUTES.RESTORE_STORE_PROFILE,
        method: "POST",
      }),
      invalidatesTags: ["storeProfile"],
    }),
    // End of Store Profile Endpoint

    // Start of Maintenance Mode

    setMaintenanceMode: builder.mutation<
      { store: IStoreInformation },
      { status: boolean; message?: string }
    >({
      query: (body) => ({
        url: SETTINGSROUTES.SET_MAINTENANCE_MODE,
        method: "POST",
        body,
      }),
      invalidatesTags: ["userData", "storeProfile"],
    }),

    uploadGeneralImage: builder.mutation<any, any>({
      query: ({ image, url }) => ({
        url: `${url}`,
        method: "POST",
        body: image,
      }),
      invalidatesTags: ["storeProfile", "store_information"],
    }),

    // End of Maintenance Mode
    // start of notifications
    getNotifications: builder.query<
      { notifications?: AppNotificationProps[] },
      void
    >({
      query: () => ({
        url: NOTIFICATIONROUTES.GET_NOTIFICATIONS,
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),

    markSingleAsRead: builder.mutation<{ notifications?: any }, string>({
      query: (id) => ({
        url: `${NOTIFICATIONROUTES.MARK_ONE_READ}/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["notifications"],
    }),

    markAllAsRead: builder.mutation<{ notifications?: any }, void>({
      query: () => ({
        url: NOTIFICATIONROUTES.MARK_ALL_READ,
        method: "POST",
      }),
      invalidatesTags: ["notifications"],
    }),

    dismissNotification: builder.query<{ notifications?: any }, void>({
      query: () => ({
        url: NOTIFICATIONROUTES.DISMISS_NOTIFICATION,
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),

    // end of notifications

    // start of subscription

    getPlans: builder.query<{ data?: any }, void>({
      query: () => ({
        url: `${SUBSCRIPTIONROUTES.PLANS}`,
      }),
      providesTags: ["plans"],
    }),

    getSubscriptionHistory: builder.query<
      { data?: PaymentHistory[] },
      string | undefined
    >({
      query: (id) => ({
        url: `${SUBSCRIPTIONROUTES.PAYMENTHISTORY}?store_id=${id}`,
      }),
      providesTags: ["plans"],
    }),

    upgradePlan: builder.mutation<
      { data: { authorization_url: string } },
      { plan_id: string; store_id: string }
    >({
      query: (body) => ({
        url: `${SUBSCRIPTIONROUTES.UPGRADEPLAN}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["plans", "storeProfile"],
    }),

    initiatePayment: builder.mutation<
      { data: { authorization_url: string } },
      { plan_id: string; store_id: string }
    >({
      query: (body) => ({
        url: `${SUBSCRIPTIONROUTES.INITITATEPAYMENT}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["plans", "storeProfile"],
    }),

    renewPlan: builder.mutation<
      { data: { authorization_url: string } },
      { plan_id: string; store_id: string }
    >({
      query: (body) => ({
        url: `${SUBSCRIPTIONROUTES.RENEW}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["plans", "storeProfile"],
    }),

    discountValidity: builder.mutation<
      { status: string; data: ValidDiscountType },
      { discount_code: string; plan_id: string }
    >({
      query: (body) => ({
        url: `${SUBSCRIPTIONROUTES.DISCOUNT}`,
        method: "POST",
        body: body,
      }),
    }),

    unSubscribe: builder.mutation<{}, { reason: string; store_id: string }>({
      query: (body) => ({
        url: `${SUBSCRIPTIONROUTES.UNSUBSCRIBE}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["plans", "storeProfile"],
    }),
    // End of subscription

    // start of categories
    getCategories: builder.query<ICategories, { search: string }>({
      query: ({ search }) => ({
        url: `${SETTINGSROUTES.CATEGORIES}?search=${search}`,
      }),
      providesTags: ["categories"],
    }),

    createCategory: builder.mutation<void, ICategory>({
      query: (body) => ({
        url: `${SETTINGSROUTES.CATEGORIES}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["categories"],
    }),

    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `${SETTINGSROUTES.CATEGORIES}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categories"],
    }),

    updateCategory: builder.mutation<
      void,
      {
        payload: { name: string; description: string | undefined };
        id: string | undefined;
      }
    >({
      query: ({ payload, id }) => ({
        url: `${SETTINGSROUTES.CATEGORIES}/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["categories"],
    }),
    // end of categories

    // start of expenses
    getExpenses: builder.query<
      IExpenses,
      { search: string; from?: string; to?: string }
    >({
      query: ({ search, from = "", to = "" }) => ({
        url: `${SETTINGSROUTES.GET_EXPENSES}?search=${search}&from_date=${from}&to_date=${to}&orderByField=created_at&orderBy=desc`,
      }),
      providesTags: ["expenses"],
    }),
    createExpense: builder.mutation<
      ExpenseFeilds,
      {
        notes: string;
        amount: string;
        expense_category_id: number;
        expense_date: string;
      }
    >({
      query: (body) => ({
        url: `${SETTINGSROUTES.GET_EXPENSES}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["expenses"],
    }),

    deleteExpense: builder.mutation<void, string>({
      query: (id) => ({
        url: `${SETTINGSROUTES.GET_EXPENSES}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["expenses"],
    }),

    updateExpense: builder.mutation<
      IExpenses,
      {
        payload: {
          notes: string;
          amount: string;
          expense_category_id: number;
          expense_date: string;
        };
        id: string | undefined;
      }
    >({
      query: ({ payload, id }) => ({
        url: `${SETTINGSROUTES.GET_EXPENSES}/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["expenses"],
    }),
    // end of expenses

    // Start of Orders
    getOrders: builder.query<
      {
        orders?: { data: OrderType[]; current_page: number; last_page: number };
        summary?: {
          count: number;
          data: { currency_code: string; total: string; subtotal: string }[];
        };
      },
      {
        limit?: number;
        page?: number;
        search?: string;
        paid_status?: string;
        shipping_status?: string;
        channel?: string;
        status?: string;
        from_date?: string;
        to_date?: string;
        customer_id?: string;
        location_id?: number | string | null;
        should_resolve?: string;
      }
    >({
      query: ({
        limit = 50,
        page = 1,
        search = "",
        paid_status = "",
        shipping_status = "",
        channel = "",
        status = "",
        from_date = "",
        to_date = "",
        customer_id = "",
        location_id = "",
        should_resolve = "",
      }) => ({
        url: `${
          ORDERSROUTES.ORDERS
        }?search=${search}&limit=${limit}&page=${page}&paid_status=${paid_status}&customer_id=${customer_id}${
          location_id && location_id !== undefined
            ? `&location_id=${location_id}`
            : ""
        }${
          should_resolve === "yes" ? `&should_resolve=${true}` : ""
        }&shipping_status=${shipping_status}&channel=${channel}&status=${status}&from_date=${from_date}&to_date=${to_date}`,
      }),
      providesTags: ["orders"],
    }),

    getSingleOrders: builder.query<{ order: OrderType }, string | undefined>({
      query: (id) => ({
        url: `${ORDERSROUTES.ORDERS}/${id}`,
      }),
      providesTags: ["orders"],
    }),

    createOrders: builder.mutation<OrderType, any>({
      query: (body) => ({
        url: ORDERSROUTES.ORDERS,
        method: "POST",
        body,
      }),
      invalidatesTags: ["orders", "product", "allAnalytics"],
    }),

    editOrders: builder.mutation<
      { order: OrderType },
      { body: any; id: string | undefined }
    >({
      query: ({ body, id }) => ({
        url: `${ORDERSROUTES.ORDERS}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["orders", "product", "allAnalytics"],
    }),

    deleteOrders: builder.mutation<any, string | undefined>({
      query: (id) => ({
        url: `${ORDERSROUTES.ORDERS}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["orders", "product", "allAnalytics"],
    }),

    actionOrders: builder.mutation<
      any,
      { id: string | undefined; action: string; body?: any }
    >({
      query: ({ id, action, body }) => ({
        url: `${ORDERSROUTES.ACTIONS}?action=${action}&id=${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["orders", "product", "allAnalytics"],
    }),

    requestOrderPayment: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `orders/${id}/${ORDERSROUTES.PAYMENT}`,
        method: "POST",
      }),
      invalidatesTags: ["orders", "allAnalytics"],
    }),

    refundOrder: builder.mutation<
      any,
      { id: string; body: { transaction_date: string; amount: number } }
    >({
      query: ({ id, body }) => ({
        url: `orders/${id}/${ORDERSROUTES.REFUND}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["orders", "allAnalytics"],
    }),

    loadCourier: builder.mutation<
      {
        data: {
          couriers: CourierType[];
          request_token: string;
        };
      },
      CourierFormType
    >({
      query: (body) => ({
        url: `${SHIPPINGROUTES.SETTINGS}/shipbubble/rates`,
        method: "POST",
        body,
      }),
    }),

    submitCourier: builder.mutation<
      any,
      { token: string; courier_id: string; courier_service_code: string }
    >({
      query: (body) => ({
        url: `${SHIPPINGROUTES.CREATEAUTOMATEDSHIPPING}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["orders"],
    }),

    getCustomerPickupLocation: builder.query<
      {
        data: any[];
      },
      string | undefined
    >({
      query: (id) => ({
        url: `${SHIPPINGROUTES.SETTINGS}/customer-pickup-locations/${id}`,
      }),
    }),

    // End of Orders

    getExtraLocationAmt: builder.mutation<
      { data: any },
      {
        store_id: number | null;
        plan_id: number;
        plan_count: number | undefined;
      }
    >({
      query: ({ store_id, plan_id, plan_count }) => ({
        url: `${LOCATIONROUTES.GETEXTRALOCATIONAMT}?store_id=${store_id}&plan_id=${plan_id}&plan_count=${plan_count}`,
      }),
    }),
    payForExtra: builder.mutation<
      { data: any },
      {
        store_id: number | null;
        plan_id: number;
        plan_count: number | undefined;
      }
    >({
      query: ({ store_id, plan_id, plan_count }) => ({
        url: `${LOCATIONROUTES.MAKEPAYMENT}?store_id=${store_id}&plan_id=${plan_id}&plan_count=${plan_count}`,
        method: "POST",
      }),
      invalidatesTags: ["storeProfile"],
    }),

    // start of location
    getUserLocations: builder.query<
      {
        data: {
          assigned_locations: LocationResponseType[];
          logged_in_location: LocationResponseType[];
        };
      },
      void
    >({
      query: () => ({
        url: LOCATIONROUTES.USERLOCATION,
      }),
      providesTags: ["location"],
    }),

    getLocations: builder.query<LocationResponseType, void>({
      query: () => ({
        url: LOCATIONROUTES.NEW_LOCATION,
      }),
      providesTags: ["location"],
    }),

    reactivateLocation: builder.mutation<
      {},
      { location_ids: number[]; all: boolean }
    >({
      query: ({ location_ids, all }) => ({
        url: `${LOCATIONROUTES.REACTIVATE}`,
        method: "POST",
        body: { location_ids: location_ids, all: all },
      }),
      invalidatesTags: ["location"],
    }),

    getLocationActivities: builder.query<
      { data: { data: any[] } },
      string | undefined
    >({
      query: (id) => ({
        url: `${LOCATIONROUTES.LOCATION}/${id}/activities`,
      }),
      providesTags: ["location"],
    }),
    getSingleLocation: builder.query<
      { data: LocationType },
      string | undefined
    >({
      query: (id) => ({
        url: `${LOCATIONROUTES.LOCATION}/${id}`,
      }),
      providesTags: ["location"],
    }),
    getSingleLocationStats: builder.query<
      {
        data: {
          staff_assigned: number;
          total_customers: number;
          total_inventory_value: number;
          total_orders: number;
          total_products: number;
          total_sales: number;
        };
      },
      string | undefined
    >({
      query: (id) => ({
        url: `${LOCATIONROUTES.LOCATION}/${id}/stats`,
      }),
      providesTags: ["location"],
    }),

    switchLocation: builder.mutation<any, number | undefined>({
      query: (id) => ({
        url: `${LOCATIONROUTES.LOCATION}/${id}/switch`,
        method: "PATCH",
      }),
      invalidatesTags: [
        "orders",
        "product",
        "staff",
        "location",
        "allAnalytics",
        "transaction",
      ],
    }),
    createLocation: builder.mutation<any, CreateLocationFields>({
      query: (body) => ({
        url: LOCATIONROUTES.LOCATION,
        method: "POST",
        body,
      }),
      invalidatesTags: ["orders", "product", "staff", "location"],
    }),

    editLocation: builder.mutation<
      any,
      { body: CreateLocationFields; id: string | undefined }
    >({
      query: ({ body, id }) => ({
        url: `${LOCATIONROUTES.LOCATION}/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["orders", "product", "staff", "location"],
    }),
    deleteLocation: builder.mutation<any, string | undefined>({
      query: (id) => ({
        url: `${LOCATIONROUTES.LOCATION}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["orders", "product", "staff", "location"],
    }),

    deactivateLocation: builder.mutation<any, string | undefined>({
      query: (id) => ({
        url: `${LOCATIONROUTES.LOCATION}/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["orders", "product", "staff", "location"],
    }),

    setdefaultLocation: builder.mutation<any, string | undefined>({
      query: (id) => ({
        url: `locations/${id}/set-default`,
        method: "PATCH",
      }),
      invalidatesTags: ["orders", "product", "staff", "location"],
    }),

    moveInventory: builder.mutation<any, any>({
      query: (body) => ({
        url: `${LOCATIONROUTES.INVENTORYTRANSFER}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["orders", "product", "staff", "customer", "location"],
    }),

    // end of location

    // start of transaction
    createTransaction: builder.mutation<any, TransactionField>({
      query: (body) => ({
        url: TRANSACTIONROUTES.TRANSACTION,
        method: "POST",
        body,
      }),
      invalidatesTags: ["orders", "transaction", "allAnalytics"],
    }),

    getTransaction: builder.query<
      {
        transactions?: {
          data: TransactionListType[];
          current_page: number;
          last_page: number;
        };
      },
      {
        limit?: number;
        page?: number;
        search?: string;
        from_date?: string;
        to_date?: string;
        location_id?: number | string | null;
        channel?: string;
        unmatched?: boolean | null;
      }
    >({
      query: ({
        limit = 10,
        page = 1,
        search = "",
        from_date = "",
        to_date = "",
        location_id = "",
        channel = "",
        unmatched = null,
      }) => ({
        url: `${
          TRANSACTIONROUTES.TRANSACTION
        }?search=${search}&limit=${limit}&page=${page}&from_date=${from_date}&to_date=${to_date}${
          location_id && location_id !== undefined
            ? `&location_id=${location_id}`
            : ""
        }&channel=${channel}${
          unmatched !== null ? `&unmatched=${unmatched}` : ""
        }`,
      }),
      providesTags: ["transaction"],
    }),

    getSettlements: builder.query<
      {
        settlements?: {
          data: SettlementListType[];
          current_page: number;
          last_page: number;
        };
      },
      {
        limit?: number;
        page?: number;
        search?: string;
        from_date?: string;
        to_date?: string;
        location_id?: number | string | null;
      }
    >({
      query: ({
        limit = 10,
        page = 1,
        search = "",
        from_date = "",
        to_date = "",
        location_id = "",
      }) => ({
        url: `${
          TRANSACTIONROUTES.SETTLEMENT
        }?search=${search}&limit=${limit}&page=${page}&from_date=${from_date}&to_date=${to_date}${
          location_id && location_id !== undefined
            ? `&location_id=${location_id}`
            : ""
        }`,
      }),
      providesTags: ["transaction"],
    }),

    getSingleSettlement: builder.query<
      { transactions: any },
      { date?: string }
    >({
      query: ({ date = "" }) => ({
        url: `${TRANSACTIONROUTES.SINGLE_SETTLEMENT}/${date}`,
      }),
      providesTags: ["transaction"],
    }),

    // end of transaction

    // start of customers
    getNewsLetter: builder.query<
      {
        subscribers?: {
          data: NEWSLETTERTYPE[];
          current_page: number;
          last_page: number;
        };
      },
      { limit?: number; page?: number; search?: string }
    >({
      query: ({ search = "" }) => ({
        url: `${CUSTOMERROUTES.NEWSLETTERLIST}?search=${search}`,
      }),
      providesTags: ["customer"],
    }),

    deleteNewsLetter: builder.mutation<{}, number | undefined>({
      query: (id) => ({
        url: `${CUSTOMERROUTES.NEWSLETTERLIST}/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["customer", "allAnalytics"],
    }),

    setDeviceToken: builder.mutation<{}, { push_token: string }>({
      query: (body) => ({
        url: `${TOKENROUTES.UPDATEDEVICETOKEN}`,
        method: "POST",
        body,
      }),
    }),

    getCustomers: builder.query<
      GetCustomersResponseType,
      { limit?: number; page?: number; search?: string; field?: string }
    >({
      query: ({ limit = 10, page = 1, search = "", field = "" }) => ({
        url: `${
          CUSTOMERROUTES.CUSTOMER
        }?search=${search}&limit=${limit}&page=${page}&orderBy=desc&orderByField=created_at&withCampaignParams=1${
          field ? field : ""
        }`,
      }),
      providesTags: ["customer"],
    }),

    getInvalidCustomers: builder.query<
      any,
      { customerGroups?: (number | string)[]; limit?: number; page?: number }
    >({
      query: ({ customerGroups, limit = 10, page = 1 } = {}) => {
        const groupQueryString = customerGroups
          ? `&customerGroups=[${customerGroups
              .map((group) =>
                typeof group === "number" ? group : `"${group}"`
              )
              .join(",")}]`
          : "";

        return {
          url: `${CUSTOMERROUTES.INVALIDCUSTOMERS}?limit=${limit}&page=${page}${groupQueryString}`,
        };
      },
    }),

    getSingleCustomer: builder.query<
      {
        customer: CustomerType;
        ordersCount: number;
        ordersTotal: number;
        groups: CustomerGroupType[];
        transactions: TransactionType[];
      },
      { id?: string; location_id?: number | string | null }
    >({
      query: ({ id, location_id }) => ({
        url: `${CUSTOMERROUTES.CUSTOMER}/${id}?${
          location_id ? `location_id=${location_id}` : ""
        }`,
      }),
      providesTags: ["customer"],
    }),

    createCustomer: builder.mutation<
      { customer: customerType },
      { body: AddNewCustomerPayload; dryRun?: boolean }
    >({
      query: ({ body, dryRun }) => ({
        url: CUSTOMERROUTES.CUSTOMER,
        method: "POST",
        body,
        headers: dryRun
          ? {
              "X-Dry-Run": "true",
              Accept: "application/json",
            }
          : {},
      }),
      invalidatesTags: ["customer", "allAnalytics"],
    }),

    editCustomer: builder.mutation<
      {},
      { body: any; id: string | undefined; dryRun?: boolean }
    >({
      query: ({ body, id, dryRun }) => ({
        url: `${CUSTOMERROUTES.CUSTOMER}/${id}`,
        method: "PUT",
        body,
        headers: {
          Accept: "application/json",
          ...(dryRun && { "X-Dry-Run": "true" }), // Conditionally add X-Dry-Run header if dryRun is true
        },
      }),
      invalidatesTags: ["customer", "orders", "allAnalytics"],
    }),

    deleteCustomer: builder.mutation<{}, number | undefined>({
      query: (id) => ({
        url: `${CUSTOMERROUTES.CUSTOMER}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["customer", "allAnalytics"],
    }),

    getCustomerGroups: builder.query<
      { groups?: CustomerGroupType[]; default?: CustomerGroupType[] },
      { search?: string; limit?: number; page?: number }
    >({
      query: ({ search = "", limit = 10, page = 2 }) => ({
        url: `${CUSTOMERROUTES.CUSTOMERGROUP}?search=${search}&limit=${limit}&page=${page}&orderBy=desc&orderByField=created_at`,
      }),
      providesTags: ["group"],
    }),

    getSingleCustomerGroup: builder.query<
      { group: CustomerGroupType },
      { id: string | undefined; limit?: number; page?: number; search?: string }
    >({
      query: ({ id, limit = 10, page = 1, search = "" }) => ({
        url: `${CUSTOMERROUTES.SINGLECUSTOMERGROUP}/${id}?search=${search}&limit=${limit}&page=${page}`,
      }),
      providesTags: ["group"],
    }),

    createCustomerGroup: builder.mutation<{}, CustomerGroupSubmitFields>({
      query: (body) => ({
        url: CUSTOMERROUTES.CREATECUSTOMERGROUP,
        method: "POST",
        body,
      }),
      invalidatesTags: ["group", "allAnalytics"],
    }),

    editCustomerGroup: builder.mutation<
      {},
      { body: CustomerGroupSubmitFields; id: string | undefined }
    >({
      query: ({ body, id }) => ({
        url: `${CUSTOMERROUTES.SINGLECUSTOMERGROUP}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["group"],
    }),

    deleteCustomerGroup: builder.mutation<{}, string | undefined>({
      query: (id) => ({
        url: `${CUSTOMERROUTES.CUSTOMERGROUP}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["group", "allAnalytics"],
    }),
    // end of customer group

    // start of countries
    getCountries: builder.query<CountryType[], void>({
      query: () => ({
        url: `${COUNTRIESROUTES.COUNTRIES}`,
      }),
      providesTags: ["countries"],
    }),

    getStates: builder.query<string[], string | undefined>({
      query: (country) => ({
        url: `${COUNTRIESROUTES.STATES}/${country}`,
      }),
      providesTags: ["countries"],
    }),

    getStatesByCountryID: builder.query<
      { name: string; id: string }[],
      string | undefined
    >({
      query: (country) => ({
        url: `country/${country}/states`,
      }),
      providesTags: ["countries"],
    }),

    getCityByStateID: builder.query<
      { name: string; id: string }[],
      string | undefined
    >({
      query: (state) => ({
        url: `state/${state}/cities`,
      }),
      providesTags: ["countries"],
    }),

    // end of countries

    // start of tax
    getTax: builder.query<{ taxTypes?: TaxType[] }, void>({
      query: () => ({
        url: `${TAXROUTES.TAX}`,
      }),
      providesTags: ["tax"],
    }),

    getSingleTax: builder.query<{ taxType: TaxType }, string | undefined>({
      query: (id) => ({
        url: `${TAXROUTES.TAX}/${id}`,
      }),
      providesTags: ["tax"],
    }),

    createTax: builder.mutation<{}, CreateTaxFeilds>({
      query: (body) => ({
        url: TAXROUTES.TAX,
        method: "POST",
        body,
      }),
      invalidatesTags: ["tax"],
    }),
    editTax: builder.mutation<
      {},
      { body: EditTaxFeilds; id: string | undefined }
    >({
      query: ({ body, id }) => ({
        url: `${TAXROUTES.TAX}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["tax"],
    }),
    deleteTax: builder.mutation<{}, string | undefined>({
      query: (id) => ({
        url: `${TAXROUTES.TAX}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tax"],
    }),
    // end of tax

    // start of shipping
    // getShipping: builder.query<{ shippingTypes?: ShippingType[] }, void>({
    //   query: () => ({
    //     url: `${SHIPPINGROUTES.SHIPPING}`,
    //   }),
    //   providesTags: ["shipping"],
    // }),
    //    // start of note
    getNotes: builder.query<{ notes?: NoteType[] }, void>({
      query: () => ({
        url: `${NOTEROUTES.NOTE}`,
      }),
      providesTags: ["orders", "notes"],
    }),

    getSingleNote: builder.query<{ note: NoteType }, string | undefined>({
      query: (id) => ({
        url: `${NOTEROUTES.NOTE}/${id}`,
      }),
      providesTags: ["notes"],
    }),

    createNote: builder.mutation<{}, InvoiceNoteFields>({
      query: (body) => ({
        url: NOTEROUTES.NOTE,
        method: "POST",
        body,
      }),
      invalidatesTags: ["notes"],
    }),

    editNote: builder.mutation<
      {},
      { body: EditShippingFeilds; id: string | undefined }
    >({
      query: ({ body, id }) => ({
        url: `${NOTEROUTES.NOTE}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["notes"],
    }),
    deleteNote: builder.mutation<{}, string | undefined>({
      query: (id) => ({
        url: `${NOTEROUTES.NOTE}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notes"],
    }),
    toggleNote: builder.mutation<{}, string | undefined>({
      query: (id) => ({
        url: `${NOTEROUTES.NOTE}/${id}/toggle`,
        method: "POST",
      }),
      invalidatesTags: ["notes"],
    }),
    // end of note
    //    // start of shipping
    getShipping: builder.query<
      { shippingTypes?: ShippingType[] },
      { location_id?: number | string | null }
    >({
      query: ({ location_id = "" }) => ({
        url: `${SHIPPINGROUTES.SHIPPING}?${
          location_id && location_id !== undefined
            ? `&location_id=${location_id}`
            : ""
        }`,
      }),
      providesTags: ["shipping"],
    }),

    getShippingSetting: builder.query<IShippingSettings, void>({
      query: () => ({
        url: `${SHIPPINGROUTES.SETTINGS}`,
      }),
      providesTags: ["shipping"],
    }),

    getShipBubbleSettings: builder.query<{ data: IShipBubbleSetting }, void>({
      query: () => ({
        url: `${SHIPPINGROUTES.SHIPBUBBLE}`,
      }),
      providesTags: ["shipping"],
    }),

    createShipping: builder.mutation<{}, CreateShippingFeilds>({
      query: (body) => ({
        url: SHIPPINGROUTES.SHIPPING,
        method: "POST",
        body,
      }),
      invalidatesTags: ["shipping"],
    }),

    updateShippingSettings: builder.mutation<
      {},
      UpdateGeneralShippingSettingsField
    >({
      query: (body) => ({
        url: SHIPPINGROUTES.SETTINGS,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["shipping"],
    }),

    updateShipbubbleSettings: builder.mutation<
      {},
      UpdateShipbubbleShippingSettingsField
    >({
      query: (body) => ({
        url: SHIPPINGROUTES.SHIPBUBBLE,
        method: "POST",
        body,
      }),
      invalidatesTags: ["shipping"],
    }),

    getPickupLocation: builder.query<{ data?: PickupLocationType[] }, void>({
      query: () => ({
        url: `${SHIPPINGROUTES.SETTINGS}/pickup-locations`,
      }),
      providesTags: ["pickup"],
    }),

    createPickupLocation: builder.mutation<{}, PickupField>({
      query: (body) => ({
        url: `${SHIPPINGROUTES.SETTINGS}/pickup-locations`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["pickup"],
    }),

    editPickupLocation: builder.mutation<
      {},
      { body: PickupField; id: string | undefined }
    >({
      query: ({ body, id }) => ({
        url: `${SHIPPINGROUTES.SETTINGS}/pickup-locations/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["pickup"],
    }),

    deletePickupLocation: builder.mutation<{}, string | undefined>({
      query: (id) => ({
        url: `${SHIPPINGROUTES.SETTINGS}/pickup-locations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["pickup"],
    }),

    getShipbubbleCategories: builder.query<
      {
        data: { category: string; category_id: number }[];
      },
      void
    >({
      query: () => ({
        url: `${SHIPPINGROUTES.SETTINGS}/shipbubble/categories`,
      }),
      providesTags: ["shipping"],
    }),

    getShipbubbleBoxSize: builder.query<
      {
        data: {
          name: string;
          description_image_url: string;
          height: string;
          width: string;
          length: string;
          max_weight: string;
        }[];
      },
      void
    >({
      query: () => ({
        url: `${SHIPPINGROUTES.SETTINGS}/shipbubble/boxes`,
      }),
      providesTags: ["shipping"],
    }),

    getShipbubbleCourier: builder.query<
      {
        data: {
          name: string;
          pin_image: string;
          service_code: string;
          origin_country: string;
          international: boolean;
          domestic: boolean;
          on_demand: boolean;
          status: string;
        }[];
      },
      void
    >({
      query: () => ({
        url: `${SHIPPINGROUTES.SETTINGS}/shipbubble/couriers`,
      }),
      providesTags: ["shipping"],
    }),

    duplicateShipping: builder.mutation<
      {},
      { location_ids: string[] | number[]; shipping_ids: string[] | number[] }
    >({
      query: (body) => ({
        url: SHIPPINGROUTES.DUPLICATESHIPPING,
        method: "POST",
        body,
      }),
      invalidatesTags: ["shipping"],
    }),
    editShipping: builder.mutation<
      {},
      { body: EditShippingFeilds; id: string | undefined }
    >({
      query: ({ body, id }) => ({
        url: `${SHIPPINGROUTES.SHIPPING}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["shipping"],
    }),

    deleteShipping: builder.mutation<{}, string | undefined>({
      query: (id) => ({
        url: `${SHIPPINGROUTES.SHIPPING}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["shipping"],
    }),
    // end of shipping

    // start of Store Information
    getStoreInformation: builder.query<{ store: IStoreInformation }, void>({
      query: () => ({
        url: `${SETTINGSROUTES.STORE_INFORMATION}`,
      }),
      providesTags: ["storeProfile"],
    }),

    updateStoreInformation: builder.mutation<
      { store: IStoreInformation },
      IStoreInformation
    >({
      query: (body) => ({
        url: `${SETTINGSROUTES.STORE_INFORMATION}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["store_information"],
    }),

    updateStoreProfilePassword: builder.mutation<IStoreProfile, {}>({
      query: (body) => ({
        url: SETTINGSROUTES.STORE_PASSWORD,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["storeProfile", "userData"],
    }),

    // end of Store Information

    // start of Bank Settings
    getBankSettings: builder.query<{ account: IBankSettings }, void>({
      query: () => ({
        url: `${SETTINGSROUTES.SETTINGS_BANK}`,
      }),
      providesTags: ["bank_settings"],
    }),

    getBankLists: builder.query<IBank[], void>({
      query: () => ({
        url: `${SETTINGSROUTES.BANK}`,
      }),
      providesTags: ["bank_settings"],
    }),

    updateBankSettings: builder.mutation<void, IBankSettings>({
      query: (body) => ({
        url: `${SETTINGSROUTES.SETTINGS_BANK}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["bank_settings"],
    }),

    // end of Bank Settings

    // Start of integration
    getPaymentSetting: builder.query<
      { payment_methods: { bank_transfer: boolean; paystack: boolean } },
      void
    >({
      query: () => ({
        url: `${INTEGRATIONROUTES.PAYMENT}`,
      }),
      providesTags: ["payment_setting"],
    }),

    getPaymentMethods: builder.query<PaymentMethodsResponse, void>({
      query: () => ({
        url: `${INTEGRATIONROUTES.PAYMENT_METHODS}`,
      }),
      providesTags: ["payment_methods"],
    }),

    savePaymentSettings: builder.mutation<
      void,
      { paystack: boolean; bank_transfer: boolean }
    >({
      query: (body) => ({
        url: `${INTEGRATIONROUTES.PAYMENT}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["payment_setting", "payment_methods"],
    }),

    // pixel code
    savePixelCode: builder.mutation<void, { pixel_code: string }>({
      query: (body) => ({
        url: `${INTEGRATIONROUTES.PIXELCODE}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["pixel"],
    }),

    disconnectPixel: builder.mutation<void, void>({
      query: () => ({
        url: `${INTEGRATIONROUTES.DISCONNECTPIXEL}`,
        method: "POST",
      }),
      invalidatesTags: ["pixel"],
    }),

    getPixelCode: builder.query<
      { pixel_code: string | null; pixel_status: number },
      void
    >({
      query: () => ({
        url: `${INTEGRATIONROUTES.PIXELCODE}`,
      }),
      providesTags: ["pixel"],
    }),

    // google analytics code
    //   getIntegrationScript: builder.query<
    //   { integration_type: string | null, integration_code: string | null },
    //   { integration_type: string | null }
    // >({
    //   query: (integration_type) => ({
    //     url: `${INTEGRATIONROUTES.INTEGRATION_SCRIPT}/${integration_type}/script`,
    //   }),
    //   providesTags: ["integration_script"],
    // }),
    // google analytics code
    getIntegrationScript: builder.query<
      {
        integration: {
          script: string | null;
          status: boolean;
        };
        integration_type: string | null;
        integration_code: string | null;
      },
      { integration_type: string | null }
    >({
      query: ({ integration_type }) => ({
        url: `${INTEGRATIONROUTES.INTEGRATION_SCRIPT}/${integration_type}/script`,
      }),
      providesTags: ["integration_script"],
    }),

    saveIntegrationScript: builder.mutation<
      void,
      { integration_type: string; integration_code: string }
    >({
      query: (body) => ({
        url: `${INTEGRATIONROUTES.SAVE_SCRIPT}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["integration_script"],
    }),

    disconnectIntegrationScript: builder.mutation<
      void,
      { integration_type: string }
    >({
      query: (body) => ({
        url: `${INTEGRATIONROUTES.DISCONNECT_SCRIPT}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["integration_script"],
    }),

    // end google analytics
    getMetaIntegration: builder.query<MetaIntegration, void>({
      query: () => ({
        url: `${INTEGRATIONROUTES.METAINTEGRATION}`,
      }),
      providesTags: ["meta_integration"],
    }),

    postMetaCallback: builder.mutation<
      any,
      {
        access_token: string;
        data_access_expiration_time: string;
        expires_in: string;
      }
    >({
      query: (body) => ({
        url: `${INTEGRATIONROUTES.METACALLBACK}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["meta_integration"],
    }),

    disconnectMeta: builder.mutation<any, void>({
      query: () => ({
        url: `${INTEGRATIONROUTES.DISCONNECTMETA}`,
        method: "POST",
      }),
      invalidatesTags: ["meta_integration"],
    }),

    // end of integration

    // start of campaigns

    getCampaigns: builder.query<
      { campaigns: ICampaign[] },
      { search: string; channel: string }
    >({
      query: ({ search, channel }) => ({
        url: `${MARKETINGROUTES.CAMPAIGN}?search=${search}&channel=${channel}`,
      }),
      providesTags: ["campaigns"],
    }),

    getSingleCampaign: builder.query<
      { campaign: ICampaign },
      {
        id: string;
        search: string;
        page: number;
        limit: number;
        filter: string;
      }
    >({
      query: ({ id, page, limit, search, filter }) => ({
        url: `${MARKETINGROUTES.CAMPAIGN}/${id}?search=${search}&page=${page}&per_page=${limit}&filter=${filter}`,
      }),
      providesTags: ["campaigns"],
    }),

    getSingleCampaignV2: builder.query<
      { campaign: ICampaign },
      {
        id: string;
        search: string;
        page: number;
        limit: number;
        filter: string;
      }
    >({
      query: ({ id, page, limit, search, filter }) => ({
        url: `v2/${MARKETINGROUTES.CAMPAIGN}/${id}?search=${search}&page=${page}&per_page=${limit}&filter=${filter}`,
      }),
      providesTags: ["campaigns"],
    }),

    estimateCampaignCredit: builder.mutation<{ credits: number }, ICampaign>({
      query: (body) => ({
        url: `${MARKETINGROUTES.CAMPAIGN}/estimate`,
        method: "POST",
        body,
      }),
    }),

    resendFailedCampaigns: builder.mutation<void, string>({
      query: (id) => ({
        url: `${MARKETINGROUTES.CAMPAIGN}/${id}/retry`,
        method: "POST",
      }),
    }),

    createCampaigns: builder.mutation<void, ICampaign>({
      query: (body) => ({
        url: `${MARKETINGROUTES.CAMPAIGN}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["campaigns"],
    }),

    getCreditPlan: builder.query<
      {
        plans: {
          id: number;
          name: string;
          credits: number;
          price: number;
          currency: string;
        }[];
      },
      void
    >({
      query: () => ({
        url: `${MARKETINGROUTES.CREDITPLANS}`,
      }),
      providesTags: ["campaigns"],
    }),

    purchaseCredit: builder.mutation<
      { data: { authorization_url: "" } },
      {
        plan_id: number;
        redirect_url: string;
      }
    >({
      query: (body) => ({
        url: `${MARKETINGROUTES.PURCHASECREDIT}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["campaigns"],
    }),
    // end of campaigns

    // start of domain

    searchDomain: builder.mutation<
      { data: SearchDomainType[]; status: boolean },
      { body: { searchTerm: string }; id: string; signal: any }
    >({
      query: ({ body, id, signal }) => ({
        url: `${DOMAINROUTES.DOMAIN}/${id}/lookUp`,
        method: "POST",
        body,
        signal,
      }),
      invalidatesTags: ["domain"],
    }),

    initiateDomainPayment: builder.mutation<
      { data: { authorization_url: string; is_free: boolean } },
      { body: InitiateDomainPaymentType; id: string }
    >({
      query: ({ body, id }) => ({
        url: `${DOMAINROUTES.DOMAIN}/${id}/initiate_payment`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["domain"],
    }),

    getDomainList: builder.query<
      {
        data: domainListType[];
        meta: {
          current_page: number;
          per_page: number;
          last_page: number;
        };
      },
      { id?: string; limit?: number; page?: number }
    >({
      query: ({ id, limit, page }) => ({
        url: `${DOMAINROUTES.DOMAIN}/${id}/domains?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["domain"],
    }),

    getDomainPaymentList: builder.query<
      {
        data: domainPaymentListType[];
        meta: {
          current_page: number;
          per_page: number;
          last_page: number;
        };
      },
      string | undefined
    >({
      query: (id) => ({
        url: `${DOMAINROUTES.DOMAIN}/${id}/payment_list`,
        method: "GET",
      }),
      providesTags: ["domain"],
    }),

    getSingleDomain: builder.query<
      { data: SingleDomainType; meta: domainListType; status: boolean },
      string | undefined
    >({
      query: (id) => ({
        url: `${DOMAINROUTES.DOMAIN}/${id}/info`,
        method: "GET",
      }),
      providesTags: ["domain"],
    }),

    getDnsList: builder.query<
      { data: { hosts: DnsHostType[] }; status: boolean },
      string | undefined
    >({
      query: (id) => ({
        url: `${DOMAINROUTES.DOMAIN}/${id}/getDNSRecords`,
        method: "GET",
      }),
      providesTags: ["domain"],
    }),

    createDns: builder.mutation<void, { body: any; id: string }>({
      query: ({ body, id }) => ({
        url: `${DOMAINROUTES.DOMAIN}/${id}/addDNSRecord`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["domain"],
    }),

    connectDomain: builder.mutation<
      { message: string; status: boolean },
      { domain_name: string }
    >({
      query: (body) => ({
        url: `${DOMAINROUTES.DOMAIN}/integrateExistingDomain`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["domain", "product", "orders", "allAnalytics"],
    }),

    editDns: builder.mutation<void, { body: any; id: string }>({
      query: ({ body, id }) => ({
        url: `${DOMAINROUTES.DOMAIN}/${id}/modifyDNSRecord`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["domain"],
    }),

    deleteDns: builder.mutation<
      {},
      { id: string | undefined; host_id: string }
    >({
      query: ({ id, host_id }) => ({
        url: `${DOMAINROUTES.DOMAIN}/${id}/deleteDNSRecord`,
        method: "POST",
        body: { host_id },
      }),
      invalidatesTags: ["domain"],
    }),

    editFreeUrl: builder.mutation<
      { message: string; status: boolean; store: IStoreInformation },
      { body: { new_url: string }; id: string }
    >({
      query: ({ body, id }) => ({
        url: `${DOMAINROUTES.DOMAIN}/${id}/editStoreFreeUrl`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["domain", "product", "orders", "allAnalytics"],
    }),

    publishUrl: builder.mutation<
      { message: string; status: boolean },
      { storeId: string; domainId: string }
    >({
      query: ({ storeId, domainId }) => ({
        url: `${DOMAINROUTES.DOMAIN}/${storeId}/${domainId}/updateStoreUrl`,
        method: "POST",
      }),
      invalidatesTags: ["domain", "product", "orders", "allAnalytics"],
    }),

    // end of domain

    // start of discount
    createDiscount: builder.mutation<{}, CreateDiscountFormType>({
      query: (body) => ({
        url: DISCOUNTROUTES.DISCOUNT,
        method: "POST",
        body,
      }),
      invalidatesTags: ["discount", "product", "allAnalytics"],
    }),

    addItemDiscount: builder.mutation<
      {},
      {
        body: {
          products?: string[];
          products_variations?: string[];
          collections?: string[];
        };
        id: string | undefined;
      }
    >({
      query: ({ body, id }) => ({
        url: `${DISCOUNTROUTES.DISCOUNT}/${id}/add-item`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["discount", "product", "allAnalytics"],
    }),

    removeItemDiscount: builder.mutation<
      {},
      {
        body: {
          products?: string[];
          products_variations?: string[];
          collections?: string[];
        };
        id: string | undefined;
      }
    >({
      query: ({ body, id }) => ({
        url: `${DISCOUNTROUTES.DISCOUNT}/${id}/remove-item`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["discount", "product", "allAnalytics"],
    }),

    getDiscounts: builder.query<
      {
        data: DiscountType[];
        current_page: number;
        last_page: number;
      },
      {
        type?: string;
        search?: string;
        limit?: number;
        page?: number;
        status?: string;
        expired?: number;
      }
    >({
      query: ({ type = "", search = "", page, limit, status, expired }) => ({
        url: `${PAGINATEDDISCOUNTROUTES.DISCOUNT}?search=${search}${
          type ? `&type=${type}` : ""
        }&expired=${
          expired ? expired : 0
        }&page=${page}&limit=${limit}&status=${status}`,
        method: "GET",
      }),
      providesTags: ["discount"],
    }),

    getSingleDiscount: builder.query<
      { discounts: DiscountType },
      string | undefined
    >({
      query: (id) => ({
        url: `${DISCOUNTROUTES.DISCOUNT}/${id}?products=false`,
      }),
      providesTags: ["discount"],
    }),

    getSingleDiscountItem: builder.query<
      any,
      { id: string; search?: string; limit?: number; page?: number }
    >({
      query: ({ id, search, limit, page }) => ({
        url: `${DISCOUNTROUTES.DISCOUNT}/${id}/getItems?search=${search}&page=${page}&limit=${limit}`,
      }),
      providesTags: ["discount"],
    }),

    deleteDiscount: builder.mutation<{}, string | undefined>({
      query: (id) => ({
        url: `${DISCOUNTROUTES.DISCOUNT}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["discount", "product"],
    }),

    // end of dicount

    // start of coupon
    createCoupon: builder.mutation<{}, CreateCouponFormType>({
      query: (body) => ({
        url: COUPONROUTES.COUPON,
        method: "POST",
        body,
      }),
      invalidatesTags: ["coupon"],
    }),
    getCoupons: builder.query<
      {
        data: CouponType[];
        current_page: number;
        last_page: number;
      },
      {
        type?: string;
        search?: string;
        limit?: number;
        page?: number;
        status?: string;
        expired?: number;
      }
    >({
      query: ({ type = "", search = "", page, limit, status, expired }) => ({
        url: `${PAGINATEDCOUPONROUTES.COUPON}?search=${search}${
          type ? `&type=${type}` : ""
        }&page=${page}&limit=${limit}&status=${status}${
          expired !== null ? `&expired=${expired}` : ""
        }`,
        method: "GET",
      }),
      providesTags: ["coupon"],
    }),
    getSingleCoupon: builder.query<{ coupon: CouponType }, string | undefined>({
      query: (id) => ({
        url: `${COUPONROUTES.COUPON}/${id}?products=false`,
      }),
      providesTags: ["coupon"],
    }),
    getSingleCouponItem: builder.query<
      any,
      { id: string; search?: string; limit?: number; page?: number }
    >({
      query: ({ id, search, limit, page }) => ({
        url: `${COUPONROUTES.COUPON}/${id}/getItems?search=${search}&page=${page}&limit=${limit}`,
      }),
      providesTags: ["coupon"],
    }),

    deleteCoupon: builder.mutation<{}, string | undefined>({
      query: (id) => ({
        url: `${COUPONROUTES.COUPON}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coupon"],
    }),
    addItemCoupon: builder.mutation<
      {},
      {
        body: {
          products?: string[];
          products_variations?: string[];
          collections?: string[];
        };
        id: string | undefined;
      }
    >({
      query: ({ body, id }) => ({
        url: `${COUPONROUTES.COUPON}/${id}/add-item`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["coupon"],
    }),

    removeItemCoupon: builder.mutation<
      {},
      {
        body: {
          products?: string[];
          products_variations?: string[];
          collections?: string[];
        };
        id: string | undefined;
      }
    >({
      query: ({ body, id }) => ({
        url: `${COUPONROUTES.COUPON}/${id}/remove-item`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["coupon"],
    }),
    // end of coupon

    // start of staff account
    getStaffAccounts: builder.query<
      IGetStaffAccountsResponse,
      { search: string; location_id?: number | string | null }
    >({
      query: ({ search, location_id = "" }) => ({
        url: `${STAFFROUTES.STAFF}?search=${search}${
          location_id && location_id !== undefined
            ? `&location_id=${location_id}`
            : ""
        }`,
        method: "GET",
      }),
      providesTags: ["staff"],
    }),

    // reactivate staff
    reactivateStaff: builder.mutation<
      {},
      { staff_ids: number[]; all: boolean }
    >({
      query: ({ staff_ids, all }) => ({
        url: `${STAFFROUTES.REACTIVATE}`,
        method: "POST",
        body: { staff_ids: staff_ids, all: all },
      }),
      invalidatesTags: ["staff"],
    }),

    deleteStaffAccount: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `${STAFFROUTES.STAFF}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["staff"],
    }),

    createStaffAccount: builder.mutation<void, ICreateStaffPayload>({
      query: (body) => ({
        url: `${STAFFROUTES.STAFF}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["staff"],
    }),

    resendStaffEmail: builder.mutation<void, { email: string }>({
      query: (body) => ({
        url: `${STAFFROUTES.RESENDMAIL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["staff"],
    }),

    getStaffActivities: builder.query<
      { activities: any },
      { type: string; id: string }
    >({
      query: ({ type, id }) => ({
        url: `${STAFFROUTES.STAFF}/${id}/activities?type=${type}`,
        method: "GET",
      }),
      providesTags: ["staff"],
    }),

    updateStaffAccount: builder.mutation<
      void,
      { body: IUpdateStaffPayload; id: string }
    >({
      query: ({ body, id }) => ({
        url: `${STAFFROUTES.STAFF}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["staff"],
    }),
    // end of staff account
    // start of app flag
    setAppFlag: builder.mutation<{}, any>({
      query: (body) => ({
        url: APPFLAGROUTES.APPFLAG,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        "userData",
        "product",
        "orders",
        "allAnalytics",
        "userData",
      ],
    }),
    confirmMail: builder.mutation<{}, {}>({
      query: () => ({
        url: AUTHROUTES.VERYFYMAIL,
        method: "POST",
      }),
      invalidatesTags: ["userData"],
    }),
    // end of app flag

    // start of  customisation
    getThemes: builder.query<{ data: ThemeType[] }, void>({
      query: () => ({
        url: `${CUSTOMISATION_ROUTES.THEMES}`,
        method: "GET",
      }),
      providesTags: ["customisation"],
    }),

    getSingleTheme: builder.query<ThemeType, string>({
      query: (id) => ({
        url: `${CUSTOMISATION_ROUTES.THEMES}/${id}/view`,
        method: "GET",
      }),
      providesTags: ["customisation"],
    }),

    getMarketPlaceSingleTheme: builder.query<ThemeType, string>({
      query: (id) => ({
        url: `${CUSTOMISATION_ROUTES.THEMES}/marketplace/${id}`,
        method: "GET",
      }),
      providesTags: ["customisation"],
    }),

    getMarketPlaceThemes: builder.query<{ data: ThemeType[] }, void>({
      query: () => ({
        url: `${CUSTOMISATION_ROUTES.THEMES}/marketplace`,
        method: "GET",
      }),
      providesTags: ["customisation"],
    }),

    updateTheme: builder.mutation<void, { body: any; id: string }>({
      query: ({ body, id }) => ({
        url: `${CUSTOMISATION_ROUTES.THEMES}/${id}/setOptions`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["customisation", "storeProfile"],
    }),

    activateTheme: builder.mutation<void, string>({
      query: (id) => ({
        url: `${CUSTOMISATION_ROUTES.THEMES}/${id}/activate`,
        method: "POST",
      }),
      invalidatesTags: ["customisation"],
    }),

    uninstallTheme: builder.mutation<void, string>({
      query: (id) => ({
        url: `${CUSTOMISATION_ROUTES.THEMES}/${id}/uninstall`,
        method: "DELETE",
      }),
      invalidatesTags: ["customisation"],
    }),

    getStoreLayout: builder.query<{ layout: ILayout }, void>({
      query: () => ({
        url: `${CUSTOMISATION_ROUTES.CUSTOMISATION}/layout`,
        method: "GET",
      }),
      providesTags: ["customisation"],
    }),

    updateStoreLayout: builder.mutation<ILayout, { config: ILayout }>({
      query: (body) => ({
        url: `${CUSTOMISATION_ROUTES.CUSTOMISATION}/save`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["customisation"],
    }),

    getStoreThemeColor: builder.query<{ colors: IColor[] }, void>({
      query: () => ({
        url: `${CUSTOMISATION_ROUTES.CUSTOMISATION}/colors`,
        method: "GET",
      }),
      providesTags: ["customisation"],
    }),

    updateStoreTheme: builder.mutation<void, { template: string }>({
      query: (body) => ({
        url: `${CUSTOMISATION_ROUTES.CUSTOMISATION}/theme`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["customisation", "storeProfile"],
    }),
    // end of store customisation

    // Get Currencies

    getCurrencies: builder.query<ICurrency[], void>({
      query: () => ({
        url: `${SETTINGSROUTES.CURRENCIES}`,
        method: "GET",
      }),
      providesTags: ["customisation"],
    }),

    // End Currencies

    //Start media upload

    postMediaUpload: builder.mutation<
      MediaType,
      { name: string; image: string }
    >({
      query: (body) => ({
        url: `media/upload/temp`,
        method: "POST",
        body,
      }),
    }),

    //End  media upload
    // state of pos
    addCouponToCart: builder.mutation<
      {
        cart: {
          discount: string;
          discount_type: string;
          discount_val: number;
          total: number;
          items: PosItemsType[];
        };
      },
      { code: string }
    >({
      query: (body) => ({
        url: `pos/applycoupon`,
        method: "POST",
        body,
      }),
    }),

    // Start of Instagram Webhook
    sendInstagramWebhookAuthorization: builder.mutation<
      { auth: string },
      { url: string; body: { socket_id: string; channel_name: string } }
    >({
      query: ({ body, url }) => ({
        url: url,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
    }),
    // End of Instagram Webhook

    // Start of Wallet

    verifyBVN: builder.mutation<{}, { bvn: string }>({
      query: (body) => ({
        url: `/wallets/bvn`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
    }),

    sendBVNOtpPin: builder.mutation<{}, { code: string }>({
      query: (body) => ({
        url: `/wallets`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
    }),

    createTransactionPin: builder.mutation<{}, { pin: string }>({
      query: (body) => ({
        url: `/settings/transaction-pin`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
      invalidatesTags: ["wallet"],
    }),

    changeTransactionPin: builder.mutation<{}, ChangePinFields>({
      query: (body) => ({
        url: WALLET_ROUTES.CHANGEPIN,
        method: "PUT",
        body,
      }),
      // providesTags: ["wallet"],
    }),

    setTransactionLimit: builder.mutation<{}, limitFields>({
      query: (body) => ({
        url: WALLET_ROUTES.SETLIMIT,
        method: "POST",
        body,
      }),
      invalidatesTags: ["wallet"],
    }),

    getWalletDetails: builder.query<
      { data: WalletDetailsType },
      { provider: string }
    >({
      query: ({ provider }) => ({
        url: `/wallets/${provider}/details`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["wallet"],
    }),

    getAccounStatement: builder.mutation<
      any,
      { provider: string; from: Date; to: Date }
    >({
      query: ({ provider, from, to }) => ({
        url: `/wallets/${provider}/statements/?from=${from}&to=${to}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      // invali: ["wallet"],
    }),

    getWrapped: builder.mutation<
      any,
      {
        user_id: string | null;
        year: string | null;
        expires: string | null;
        signature: string | null;
      }
    >({
      query: ({ user_id, year, expires, signature }) => ({
        url: `/bumpa_wrapped/${user_id}/${year}?expires=${expires}&signature=${signature}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getWalletTransactions: builder.query<
      { transactions: { data: WalletTransactionDetailsType[] } },
      {
        type: string;
        filter: string;
        provider: string;
        from?: string;
        to?: string;
      }
    >({
      query: ({ provider, from, to, type, filter }) => ({
        url:
          filter === "all"
            ? `/transactions?provider=${provider}`
            : `/transactions?provider=${provider}?from=${from}&to=${to}&type=${type}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getSingleWalletTransactionsDetails: builder.query<
      any,
      { transactionId: string }
    >({
      query: ({ transactionId }) => ({
        url: `/transactions/${transactionId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getListOfFincraBank: builder.query<any, void>({
      query: () => ({
        url: `/fincra/banks`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    lookUpWithdrawalAccount: builder.mutation<
      any,
      { body: { accountNumber: string; bankCode: string }; lookup: number }
    >({
      query: ({ body, lookup }) => ({
        url: `/wallets/bank-accounts?lookup=${lookup}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
    }),

    addWithdrawalAccount: builder.mutation<
      any,
      { body: { accountNumber: string; bankCode: string } }
    >({
      query: ({ body }) => ({
        url: `/wallets/bank-accounts`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
    }),

    initiateWithdrawal: builder.mutation<
      any,
      {
        body: { withdrawal_bank_account_id: number; amount: number };
        provider: string;
      }
    >({
      query: ({ body, provider }) => ({
        url: `/wallets/${provider}/withdrawals`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
    }),

    initiateWithdrawalPin: builder.mutation<
      any,
      {
        body: { withdrawal_bank_account_id: number; amount: number };
        provider: string;
      }
    >({
      query: ({ body, provider }) => ({
        url: `/wallets/${provider}/withdrawals`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
    }),

    getListOfAddedAccount: builder.query<any, void>({
      query: () => ({
        url: `/wallets/bank-accounts`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["beneficiary-list"],
    }),

    deleteWithdrawalAccount: builder.mutation<any, { walletId: number }>({
      query: ({ walletId }) => ({
        url: `/wallets/bank-accounts/${walletId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["beneficiary-list"],
    }),

    getUnpaidPaymentRequest: builder.query<any, { provider: string }>({
      query: ({ provider }) => ({
        url: `/wallets/${provider}/unpaid-payment-requests`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["unpaid-request"],
    }),

    getWalletTransactionAnalytics: builder.query<any, { provider: string }>({
      query: ({ provider }) => ({
        url: `/wallets/${provider}/analytics`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    initiateBankPaymentRequest: builder.mutation<
      any,
      { body: any; orderId: string; preview: number }
    >({
      query: ({ body, preview, orderId }) => ({
        url: `/orders/${orderId}/payment-request?preview=${preview}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
      invalidatesTags: ["unpaid-request"],
    }),

    transactionCharge: builder.mutation<
      void,
      { charge_customer: boolean; channel?: string; enabled: boolean }
    >({
      query: (body) => ({
        url: `/integrations/settings/payments/customer-charge`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["storeProfile"],
    }),

    getTodos: builder.query<TodosType[], void>({
      query: () => ({
        url: `/todos`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // Start of KYC

    linkBvn: builder.mutation<{ user: IStoreProfile }, { bvn: string }>({
      query: (body) => ({
        url: KYC_ROUTES.LINKBVN,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
    }),

    linkNin: builder.mutation<{ user: IStoreProfile }, { nin: string }>({
      query: (body) => ({
        url: KYC_ROUTES.LINKNIN,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
    }),

    verifyCac: builder.mutation<{ store: IStoreInformation }, CacField>({
      query: (body) => ({
        url: KYC_ROUTES.VERIFYCAC,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
    }),

    // Start of KYC service status Webhook
    kycCurrentState: builder.query<
      {
        success: boolean;
        data: {
          kyc_uptime: boolean;
          kyc_display_service_restored_banner: boolean;
        };
      },
      void
    >({
      query: () => ({
        url: `/websocket-connection/current-states`,
        method: "GET",
      }),
    }),
    // End of KYC service status Webhook

    // End of KYC

    // beginning of settings
    getInventorySetting: builder.query<
      { inventory_settings: InventorySettingsType },
      void
    >({
      query: () => ({
        url: `${INVENTORYSETTINGSROUTES.INVENTORYSETTINGS}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["inventory_setting"],
    }),

    getSingleInventorySetting: builder.query<
      { inventory_setting: InventorySettingsSection },
      string
    >({
      query: (code) => ({
        url: `${INVENTORYSETTINGSROUTES.INVENTORYSETTINGS}/${code}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["inventory_setting"],
    }),

    updateInventorySetting: builder.mutation<
      void,
      { inventory_settings: { id: number; value: any }[] }
    >({
      query: (body) => ({
        url: `${INVENTORYSETTINGSROUTES.INVENTORYSETTINGS}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["inventory_setting"],
    }),

    getProductSetting: builder.query<
      { inventory_settings: InventorySettingsType },
      void
    >({
      query: () => ({
        url: `${INVENTORYSETTINGSROUTES.INVENTORYSETTINGS}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["inventory_setting"],
    }),

    updateProductSetting: builder.mutation<
      void,
      { inventory_settings: { id: number; value: any }[] }
    >({
      query: (body) => ({
        url: `${INVENTORYSETTINGSROUTES.INVENTORYSETTINGS}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["product_setting"],
    }),

    //Start of Referrals
    activateReferral: builder.mutation<void, void>({
      query: () => ({
        url: REFERRAL_ROUTES.ACTIVATE_REFERRAL,
        method: "POST",
      }),
      invalidatesTags: ["storeProfile"],
    }),

    urlShortener: builder.mutation<any, { long_url: string }>({
      query: (body) => ({
        url: REFERRAL_ROUTES.URL_SHORTERNER,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
    }),

    getReferralAnalytics: builder.query<
      ReferralAnalyticsType,
      { from: string; to: string }
    >({
      query: ({ from, to }) => ({
        url: `${REFERRAL_ROUTES.ANALYTICS}?from=${from}&to=${to}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getStoreReferrals: builder.query<
      any,
      {
        from: string;
        to: string;
        status: string;
        search: string;
        limit: number;
        page: number;
      }
    >({
      query: ({ from, to, status, search, limit, page }) => ({
        url: `${REFERRAL_ROUTES.STORE_REFERALS}?from=${from}&to=${to}&status=${status}&search=${search}&page=${page}&limit=${limit}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    //End of referrals

    // Start of Terminal
    getCheckoutTerminal: builder.query<any, void>({
      query: () => ({
        url: TERMINAL_ROUTES.GET_CHECKOUT_TERMINALS,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["checkout_terminal"],
    }),

    getStoreTerminals: builder.query<any, void>({
      query: () => ({
        url: TERMINAL_ROUTES.GET_STORE_TERMINALS,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    checkLinkTerminal: builder.query<any, { account_number: string }>({
      query: ({ account_number }) => ({
        url: `${TERMINAL_ROUTES.CHECK_LINK}?account_number=${account_number}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    linkTerminal: builder.mutation<any, { account_number: string }>({
      query: (body) => ({
        url: TERMINAL_ROUTES.LINK_TERMINAL,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
      invalidatesTags: ["checkout_terminal"],
    }),

    getTerminal: builder.mutation<any, { whatsapp_numbers: string[] }>({
      query: (body) => ({
        url: TERMINAL_ROUTES.GET_TERMINAL,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
      invalidatesTags: ["checkout_terminal"],
    }),

    addNotificationNumber: builder.mutation<
      any,
      { terminal_id: number; whatsapp_numbers: string[] }
    >({
      query: (body) => ({
        url: TERMINAL_ROUTES.ADD_NOTIFICATION_NUMBER,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
      invalidatesTags: ["checkout_terminal"],
    }),

    removeNotificationNumber: builder.mutation<
      any,
      { terminal_id: number; whatsapp_numbers: string[] }
    >({
      query: (body) => ({
        url: TERMINAL_ROUTES.REMOVE_NOTIFICATION_NUMBER,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }),
      invalidatesTags: ["checkout_terminal"],
    }),
    // End of Terminal
  }),
});

export const {
  useSetdefaultLocationMutation,
  useAddCouponToCartMutation,
  useCreateLocationMutation,
  useDeleteLocationMutation,
  useEditLocationMutation,
  useDeactivateLocationMutation,
  useReactivateLocationMutation,
  useGetLocationsQuery,
  useGetSingleLocationQuery,
  useDiscountValidityMutation,
  useGenerateApiKeyMutation,
  useAllAnalyticsSummaryQuery,
  useGetLoggedInUserQuery,
  useAnalyticsQuery,
  useSalesAnalyticsQuery,
  useAnalyticssummaryQuery,
  useStatsallQuery,
  useStatsviewQuery,
  useStatshomeQuery,
  usePostProductImageMutation,
  useDeleteProductImageMutation,
  useGetProductQuery,
  useGetSingleProductQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
  useGetStoreProfileQuery,
  useUpdateStoreProfileMutation,
  useDeleteStoreProfileMutation,
  useRestoreStoreProfileMutation,
  useUpdateStoreProfilePasswordMutation,
  useUploadProfileAvatarMutation,
  useSetMaintenanceModeMutation,
  useUploadGeneralImageMutation,
  useGetNotificationsQuery,
  useDismissNotificationQuery,
  useMarkAllAsReadMutation,
  useMarkSingleAsReadMutation,
  useGetPlansQuery,
  useGetSubscriptionHistoryQuery,
  useUnSubscribeMutation,
  useInitiatePaymentMutation,
  useRenewPlanMutation,
  useUpgradePlanMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetOrdersQuery,
  useCreateOrdersMutation,
  useDeleteOrdersMutation,
  useEditOrdersMutation,
  useGetSingleOrdersQuery,
  useActionOrdersMutation,
  useRequestOrderPaymentMutation,
  useCreateCustomerGroupMutation,
  useEditCustomerGroupMutation,
  useDeleteCustomerGroupMutation,
  useGetCustomerGroupsQuery,
  useGetInvalidCustomersQuery,
  useLazyGetInvalidCustomersQuery,
  useGetSingleCustomerGroupQuery,
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useEditCustomerMutation,
  useGetCustomersQuery,
  useGetSingleCustomerQuery,
  useGetCountriesQuery,
  useGetStatesQuery,
  useCreateShippingMutation,
  useDeleteShippingMutation,
  useEditShippingMutation,
  useGetShippingQuery,
  useCreateTaxMutation,
  useDeleteTaxMutation,
  useEditTaxMutation,
  useGetTaxQuery,
  useGetSingleTaxQuery,
  useCreateTransactionMutation,
  useGetTransactionQuery,
  useGetSettlementsQuery,
  useGetSingleSettlementQuery,
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
  useDeleteProductFromCollectionMutation,
  useEditCollectionMutation,
  useGetCollectionsQuery,
  useGetSingleCollectionQuery,
  useGetStoreInformationQuery,
  useUpdateStoreInformationMutation,
  useGetBankSettingsQuery,
  useGetBankListsQuery,
  useUpdateBankSettingsMutation,
  useGetPaymentSettingQuery,
  useGetPaymentMethodsQuery,
  useSavePaymentSettingsMutation,
  useGetPixelCodeQuery,
  useSavePixelCodeMutation,
  useDisconnectPixelMutation,
  useGetMetaIntegrationQuery,
  usePostMetaCallbackMutation,
  useGetCampaignsQuery,
  useCreateCampaignsMutation,
  useCreateDiscountMutation,
  useDeleteDiscountMutation,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useAddItemCouponMutation,
  useRemoveItemCouponMutation,
  useGetDiscountsQuery,
  useAddItemDiscountMutation,
  useRemoveItemDiscountMutation,
  useGetSingleDiscountQuery,
  useGetCouponsQuery,
  useGetSingleCouponQuery,
  useGetStaffAccountsQuery,
  useReactivateStaffMutation,
  useDeleteStaffAccountMutation,
  useCreateStaffAccountMutation,
  useGetStaffActivitiesQuery,
  useUpdateStaffAccountMutation,
  useSetAppFlagMutation,
  useConfirmMailMutation,
  useGetStoreLayoutQuery,
  useUpdateStoreLayoutMutation,
  useGetStoreThemeColorQuery,
  useUpdateStoreThemeMutation,
  useGetCurrenciesQuery,
  usePostMediaUploadMutation,
  useSendInstagramWebhookAuthorizationMutation,
  useGetNewsLetterQuery,
  useDeleteNewsLetterMutation,
  useVerifyMailQuery,
  useGetApikeyQuery,
  useDisconnectMetaMutation,
  useSetDeviceTokenMutation,
  useGetSingleProductHistoryByStatusQuery,
  useGetSingleProductActivitiesQuery,
  useGetSingleProductHistoryQuery,
  useUpdateProductStockMutation,
  useCreateDnsMutation,
  useEditDnsMutation,
  useDeleteDnsMutation,
  useGetDnsListQuery,
  useEditFreeUrlMutation,
  useGetDomainListQuery,
  useGetDomainPaymentListQuery,
  useGetSingleDomainQuery,
  useInitiateDomainPaymentMutation,
  useSearchDomainMutation,
  usePublishUrlMutation,
  useConnectDomainMutation,
  useGetCityByStateIDQuery,
  useGetStatesByCountryIDQuery,
  useMoveInventoryMutation,
  useGetSingleLocationStatsQuery,
  useGetLocationActivitiesQuery,
  useSwitchLocationMutation,
  useLinkExistingBarcodeMutation,
  usePrintBarCodeMutation,
  useVerifyBVNMutation,
  useCreateTransactionPinMutation,
  useChangeTransactionPinMutation,
  useSetTransactionLimitMutation,
  useSendBVNOtpPinMutation,
  useGetWalletDetailsQuery,
  useGetWalletTransactionsQuery,
  useGetSingleWalletTransactionsDetailsQuery,
  useGetListOfFincraBankQuery,
  useLookUpWithdrawalAccountMutation,
  useAddWithdrawalAccountMutation,
  useInitiateWithdrawalMutation,
  useGetListOfAddedAccountQuery,
  useDeleteWithdrawalAccountMutation,
  useGetUnpaidPaymentRequestQuery,
  useGetWalletTransactionAnalyticsQuery,
  useGetAccounStatementMutation,
  useInitiateBankPaymentRequestMutation,
  useGetWrappedMutation,
  useTransactionSummaryQuery,
  useMatchOrderMutation,
  useTransactionChargeMutation,
  useGetExtraLocationAmtMutation,
  usePayForExtraMutation,
  useRefundOrderMutation,
  useResendStaffEmailMutation,
  useDuplicateShippingMutation,
  useGetProductLedgerQuery,
  useGetVariationProductLedgerQuery,
  useGetSingleProductVariationQuery,
  useGetSingleProductLedgerSummaryQuery,
  useGetSingleVariationLedgerSummaryQuery,
  useGetUserLocationsQuery,
  useGetIntegrationScriptQuery,
  useDisconnectIntegrationScriptMutation,
  useSaveIntegrationScriptMutation,
  useResolveOrderMutation,
  useGetInventorySettingQuery,
  useUpdateInventorySettingMutation,
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useEditNoteMutation,
  useGetNotesQuery,
  useGetSingleNoteQuery,
  useToggleNoteMutation,
  useGetThemesQuery,
  useGetMarketPlaceThemesQuery,
  useGetSingleThemeQuery,
  useUpdateThemeMutation,
  useActivateThemeMutation,
  useUninstallThemeMutation,
  useGetMarketPlaceSingleThemeQuery,
  useGetTodosQuery,
  useLinkBvnMutation,
  useLinkNinMutation,
  useVerifyCacMutation,
  useGetSingleDiscountItemQuery,
  useGetSingleCouponItemQuery,
  useExportCsvMutation,
  useGetSingleInventorySettingQuery,
  useEstimateCampaignCreditMutation,
  useKycCurrentStateQuery,
  useGetShippingSettingQuery,
  useUpdateShippingSettingsMutation,
  useGetShipBubbleSettingsQuery,
  useUpdateShipbubbleSettingsMutation,
  useCreatePickupLocationMutation,
  useDeletePickupLocationMutation,
  useEditPickupLocationMutation,
  useGetPickupLocationQuery,
  useGetShipbubbleCategoriesQuery,
  useGetShipbubbleBoxSizeQuery,
  useGetShipbubbleCourierQuery,
  useGetSingleCampaignQuery,
  useDeleteBulkProductMutation,
  useBulkEditProductMutation,
  useLoadCourierMutation,
  useGetCustomerPickupLocationQuery,
  useSubmitCourierMutation,
  useGetReferralAnalyticsQuery,
  useGetStoreReferralsQuery,
  useActivateReferralMutation,
  useUrlShortenerMutation,
  useGetStoreTerminalsQuery,
  useGetCheckoutTerminalQuery,
  useLazyCheckLinkTerminalQuery,
  useLinkTerminalMutation,
  useGetTerminalMutation,
  useAddNotificationNumberMutation,
  useRemoveNotificationNumberMutation,
  useResendFailedCampaignsMutation,
  useGetCreditPlanQuery,
  usePurchaseCreditMutation,
  useGetSingleCampaignV2Query,
} = generalApi;
