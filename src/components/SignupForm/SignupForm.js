import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    Grid,
    Paper,
    Avatar,
    TextField,
    Button,
    Typography,
    Link,
    Alert,
    Stack,
    Box,
    CircularProgress,
} from "@mui/material";
import { signup, googleSignup } from "../../service/AccountService";
import { API_STATUS } from "../../config/common";
import * as MESSAGE from "../../resource/message";
import { useNavigate } from "react-router-dom";
import { GOOGLE_CLIENT_ID } from "../../config";
import jwt_decode from "jwt-decode";
import cssStyle from "./SignupForm.module.css";

const SignupForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const handleGoogleLogIn = async (response) => {
        const data = jwt_decode(response.credential);
        const email = data.email;
        const fullname = data.name;
        const token = response.credential;
        setLoading(true)
        const res = await googleSignup({ email, fullname, token });
        console.log(res);
        if (res.status === API_STATUS.OK) {
            navigate("/group");
        }
        setLoading(false);
    };

    useEffect(() => {
        /*global google*/
        if (window.google) {
            google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleLogIn,
            });
            google.accounts.id.renderButton(
                document.getElementById("GoogleSignUpDiv"),
                { theme: "outline", size: "large", text: "signup_with" }
            );
        }
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();
    const [emailExist, setEmailExist] = useState(false);
    const [msg, setMsg] = useState("");
    const onSubmit = async (data) => {
        const signupData = {
            password: data.password,
            email: data.email,
            fullname: data.fullname,
        };
        console.log(signupData);
        try {
            setLoading(true);
            const res = await signup(signupData);
            setLoading(false);
            console.log(res);
            if (res.status === API_STATUS.EXISTED) {
                if (res.message === MESSAGE.EXISTED_EMAIL) {
                    setEmailExist(true);
                    setMsg("");
                }
            }
            if (res.status === API_STATUS.OK) {
                setEmailExist(false);
                setMsg(MESSAGE.SEND_VERIFY_EMAIL(data.email));
            }
        } catch (err) {
            setLoading(false);
            console.log(err);
        }
    };

    const handleEmailChange = () => {
        setEmailExist(false);
    };

    return (
        <div className={`${cssStyle["form-container"]}`}>
            <h2 className={`${cssStyle["form-title"]}`}>Đăng ký</h2>
            <form
                className={`${cssStyle["login-form"]}`}
                onSubmit={handleSubmit(onSubmit)}
            >
                <TextField
                    autoFocus
                    label="Họ tên"
                    fullWidth
                    required
                    variant="standard"
                    margin="normal"
                    inputProps={{
                        style: {
                            fontSize: 18,
                            fontFamily: "PatrickHand",
                            color: "white",
                            paddingLeft: "0.5rem",
                        },
                    }} // font size of input text
                    InputLabelProps={{
                        style: {
                            fontSize: 20,
                            fontFamily: "PatrickHand",
                            color: "white",
                        },
                    }} // font size of input label
                    {...register("fullname")}
                    sx={{
                        "& .MuiInputBase-root::before": {
                            borderBottom: "1px solid #fff",
                        },
                        "& .MuiInputBase-root:hover:not(.Mui-disabled):before":
                            {
                                borderBottom: "2px solid #fff",
                            },
                        "& .MuiInputBase-root::after": {
                            borderBottom: "2px solid #852D91",
                        },
                    }}
                />
                <TextField
                    label="Email"
                    fullWidth
                    required
                    variant="standard"
                    margin="normal"
                    inputProps={{
                        style: {
                            fontSize: 18,
                            fontFamily: "PatrickHand",
                            color: "white",
                            paddingLeft: "0.5rem",
                        },
                    }} // font size of input text
                    InputLabelProps={{
                        style: {
                            fontSize: 20,
                            fontFamily: "PatrickHand",
                            color: "white",
                        },
                    }} // font size of input label
                    {...register("email", {
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Địa chỉ email không hợp lệ",
                        },
                    })}
                    onChange={handleEmailChange}
                    error={!!errors?.email || !!emailExist}
                    helperText={
                        errors?.email
                            ? errors.email.message
                            : emailExist
                            ? MESSAGE.EXISTED_EMAIL
                            : null
                    }
                    sx={{
                        "& .MuiInputBase-root::before": {
                            borderBottom: "1px solid #fff",
                        },
                        "& .MuiInputBase-root:hover:not(.Mui-disabled):before":
                            {
                                borderBottom: "2px solid #fff",
                            },
                        "& .MuiInputBase-root::after": {
                            borderBottom: "2px solid #852D91",
                        },
                    }}
                />
                <TextField
                    label="Mật khẩu"
                    type="password"
                    fullWidth
                    required
                    variant="standard"
                    margin="normal"
                    inputProps={{
                        style: {
                            fontSize: 18,
                            fontFamily: "PatrickHand",
                            color: "white",
                            paddingLeft: "0.5rem",
                        },
                    }} // font size of input text
                    InputLabelProps={{
                        style: {
                            fontSize: 20,
                            fontFamily: "PatrickHand",
                            color: "white",
                        },
                    }} // font size of input label
                    {...register("password")}
                    sx={{
                        "& .MuiInputBase-root::before": {
                            borderBottom: "1px solid #fff",
                        },
                        "& .MuiInputBase-root:hover:not(.Mui-disabled):before":
                            {
                                borderBottom: "2px solid #fff",
                            },
                        "& .MuiInputBase-root::after": {
                            borderBottom: "2px solid #852D91",
                        },
                    }}
                />
                <TextField
                    label="Nhập lại mật khẩu"
                    type="password"
                    fullWidth
                    required
                    variant="standard"
                    margin="normal"
                    inputProps={{
                        style: {
                            fontSize: 18,
                            fontFamily: "PatrickHand",
                            color: "white",
                            paddingLeft: "0.5rem",
                        },
                    }} // font size of input text
                    InputLabelProps={{
                        style: {
                            fontSize: 20,
                            fontFamily: "PatrickHand",
                            color: "white",
                        },
                    }} // font size of input label
                    {...register("confirmPassword", {
                        validate: (value) =>
                            value === watch("password") ||
                            "Mật khẩu không trùng khớp",
                    })}
                    error={!!errors?.confirmPassword}
                    helperText={
                        errors?.confirmPassword
                            ? errors.confirmPassword.message
                            : null
                    }
                    sx={{
                        "& .MuiInputBase-root::before": {
                            borderBottom: "1px solid #fff",
                        },
                        "& .MuiInputBase-root:hover:not(.Mui-disabled):before":
                            {
                                borderBottom: "2px solid #fff",
                            },
                        "& .MuiInputBase-root::after": {
                            borderBottom: "2px solid #852D91",
                        },
                    }}
                />
                {msg && (
                    <Alert variant="filled" severity="success">
                        {msg}
                    </Alert>
                )}
                <div className={`${cssStyle["btn-center"]}`}>
                    <button
                        className="btn-hover color-1"
                        type="submit"
                        disabled={loading}
                        style={{
                            ...(loading && {
                                backgroundColor: "grey",
                                backgroundImage: "unset",
                                boxShadow: "unset",
                            }),
                        }}
                    >
                        {loading ? (
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Box>Đang đăng ký</Box>
                                <CircularProgress
                                    size={20}
                                    sx={{
                                        color: "#fff",
                                    }}
                                />
                            </Stack>
                        ) : (
                            "Đăng ký"
                        )}
                    </button>
                </div>
                <Typography
                    sx={{
                        color: "white",
                        fontSize: 18,
                        fontFamily: "PatrickHand",
                        margin: "0",
                    }}
                >
                    ------------ hoặc ------------
                </Typography>
                <div
                    className={`${cssStyle["btn-center"]}`}
                    style={{
                        margin: "20px 0px",
                    }}
                    id="GoogleSignUpDiv"
                ></div>
            </form>
            <Typography
                sx={{
                    color: "white",
                    fontSize: 18,
                    fontFamily: "PatrickHand",
                    margin: "1rem 0 0 0",
                }}
            >
                Đã có tài khoản? <Link href="/login">Đăng nhập ngay</Link>
            </Typography>
        </div>
    );
};

export default SignupForm;
