import moment from "moment";

export const timeRangeOptions = [
    {
        description: "This month",
        monthYear: moment(new Date()).format("YYYY/MM"),
        startDate: moment(new Date()).startOf("month").format("DD/MM/YYYY"),
        endDate: moment(new Date()).endOf("month").format("DD/MM/YYYY"),
    },
    {
        description: "Last month",
        monthYear: moment(new Date())
            .subtract(1, "month")
            .startOf("month")
            .format("YYYY/MM"),
        startDate: moment(new Date())
            .subtract(1, "month")
            .startOf("month")
            .format("DD/MM/YYYY"),
        endDate: moment(new Date())
            .subtract(1, "month")
            .endOf("month")
            .format("DD/MM/YYYY"),
    },
    {
        description: "Last 3 months",
        monthYear: moment(new Date())
            .subtract(3, "month")
            .startOf("month")
            .format("YYYY/MM"),
        startDate: moment(new Date())
            .subtract(3, "month")
            .startOf("month")
            .format("DD/MM/YYYY"),
        endDate: moment(new Date())
            .subtract(1, "month")
            .endOf("month")
            .format("DD/MM/YYYY"),
    },

    {
        description: "Last 6 months",
        monthYear: moment(new Date())
            .subtract(6, "month")
            .startOf("month")
            .format("YYYY/MM"),
        startDate: moment(new Date())
            .subtract(6, "month")
            .startOf("month")
            .format("DD/MM/YYYY"),
        endDate: moment(new Date())
            .subtract(1, "month")
            .endOf("month")
            .format("DD/MM/YYYY"),
    },

    {
        description: "Last year",
        monthYear: moment(new Date()).subtract(1, "year").format("YYYY"),
        startDate: moment(new Date())
            .subtract(1, "year")
            .startOf("year")
            .format("DD/MM/YYYY"),
        endDate: moment(new Date())
            .subtract(1, "year")
            .endOf("year")
            .format("DD/MM/YYYY"),
    },
];
