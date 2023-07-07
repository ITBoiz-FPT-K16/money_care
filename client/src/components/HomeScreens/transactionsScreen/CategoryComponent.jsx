import { Divider } from "@mui/material";
import React from "react";
import { currencyFormat } from "../../../utils";
import moment from "moment";
import { useSelector } from "react-redux";

const CategoryComponent = (props) => {
    const transactionInfo = useSelector(
        (state) => state.transaction.transactionsInfo
    );
    console.log("transactionInfo", transactionInfo);

    const { category } = props;
    const isIncome = category.type;
    let transactionsInThisCategory;
    if (isIncome) {
        transactionsInThisCategory = category.incomes;
    }
    console.log("transactionsInThisCategory", transactionsInThisCategory);

    return (
        <div className="bg-white-primary">
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
                            {transactionsInThisCategory.length} Transactions
                        </div>
                    </div>
                </div>
                <div className="text-xl">
                    {isIncome ? "+" : "-"}{" "}
                    {currencyFormat(transactionInfo.totalIncomes)}
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
                        <div className=" flex items-center">
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
                            {isIncome ? "+" : "-"} {transaction.amount}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CategoryComponent;
