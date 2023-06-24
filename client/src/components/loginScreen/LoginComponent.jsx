import React from "react";
import FormLogin from "./FormLogin";
import GoogleLoginButton from "./googleLoginButton";
import { Divider } from "@mui/material";
const LoginComponent = () => {
    return (
        <div className=" flex justify-center items-center">
            <div
                className="login rounded-lg"
                style={{ height: "600px", width: "1000px" }}
            >
                <div className=" grid grid-cols-5" style={{ height: "100%" }}>
                    <div className="col-span-3 bg-red-400 rounded-tl-lg rounded-bl-lg   h-100%"></div>
                    <div className="col-span-2 bg-yellow-100 rounded-tr-lg rounded-br-lg h-100% text-center">
                        <div className="p-5">
                            <FormLogin />
                            <Divider>Or</Divider>
                            <GoogleLoginButton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;
