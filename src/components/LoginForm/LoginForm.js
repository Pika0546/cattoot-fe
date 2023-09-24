import React, { useEffect, useState, useRef } from "react";
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
import { useNavigate, useSearchParams } from "react-router-dom";
import { login, googleLogin } from "../../service/AccountService";
import { API_STATUS } from "../../config/common";
import * as MESSAGE from "../../resource/message";
import { GOOGLE_CLIENT_ID } from "../../config";
import jwt_decode from "jwt-decode";

import cssStyle from "./LoginForm.module.css";
import { navigateAfterLogin } from "../../utilities/login";

// const CssTextField = withStyles({
//     root: {
//         '& label.Mui-focused': {
//             color: 'green',
//         },
//         '& .MuiInput-underline:after': {
//             borderBottomColor: 'green',
//         },
//         '& .MuiOutlinedInput-root': {
//             '& fieldset': {
//                 borderColor: 'red',
//             },
//             '&:hover fieldset': {
//                 borderColor: 'yellow',
//             },
//             '&.Mui-focused fieldset': {
//                 borderColor: 'green',
//             },
//         },
//     },
// })(TextField);
// const useStyles = makeStyles((theme: Theme) =>
//     createStyles({
//         root: {
//             display: 'flex',
//             flexWrap: 'wrap',
//         },
//         margin: {
//             margin: theme.spacing(1),
//         },
//     }),
// );
// const theme = createMuiTheme({
//     palette: {
//       primary: green,
//     },
//   });

const LoginForm = () => {
    const paperStyle = {
        padding: 20,
        height: "70vh",
        width: 300,
        margin: "20px auto",
    };

    //   const classes = useStyles();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleGoogleLogIn = async (response) => {
        const data = jwt_decode(response.credential);
        const email = data.email;
        const fullname = data.name;
        const token = response.credential;
        setLoading(true);
        const res = await googleLogin({ email, fullname, token });
        console.log(res);
        if (res.status === API_STATUS.OK) {
            navigateAfterLogin(searchParams, navigate);
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
                document.getElementById("GoogleSignInDiv"),
                { theme: "outline", size: "large" }
            );
        }
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [emailNotExist, setEmailNotExist] = useState(false);
    const [passwordIncorrect, setPasswordIncorrect] = useState(false);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingDots, setLoadingDots] = useState([".", ".", "."]);
    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const res = await login(data);
            console.log(res);
            setLoading(false);
            if (res.status === API_STATUS.AUTHENTICATE) {
                if (res.message === MESSAGE.NOT_FOUND_ACCOUNT) {
                    setEmailNotExist(true);
                    setPasswordIncorrect(false);
                }
                if (res.message === MESSAGE.INCORRECT_PASSWORD) {
                    setPasswordIncorrect(true);
                    setEmailNotExist(false);
                }
            }
            if (res.status === API_STATUS.NOT_VERIFIED) {
                setMsg(MESSAGE.SEND_VERIFY_EMAIL(data.email));
                setEmailNotExist(false);
                setPasswordIncorrect(false);
            }
            if (res.status === API_STATUS.OK) {
                setEmailNotExist(false);
                setPasswordIncorrect(false);
                navigateAfterLogin(searchParams, navigate);
            }
        } catch (err) {
            setLoading(false);
            console.log(err);
        }
    };

    const intervalRef = useRef(null);
    useEffect(() => {
        if (loading) {
            intervalRef.current = setInterval(() => {
                setLoadingDots((prev) => {
                    if (prev.length >= 3) {
                        return ["."];
                    }
                    const re = [...prev];
                    re.push(".");
                    return re;
                });
            }, [500]);

            return () => {
                clearInterval(intervalRef.current);
            };
        }
    }, [loading]);

    const handleEmailChange = () => {
        setEmailNotExist(false);
    };

    const handlePassChange = () => {
        setPasswordIncorrect(false);
    };

    return (
        <div className={`${cssStyle["form-container"]}`}>
            <h2 className={`${cssStyle["form-title"]}`}>Đăng nhập</h2>
            <form
                className={`${cssStyle["login-form"]}`}
                onSubmit={handleSubmit(onSubmit)}
            >
                {/* <ToastContainer /> */}

                <TextField
                    autoFocus
                    label="Email"
                    fullWidth
                    required
                    variant="standard"
                    margin="normal"
                    // className={classes.margin}
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
                    error={!!errors?.email || !!emailNotExist}
                    helperText={
                        errors?.email
                            ? errors.email.message
                            : emailNotExist
                            ? MESSAGE.NOT_FOUND_ACCOUNT
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
                    onChange={handlePassChange}
                    error={!!passwordIncorrect}
                    helperText={
                        passwordIncorrect ? MESSAGE.INCORRECT_PASSWORD : null
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
                <Typography
                    sx={{
                        color: "white",
                        fontSize: 18,
                        fontFamily: "PatrickHand",
                        margin: "0 0 0 0",
                        display: "flex",
                        justifyContent: "right",
                    }}
                >
                    <Link href="/reset_password">Quên mật khẩu</Link>
                </Typography>
                {msg && (
                    <Alert variant="filled" severity="error">
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
                                <Box>Đang đăng nhập</Box>
                                <CircularProgress
                                    size={20}
                                    sx={{
                                        color: "#fff",
                                    }}
                                />
                            </Stack>
                        ) : (
                            "Đăng nhập"
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
                    id="GoogleSignInDiv"
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
                Chưa có tài khoản? <Link href="/signup">Đăng ký ngay</Link>
            </Typography>
        </div>
    );
};

export default LoginForm;
