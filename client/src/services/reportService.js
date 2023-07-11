import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getTransactionDetail = async (timeRange, token) => {
    try {
        console.log("timeRage in service>>", timeRange);
        console.log("token in service>>>", token);

        const res = await axios.get(
            `${API_URL}/transactions/${timeRange}/detail`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        console.log("res>>>   ", res.data);

        return {
            errCode: 0,
            data: res.data,
            message: "success",
        };
    } catch (err) {
        console.error("error get transaction detail>>>", err.response.data);
        return {
            errCode: 1,
            data: null,
            message: err,
        };
    }
};
