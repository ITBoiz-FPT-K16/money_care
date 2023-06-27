import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { TextField, Button, Typography, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginStart, loginSuccess, loginFailure } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginUser, registerUser } from "../../services/authService";
import GoogleLoginButton from "./googleLoginButton";
const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

const registerSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
});

let initialValueLogin = {
    email: "",
    password: "",
};

const initialValueRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
};
const FormLogin = () => {
    const navigate = useNavigate();
    const [typeForm, setTypeForm] = useState("login");
    const dispatch = useDispatch();

    console.log("typeForm", typeForm);

    const handleLogin = async (values, { setSubmitting }) => {
        console.log("values", values);
        setSubmitting(true);

        if (typeForm === "login") {
            const form = {
                email: values.email,
                password: values.password,
            };
            console.log("form will sent to login >>>", form);
            dispatch(loginStart());
            const res = await loginUser(form);
            console.log("res", res);
            if (res.errCode === 0) {
                dispatch(loginSuccess());
                toast.success(res.message);
                navigate("/home");
            } else {
                dispatch(loginFailure());
                toast.error(res.message);
            }
        } else {
            const form = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
            };
            console.log("form", form);
            const res = await registerUser(form);
            console.log("res from register user", res);

            if (res.errCode === 0) {
                toast.success(res.message);
                setTypeForm("login");
                initialValueLogin = {
                    email: res.data.email,
                    password: "",
                };
            }
        }
    };

    return (
        <>
            <Formik
                initialValues={
                    typeForm === "login"
                        ? initialValueLogin
                        : initialValueRegister
                }
                validationSchema={
                    typeForm === "login" ? loginSchema : registerSchema
                }
                onSubmit={handleLogin}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    isSubmitting,
                    resetForm,
                    setFieldValue,
                }) => (
                    <Form className="text-center">
                        <Typography
                            variant="h4"
                            style={{
                                fontWeight: "bold",
                                color: "black",
                                marginTop: "20px",
                            }}
                        >
                            {typeForm === "login" ? "Login" : "Register"}
                        </Typography>
                        {typeForm !== "login" && (
                            <>
                                <Field
                                    as={TextField}
                                    size="small"
                                    name="firstName"
                                    label="First Name"
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    error={
                                        touched.firstName &&
                                        Boolean(errors.firstName)
                                    }
                                    helperText={
                                        touched.firstName && errors.firstName
                                    }
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName}
                                    className="sm:col-span-2 md:col-span-1"
                                />

                                <Field
                                    as={TextField}
                                    size="small"
                                    name="lastName"
                                    label="Last Name"
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    error={
                                        touched.lastName &&
                                        Boolean(errors.lastName)
                                    }
                                    helperText={
                                        touched.lastName && errors.lastName
                                    }
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lastName}
                                    className="sm:col-span-2 md:col-span-1"
                                />
                            </>
                        )}
                        <Field
                            as={TextField}
                            size="small"
                            name="email"
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            className="col-span-2"
                        />

                        <Field
                            as={TextField}
                            size="small"
                            name="password"
                            label="Password"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            className="col-span-2"
                            type="password"
                        />

                        {typeForm !== "login" && (
                            <Field
                                as={TextField}
                                size="small"
                                name="confirmPassword"
                                label="Confirm Password"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                error={
                                    touched.confirmPassword &&
                                    Boolean(errors.confirmPassword)
                                }
                                helperText={
                                    touched.confirmPassword &&
                                    errors.confirmPassword
                                }
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.confirmPassword}
                                className="col-span-2"
                                type="password"
                            />
                        )}

                        <div className="mt-4">
                            {typeForm === "login" ? (
                                <Button
                                    variant="contained"
                                    disabled={isSubmitting}
                                    type="submit"
                                >
                                    {isSubmitting ? "LOADING" : "LOGIN"}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    disabled={isSubmitting}
                                    type="submit"
                                >
                                    {isSubmitting ? "LOADING" : "REGISTER"}
                                </Button>
                            )}
                        </div>

                        <div className="text-clip">
                            {typeForm === "login" ? (
                                <Typography className="text-black">
                                    You don't have an account?{" "}
                                    <span
                                        className="text-blue-600 underline decoration-solid cursor-pointer"
                                        onClick={() => {
                                            setTypeForm("register");
                                            resetForm();
                                        }}
                                    >
                                        Register
                                    </span>
                                </Typography>
                            ) : (
                                <Typography className="text-black">
                                    You have an account?{" "}
                                    <span
                                        className="text-blue-600 underline decoration-solid cursor-pointer"
                                        onClick={() => {
                                            setTypeForm("login");
                                            resetForm();
                                        }}
                                    >
                                        Login
                                    </span>
                                </Typography>
                            )}
                        </div>
                    </Form>
                )}
            </Formik>
            <Divider>Or</Divider>
            <GoogleLoginButton />
        </>
    );
};

export default FormLogin;
