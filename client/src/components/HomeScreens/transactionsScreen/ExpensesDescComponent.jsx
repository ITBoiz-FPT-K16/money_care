import { Divider } from "@mui/material";
import React from "react";

const ExpensesDescComponent = () => {
    return (
        <div className="bg-white-primary">
            <div className="py-3 px-5 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="w-14 h-14">
                        <img
                            src="https://static.moneylover.me/img/icon/ic_category_transport.png"
                            alt=""
                        />
                    </div>
                    <div className="mx-2">
                        <div>
                            <strong>Transportation</strong>
                        </div>
                        <div className="text-slate-400">1 Transactions</div>
                    </div>
                </div>
                <div className="text-xl">- 10,000.00</div>
            </div>
            <Divider />
            <div className="flex justify-between items-center px-5 py-3">
                <div className=" flex">
                    <div className="text-3xl">03</div>
                    <div className="text-sm mx-2"> Monday, July 2023</div>
                </div>
                <div className="text-red-500">- 10,000.00</div>
            </div>
        </div>
    );
};

export default ExpensesDescComponent;
