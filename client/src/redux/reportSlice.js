import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reportInfo: {
    dateInMonth: [],
    expenseList: [],
    incomeList: [],
    totalExpenses: 0,
    totalIncomes: 0,
  },

  isFetching: false,
  error: false,
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    getReportStart: (state) => {
      state.isFetching = true;
    },
    getReportSuccess: (state, action) => {
      state.isFetching = false;
      state.reportInfo = action.payload;
      state.error = null;
    },

    getReportFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const { getReportStart, getReportSuccess, getReportFailure } =
  reportSlice.actions;
export default reportSlice.reducer;
