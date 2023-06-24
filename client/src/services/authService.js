const VITE_API_URL = import.meta.env.VITE_API_URL;
import axios from "axios";
export const loginUser = async (form) => {
    try {
        console.log("loginUser" + VITE_API_URL);
        const res = await axios.post(`${VITE_API_URL}/auth/login`, form);
        //case success
        return {
            errCode: 0,
            data: res.data,
            message: "Login success",
        };
    } catch (error) {
        //case error
        console.log(error);
        return {
            errCode: 1,
            data: null,
            message: error.message,
        };
    }
};

export const registerUser = async (form) => {
    try {
        const res = await axios.post(`${VITE_API_URL}/auth/register`, form);
        //case success
        return {
            errCode: 0,
            data: res.data,
            message: "Register success",
        };
    } catch (error) {
        //case error
        console.log(error);
        return {
            errCode: 1,
            data: null,
            message: error.message,
        };
    }
};
