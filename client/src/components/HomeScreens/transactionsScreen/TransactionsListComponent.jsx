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
const TransactionsListComponent = (props) => {
    const transactionInfo = useSelector(
        (state) => state.transaction.transactionsInfo
    );

    const [tabValue, setTabValue] = React.useState("2");

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <div
            className="flex justify-center items-center"
            style={{ height: "100vh" }}
        >
            <div
                className="bg-white-secondary rounded-xl shadow-xl box-border"
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
                                top: "60px",
                            }}
                        >
                            <TabList
                                onChange={handleChange}
                                aria-label="lab API tabs example"
                                centered
                            >
                                <Tab label="Last Month" value="1" />
                                <Tab label="This Month" value="2" />
                                <Tab label="Future" value="3" />
                            </TabList>
                        </Box>
                        <TabPanel value="1" sx={{ padding: "0px" }}>
                            Item One
                        </TabPanel>
                        <TabPanel value="2" sx={{ padding: "0px" }}>
                            <div className="box-border">
                                {transactionInfo.isFetching && (
                                    <LoadingTransaction />
                                )}

                                {!transactionInfo.isFetching && (
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
                            </div>
                        </TabPanel>
                        <TabPanel value="3">Item Three</TabPanel>
                    </TabContext>
                </Box>
            </div>
        </div>
    );
};

export default TransactionsListComponent;
