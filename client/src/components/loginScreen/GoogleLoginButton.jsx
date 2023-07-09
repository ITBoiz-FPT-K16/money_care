import React from "react";
import { GoogleLogin } from "react-google-login";
const GoogleLoginButton = () => {
    const responseGoogle = (response) => {
        console.log(response);
        // Handle the login response here
    };
    return (
        <GoogleLogin
            clientId="343464764455-n689aefusle0migb3k6fdf9mkuds8k9g.apps.googleusercontent.com"
            buttonText="Login with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={"single_host_origin"}
            style={{
                textAlign: "center",
                width: "100%",
            }}
        />
    );
};

export default GoogleLoginButton;
