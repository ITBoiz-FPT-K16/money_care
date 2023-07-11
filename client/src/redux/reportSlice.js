import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
const month = moment(new Date()).format("YYYY/MM");
const dayStart = moment(month).startOf("month").format("YYYY/MM/DD");
const dayEnd = moment(month).endOf("month").format("YYYY/MM/DD");
const desc = "this month";
const initialState = {
    reportInfo: {
        dateInMonth: [],
        expenseList: [],
        incomeList: [],
        totalExpenses: 0,
        totalIncomes: 0,
    },
    timeRange: {
        month: month,
        dayStart: dayStart,
        dayEnd: dayEnd,
        desc: desc,
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

        setTimeRangeReport: (state, action) => {
            state.timeRange = action.payload;
        },
    },
});

export const {
    getReportStart,
    getReportSuccess,
    getReportFailure,
    setTimeRangeReport,
} = reportSlice.actions;
export default reportSlice.reducer;
