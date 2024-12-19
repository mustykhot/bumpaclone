import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store.types";

type kycServiceStatusType = {
  kycUptime: boolean | null;
  kycDisplayServiceRestoredBanner: boolean | null;
};

const kycServiceStatusState: kycServiceStatusType = {
  kycUptime: null,
  kycDisplayServiceRestoredBanner: null,
};

const KycServiceStatusSlice = createSlice({
  name: "kycServiceStatus",
  initialState: kycServiceStatusState,
  reducers: {
    setKycUptime: (state, { payload }: PayloadAction<boolean | null>) => {
      state.kycUptime = payload;
    },
    setKycDisplayServiceRestoredBanner: (
      state,
      { payload }: PayloadAction<boolean | null>
    ) => {
      state.kycDisplayServiceRestoredBanner = payload;
    },
  },
});

const { actions, reducer } = KycServiceStatusSlice;

export const { setKycUptime, setKycDisplayServiceRestoredBanner } = actions;

export const selectKycUptime = (state: RootState) =>
  state.kycServiceStatus.kycUptime;
export const selectKycDisplayServiceRestoredBanner = (state: RootState) =>
  state.kycServiceStatus.kycDisplayServiceRestoredBanner;

export default reducer;
