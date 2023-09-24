import React, { useEffect, useState } from "react";
// import ClickAwayListener from '@mui/base/ClickAwayListener';
import {
    TextField,
    Stack,
    Box,
    CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { updateName } from "../../service/AccountService";
import { API_STATUS } from "../../config/common";
import {useToast} from "../../hook/useToast"

import "../../App.css"
import cssStyle from "./PersonalPage.module.css"

const theme = createTheme();

export default function ChangeNameForm(props) {
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
        try {
            console.log(data)
            setLoading(true);
            const res = await updateName(data);
            console.log(res);
            setLoading(false);
            
            if (res.status === API_STATUS.OK) {
                window.location.reload();
                toast.info("Đổi tên thành công")
            }
        } catch (err) {
            setLoading(false);
            console.log(err);
        }
    };

    return (
        <ThemeProvider theme={theme}>

            <main>
                <form className={`${cssStyle["login-form"]}`}

                onSubmit={handleSubmit(onSubmit)}
                >
                    <TextField
                        label="Đặt tên mới"
                        fullWidth
                        required
                        variant="outlined"
                        margin="normal"
                        sx={{
                            "& fieldset": {
                                borderColor: "#a1a1a1"
                            },
                            "& .MuiInputBase-root:hover fieldset": {
                                borderColor: "#fff"
                            }
                        }}
                        inputProps={{
                            style: { fontSize: 20, fontFamily: 'PatrickHand', color: 'white', paddingLeft: '0.5rem' }

                        }} // font size of input text
                        InputLabelProps={{
                            style: { fontSize: 20, fontFamily: 'PatrickHand', color: 'white' }
                        }} // font size of input label
                        {...register("fullname")}

                    />
                    <div className={`${cssStyle["btn-center"]}`}>
                        <button
                            className='btn-hover color-1'
                            type="submit"
                            disabled={loading}
                            style={{
                                ...(loading && {
                                    backgroundColor: "grey",
                                    backgroundImage: "unset",
                                    boxShadow: "unset"
                                })
                            }}

                        >
                            {loading ? (
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Box>
                                        Đang Lưu
                                    </Box>
                                    <CircularProgress size={20}
                                        sx={{
                                            color: "#fff"
                                        }}
                                    />
                                </Stack>
                            ) : "Lưu thông tin"}
                        </button>
                    </div>

                </form>
                <button className={`${cssStyle["link-btn"]}`} onClick={() => props.onFormSwitch('pass')}>Bạn muốn đổi mật khẩu</button>

            </main>

        </ThemeProvider>
    );
}