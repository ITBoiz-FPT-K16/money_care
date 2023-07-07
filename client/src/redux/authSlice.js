import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        uid: null,
        name: null,
        email: null,
        accessToken: null,
        refreshToken: null,
        userImg: null,
        totalAmount: 0,
    },
    isFetching: false,
    isLogedIn: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.isFetching = false;
            state.user = action.payload;
            state.isLogedIn = true;
            state.error = null;
        },

        loginFailure: (state, action) => {
            state.isFetching = false;
            state.error = action.payload;
        },

        logout: (state) => {
            state.user = null;
            state.isFetching = false;
            state.isLogedIn = false;
            state.error = null;
        },

        setTotalAmount: (state, action) => {
            state.user.totalAmount = action.payload;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    setTotalAmount,
} = authSlice.actions;
export default authSlice.reducer;
