import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store/store.types";

interface TerminalState {
  modals: {
    activateTerminal: boolean;
    terminalGetStarted: boolean;
    terminalStatus: boolean;
    linkTerminal: boolean;
    getTerminal: boolean;
    manageTerminal?: boolean;
  };
  shouldContinueTerminalFlow: boolean;
  shouldNavigateToPaymentMethods: boolean;
  shouldOpenManageTerminal: boolean;
}

const initialState: TerminalState = {
  modals: {
    activateTerminal: false,
    terminalGetStarted: false,
    terminalStatus: false,
    linkTerminal: false,
    getTerminal: false,
    manageTerminal: false,
  },
  shouldContinueTerminalFlow: false,
  shouldNavigateToPaymentMethods: false,
  shouldOpenManageTerminal: false,
};

const terminalSlice = createSlice({
  name: "terminal",
  initialState,
  reducers: {
    closeAllModals: (state) => {
      state.modals = {
        activateTerminal: false,
        terminalGetStarted: false,
        terminalStatus: false,
        linkTerminal: false,
        getTerminal: false,
      };
    },
    startTerminalFlow: (state) => {
      state.modals.activateTerminal = true;
    },
    handleActivateTerminalAction: (state) => {
      state.modals.activateTerminal = false;
      state.modals.terminalGetStarted = true;
    },
    handleTerminalGetStartedAction: (state) => {
      state.modals.terminalGetStarted = false;
      state.modals.terminalStatus = true;
    },
    handleTerminalStatusNoAction: (state) => {
      state.modals.getTerminal = true;
    },
    handleTerminalStatusYesAction: (state) => {
      state.modals.linkTerminal = true;
    },
    closeModal: (
      state,
      action: PayloadAction<keyof TerminalState["modals"]>
    ) => {
      state.modals[action.payload] = false;
    },
    continueTerminalFlow: (state) => {
      state.shouldContinueTerminalFlow = true;
    },
    resetTerminalFlow: (state) => {
      state.shouldContinueTerminalFlow = false;
    },
    openManageTerminal: (state) => {
      state.shouldOpenManageTerminal = true;
    },
    closeManageTerminal: (state) => {
      state.shouldOpenManageTerminal = false;
    },
    setShouldNavigateToPaymentMethods: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.shouldNavigateToPaymentMethods = action.payload;
    },
    handleTerminalSuccess: (state) => {
      state.shouldOpenManageTerminal = true;
      state.shouldNavigateToPaymentMethods = true;
    },
  },
});

const { actions, reducer } = terminalSlice;

export const {
  closeAllModals,
  startTerminalFlow,
  handleActivateTerminalAction,
  handleTerminalGetStartedAction,
  handleTerminalStatusNoAction,
  handleTerminalStatusYesAction,
  closeModal,
  continueTerminalFlow,
  resetTerminalFlow,
  openManageTerminal,
  closeManageTerminal,
  setShouldNavigateToPaymentMethods,
  handleTerminalSuccess,
} = actions;

export const selectTerminalModals = (state: RootState) => state.terminal.modals;
export const selectShouldContinueTerminalFlow = (state: RootState) =>
  state.terminal.shouldContinueTerminalFlow;
export const selectShouldNavigateToPaymentMethods = (state: RootState) =>
  state.terminal.shouldNavigateToPaymentMethods;
export const selectShouldOpenManageTerminal = (state: RootState) =>
  state.terminal.shouldOpenManageTerminal;

export default reducer;
