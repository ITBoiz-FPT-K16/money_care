import React from "react";
import { useSelector } from "react-redux";
import { currencyFormat } from "../../../utils";
const MoneyFlowComponent = () => {
    const transactionInfo = useSelector(
        (state) => state.transaction.transactionsInfo
    );

    return (
        <div className="mb-5 bg-white-primary p-3">
            <div className="flex justify-between items-center">
                <span>Inflow</span>
                <strong className="text-blue-400">
                    {currencyFormat(transactionInfo.totalIncomes)}
                </strong>
            </div>
            <div className="flex justify-between items-center">
                <span>Outflow</span>
                <strong className="text-red-600">
                    {currencyFormat(transactionInfo.totalExpenses)}
                </strong>
            </div>
            <div className="flex justify-end items-center ">
                <strong className="border-t-1 border-gray-400 pl-5">
                    {currencyFormat(
                        transactionInfo.totalIncomes -
                            transactionInfo.totalExpenses
                    )}
                </strong>
            </div>
        </div>
    );
};

export default MoneyFlowComponent;
