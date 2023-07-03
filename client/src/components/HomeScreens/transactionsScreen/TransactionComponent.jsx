import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

const TransactionComponent = () => {
    return (
        <div className="pl-20 h-100%">
            <>
                <Navbar />
                <div></div>
            </>
        </div>
    );
};

export default TransactionComponent;
