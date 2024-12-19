import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.types";
import { AnyObject } from "Models";
type initialStateType = {
  themeConfigData: AnyObject;
  themeConfigErrors: AnyObject;
};
const initialState: initialStateType = {
  themeConfigData: {},
  themeConfigErrors: {},
};
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeConfigData: (state, { payload }) => {
      state.themeConfigData = payload;
    },
    setThemeConfigErrorsSuccess: (state, { payload }) => {
      state.themeConfigErrors = payload;
    },
  },
});
const { actions, reducer } = themeSlice;
export const { setThemeConfigData, setThemeConfigErrorsSuccess } = actions;
export const selectThemeConfigData = (state: RootState) =>
  state.theme.themeConfigData;
export const selectThemeConfigErrors = (state: RootState) =>
  state.theme.themeConfigErrors;

export default reducer;
