import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginType, VerifyOtpType } from "./api.types";
import { LocationType } from "Models/order";
import { IStoreInformation } from "Models/store";
import { LoginFeilds } from "pages/Auth/Login";
import { ResetPasswordFeilds } from "pages/Auth/ResetPassword";
import {
  RequestOtpFields,
  SignupFields,
  VerifyOtpFields,
} from "pages/Auth/Signup";
import { PlanRecommendationFields, StoreFields } from "pages/Auth/Signup/store";
import { BankFields } from "pages/Dashboard/Home/Widgets/AddBankDetails";
import { CreateShippingFeilds } from "pages/Dashboard/Store/ShippingFee/CreateShipping";
import { API_URL } from "utils/constants/general";
import { AUTHROUTES } from "utils/constants/apiroutes";
import { ActivateFreeTrialFields } from "pages/Dashboard/Home/Widgets/ActivateFreeTrialModal";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, api) => {
    const { auth } = api.getState() as { auth: { token: string | undefined } };
    headers.set("Accept", `application/json`);
    if (auth.token) {
      headers.set("authorization", `Bearer ${auth.token}`);
      headers.set("Access-Control-Allow-Origin", `*`);
    }
    // headers.set('x-api-key', import.meta.env.VITE_API_KEY);
    return headers;
  },
});

export const authApi = createApi({
  baseQuery,
  reducerPath: "authApi",
  tagTypes: ["userData"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginType, LoginFeilds>({
      query: (credentials) => ({
        url: AUTHROUTES.LOGINROUTE,
        method: "POST",
        body: {
          ...credentials,
          origin: "web",
        },
      }),
    }),
    forgotPassword: builder.mutation<{}, ResetPasswordFeilds>({
      query: (credentials) => ({
        url: AUTHROUTES.FORGOTPASSWORD,
        method: "POST",
        body: credentials,
      }),
    }),
    resetPassword: builder.mutation<{}, any>({
      query: (credentials) => ({
        url: AUTHROUTES.RESETPASSWORD,
        method: "POST",
        body: credentials,
      }),
    }),
    signup: builder.mutation<
      LoginType,
      { payload: SignupFields; registerLink: string }
    >({
      query: ({ payload, registerLink }) => ({
        url: registerLink,
        method: "POST",
        body: {
          ...payload,
          origin: "web",
        },
      }),
    }),
    prevalidateSignup: builder.mutation<SignupFields, {}>({
      query: (credentials) => ({
        url: AUTHROUTES.PREVALIDATE_SIGNUP,
        method: "POST",
        body: credentials,
      }),
    }),
    requestOtp: builder.mutation<RequestOtpFields, {}>({
      query: (credentials) => ({
        url: AUTHROUTES.REQUEST_OTP,
        method: "POST",
        body: credentials,
      }),
    }),
    verifyOtp: builder.mutation<
      VerifyOtpType,
      { payload: VerifyOtpFields; verifyOtpLink: string }
    >({
      query: ({ payload, verifyOtpLink }) => ({
        url: verifyOtpLink,
        method: "POST",
        body: payload,
      }),
    }),
    getPlanRecommendation: builder.mutation<PlanRecommendationFields, {}>({
      query: (credentials) => ({
        url: AUTHROUTES.SUGGEST_PLAN,
        method: "POST",
        body: credentials,
      }),
    }),
    setupStoreBasic: builder.mutation<StoreFields, {}>({
      query: (credentials) => ({
        url: AUTHROUTES.SETUP_STORE_BASIC,
        method: "POST",
        body: credentials,
      }),
    }),
    setupStoreBank: builder.mutation<BankFields, {}>({
      query: (credentials) => ({
        url: AUTHROUTES.SETUP_STORE_BANK,
        method: "POST",
        body: credentials,
      }),
    }),
    setupStorePaymentMethod: builder.mutation<BankFields, {}>({
      query: (credentials) => ({
        url: AUTHROUTES.SETUP_STORE_PAYMENT_METHOD,
        method: "POST",
        body: credentials,
      }),
    }),
    setupStoreShippingMethod: builder.mutation<CreateShippingFeilds, {}>({
      query: (credentials) => ({
        url: AUTHROUTES.SETUP_STORE_SHIPPING_METHOD,
        method: "POST",
        body: credentials,
      }),
    }),
    setupStoreActivateFreeTrial: builder.mutation<ActivateFreeTrialFields, {}>({
      query: (credentials) => ({
        url: AUTHROUTES.SETUP_STORE_ACTIVATE_FREE_TRIAL,
        method: "POST",
        body: credentials,
      }),
    }),
    activateStaff: builder.mutation<
      {
        userAssignedLocations: LocationType[];
        assigned_locations: LocationType[];
        logged_in_location: LocationType;
        permissions: unknown;
        access_token: string;
        store_id: number;
        expires_in: number;
        location: LocationType;
        store: IStoreInformation;
      },
      {
        email: string;
        password: string;
        password_confirmation: string;
        token: string;
      }
    >({
      query: (credentials) => ({
        url: AUTHROUTES.VERIFY_STAFF,
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useActivateStaffMutation,
  usePrevalidateSignupMutation,
  useRequestOtpMutation,
  useVerifyOtpMutation,
  useSetupStoreBasicMutation,
  useSetupStoreBankMutation,
  useSetupStorePaymentMethodMutation,
  useSetupStoreShippingMethodMutation,
  useSetupStoreActivateFreeTrialMutation,
  useGetPlanRecommendationMutation,
} = authApi;
