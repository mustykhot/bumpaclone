import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store.types";
import { BankDetails } from "Models/wallet";

type WalletDetailsType = {
    account_name: string;
    account_number: string;
    bank_name: string;
    is_active: string;
    transaction_limit: string;
    tier: string;
    balance: number;
    max_transaction_limit: number;
}

type WithdrawalDetailsType = {
    withdrawal_bank_account_id: number;
    amount: number
}

type BankRequestPaymentDetailsType = {
    account_name: string
    account_number: string
    bank_name: string
    expires_at: string
    message?: string
}


type WalletType = {
    walletDetails: WalletDetailsType
    fincraBankList: BankDetails[]
    formatedBankList: any
    withdrawalDetails: WithdrawalDetailsType
    bankRequestPaymentDetails: BankRequestPaymentDetailsType
    onlineTransferMessage: string
};



const walletState: WalletType = {
    walletDetails: {
        account_name: '',
        account_number: '',
        bank_name: '',
        is_active: '',
        transaction_limit: '',
        tier: '',
        balance: 0,
        max_transaction_limit: 0
    },
    fincraBankList: [],
    formatedBankList: {},
    withdrawalDetails: {
        withdrawal_bank_account_id: 0,
        amount: 0
    },
    bankRequestPaymentDetails: {
        account_name: '',
        account_number: '',
        bank_name: '',
        expires_at: '',
        message: ''
    },
    onlineTransferMessage: ''

};

const WalletSlice = createSlice({
    name: 'wallet',
    initialState: walletState,
    reducers: {
        setWalletDetails: (state, { payload }: PayloadAction<WalletDetailsType>) => {
            state.walletDetails = payload;
        },
        setFincraBankList: (state, { payload }: PayloadAction<BankDetails[]>) => {
            state.fincraBankList = payload;
        },
        setFormatedBankList: (state, { payload }: PayloadAction<any>) => {
            state.formatedBankList = payload;
        },
        setWithdrawalDetails: (state, { payload }: PayloadAction<any>) => {
            state.withdrawalDetails = payload;
        },
        setBankRequestPaymentDetails: (state, { payload }: PayloadAction<any>) => {
            state.bankRequestPaymentDetails = payload;
        },
        setOnlineTransferMessage: (state, { payload }: PayloadAction<string>) => {
            state.onlineTransferMessage = payload;
        },

    }
})

const { actions, reducer } = WalletSlice;
export const { setWalletDetails, setFincraBankList, setFormatedBankList, setWithdrawalDetails, setBankRequestPaymentDetails, setOnlineTransferMessage } = actions;


export const selectWalletDetails = (state: RootState) => state.wallet.walletDetails
export const selectFincraBankList = (state: RootState) => state.wallet.fincraBankList
export const selectFormatedBankList = (state: RootState) => state.wallet.formatedBankList
export const selectWithdrawalDetails = (state: RootState) => state.wallet.withdrawalDetails
export const selectBankRequestPaymentDetails = (state: RootState) => state.wallet.bankRequestPaymentDetails
export const selectOnlineTransferMessage = (state: RootState) => state.wallet.onlineTransferMessage

export default reducer;