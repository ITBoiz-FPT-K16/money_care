import React from "react";
import auth from "../../services/auth";
import { useNavigate } from "react-router-dom";
import * as actionAuth from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

// IMPORT COMPONENTS
import Sidebar from "./Sidebar";

const HomeComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = () => {
        auth.signOut();
        dispatch(actionAuth.logout());
        navigate("/auth");
    };

    return (
        <div className="w-full h-100vh bg-white-secondary">
            <Sidebar />
            <Outlet />
        </div>
    );
};
export default HomeComponent;
