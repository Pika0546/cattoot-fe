import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { TextField, Alert, Stack, Box, CircularProgress } from "@mui/material";
import { forgotPassword } from "../../service/AccountService";
import { API_STATUS } from "../../config/common";
import * as MESSAGE from "../../resource/message";

import cssStyle from "./ForgotPasswordForm.module.css";

const ForgotPasswordForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [emailNotExist, setEmailNotExist] = useState(false);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingDots, setLoadingDots] = useState([".", ".", "."]);
    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const res = await forgotPassword(data);
            console.log(res);
            setLoading(false);
            if (res.status === API_STATUS.AUTHENTICATE) {
                if (res.message === MESSAGE.NOT_FOUND_ACCOUNT) {
                    setEmailNotExist(true);
                }
            }
            if (res.status === API_STATUS.OK) {
                setMsg(MESSAGE.SEND_RESET_PASSWORD_EMAIL(data.email));
                setEmailNotExist(false);
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

    return (
        <div className={`${cssStyle["form-container"]}`}>
            <h2 className={`${cssStyle["form-title"]}`}>Đặt lại mật khẩu</h2>
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
                                <Box>Đang tải</Box>
                                <CircularProgress
                                    size={20}
                                    sx={{
                                        color: "#fff",
                                    }}
                                />
                            </Stack>
                        ) : (
                            "Đặt lại mật khẩu"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ForgotPasswordForm;
