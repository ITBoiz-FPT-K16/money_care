import React from "react";
import Navbar from "../Navbar";
import TransactionsListComponent from "./TransactionsListComponent";
const TransactionComponent = () => {
    return (
        <div className="pl-20 h-100%">
            <>
                <Navbar />
                <TransactionsListComponent />
            </>
        </div>
    );
};

export default TransactionComponent;
