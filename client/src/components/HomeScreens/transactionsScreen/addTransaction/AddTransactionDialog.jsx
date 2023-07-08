import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Divider } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChooseCategoryDialog from "./ChooseCategoryDialog";
import { useSelector, useDispatch } from "react-redux";
import {
    createTransactionIncome,
    createTransactionExpense,
    getTransactionsByTimeRange,
} from "../../../../services/transactionSerVice";
import moment from "moment";
import {
    getTransactionStart,
    getTransactionSuccess,
} from "../../../../redux/transactionSlice";
import { toast } from "react-toastify";
import { getTotalAmount } from "../../../../services/authService";
import { setTotalAmount } from "../../../../redux/authSlice";

const AddTransactionDialog = () => {
    const token = useSelector((state) => state.auth.auth.user.accessToken);
    const currentUser = useSelector((state) => state.auth.auth.user);
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [categorySelected, setCategorySelected] = React.useState(null);
    const [transactionModel, setTransactionModel] = React.useState({
        amount: "",
        description: "",
        date: "",
        category: "",
        user: currentUser.uid,
    });

    React.useEffect(() => {
        setTransactionModel({
            ...transactionModel,
            category: categorySelected?._id,
        });
    }, [categorySelected]);

    const timeThisMonth = moment(new Date()).format("YYYY/MM");

    console.log("transactionModel: ", transactionModel);

    const onchangeFormInput = (e) => {
        setTransactionModel({
            ...transactionModel,
            [e.target.name]: e.target.value,
        });
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [openChooseCategoryDialog, setOpenChooseCategoryDialog] =
        React.useState(false);
    const handleClickOpenChooseCategoryDialog = () => {
        setOpenChooseCategoryDialog(true);
    };
    const handleCloseChooseCategoryDialog = () => {
        setOpenChooseCategoryDialog(false);
    };

    const setCategory = (category) => {
        setCategorySelected(category);
    };
    console.log("categorySelected: ", categorySelected);

    const handleCreateTransaction = async () => {
        let resCreateTransaction;
        if (categorySelected.type) {
            const resCreateTransaction = await createTransactionIncome(
                transactionModel,
                token
            );
            if (resCreateTransaction.errCode === 0) {
                toast.success("Create transaction success");
                setTransactionModel({
                    amount: "",
                    description: "",
                    date: "",
                    category: "",
                    user: currentUser.uid,
                });
                setCategorySelected(null);
            } else {
                toast.error(resCreateTransaction.message);
            }
        } else {
            const resCreateTransaction = await createTransactionExpense(
                transactionModel,
                token
            );
            if (resCreateTransaction.errCode === 0) {
                toast.success("Create transaction success");
            } else {
                toast.error(resCreateTransaction.message);
            }
        }

        if (moment(transactionModel.date).format("YYYY/MM") === timeThisMonth) {
            try {
                dispatch(getTransactionStart());
                const res = await getTransactionsByTimeRange(
                    timeThisMonth,
                    token
                );
                if (res.errCode === 0) {
                    dispatch(getTransactionSuccess(res.data));

                    setTransactionModel({
                        amount: "",
                        description: "",
                        date: "",
                        category: "",
                        user: currentUser.uid,
                    });
                    setCategorySelected(null);
                } else {
                    toast.error(res.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }

        // refresh total amount
        const refreshTotalAmount = await getTotalAmount(token);
        dispatch(setTotalAmount(refreshTotalAmount.data.total));
        handleClose();
    };

    return (
        <div>
            <Button
                variant="contained"
                color="success"
                onClick={handleClickOpen}
            >
                Add Transaction
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="alert-dialog-title">
                    Add Transaction
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <DialogContentText>
                        <div
                            className="p-3 grid grid-cols-4 gap-3"
                            style={{ width: "500px" }}
                        >
                            <div
                                className="col-span-2 p-2 border-1 border-gray-400 rounded-md cursor-pointer"
                                onClick={handleClickOpenChooseCategoryDialog}
                            >
                                <div>
                                    <span className="text-xs">Category</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    {categorySelected ? (
                                        <div className="flex items-center ">
                                            <img
                                                src={categorySelected.image}
                                                alt=""
                                                width={"20px"}
                                                height={"20px"}
                                            />
                                            <span className="px-3">
                                                {categorySelected.name}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <HelpIcon
                                                color="disabled"
                                                sx={{ pr: "2px" }}
                                            />
                                            <span>Select category</span>
                                        </div>
                                    )}
                                    <div className="">
                                        {" "}
                                        <ArrowForwardIosIcon
                                            color="disabled"
                                            fontSize="10px"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-2 p-2 border-1 border-gray-400 rounded-md">
                                <div>
                                    <span className="text-xs">Amount</span>
                                </div>
                                <input
                                    className="border-none outline-none "
                                    type="number"
                                    placeholder="0"
                                    name="amount"
                                    value={transactionModel.amount}
                                    onChange={(e) => onchangeFormInput(e)}
                                />
                            </div>
                            <div className="col-span-2 p-2 border-1 border-gray-400 rounded-md">
                                <div>
                                    <span className="text-xs">Date</span>
                                </div>
                                <input
                                    className="border-none outline-none "
                                    type="date"
                                    format="mm/dd/yyyy"
                                    name="date"
                                    value={transactionModel.date}
                                    onChange={(e) => onchangeFormInput(e)}
                                />
                            </div>
                            <div className="col-span-2 p-2 border-1 border-gray-400 rounded-md">
                                <div>
                                    <span className="text-xs">Note</span>
                                </div>
                                <input
                                    className="border-none outline-none "
                                    type="text"
                                    name="description"
                                    value={transactionModel.description}
                                    onChange={(e) => onchangeFormInput(e)}
                                />
                            </div>
                        </div>
                    </DialogContentText>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        variant="outlined"
                        color="success"
                        autoFocus
                        disabled={
                            !categorySelected ||
                            transactionModel.amount == 0 ||
                            transactionModel.date == ""
                        }
                        onClick={handleCreateTransaction}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <ChooseCategoryDialog
                open={openChooseCategoryDialog}
                handleClose={handleCloseChooseCategoryDialog}
                setCategory={setCategory}
            />
        </div>
    );
};

export default AddTransactionDialog;
