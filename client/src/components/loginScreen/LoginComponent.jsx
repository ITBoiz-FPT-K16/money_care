import React from "react";
import firebase from "firebase/compat/app";
import "firebaseui/dist/firebaseui.css";

import { useEffect } from "react";
import StyledFirebaseAuth from "./StyledFirebaseAuth";

import auth from "../../services/auth";

import * as actionAuth from "../../redux/authSlice";
import * as actionTransactions from "../../redux/transactionSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import moment from "moment";
import { getTotalAmount } from "../../services/authService";
const uiConfig = {
    signInFlow: "popup",
    signInSuccessUrl: "/home",
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
        signInSuccessWithAuthResult: () => false,
    },
};

const LoginComponent = () => {
    const currentUser = useSelector((state) => state.auth.auth.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isAuth, setIsAuth] = React.useState(false);
    console.log("isAuth", isAuth);
    console.log("auth", auth);

    const doAfterAuth = async () => {
        if (isAuth) {
            console.log("doAfterAuth: isAuth is true");
            const token = await auth.currentUser.getIdToken(true);
            console.log("token from getIdToken()", token);

            dispatch(
                actionAuth.loginSuccess({
                    uid: auth.currentUser.uid,
                    name: auth.currentUser.displayName,
                    email: auth.currentUser.email,
                    accessToken: token,
                    refresh_token: auth.currentUser.refreshToken,
                    userImg: auth.currentUser.photoURL,
                })
            );

            const totalAmount = await getTotalAmount(token);
            if (totalAmount.errCode === 0) {
                dispatch(actionAuth.setTotalAmount(totalAmount.data.total));
            }

            navigate("/home/transactions");

            toast.success("Login Success");
        }
    };

    useEffect(() => {
        const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
            setIsAuth(!!user);
        });
        return () => unregisterAuthObserver();
    });

    useEffect(() => {
        if (isAuth) {
            doAfterAuth();
        }
    }, [isAuth]);

    // if (!isAuth) {
    //     return (
    //         <div className=" flex justify-center items-center">
    //             <div
    //                 className="login rounded-lg"
    //                 style={{ height: "600px", width: "1000px" }}
    //             >
    //                 <div
    //                     className=" grid grid-cols-5"
    //                     style={{ height: "100%" }}
    //                 >
    //                     <div className="col-span-3 bg-red-400 rounded-tl-lg rounded-bl-lg   h-100%"></div>
    //                     <div className="col-span-2 bg-yellow-100 rounded-tr-lg rounded-br-lg h-100% text-center">
    //                         <div className="p-5">
    //                             <h1 className="text-center my-3 title">
    //                                 Login Page
    //                             </h1>
    //                             <StyledFirebaseAuth
    //                                 uiConfig={uiConfig}
    //                                 firebaseAuth={auth}
    //                             />
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }
    // return (
    //     <div className=" flex justify-center items-center">
    //         <div
    //             className="login rounded-lg"
    //             style={{ height: "600px", width: "1000px" }}
    //         >
    //             <div className=" grid grid-cols-5" style={{ height: "100%" }}>
    //                 <div className="col-span-3 bg-red-400 rounded-tl-lg rounded-bl-lg   h-100%"></div>
    //                 <div className="col-span-2 bg-yellow-100 rounded-tr-lg rounded-br-lg h-100% text-center">
    //                     <div className="p-5">
    //                         <h1 className="text-center my-3 title">My App</h1>
    //                         <p>
    //                             Welcome {auth.currentUser.displayName}! You are
    //                             now signed-in!
    //                         </p>
    //                         <button onClick={() => auth.signOut()}>
    //                             Sign-out
    //                         </button>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );

    return (
        <>
            {!isAuth ? (
                <div className=" flex justify-center items-center">
                    <div
                        className="login rounded-lg"
                        style={{ height: "600px", width: "1000px" }}
                    >
                        <div
                            className=" grid grid-cols-5"
                            style={{ height: "100%" }}
                        >
                            <div className="col-span-3 bg-red-400 rounded-tl-lg rounded-bl-lg   h-100%"></div>
                            <div className="col-span-2 bg-yellow-100 rounded-tr-lg rounded-br-lg h-100% text-center">
                                <div className="p-5">
                                    <h1 className="text-center my-3 title">
                                        Login Page
                                    </h1>
                                    <StyledFirebaseAuth
                                        uiConfig={uiConfig}
                                        firebaseAuth={auth}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className=" flex justify-center items-center">
                    <div
                        className="login rounded-lg"
                        style={{ height: "600px", width: "1000px" }}
                    >
                        <div
                            className=" grid grid-cols-5"
                            style={{ height: "100%" }}
                        >
                            <div className="col-span-3 bg-red-400 rounded-tl-lg rounded-bl-lg   h-100%"></div>
                            <div className="col-span-2 bg-yellow-100 rounded-tr-lg rounded-br-lg h-100% text-center">
                                <div className="p-5">
                                    <h1 className="text-center my-3 title">
                                        My App
                                    </h1>
                                    <p>
                                        Welcome {auth.currentUser.displayName}!
                                        You are now signed-in!
                                    </p>
                                    <button onClick={() => auth.signOut()}>
                                        Sign-out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LoginComponent;
