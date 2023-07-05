import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    transactionInfo: {
        totalExpenses: 0,
        totalIncomes: 0,
        categories: [],
        netIncome: 0,
    },
    isFetching: false,
    error: false,
};

const transactionSlice = createSlice({
    name: "transaction",
    initialState,
    reducers: {
        getTransactionStart: (state) => {
            state.isFetching = true;
        },
        getTransactionSuccess: (state, action) => {
            state.isFetching = false;
            state.transactionInfo = action.payload;
            state.error = null;
        },

        getTransactionFailure: (state, action) => {
            state.isFetching = false;
            state.error = true;
        },
    },
});

export const {
    getTransactionStart,
    getTransactionSuccess,
    getTransactionFailure,
} = transactionSlice.actions;
export default transactionSlice.reducer;
