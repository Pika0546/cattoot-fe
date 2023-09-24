import React, { useEffect, useState } from "react";
import ClickAwayListener from "@mui/base/ClickAwayListener";
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
import { useForm } from "react-hook-form";
import * as MESSAGE from "../../resource/message";
import { API_STATUS } from "../../config/common";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { updatePassword, logout } from "../../service/AccountService";
import InPageLoading from "../PageLoading/InPageLoading";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hook/useToast";
import "../../App.css";
import cssStyle from "./PersonalPage.module.css";
const theme = createTheme();
export default function ChangePassForm(props) {
    const [incorrectPass, setIncorrectPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();
    const onSubmit = async (data) => {
        const updateData = {
            password: data.password,
            newPassword: data.newPassword,
        };
        try {
            // console.log(updateData)
            setLoading(true);
            const res = await updatePassword(updateData);
            console.log(res);
            setLoading(false);

            if (res.status === API_STATUS.INVALID_INPUT) {
                setIncorrectPass(true);
            }

            if (res.status === API_STATUS.OK) {
                setIncorrectPass(false);
                logout();
                navigate("/login");
                toast.success("Đổi mật khẩu thành công");
            }
        } catch (err) {
            setLoading(false);
            console.log(err);
        }
    };

    const handlePassChange = () => {
        setIncorrectPass(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <main>
                <form
                    className={`${cssStyle["login-form"]}`}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <TextField
                        label="Mật khẩu hiện tại"
                        type="password"
                        fullWidth
                        required
                        variant="outlined"
                        margin="normal"
                        sx={{
                            "& fieldset": {
                                borderColor: "#a1a1a1",
                            },
                            "& .MuiInputBase-root:hover fieldset": {
                                borderColor: "#fff",
                            },
                        }}
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
                        error={!!incorrectPass}
                        helperText={
                            incorrectPass ? "Mật khẩu không đúng" : null
                        }
                    />
                    <TextField
                        label="Mật khẩu mới"
                        type="password"
                        fullWidth
                        required
                        variant="outlined"
                        margin="normal"
                        sx={{
                            "& fieldset": {
                                borderColor: "#a1a1a1",
                            },
                            "& .MuiInputBase-root:hover fieldset": {
                                borderColor: "#fff",
                            },
                        }}
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
                        {...register("newPassword")}
                    />
                    <TextField
                        label="Nhập lại mật khẩu mới"
                        type="password"
                        fullWidth
                        required
                        variant="outlined"
                        margin="normal"
                        sx={{
                            "& fieldset": {
                                borderColor: "#a1a1a1",
                            },
                            "& .MuiInputBase-root:hover fieldset": {
                                borderColor: "#fff",
                            },
                        }}
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
                                value === watch("newPassword") ||
                                "Mật khẩu không trùng khớp",
                        })}
                        error={!!errors?.confirmPassword}
                        helperText={
                            errors?.confirmPassword
                                ? errors.confirmPassword.message
                                : null
                        }
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
                                    <Box>Đang Lưu</Box>
                                    <CircularProgress
                                        size={20}
                                        sx={{
                                            color: "#fff",
                                        }}
                                    />
                                </Stack>
                            ) : (
                                "Đổi mật khẩu"
                            )}
                        </button>
                    </div>
                </form>
                <button
                    className={`${cssStyle["link-btn"]}`}
                    onClick={() => props.onFormSwitch("name")}
                >
                    Bạn muốn đổi tên
                </button>
            </main>
        </ThemeProvider>
    );
}
