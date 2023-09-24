import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { API_STATUS } from "../../config/common";
import * as MESSAGE from "../../resource/message";
import { TextField, Stack, Box, CircularProgress } from "@mui/material";

import cssStyle from "./CreateGroupForm.module.css";
import "../../App.css";
import { useToast } from "../../hook/useToast";
import { createGroup } from "../../service/GroupService";
import { AppContext } from "../../context/AppContext";

const CreateGroupForm = () => {
    const { user } = useContext(AppContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const [existedName, setExistedName] = useState(false);
    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const res = await createGroup(data);
            setLoading(false);

            console.log(res);
            if (res.status === API_STATUS.INVALID_INPUT) {
                if (res.message === MESSAGE.MISSING_INPUT("Tên nhóm")) {
                    toast.error(res.message);
                }
                if (res.message === MESSAGE.MISSING_INPUT("Mô tả nhóm")) {
                    toast.error(res.message);
                }
            }
            if (res.status === API_STATUS.EXISTED) {
                setExistedName(true);
                // toast.error(MESSAGE.EXISTED_GROUP);
            }
            if (res.status === API_STATUS.OK) {
                toast.success(res.message);
                navigate("/group");
            }
        } catch (err) {
            setLoading(false);
            console.log(err);
        }
    };

    const handleNameChange = () => {
        setExistedName(false);
    };

    return (
        <div>
            <div className={`${cssStyle["form-container"]}`}>
                <h2 className={`${cssStyle["form-title"]}`}>Tạo nhóm</h2>
                <form
                    className={`${cssStyle["login-form"]}`}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <TextField
                        label="Tên Nhóm"
                        fullWidth
                        required
                        variant="outlined"
                        margin="normal"
                        placeholder="Nhập tên nhóm (tối đa 100 kí tự)"
                        inputProps={{
                            maxLength: 100,
                            style: {
                                fontSize: 18,
                                fontFamily: "PatrickHand",
                                color: "white",
                            },
                        }} // font size of input text
                        InputLabelProps={{
                            style: {
                                fontSize: 25,
                                fontFamily: "PatrickHand",
                                color: "white",
                            },
                        }} // font size of input label
                        {...register("name", {})}
                        sx={{
                            "& fieldset": {
                                borderColor: "#a1a1a1",
                            },
                            "& .MuiInputBase-root:hover fieldset": {
                                borderColor: "#fff",
                            },
                        }}
                        onChange={handleNameChange}
                        error={!!existedName}
                        helperText={existedName ? MESSAGE.EXISTED_GROUP : null}
                    />
                    <TextField
                        label="Mô Tả"
                        rows={3}
                        multiline
                        required
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        placeholder="Nhập mô tả (tối đa 200 kí tự)"
                        inputProps={{
                            maxLength: 200,
                            style: {
                                fontSize: 18,
                                fontFamily: "PatrickHand",
                                color: "white",
                                height: "6rem",
                            },
                        }} // font size of input text
                        InputLabelProps={{
                            style: {
                                fontSize: 25,
                                fontFamily: "PatrickHand",
                                color: "white",
                            },
                        }} // font size of input label
                        {...register("description", {})}
                        sx={{
                            "& fieldset": {
                                borderColor: "#a1a1a1",
                            },
                            "& .MuiInputBase-root:hover fieldset": {
                                borderColor: "#fff",
                            },
                        }}
                        // {...register("password")}
                        // error={!!passwordIncorrect}
                        // helperText={
                        //     passwordIncorrect
                        //         ? MESSAGE.INCORRECT_PASSWORD
                        //         : null
                        // }
                    />
                    {/* {msg && (
                    <Alert variant="filled" severity="error">
                        {msg}
                    </Alert>
                )} */}
                    <div className={`${cssStyle["btn-center"]}`}>
                        <button
                            className="btn-hover color-1"
                            type="submit"
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
                                    <Box>Đang tạo nhóm</Box>
                                    <CircularProgress
                                        size={20}
                                        sx={{
                                            color: "#fff",
                                        }}
                                    />
                                </Stack>
                            ) : (
                                "Tạo nà (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧"
                            )}
                        </button>
                    </div>
                </form>
                {/* <button className="btn-hover color-background" >Already have an account? Login here.</button> */}
            </div>
        </div>
    );
};

export default CreateGroupForm;
