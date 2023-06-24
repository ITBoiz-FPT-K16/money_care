import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const RedirectPage = () => {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.auth.user);
    console.log(currentUser);
    const checkIsUserLoggedIn = () => {
        if (currentUser.isLogedIn) {
            return true;
        } else {
            return false;
        }
    };

    useEffect(() => {
        if (checkIsUserLoggedIn()) {
            navigate("/home");
        } else {
            navigate("/auth");
        }
    }, []);
    return <div></div>;
};

export default RedirectPage;
