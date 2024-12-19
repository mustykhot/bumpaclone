import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocationType } from "Models/order";
import { IStoreInformation, IStoreProfile } from "Models/store";
import { RootState } from "../store.types";

type AuthType = {
  user: IStoreProfile | null;
  token: string | undefined;
  store_id: number | null;
  store: IStoreInformation | null;
  isLoggedIn: boolean;
  isSubscriptionExpired: boolean;
  isSubscriptionCancelled: boolean;
  isSubscriptionExpiring: boolean;
  isSubscriptionType: string;
  isSubscriptionDets: any | null;
  isWithinNoticePeriod: boolean;
  remainingDays: number | null;
  isFreeTrial: boolean;
  isFreeTrialExpired: boolean;
  isFreeTrialExpiring: boolean;
  remainingFreeTrialDays: number | null;
  userLocation: {
    name: string;
    id: number;
    address: string;
    city: string;
    country: string;
    state: string;
  } | null;
  userAssignedLocations: LocationType[];
  permissions: {
    orders: { view: boolean; manage: boolean };
    messaging: { view: boolean; manage: boolean };
    products: { view: boolean; manage: boolean };
    analytics: { view: boolean };
  };
};

const initialState: AuthType = {
  user: null,
  token: "",
  isLoggedIn: false,
  store_id: null,
  store: null,
  userLocation: null,
  userAssignedLocations: [],
  isSubscriptionCancelled: false,
  isSubscriptionExpired: false,
  isSubscriptionExpiring: false,
  isSubscriptionType: "",
  isSubscriptionDets: null,
  isWithinNoticePeriod: false,
  remainingDays: null,
  isFreeTrial: false,
  isFreeTrialExpired: false,
  isFreeTrialExpiring: false,
  remainingFreeTrialDays: null,
  permissions: {
    orders: { view: true, manage: true },
    messaging: { view: true, manage: true },
    products: { view: true, manage: true },
    analytics: { view: true },
  },
};

// auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserDetails: (
      state,
      { payload: user }: PayloadAction<IStoreProfile>
    ) => {
      state.user = user;
    },
    setUserLocation(state, action) {
      state.userLocation = action.payload;
    },
    setUserAssignedLocation(state, action) {
      state.userAssignedLocations = action.payload;
    },
    setStoreDetails: (state, { payload }: PayloadAction<IStoreInformation>) => {
      state.store = payload;
    },
    setUserToken: (
      state,
      { payload: token }: PayloadAction<string | undefined>
    ) => {
      state.token = token;
    },
    setUserStoreId: (state, { payload }: PayloadAction<number | null>) => {
      state.store_id = payload;
    },
    setIsLoggedIn: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoggedIn = payload;
    },
    setIsSubscriptionExpired: (state, { payload }: PayloadAction<boolean>) => {
      state.isSubscriptionExpired = payload;
    },
    setISSubscriptionCancelled: (
      state,
      { payload }: PayloadAction<boolean>
    ) => {
      state.isSubscriptionCancelled = payload;
    },
    setIsSubscriptionExpiring: (state, { payload }: PayloadAction<boolean>) => {
      state.isSubscriptionExpiring = payload;
    },
    setIsSubscriptionType: (state, { payload }: PayloadAction<string>) => {
      state.isSubscriptionType = payload;
    },
    setIsSubscriptionDets: (state, { payload }: PayloadAction<any | null>) => {
      state.isSubscriptionDets = payload;
    },
    setPermissions: (state, { payload }: PayloadAction<any>) => {
      state.permissions = payload;
    },
    setIsWithinNoticePeriod: (state, { payload }: PayloadAction<boolean>) => {
      state.isWithinNoticePeriod = payload;
    },
    setRemainingDays: (state, { payload }: PayloadAction<number | null>) => {
      state.remainingDays = payload;
    },
    setIsFreeTrial: (state, { payload }: PayloadAction<boolean>) => {
      state.isFreeTrial = payload;
    },
    setIsFreeTrialExpired: (state, { payload }: PayloadAction<boolean>) => {
      state.isFreeTrialExpired = payload;
    },
    setIsFreeTrialExpiring: (state, { payload }: PayloadAction<boolean>) => {
      state.isFreeTrialExpiring = payload;
    },
    setRemainingFreeTrialDays: (
      state,
      { payload }: PayloadAction<number | null>
    ) => {
      state.remainingFreeTrialDays = payload;
    },
    logOut: (
      state,
      { payload: { redirect = true } }: PayloadAction<{ redirect: boolean }>
    ) => {
      window.localStorage.clear();
      window.location.href = "/login";
      state.token = "";
      state.isLoggedIn = false;
      state.isSubscriptionCancelled = false;
      state.isSubscriptionExpired = false;
      state.isSubscriptionExpiring = false;
      state.isSubscriptionType = "";
      state.isSubscriptionDets = null;
      state.isWithinNoticePeriod = false;
      state.remainingDays = null;
      state.isFreeTrial = false;
      state.isFreeTrialExpired = false;
      state.isFreeTrialExpiring = false;
      state.remainingFreeTrialDays = null;
      state.user = null;
      state.store_id = null;
      state.store = null;
      state.userLocation = null;
      state.userAssignedLocations = [];
      state.permissions = {
        orders: { view: true, manage: true },
        messaging: { view: true, manage: true },
        products: { view: true, manage: true },
        analytics: { view: true },
      };
    },
  },
});

const { actions, reducer } = authSlice;
export const {
  setUserDetails,
  logOut,
  setUserToken,
  setUserStoreId,
  setStoreDetails,
  setPermissions,
  setIsLoggedIn,
  setUserLocation,
  setUserAssignedLocation,
  setIsSubscriptionExpired,
  setISSubscriptionCancelled,
  setIsSubscriptionExpiring,
  setIsSubscriptionType,
  setIsSubscriptionDets,
  setIsWithinNoticePeriod,
  setRemainingDays,
  setIsFreeTrial,
  setIsFreeTrialExpired,
  setIsFreeTrialExpiring,
  setRemainingFreeTrialDays,
} = actions;

// selector to select user details from the store
export const selectUserLocation = (state: RootState) => state.auth.userLocation;
export const selectUserAssignedLocation = (state: RootState) =>
  state.auth.userAssignedLocations;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectCurrentStore = (state: RootState) => state.auth.store;
export const selectToken = (state: RootState) => state.auth.token;
export const selectStoreId = (state: RootState) => state.auth.store_id;
export const selectPermissions = (state: RootState) => state.auth.permissions;
export const selectIsSubscriptionCancelled = (state: RootState) =>
  state.auth.isSubscriptionCancelled;
export const selectIsSubscriptionExpired = (state: RootState) =>
  state.auth.isSubscriptionExpired;
export const selectIsSubscriptionExpiring = (state: RootState) =>
  state.auth.isSubscriptionExpiring;
export const selectIsSubscriptionType = (state: RootState) =>
  state.auth.isSubscriptionType;
export const selectIsSubscriptionDets = (state: RootState) =>
  state.auth.isSubscriptionDets;
export const selectIsWithinNoticePeriod = (state: RootState) =>
  state.auth.isWithinNoticePeriod;
export const selectRemainingDays = (state: RootState) =>
  state.auth.remainingDays;
export const selectIsFreeTrial = (state: RootState) => state.auth.isFreeTrial;
export const selectIsFreeTrialExpired = (state: RootState) =>
  state.auth.isFreeTrialExpired;
export const selectIsFreeTrialExpiring = (state: RootState) =>
  state.auth.isFreeTrialExpiring;
export const selectRemainingFreeTrialDays = (state: RootState) =>
  state.auth.remainingFreeTrialDays;

export default reducer;
