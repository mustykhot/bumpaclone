import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.types";
type initialStateType = {
  cartItems: any[];
  cartTotalAmount: number;
  settlementData: any;
};
const initialState: initialStateType = {
  cartItems: [],
  cartTotalAmount: 0,
  settlementData: null,
};
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    initialAddToCart(state, action) {
      state.cartItems = action.payload;
    },
    setDataToSettlementData(state, action) {
      state.settlementData = action.payload;
    },

    addToCart(state, action) {
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
        }
      } else {
        const tempProduct = { ...action.payload, quantity: 1 };
        state.cartItems.push(tempProduct);
      }
    },
    decreaseCart(state, action) {
      // check if item is in cart
      const itemIndex = state.cartItems.findIndex((item) => {
        return item.id === action.payload.id;
      });
      if (state.cartItems[itemIndex].quantity > 1) {
        state.cartItems[itemIndex].quantity -= 1;
      } else if (state.cartItems[itemIndex].quantity === 1) {
        const nextCartItems = state.cartItems.filter(
          (cartItem) => cartItem.id !== action.payload.id
        );
        state.cartItems = nextCartItems;
      }
    },

    getTotals(state) {
      let { total } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, quantity } = cartItem;
          const itemTotal = parseInt(price) * parseInt(quantity);

          cartTotal.total += Number(itemTotal);
          cartTotal.quantity += Number(quantity);
          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        }
      );
      state.cartTotalAmount = total;
    },
    clearCart(state) {
      state.cartItems = [];
      state.cartTotalAmount = 0;
    },
  },
});
const { actions, reducer } = orderSlice;
export const {
  addToCart,
  decreaseCart,
  getTotals,
  initialAddToCart,
  clearCart,
  setDataToSettlementData,
} = actions;
export const selectProductItems = (state: RootState) => state.order.cartItems;

export const selectSettlementData = (state: RootState) =>
  state.order.settlementData;
export const selectTotal = (state: RootState) => state.order.cartTotalAmount;

export default reducer;
