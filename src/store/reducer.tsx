import { combineReducers } from "@reduxjs/toolkit";
import AuthReducer from "./slice/AuthSlice";
import ToastReducer from "./slice/ToasterSlice";
import VideoWidgetReducer from "./slice/VideoWidgetSlice";
import NotificationReducer from "./slice/NotificationSlice";
import { authApi } from "services/auth.api";
import { generalApi } from "services";
import ProfileReducer from "./slice/ProfileSlice";
import BulkProductReducer from "./slice/BulkProductSlice";
import OrderReducer from "./slice/OrderSlice";
import ThemeReducer from "./slice/ThemeSlice";
import ExpenseReducer from "./slice/Expense";
import BankReducer from "./slice/BankSlice";
import CampaignReducer from "./slice/CampaignSlice";
import NotificationToastReducer from "./slice/NotificationToasterSlice";
import InstagramReducer from "./slice/InstagramSlice";
import FiltersReducer from "./slice/FilterSlice";
import PosReducer from "./slice/PosSlice";
import WalletReducer from "./slice/WalletSlice";
import MaintenanceReducer from "./slice/MaintenanceSlice";
import KycServiceStatusReducer from "./slice/KycServiceStatusSlice";
import ShippingSettingReducer from "./slice/ShippingSettingsSlice";
import TerminalReducer from "./slice/TerminalSlice";
import KycReducer from "./slice/KycSlice";

import { messengerApi } from "services/messenger.api";

const rootReducer = combineReducers({
  //Shared Reducers
  auth: AuthReducer,
  toasts: ToastReducer,
  notificationToasts: NotificationToastReducer,
  notification: NotificationReducer,
  videoWidget: VideoWidgetReducer,
  profile: ProfileReducer,
  bulkProduct: BulkProductReducer,
  order: OrderReducer,
  theme: ThemeReducer,
  expense: ExpenseReducer,
  bank: BankReducer,
  campaign: CampaignReducer,
  instagram: InstagramReducer,
  filters: FiltersReducer,
  pos: PosReducer,
  wallet: WalletReducer,
  maintenance: MaintenanceReducer,
  kycServiceStatus: KycServiceStatusReducer,
  shippingSetting: ShippingSettingReducer,
  terminal: TerminalReducer,
  kyc: KycReducer,
  [authApi.reducerPath]: authApi.reducer,
  [generalApi.reducerPath]: generalApi.reducer,
  [messengerApi.reducerPath]: messengerApi.reducer,
});
export default rootReducer;
