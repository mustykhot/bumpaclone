import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store.types";
import { ICategory } from "Models/store";


type ExpenseType = {
    categoryId: string
    categoryName: string
    categories: ICategory[]
};

const expenseState: ExpenseType = {
    categoryId: "",
    categoryName: "",
    categories: []

};

const ExpenseSlice = createSlice({
    name: 'expense',
    initialState: expenseState,
    reducers: {
        setCategoryId: (state, { payload }: PayloadAction<string>) => {
            state.categoryId = payload
        },
        setAllCategories: (state, { payload }: PayloadAction<ICategory[]>) => {
            state.categories = payload
        },
        setCategoryName: (state) => {
            const category = state.categories.length > 0 && state.categories.find((item, index) => parseInt(item?.id as string) === parseInt(state.categoryId))
            
            if (category) {
                state.categoryName = category.name
            }
            else {
                state.categoryName = ""
            }
        },

    }
})

const { actions, reducer } = ExpenseSlice;
export const { setCategoryId, setAllCategories, setCategoryName } = actions;


export const selectCategoryId = (state: RootState) => state.expense.categoryId
export const selectCategories = (state: RootState) => state.expense.categories
export const selectCategoryName = (state: RootState) => state.expense.categoryName

export default reducer;