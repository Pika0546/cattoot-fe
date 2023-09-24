import React, { useEffect, useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { TextField, Alert, Stack, Box, CircularProgress } from "@mui/material";
import { resetPassword } from "../../service/AccountService";
import * as MESSAGE from "../../resource/message";
import { API_STATUS, HTTP_METHOD } from "../../config/common";
import { makeRequest } from "../../utilities/api";
import { Link, useParams } from "react-router-dom";
import Error from "../Error/Error";
import InPageLoading from "../PageLoading/InPageLoading";

import cssStyle from "./ResetPassword.module.css";

const ResetPassword = () => {
    const [loadingPage, setLoadingPage] = useState(true);
    const [validUrl, setValidUrl] = useState(false);
    const param = useParams();

    useEffect(() => {
        const verifyEmailUrl = async () => {
            try {
                //makeRequest
                const VERIFY_URL = `/account/${param.id}/reset_password/${param.token}`;
                const res = await makeRequest(HTTP_METHOD.GET, VERIFY_URL);
                // console.log(res);
                if (res.status === API_STATUS.NOT_FOUND) {
                    setLoadingPage(false);
                    setValidUrl(false);
                }
                if (res.status === API_STATUS.OK) {
                    setLoadingPage(false);
                    setValidUrl(true);
                }
            } catch (error) {
                console.log(error);
                setLoadingPage(false);
                setValidUrl(false);
            }
        };
        verifyEmailUrl();
    }, [param]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm();
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const password = data.password;
            const accountID = param.id;
            const res = await resetPassword({ accountID, password });
            console.log(res);
            setLoading(false);
            if (res.status === API_STATUS.OK) {
                setMsg(MESSAGE.SUCCESS_CHANGE_PASSWORD);
            }
        } catch (err) {
            setLoading(false);
            console.log(err);
        }
    };

    return (
        <Fragment>
            {loadingPage ? (
                <InPageLoading></InPageLoading>
            ) : validUrl ? (
                <div className={`${cssStyle["form-container"]}`}>
                    <h2 className={`${cssStyle["form-title"]}`}>
                        Đặt lại mật khẩu
                    </h2>
                    <form
                        className={`${cssStyle["login-form"]}`}
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {msg ? (
                            <>
                                <Alert
                                    variant="filled"
                                    severity="success"
                                    sx={{
                                        margin: "2rem 0 0 0",
                                    }}
                                >
                                    {msg}
                                </Alert>
                                <div className={`${cssStyle["btn-center"]}`}>
                                    <Link to="/login">
                                        <button
                                            className="btn-hover color-1"
                                            type="button"
                                            style={{
                                                ...(loading && {
                                                    backgroundColor: "grey",
                                                    backgroundImage: "unset",
                                                    boxShadow: "unset",
                                                }),
                                            }}
                                        >
                                            Đăng nhập
                                        </button>
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
                    </form>
                </div>
            ) : (
                <Error></Error>
            )}
        </Fragment>
    );
};

export default ResetPassword;
