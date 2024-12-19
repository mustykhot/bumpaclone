import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.types";
import { AppNotificationProps } from "Templates/DashboardLayout/Navbar/Notifications/appnotification";

type initialStateType = {
  articles: any[] | [];
  appnotification: AppNotificationProps[] | [];
  showIndicator: boolean;
  isTour: boolean;
  isWalletTour: boolean;
  isGrowthTour: boolean;
  isFirstLogin: boolean;
  showGrowth: boolean;
  showReferralModal: boolean;
  isPaymentMethodsTour: boolean;
};

const initialState: initialStateType = {
  articles: [],
  appnotification: [],
  isTour: false,
  isWalletTour: false,
  isGrowthTour: false,
  isFirstLogin: false,
  showIndicator: false,
  showGrowth: false,
  showReferralModal: false,
  isPaymentMethodsTour: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addToArticles(state, action) {
      state.articles = action.payload;
    },
    addToAppNotification(state, action) {
      state.appnotification = action.payload;
    },
    setShowIndicator(state, action) {
      state.showIndicator = action.payload;
    },
    setIsTour(state, action) {
      state.isTour = action.payload;
    },
    setIsWalletTour(state, action) {
      state.isWalletTour = action.payload;
    },
    setIsGrowthTour(state, action) {
      state.isGrowthTour = action.payload;
    },
    setIsFirstLogin(state, action) {
      state.isFirstLogin = action.payload;
    },
    setShowGrowth(state, action) {
      state.showGrowth = action.payload;
    },
    setShowReferralModal(state, action) {
      state.showReferralModal = action.payload;
    },
    setIsPaymentMethodsTour(state, action) {
      state.isPaymentMethodsTour = action.payload;
    },
  },
});

const { actions, reducer } = notificationSlice;

export const {
  addToAppNotification,
  addToArticles,
  setIsTour,
  setIsWalletTour,
  setIsGrowthTour,
  setIsFirstLogin,
  setShowIndicator,
  setShowGrowth,
  setShowReferralModal,
  setIsPaymentMethodsTour,
} = actions;

export const selectArticles = (state: RootState) => state.notification.articles;
export const selectIsTour = (state: RootState) => state.notification.isTour;
export const selectShowGrowth = (state: RootState) =>
  state.notification.showGrowth;
export const selectIsWalletTour = (state: RootState) =>
  state.notification.isWalletTour;
export const selectIsGrowthTour = (state: RootState) =>
  state.notification.isGrowthTour;
export const selectIsFirstLogin = (state: RootState) =>
  state.notification.isFirstLogin;
export const selectAppNotification = (state: RootState) =>
  state.notification.appnotification;
export const selectShowIndicator = (state: RootState) =>
  state.notification.showIndicator;
export const selectShowReferralModal = (state: RootState) =>
  state.notification.showReferralModal;
export const selectIsPaymentMethodsTour = (state: RootState) =>
  state.notification.isPaymentMethodsTour;

export default reducer;
