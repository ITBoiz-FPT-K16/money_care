import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Divider } from "@mui/material";
import { categories } from "../../../../../../categories";

const ChooseCategoryDialog = (props) => {
    const { open, handleClose, setCategory } = props;
    const [tabValue, setTabValue] = React.useState("1");
    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const categoriesExpense = categories.filter(
        (category) => category.type === false
    );
    const categoriesIncome = categories.filter(
        (category) => category.type === true
    );

    const handleClickCategory = (category) => {
        setCategory(category);
        handleClose();
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="alert-dialog-title" className="text-center">
                    Choose category
                </DialogTitle>

                <DialogContent sx={{ p: "0px" }}>
                    {" "}
                    <div
                        className="rounded-xl shadow-xl box-border overflow-auto relative"
                        style={{ width: "400px", height: "450px" }}
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
                                        <Tab label="EXPENSE" value="1"></Tab>

                                        <Tab label="INCOME" value="2" />
                                    </TabList>
                                </Box>
                                <TabPanel value="1" sx={{ padding: "20px" }}>
                                    {categoriesExpense.map((item, index) => {
                                        return (
                                            <div
                                                className="flex items-center p-2 mb-2 cursor-pointer hover:bg-gray-100 hover:rounded-xl border-b-1 border-gray-400"
                                                key={index}
                                                onClick={() => {
                                                    handleClickCategory(item);
                                                }}
                                            >
                                                <img
                                                    src={item.image}
                                                    alt=""
                                                    width={"50px"}
                                                    height={"50px"}
                                                />
                                                <span className="px-3">
                                                    {item.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </TabPanel>
                                <TabPanel value="2" sx={{ padding: "20px" }}>
                                    {categoriesIncome.map((item, index) => {
                                        return (
                                            <div
                                                className="flex items-center p-2 mb-2 cursor-pointer hover:bg-gray-100 hover:rounded-xl border-b-1 border-gray-400"
                                                key={index}
                                                onClick={() =>
                                                    handleClickCategory(item)
                                                }
                                            >
                                                <img
                                                    src={item.image}
                                                    alt=""
                                                    width={"50px"}
                                                    height={"50px"}
                                                />
                                                <span className="px-3">
                                                    {item.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </TabPanel>
                            </TabContext>
                        </Box>
                    </div>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ChooseCategoryDialog;
