import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.types";
import { CustomerType, TaxType } from "services/api.types";
import { OrderType } from "Models/order";
export type PosItemsType = {
  discount?: string | null;
  discount_type?: string | null;
  discount_val?: string | null;
  id: string;
  name: string;
  price: number;
  variant?: string;
  quantity: number;
  itemId?: string;
  total: number;
  image: string;
  options?: string;
  stock: number;
  amountLeft: number;
  url: string;
  unit: string;
  description: string;
  variantName?: string;
};
type initialStateType = {
  cartItems: PosItemsType[];
  total: number;
  sub_total: number;
  cartDiscountType: string;
  taxes: TaxType[];
  totalTax: number;
  customerDetails: CustomerType | null;
  cartDiscountValue: null | number;
  cartDiscount: null | number;
  cartDiscountAndCartTotalAmount: null | number;
  activeCartDiscount: string;
  couponCode: string;
  cartPaymentMethod: string | null;
  bankPaymentRecieved: string | null;
  discount: { type: string; value: number | null };
  bankMultiplePaymentRecieved: string | null;
  secondBankMultiplePaymentRecieved: string | null;
  orderToCompletePayment: null | OrderType;
};
const initialState: initialStateType = {
  cartItems: [],
  total: 0,
  sub_total: 0,
  taxes: [],
  totalTax: 0,
  customerDetails: null,
  cartDiscountValue: null,
  cartDiscountType: "",
  cartDiscount: null,
  cartDiscountAndCartTotalAmount: null,
  activeCartDiscount: "",
  couponCode: "",
  cartPaymentMethod: "BANK",
  discount: { type: "", value: null },
  bankPaymentRecieved: null,
  bankMultiplePaymentRecieved: null,
  secondBankMultiplePaymentRecieved: null,
  orderToCompletePayment: null,
};
const posSlice = createSlice({
  name: "pos",
  initialState,
  reducers: {
    bulkAddToPosCart(state, action) {
      state.cartItems = action.payload;
    },
    addOrderToCompletePayment(state, action) {
      state.orderToCompletePayment = action.payload;
    },
    setBankPaymentRecieved(state, action) {
      state.bankPaymentRecieved = action.payload;
    },
    setBankMultiplePaymentRecieved(state, action) {
      state.bankMultiplePaymentRecieved = action.payload;
    },
    setSecondBankMultiplePaymentRecieved(state, action) {
      state.secondBankMultiplePaymentRecieved = action.payload;
    },
    addCustomerDetails(state, action) {
      state.customerDetails = action.payload;
    },
    setActiveCartDiscount(state, action) {
      state.activeCartDiscount = action.payload;
    },
    setCartPaymentMethod(state, action) {
      state.cartPaymentMethod = action.payload;
    },
    setCartDiscount(state, action) {
      state.cartDiscountValue = action.payload.discount_val;
      state.cartDiscountType = action.payload.discount_type;
      state.cartDiscount = action.payload.discount;
      state.couponCode = action.payload.couponCode;
    },
    setDiscount(state, action) {
      state.discount = action.payload;
    },
    setCartDiscountAndCartTotalAmount(state, action) {
      state.cartDiscountAndCartTotalAmount = action.payload;
    },
    addTaxes(state, action) {
      state.taxes = action.payload;
    },
    clearTaxes(state) {
      state.taxes = [];
      state.totalTax = 0;
    },
    removeDiscount(state) {
      state.cartDiscountAndCartTotalAmount = null;
      state.cartDiscountValue = null;
      state.discount = { type: "", value: null };
      state.activeCartDiscount = "";
      state.couponCode = "";
      state.cartItems = state.cartItems.map((item) => {
        return {
          ...item,
          discount: null,
          discount_val: null,
          discount_type: null,
        };
      });
    },
    addTotalTax(state, action) {
      state.totalTax = action.payload;
      state.total = (action.payload / 100) * state.sub_total + state.sub_total;
    },
    addToPosCart(state, action) {
      // check if item is in cart
      const itemIndex = state.cartItems.findIndex((item) => {
        return item.id === action.payload.id;
      });
      if (itemIndex >= 0) {
        if (
          state.cartItems[itemIndex].quantity + 1 >
          Number(action.payload.stock)
        ) {
          state.cartItems[itemIndex].quantity =
            state.cartItems[itemIndex].quantity;
        } else {
          state.cartItems[itemIndex].quantity += 1;
          state.cartItems[itemIndex].total =
            state.cartItems[itemIndex].price *
            state.cartItems[itemIndex].quantity;
          if (state.cartItems[itemIndex].amountLeft) {
            state.cartItems[itemIndex].amountLeft -= 1;
          } else {
            state.cartItems[itemIndex].amountLeft =
              state.cartItems[itemIndex].stock - 1;
          }
        }
      } else {
        const tempProduct = {
          ...action.payload,
          quantity: action.payload.quantity || 1,
        };
        state.cartItems.push(tempProduct);
      }
    },
    decreasePosCart(state, action) {
      // check if item is in cart
      const itemIndex = state.cartItems.findIndex((item) => {
        return item.id === action.payload.id;
      });
      if (state.cartItems[itemIndex].quantity > 1) {
        state.cartItems[itemIndex].quantity -= 1;
        state.cartItems[itemIndex].total =
          state.cartItems[itemIndex].price *
          state.cartItems[itemIndex].quantity;
        state.cartItems[itemIndex].amountLeft += 1;
      } else if (state.cartItems[itemIndex].quantity === 1) {
        const nextCartItems = state.cartItems.filter(
          (cartItem) => cartItem.id !== action.payload.id
        );
        state.cartItems = nextCartItems;
      }
    },
    inputPosCartQuantity(state, action) {
      // check if item is in cart
      const itemIndex = state.cartItems.findIndex((item) => {
        return item.id === action.payload.id;
      });
      state.cartItems[itemIndex].amountLeft =
        state.cartItems[itemIndex].stock - action.payload.input;
      state.cartItems[itemIndex].quantity = action.payload.input;
      state.cartItems[itemIndex].total =
        state.cartItems[itemIndex].price * state.cartItems[itemIndex].quantity;
    },
    removeItemFromPosCart(state, action) {
      const nextCartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== action.payload.id
      );
      state.cartItems = nextCartItems;
    },

    getPosTotals(state) {
      let { total } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, quantity } = cartItem;
          const itemTotal = Number(price) * Number(quantity);
          cartTotal.total += Number(itemTotal);
          cartTotal.quantity += Number(quantity);
          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        }
      );
      state.total = total;
      state.sub_total = total;
    },
    clearPosCart(state) {
      state.cartItems = [];
      state.total = 0;
      state.sub_total = 0;
    },

    clearEntireCart(state) {
      state.cartItems = [];
      state.total = 0;
      state.sub_total = 0;
      state.customerDetails = null;
      state.cartDiscountValue = null;
      state.cartDiscountType = "";
      state.cartDiscount = null;
      state.cartDiscountAndCartTotalAmount = null;
      state.activeCartDiscount = "";
      state.cartPaymentMethod = "BANK";
      state.discount = { type: "", value: null };
      state.bankPaymentRecieved = null;
      state.bankMultiplePaymentRecieved = null;
      state.secondBankMultiplePaymentRecieved = null;
    },
  },
});
const { actions, reducer } = posSlice;
export const {
  clearEntireCart,
  addToPosCart,
  decreasePosCart,
  getPosTotals,
  bulkAddToPosCart,
  clearPosCart,
  removeItemFromPosCart,
  addTaxes,
  addTotalTax,
  addCustomerDetails,
  setCartDiscountAndCartTotalAmount,
  setCartDiscount,
  removeDiscount,
  setActiveCartDiscount,
  setCartPaymentMethod,
  inputPosCartQuantity,
  clearTaxes,
  setDiscount,
  setBankPaymentRecieved,
  setBankMultiplePaymentRecieved,
  setSecondBankMultiplePaymentRecieved,
  addOrderToCompletePayment,
} = actions;
export const selectOrderToCompletePayment = (state: RootState) =>
  state.pos.orderToCompletePayment;
export const selectActiveCartDiscount = (state: RootState) =>
  state.pos.activeCartDiscount;
export const selectBankMultiplePaymentReceived = (state: RootState) =>
  state.pos.bankMultiplePaymentRecieved;
export const selectSecondBankMultiplePaymentReceived = (state: RootState) =>
  state.pos.secondBankMultiplePaymentRecieved;
export const selectCouponCode = (state: RootState) => state.pos.couponCode;
export const selectBankPaymentReceived = (state: RootState) =>
  state.pos.bankPaymentRecieved;
export const selectPosCartItems = (state: RootState) => state.pos.cartItems;
export const selectPosCartTotal = (state: RootState) => state.pos.total;
export const selectPosCartSubTotal = (state: RootState) => state.pos.sub_total;
export const selectTotalTax = (state: RootState) => state.pos.totalTax;
export const selectTaxList = (state: RootState) => state.pos.taxes;
export const selectCartDiscountValue = (state: RootState) =>
  state.pos.cartDiscountValue;
export const selectCartDiscount = (state: RootState) => state.pos.cartDiscount;
export const selectCartDiscountType = (state: RootState) =>
  state.pos.cartDiscountType;
export const selectCartDiscountAndCartTotalAmount = (state: RootState) =>
  state.pos.cartDiscountAndCartTotalAmount;

export const selectCartPaymentMethod = (state: RootState) =>
  state.pos.cartPaymentMethod;

export const selectDiscount = (state: RootState) => state.pos.discount;

export const selectCustomerDetails = (state: RootState) =>
  state.pos.customerDetails;

export default reducer;
