import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.types";

type initialStateType = {
  isMaintenanceModeEnabled: boolean;
};

const initialState: initialStateType = {
  isMaintenanceModeEnabled: false,
};

const maintenanceSlice = createSlice({
  name: "maintenance",
  initialState,
  reducers: {
    setIsMaintenanceModeEnabled(state, action) {
      state.isMaintenanceModeEnabled = action.payload;
    },
  },
});

const { actions, reducer } = maintenanceSlice;

export const { setIsMaintenanceModeEnabled } = actions;

export const selectIsMaintenanceModeEnabled = (state: RootState) =>
  state.maintenance.isMaintenanceModeEnabled;

export default reducer;
