import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store.types";

export type messageType = "success" | "error" | "warning";

type ToastType = {
  id: string;
  text: null | string;
  messageType: messageType;
  isOpen: boolean;
};

type toastPayloadType = {
  text: string;
  messageType: messageType;
  id: string;
};

const initialState: ToastType[] = [];

// toasts slice
const toastSlice = createSlice({
  name: "toasts",
  initialState,
  reducers: {
    toastMessage: (state, { payload }: PayloadAction<toastPayloadType>) => {
      state.push({
        text: payload.text,
        messageType: payload.messageType,
        isOpen: true,
        id: payload.id,
      });
    },
    hideToast: (state, { payload }: PayloadAction<string>) => {
      state = state.map((toast) => {
        if (toast.id === payload) {
          toast.isOpen = false;
        }
        return toast;
      });
    },
    removeToast: (state, { payload }: PayloadAction<string>) => {
      let index = state.findIndex((el) => el.id === payload);
      state.splice(index, 1);
    },
  },
});

const { actions, reducer } = toastSlice;
export const { toastMessage, removeToast, hideToast } = actions;
export const selectToasts = (state: RootState) => state.toasts;

export default reducer;
