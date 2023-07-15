import { Alert, Button, Divider } from "@mui/material";
import React from "react";
import { currencyFormat } from "../../../utils";
import moment from "moment";
import { useSelector } from "react-redux";
import AddTransactionDialog from "./addTransaction/AddTransactionDialog";
import { categories } from "../../../../../categories";
import EditTransactionDialog from "./addTransaction/EditTransactionDialog";
import AlertDeleteTransaction from "./addTransaction/AlertDeleteTransaction";
import { setTotalAmount } from "../../../redux/authSlice";
import {
    deleteTransactionExpenses,
    deleteTransactionIncomes,
} from "../../../services/transactionSerVice";
import { toast } from "react-toastify";
import {
    getTransactionStart,
    getTransactionSuccess,
    getTransactionFailure,
} from "../../../redux/transactionSlice";
import { getTotalAmount } from "../../../services/authService";
import { getTransactionsByTimeRange } from "../../../services/transactionSerVice";
import { useDispatch } from "react-redux";

const CategoryComponent = (props) => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.auth.user.accessToken);
    const transactionInfo = useSelector(
        (state) => state.transaction.transactionsInfo
    );
    console.log("transactionInfo", transactionInfo);
    const [openAlertDelete, setOpenAlertDelete] = React.useState(false);
    const [transactionWillDelete, setTransactionWillDelete] = React.useState();

    const { category } = props;
    const isIncome = category.type;
    let transactionsInThisCategory;
    let totalAmountInThisCategory = 0;
    if (isIncome) {
        transactionsInThisCategory = category.incomes;
    } else {
        transactionsInThisCategory = category.expenses;
    }

    transactionsInThisCategory?.forEach((transaction) => {
        totalAmountInThisCategory += transaction.amount;
    });
    console.log("transactionsInThisCategory", transactionsInThisCategory);
    const [transactionsNeedEdit, setTransactionsNeedEdit] = React.useState();
    const [openEdit, setOpenEdit] = React.useState(false);
    const handleCloseEditDialog = () => {
        console.log("close edit dialog");
        setOpenEdit(false);
    };
    const handelClickTransaction = (transaction) => {
        console.log("transaction will edit", transaction);
        let isIncome = false;
        let transactionImage;
        let nameCategory;
        for (const category of categories) {
            if (transaction.category == category._id) {
                isIncome = category.type;
                transactionImage = category.image;
                nameCategory = category.name;
                break;
            }
        }
        const transactionWillEdit = {
            ...transaction,
            date: moment(transaction.date).format("MM/DD/YYYY"),
            isIncome: isIncome,
            image: transactionImage,
            name: nameCategory,
        };

        console.log("transaction will edit", transactionWillEdit);
        setTransactionsNeedEdit(transactionWillEdit);
        setOpenEdit(true);
    };

    const handleClickDeleteBtn = (transaction) => {
        console.log("click delete btn");
        console.log("transaction will delete", transaction);

        setTransactionWillDelete(transaction);
        setOpenAlertDelete(true);
    };

    const closeAlertDelete = () => {
        console.log("close alert delete");

        setOpenAlertDelete(false);
    };

    const handleDeleteTransaction = async () => {
        console.log("delete transaction");
        let type;
        let res;
        for (const category of categories) {
            if (category._id === transactionWillDelete.category) {
                type = category.type;
                break;
            }
        }
        if (type) {
            res = await deleteTransactionIncomes(
                transactionWillDelete._id,
                token
            );
        } else {
            res = await deleteTransactionExpenses(
                transactionWillDelete._id,
                token
            );
        }

        if (res.errCode === 0) {
            console.log("delete success");
            toast.success("Delete transaction success");
            const timeThisMonth = moment(new Date()).format("YYYY/MM");
            if (
                moment(transactionWillDelete.date).format("YYYY/MM") ===
                timeThisMonth
            ) {
                try {
                    dispatch(getTransactionStart());
                    const res = await getTransactionsByTimeRange(
                        timeThisMonth,
                        token
                    );
                    if (res.errCode === 0) {
                        dispatch(getTransactionSuccess(res.data));
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
        } else {
            console.log("delete fail");
            toast.error("Delete transaction fail");
        }
    };

    return (
        <div className="bg-white-primary mb-5">
            <div className="py-3 px-5 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="w-14 h-14">
                        <img src={category.image} alt="" />
                    </div>
                    <div className="mx-2">
                        <div>
                            <strong>{category.name}</strong>
                        </div>
                        <div className="text-slate-400">
                            {transactionsInThisCategory?.length} Transactions
                        </div>
                    </div>
                </div>
                <div className="text-xl">
                    {isIncome ? "+" : "-"}{" "}
                    {currencyFormat(totalAmountInThisCategory)}
                </div>
            </div>
            <Divider />
            {transactionsInThisCategory?.map((transaction, index) => {
                const day = moment(transaction.date).format("DD");
                const specificDay = moment(transaction.date).format(
                    "dd, MMM YYYY"
                );
                return (
                    <div
                        className="flex justify-between items-center px-5 py-3"
                        key={index}
                    >
                        <div
                            className=" flex items-center cursor-pointer"
                            onClick={() => handelClickTransaction(transaction)}
                        >
                            <div className="text-3xl">{day}</div>
                            <div className="mx-2">
                                <div className="text-sm">{specificDay}</div>
                                <div className="text-slate-400">
                                    {transaction.description}
                                </div>
                            </div>
                        </div>
                        <div
                            className={`${
                                isIncome ? "text-blue-500" : "text-red-500"
                            }`}
                        >
                            {isIncome ? "+" : "-"}{" "}
                            {currencyFormat(transaction.amount)}
                            <div className="my-1">
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() =>
                                        handleClickDeleteBtn(transaction)
                                    }
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}
            <EditTransactionDialog
                open={openEdit}
                handelClose={handleCloseEditDialog}
                transaction={transactionsNeedEdit}
            />
            <AlertDeleteTransaction
                open={openAlertDelete}
                handleClose={closeAlertDelete}
                handleDelete={handleDeleteTransaction}
            />
        </div>
    );
};

export default CategoryComponent;
