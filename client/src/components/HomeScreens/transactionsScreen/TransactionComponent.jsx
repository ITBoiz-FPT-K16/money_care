import React, { useEffect } from "react";
import Navbar from "../Navbar";
import TransactionsListComponent from "./TransactionsListComponent";
import * as actionTransactions from "../../../redux/transactionSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getTransactionsByTimeRange } from "../../../services/transactionSerVice";
import moment from "moment";
const TransactionComponent = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.auth.user.accessToken);
    const fetchTransactions = async () => {
        dispatch(actionTransactions.getTransactionStart);
        const time = moment(new Date()).format("YYYY/MM");
        const res = await getTransactionsByTimeRange(time, token);
        if (res.errCode === 0) {
            let data = res.data;
            res.data.timeRange = time;
            dispatch(actionTransactions.getTransactionSuccess(data));
        } else {
            dispatch(actionTransactions.getTransactionFailure());
            toast.error(res.message);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div className="pl-20 h-100%">
            <>
                <Navbar />
                <TransactionsListComponent />;
            </>
        </div>
    );
};

export default TransactionComponent;
