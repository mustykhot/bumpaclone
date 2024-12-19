import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store.types";

type ToastType = {
  id: string;
  notificationText: null | string;
  isNotificationOpen: boolean;
};

type toastPayloadType = {
  notificationText: string;
  id: string;
};

const initialState: ToastType[] = [];

// toasts slice
const notificationToastSlice = createSlice({
  name: "notificationToasts",
  initialState,
  reducers: {
    toastNotificationMessage: (
      state,
      { payload }: PayloadAction<toastPayloadType>
    ) => {
      state.push({
        notificationText: payload.notificationText,
        isNotificationOpen: true,
        id: payload.id,
      });
    },
    hideNotificationToast: (state, { payload }: PayloadAction<string>) => {
      state = state.map((toast) => {
        if (toast.id === payload) {
          toast.isNotificationOpen = false;
        }
        return toast;
      });
    },
    removeNotificationToast: (state, { payload }: PayloadAction<string>) => {
      let index = state.findIndex((el) => el.id === payload);
      state.splice(index, 1);
    },
  },
});

const { actions, reducer } = notificationToastSlice;
export const {
  toastNotificationMessage,
  removeNotificationToast,
  hideNotificationToast,
} = actions;
export const selectNotificationToasts = (state: RootState) =>
  state.notificationToasts;

export default reducer;
