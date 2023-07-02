import React from "react";
import firebase from "firebase/compat/app";
import 'firebaseui/dist/firebaseui.css'

import { useEffect } from "react";
import StyledFirebaseAuth from "./StyledFirebaseAuth";

import auth from '../../services/auth'

const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: '/home',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
        signInSuccessWithAuthResult: () => false
    }
}

const LoginComponent = () => {
    const [isAuth, setIsAuth] = React.useState(false);

    useEffect(() => {
        const unregisterAuthObserver =  auth.onAuthStateChanged(user => {
            setIsAuth(!!user);
        })
        return () => unregisterAuthObserver();
    })

    if (!isAuth) {
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
                                <h1 className="text-center my-3 title">Login Page</h1>
                                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
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
                            <h1 className="text-center my-3 title">My App</h1>
                            <p>Welcome {auth.currentUser.displayName}! You are now signed-in!</p>
                            <button onClick={() => auth.signOut()}>Sign-out</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

};

export default LoginComponent;
