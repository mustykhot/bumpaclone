import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store.types";
import { IShipBubbleSetting, IShippingSettings } from "services/api.types";
type initialStateType = {
  fields: IShippingSettings | null;
  fieldsToUpdate: IShippingSettings;
  shipbubbleFields: IShipBubbleSetting | null;
  shipBubbleFieldsToUpdate: IShipBubbleSetting;
};
const initialState: initialStateType = {
  fields: null,
  fieldsToUpdate: {
    use_delivery_timeline: false,
    delivery_days: [],
    same_day_delivery: false,
    processing_days: "",
    reminder_days: "1",
    checkout_note: "",
    automated_shipping: false,
    shipping_mode: "",
    automated_shipping_location_type: "",
    automated_shipping_locations: [],
    default_weight_kg: "",
  },
  shipbubbleFields: null,
  shipBubbleFieldsToUpdate: {
    couriers: [],
    default_box_size: "",
    custom_box_size: {
      height: "",
      width: "",
      weight: "",
      length: "",
      name: "",
    },
    shipping_categories: [],
  },
};
const shippingSettingsSlice = createSlice({
  name: "shippingSetting",
  initialState,
  reducers: {
    initialShippingSettingUpdate(state, { payload }: PayloadAction<any>) {
      state.fields = { ...state.fields, ...payload };
    },
    updateShippingSettingState(state, { payload }: PayloadAction<any>) {
      state.fieldsToUpdate = { ...state.fieldsToUpdate, ...payload };
    },
    initialShipbubbleShippingSettingUpdate(
      state,
      { payload }: PayloadAction<any>
    ) {
      state.shipbubbleFields = { ...state.shipbubbleFields, ...payload };
    },
    updateShipbubbleShippingSettingState(
      state,
      { payload }: PayloadAction<any>
    ) {
      state.shipBubbleFieldsToUpdate = {
        ...state.shipBubbleFieldsToUpdate,
        ...payload,
      };
    },
  },
});
const { actions, reducer } = shippingSettingsSlice;
export const {
  updateShippingSettingState,
  initialShippingSettingUpdate,
  initialShipbubbleShippingSettingUpdate,
  updateShipbubbleShippingSettingState,
} = actions;
export const selectSettingsField = (state: RootState) =>
  state.shippingSetting.fields;
export const selectSettingsUpdateField = (state: RootState) =>
  state.shippingSetting.fieldsToUpdate;
export const selectShipbubbleSettingsField = (state: RootState) =>
  state.shippingSetting.shipbubbleFields;
export const selectShipbubbleSettingsUpdateField = (state: RootState) =>
  state.shippingSetting.shipBubbleFieldsToUpdate;
export default reducer;
