import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store.types";
import { ICampaign } from "Models/marketing";
import { ICustomer } from "pages/Dashboard/Marketing/SendCampaign/addCustomerModal";

type CampaignType = {
  allCampaigns: ICampaign;
  customerRecipient: ICustomer[];
  groupRecipient: string[];
  selectedAll: boolean;
};

const campaignState: CampaignType = {
  allCampaigns: {
    name: "",
    type: "",
    status: "",
    recipients: [],
    subject: "",
    content: "",
    banner: "",
    created_at: "",
  },
  customerRecipient: [],
  groupRecipient: [],
  selectedAll: false,
};

const CampaignSlice = createSlice({
  name: "campaign",
  initialState: campaignState,
  reducers: {
    setCampaigns: (state, { payload }: PayloadAction<ICampaign>) => {
      state.allCampaigns = payload;
    },
    setSelectedAll: (state, { payload }: PayloadAction<boolean>) => {
      state.selectedAll = payload;
    },
    setCustomerRecipient: (state, { payload }: PayloadAction<ICustomer[]>) => {
      state.customerRecipient = payload;
    },
    setGroupRecipient: (state, { payload }: PayloadAction<string[]>) => {
      state.groupRecipient = payload;
    },
  },
});

const { actions, reducer } = CampaignSlice;
export const {
  setCampaigns,
  setCustomerRecipient,
  setGroupRecipient,
  setSelectedAll,
} = actions;

export const selectAllCampaigns = (state: RootState) =>
  state.campaign.allCampaigns;
export const selectCustomerRecipient = (state: RootState) =>
  state.campaign.customerRecipient;
export const selectGroupRecipient = (state: RootState) =>
  state.campaign.groupRecipient;
export const selectSelectedAll = (state: RootState) =>
  state.campaign.selectedAll;

export default reducer;
