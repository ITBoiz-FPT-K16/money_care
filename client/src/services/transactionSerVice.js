import { Message } from "@mui/icons-material";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getTransactionsByTimeRange = async (time, token) => {
    try {
        const res = await axios.get(`${API_URL}/transactions/${time}/overall`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("res.data", res.data);
        return {
            errCode: 0,
            data: res.data,
            message: "Get transaction by time range successfully",
        };
    } catch (error) {
        return { errCode: 1, data: null, message: error.message };
    }
};

export const getAllTransactions = async (token) => {
    const res = await axios.get(`${API_URL}/transactions/total`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log("rea all transaction>>>", res.data);
};

export const createTransactionIncome = async (data, token) => {
    try {
        const res = await axios.post(`${API_URL}/incomes`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("res.data", res.data);
        return {
            errCode: 0,
            data: res.data,
            message: "Create transaction successfully",
        };
    } catch (error) {
        return { errCode: 1, data: null, message: error.response.data.message };
    }
};

export const createTransactionExpense = async (data, token) => {
    try {
        const res = await axios.post(`${API_URL}/expenses`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("res.data", res.data);
        return {
            errCode: 0,
            data: res.data,
            message: "Create transaction successfully",
        };
    } catch (error) {
        return { errCode: 1, data: null, message: error.response.data.message };
    }
};
