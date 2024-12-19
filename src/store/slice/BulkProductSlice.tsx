import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.types";
type initialStateType = {
  bulkProduct: any[] | [];
};
const initialState: initialStateType = { bulkProduct: [] };
const bulkProductSlice = createSlice({
  name: "bulkProduct",
  initialState,
  reducers: {
    addToBulkProduct(state, action) {
      state.bulkProduct = action.payload;
    },
  },
});
const { actions, reducer } = bulkProductSlice;
export const { addToBulkProduct } = actions;
export const selectBulkProduct = (state: RootState) =>
  state.bulkProduct.bulkProduct;

export default reducer;
