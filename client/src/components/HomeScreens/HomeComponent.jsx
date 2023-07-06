import React from "react";
import auth from "../../services/auth";
import { useNavigate } from "react-router-dom";
import * as actionAuth from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

// IMPORT COMPONENTS
import Sidebar from "./Sidebar";

const HomeComponent = () => {
    // const getAccessToken = async () => {

    //     console.log("token", token);
    // };

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = () => {
        auth.signOut();
        dispatch(actionAuth.logout());
        navigate("/auth");
    };

    return (
        <div className="w-full h-100% bg-white-secondary">
            <Sidebar />
            <Outlet />
        </div>
    );
};
export default HomeComponent;
