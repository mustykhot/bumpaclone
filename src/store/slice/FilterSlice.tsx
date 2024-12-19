import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.types";
type initialStateType = {
  orderFilters:
    | {
        date?: any;
        order_status?: any;
        payment_status?: any;
        shipping_status?: any;
        channel?: any;
        page?: number;
        should_resolve?: boolean | string;
      }
    | any;
  productFilters:
    | {
        search: string;
        status: string;
        min_stock: null | string;
        max_stock: null | string;
        collection: string;
        page: number;
      }
    | any;
  customerFilters:
    | {
        search: string;
        page: number;
        field: string;
      }
    | any;
  discountFilters:
    | {
        search: string;
        page: number;
        status: string;
        expired?: number;
      }
    | any;
  couponFilters:
    | {
        search: string;
        page: number;
        status: string;
        expired: number;
      }
    | any;
  transactionFilters:
    | {
        search: string;
        page: number;
        channel: string;
        dateRange: { from_date: string; to_date: string } | null;
      }
    | any;
  settlementFilters:
    | {
        search: string;
        page: number;
        channel: string;
        dateRange: { from_date: string; to_date: string } | null;
      }
    | any;
  referralFilters:
    | {
        page: number;
        search: string;
        status: string;
        dateRange: { from_date: string; to_date: string } | null;
      }
    | any;
};
const initialState: initialStateType = {
  orderFilters: {
    date: null,
    order_status: "",
    payment_status: "PAID,PARTIALLY_PAID",
    shipping_status: "",
    channel: "",
    search: "",
    page: 1,
    should_resolve: "",
  },
  productFilters: {
    search: "",
    status: "",
    collection: "",
    min_stock: "",
    max_stock: "",
    page: 1,
  },
  customerFilters: {
    page: 1,
    search: "",
    newsLetterPage: 1,
    newsLetterSearch: "",
    field: "",
  },
  discountFilters: {
    page: 1,
    expired: 0,
    status: "",
    search: "",
  },
  couponFilters: {
    page: 1,
    expired: null,
    status: "",
    search: "",
  },
  transactionFilters: {
    page: 1,
    dateRange: null,
    channel: "",
    search: "",
  },
  settlementFilters: {
    page: 1,
    dateRange: null,
    search: "",
  },
  referralFilters: {
    page: 1,
    search: "",
    status: "",
    dateRange: null,
  },
};
const orderSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    addOrderFilter(state, { payload }: PayloadAction<any>) {
      state.orderFilters = { ...state.orderFilters, ...payload };
    },
    addProductFilter(state, { payload }: PayloadAction<any>) {
      state.productFilters = { ...state.productFilters, ...payload };
    },
    addCustomerFilter(state, { payload }: PayloadAction<any>) {
      state.customerFilters = { ...state.customerFilters, ...payload };
    },
    addDiscountFilter(state, { payload }: PayloadAction<any>) {
      state.discountFilters = { ...state.discountFilters, ...payload };
    },
    addCouponFilter(state, { payload }: PayloadAction<any>) {
      state.couponFilters = { ...state.couponFilters, ...payload };
    },
    addTransactionFilter(state, { payload }: PayloadAction<any>) {
      state.transactionFilters = { ...state.transactionFilters, ...payload };
    },
    addSettlementFilter(state, { payload }: PayloadAction<any>) {
      state.settlementFilters = { ...state.settlementFilters, ...payload };
    },
    addReferralFilter(state, { payload }: PayloadAction<any>) {
      state.referralFilters = { ...state.referralFilters, ...payload };
    },
  },
});
const { actions, reducer } = orderSlice;
export const {
  addOrderFilter,
  addProductFilter,
  addCustomerFilter,
  addCouponFilter,
  addDiscountFilter,
  addTransactionFilter,
  addSettlementFilter,
  addReferralFilter,
} = actions;
export const selectOrderFilters = (state: RootState) =>
  state.filters.orderFilters;
export const selectProductFilters = (state: RootState) =>
  state.filters.productFilters;
export const selectCustomerFilters = (state: RootState) =>
  state.filters.customerFilters;
export const selectDiscountFilters = (state: RootState) =>
  state.filters.discountFilters;
export const selectCouponFilters = (state: RootState) =>
  state.filters.couponFilters;
export const selectTransactionFilters = (state: RootState) =>
  state.filters.transactionFilters;
export const selectSettlementFilters = (state: RootState) =>
  state.filters.settlementFilters;
export const selectReferralFilters = (state: RootState) =>
  state.filters.referralFilters;

export default reducer;
