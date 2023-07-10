import React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import MoneyFlowComponent from "./MoneyFlowComponent";
import ExpensesDescComponent from "./CategoryComponent";
import { useSelector } from "react-redux";
import CategoryComponent from "./CategoryComponent";
import LoadingTransaction from "./LoadingTransaction";
import moment from "moment";
import { getTransactionsByTimeRange } from "../../../services/transactionSerVice";
import { useDispatch } from "react-redux";
import * as actionTransactions from "../../../redux/transactionSlice";
import { toast } from "react-toastify";
import dataNotFound from "../../../assets/images/data-not-found.png";
const TransactionsListComponent = (props) => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.auth.user.accessToken);
    const transactionInfo = useSelector(
        (state) => state.transaction.transactionsInfo
    );

    const [tabValue, setTabValue] = React.useState("2");

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const timeThisMonth = moment(new Date()).format("YYYY/MM");
    const timeLastMonth = moment(new Date())
        .subtract(1, "months")
        .format("YYYY/MM");

    const getTransactionsOftMonth = async (timeRange) => {
        dispatch(actionTransactions.getTransactionStart);
        const res = await getTransactionsByTimeRange(timeRange, token);
        if (res.errCode === 0) {
            dispatch(actionTransactions.getTransactionSuccess(res.data));
        } else {
            dispatch(actionTransactions.getTransactionFailure());
            toast.error(res.message);
        }
    };

    return (
        <div
            className="flex justify-center items-center"
            style={{ height: "100vh" }}
        >
            <div
                className="bg-white-secondary rounded-xl shadow-xl box-border overflow-auto relative"
                style={{ width: "500px", height: "550px" }}
            >
                <Box sx={{ width: "100%", typography: "body1" }}>
                    <TabContext value={tabValue}>
                        <Box
                            sx={{
                                borderBottom: 1,
                                borderColor: "divider",
                                backgroundColor: "#fff",
                                borderRadius: "10px 10px 0px 0px",
                                position: "sticky",
                                top: "0px",
                            }}
                        >
                            <TabList
                                onChange={handleChange}
                                aria-label="lab API tabs example"
                                centered
                            >
                                <Tab
                                    label="Last Month"
                                    value="1"
                                    onClick={() => {
                                        getTransactionsOftMonth(timeLastMonth);
                                    }}
                                />
                                <Tab
                                    label="This Month"
                                    value="2"
                                    onClick={() => {
                                        getTransactionsOftMonth(timeThisMonth);
                                    }}
                                />
                            </TabList>
                        </Box>
                        <TabPanel value="1" sx={{ padding: "0px" }}>
                            {transactionInfo.isFetching && (
                                <LoadingTransaction />
                            )}

                            {!transactionInfo.isFetching &&
                                transactionInfo?.categories?.length > 0 && (
                                    <>
                                        <MoneyFlowComponent />
                                        {transactionInfo?.categories?.map(
                                            (item, index) => {
                                                return (
                                                    <CategoryComponent
                                                        key={index}
                                                        category={item}
                                                    />
                                                );
                                            }
                                        )}
                                    </>
                                )}

                            {transactionInfo?.categories == 0 && (
                                <div className="flex flex-col justify-center items-center">
                                    <img
                                        src={dataNotFound}
                                        alt="data not found"
                                        width="400px"
                                        height="400px"
                                    />
                                    <h2>Data Not Found</h2>
                                </div>
                            )}
                        </TabPanel>
                        <TabPanel value="2" sx={{ padding: "0px" }}>
                            <div className="box-border">
                                {transactionInfo.isFetching && (
                                    <LoadingTransaction />
                                )}

                                {!transactionInfo.isFetching &&
                                    transactionInfo?.categories?.length > 0 && (
                                        <>
                                            <MoneyFlowComponent />
                                            {transactionInfo?.categories?.map(
                                                (item, index) => {
                                                    return (
                                                        <CategoryComponent
                                                            key={index}
                                                            category={item}
                                                        />
                                                    );
                                                }
                                            )}
                                        </>
                                    )}

                                {transactionInfo?.categories?.length === 0 &&
                                    transactionInfo.isFetching === false && (
                                        <div>
                                            <h1>No data</h1>
                                        </div>
                                    )}
                            </div>
                        </TabPanel>
                    </TabContext>
                </Box>
            </div>
        </div>
    );
};

export default TransactionsListComponent;
