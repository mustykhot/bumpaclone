import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store/store.types";

interface KYCState {
  modals: {
    verifyIdentity: boolean;
    updateProfile: boolean;
    bvn: boolean;
    bvnSuccess: boolean;
    nin: boolean;
    ninSuccess: boolean;
    updateBusinessName: boolean;
    cac: boolean;
    verificationSuccess: boolean;
  };
  status: {
    cacComplete: boolean;
    verificationComplete: boolean;
    kycOrigin: string | null;
  };
}

type ModalKey = keyof KYCState["modals"];

interface VerificationStepPayload {
  currentStep: ModalKey;
  nextModal: ModalKey;
}

const initialState: KYCState = {
  modals: {
    verifyIdentity: false,
    updateProfile: false,
    bvn: false,
    bvnSuccess: false,
    nin: false,
    ninSuccess: false,
    updateBusinessName: false,
    cac: false,
    verificationSuccess: false,
  },
  status: {
    cacComplete: false,
    verificationComplete: false,
    kycOrigin: null,
  },
};

const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    resetKYCFlow: (state) => {
      return initialState;
    },
    startKYCFlow: (state) => {
      state.modals.verifyIdentity = true;
    },
    closeAllKYCModals: (state) => {
      state.modals = initialState.modals;
    },
    closeKYCModal: (state, action: PayloadAction<ModalKey>) => {
      state.modals[action.payload] = false;
    },
    handleVerificationNextStep: (
      state,
      action: PayloadAction<VerificationStepPayload>
    ) => {
      const { currentStep, nextModal } = action.payload;
      if (!(currentStep === "updateProfile" && nextModal === "bvn")) {
        state.modals[currentStep] = false;
      }
      state.modals[nextModal] = true;
    },
    setKYCStatus: (
      state,
      action: PayloadAction<Partial<KYCState["status"]>>
    ) => {
      state.status = { ...state.status, ...action.payload };
    },
    setKYCOrigin: (state, action: PayloadAction<string | null>) => {
      state.status.kycOrigin = action.payload;
    },
  },
});

const { actions, reducer } = kycSlice;

export const {
  resetKYCFlow,
  startKYCFlow,
  closeAllKYCModals,
  closeKYCModal,
  handleVerificationNextStep,
  setKYCStatus,
  setKYCOrigin,
} = actions;

export const selectKYCModals = (state: RootState) => state.kyc.modals;
export const selectKYCStatus = (state: RootState) => state.kyc.status;

export default reducer;
