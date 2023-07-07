import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    transactionsInfo: {
        totalExpenses: 0,
        totalIncomes: 0,
        categories: [],
        netIncome: 0,
        timeRange: "",
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
            state.transactionsInfo = action.payload;
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
