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
];
