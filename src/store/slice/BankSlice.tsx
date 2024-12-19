import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store.types";
import { IBank } from "Models/store";


type BankType = {
    bankCode: string
    bankSlug: string
    bankName: string
};

const bankState: BankType = {
    bankCode: "",
    bankSlug: "",
    bankName: ""

};

const BankSlice = createSlice({
    name: 'bank',
    initialState: bankState,
    reducers: {
        setBankName: (state, { payload }: PayloadAction<string>) => {
            state.bankName = payload
        },
        setBankDetails: (state, { payload }: PayloadAction<IBank[]>) => {
            const bank = payload.length > 0 && payload.find((item) => item.name === state.bankName)

            if (bank) {
                state.bankCode = bank.code
                state.bankSlug = bank.slug
            }
            else {
                state.bankCode = ""
                state.bankSlug = ""
            }
        },

    }
})

const { actions, reducer } = BankSlice;
export const { setBankDetails, setBankName } = actions;


export const selectBankCode = (state: RootState) => state.bank.bankCode
export const selectBankSlug = (state: RootState) => state.bank.bankSlug
export const selectBankName = (state: RootState) => state.bank.bankName

export default reducer;