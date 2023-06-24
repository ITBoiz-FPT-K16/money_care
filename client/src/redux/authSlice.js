import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        id: null,
        name: null,
        email: null,
        token: null,
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
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
    authSlice.actions;
export default authSlice.reducer;
