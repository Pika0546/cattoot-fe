import {
    Grid,
    TextField,
    Typography,
    Stack,
    Button,
    Box,
    MenuItem,
    Select,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "../../../hook/useToast";
import { StoreMallDirectory } from "@mui/icons-material";
import { useMemo } from "react";

const DEFAULT_QUESTION = "Trắc nghiệm nhiều lựa chọn";
const DEFAULT_OPTIONS = [
    {
        key: "Lựa chọn 1",
        value: 0,
        submitBy: [],
    },
    {
        key: "Lựa chọn 2",
        value: 0,
        submitBy: [],
    },
    {
        key: "Lựa chọn 3",
        value: 0,
        submitBy: [],
    },
];

const HeadingSlideSetting = ({ slide, handleChangeSlide }) => {
    const { register, handleSubmit, setValue, getValues, control } = useForm();

    const toast = useToast();
    const warningDelete = () => {
        toast.warning("Không thể xóa lựa chọn này");
    };
    const slideContent = useMemo(() => {
        return slide.content;
    }, [slide]);

    const onSubmitHeading = (data) => {
        const newSlide = slide;
        newSlide.content.heading = data.heading;
        handleChangeSlide(newSlide);
    };

    const onSubmitSubHeading = (data) => {
        const newSlide = slide;
        newSlide.content.subHeading = data.subHeading;
        handleChangeSlide(newSlide);
    };

    const setSlideType = (type) => {
        console.log(type);
        const newSlide = slide;
        newSlide.type = type;
        if (type === "PARAGRAPH") {
            newSlide.content.heading = "Bản trình bày có đoạn văn";
            newSlide.content.paragraph = "";
        }
        if (type === "MULTIPLE_CHOICE") {
            newSlide.content.question = DEFAULT_QUESTION;
            newSlide.content.option = DEFAULT_OPTIONS;
        }
        handleChangeSlide(newSlide);
    };

    useEffect(() => {
        if (slideContent) {
            setValue("heading", slideContent.heading);
            setValue("subHeading", slideContent.subHeading);
        }
    }, [slideContent]);

    return (
        <Box>
            <Typography
                component="p"
                variant="h2"
                align="center"
                color="white"
                marginTop={1.5}
                fontWeight={700}
                fontFamily="PatrickHand"
                fontSize="1.3rem"
            >
                LOẠI SLIDE
            </Typography>
            <Select
                defaultValue={"HEADING"}
                fullWidth
                onChange={(event) => {
                    setSlideType(event.target.value);
                }}
                sx={{
                    m: 1,
                    width: "90%",
                    "& .MuiSelect-select": {
                        fontSize: 20,
                        fontFamily: "PatrickHand",
                        color: "white",
                        paddingRight: "0px !important",
                        paddingLeft: "0px !important",
                    },
                    "& fieldset": {
                        borderColor: "#a1a1a1",
                    },
                    "&:hover": {
                        "&& fieldset": {
                            border: "2px solid #fff",
                        },
                    },
                    ".MuiSvgIcon-root ": {
                        fill: "white !important",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "2px solid #852D91",
                        borderColor: "#852D91 !important",
                    },
                }}
            >
                <MenuItem value="MULTIPLE_CHOICE">Multiple Choice</MenuItem>
                <MenuItem value="PARAGRAPH">Paragraph</MenuItem>
                <MenuItem value="HEADING">Heading</MenuItem>
            </Select>
            <Typography
                component="p"
                variant="h2"
                align="center"
                color="white"
                marginTop={1.5}
                fontWeight={700}
                fontFamily="PatrickHand"
                fontSize="1.3rem"
            >
                TIÊU ĐỀ
            </Typography>
            <Controller
                control={control}
                name="heading"
                defaultValue={slideContent.heading}
                render={({
                    field: { onChange, value },
                    fieldState: { error },
                }) => (
                    <TextField
                        fullWidth
                        required
                        variant="outlined"
                        margin="normal"
                        placeholder="Tối đa 150 kí tự"
                        sx={{
                            m: 1,
                            width: "90%",
                            "& fieldset": {
                                borderColor: "#a1a1a1",
                            },
                            "& .MuiOutlinedInput-root:hover fieldset": {
                                border: "2px solid #fff",
                            },
                            "& .Mui-focused fieldset": {
                                border: "1px solid #852D91",
                                borderColor: "#852D91 !important",
                            },
                        }}
                        inputProps={{
                            maxLength: 150,
                            style: {
                                fontSize: 20,
                                fontFamily: "PatrickHand",
                                color: "white",
                                paddingLeft: "1.1rem",
                            },
                        }} // font size of input text
                        InputLabelProps={{
                            style: {
                                fontSize: 20,
                                fontFamily: "PatrickHand",
                                color: "white",
                            },
                        }} // font size of input label
                        onBlur={handleSubmit(onSubmitHeading)}
                        value={value}
                        onChange={onChange}
                    />
                )}
            />
            <Typography
                component="p"
                variant="h2"
                align="center"
                color="white"
                // gutterBottom.
                marginTop={2}
                fontWeight={700}
                fontFamily="PatrickHand"
                fontSize="1.3rem"
            >
                TIÊU ĐỀ PHỤ
            </Typography>
            <Controller
                control={control}
                name="subHeading"
                defaultValue={slideContent.subHeading}
                render={({
                    field: { onChange, value },
                    fieldState: { error },
                }) => (
                    <TextField
                        fullWidth
                        required
                        variant="outlined"
                        margin="normal"
                        placeholder="Tối đa 500 kí tự"
                        sx={{
                            m: 1,
                            width: "90%",
                            "& fieldset": {
                                borderColor: "#a1a1a1",
                            },
                            "& .MuiOutlinedInput-root:hover fieldset": {
                                border: "2px solid #fff",
                            },
                            "& .Mui-focused fieldset": {
                                border: "1px solid #852D91",
                                borderColor: "#852D91 !important",
                            },
                        }}
                        inputProps={{
                            maxLength: 500,
                            style: {
                                fontSize: 20,
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
                        onBlur={handleSubmit(onSubmitSubHeading)}
                        value={value}
                        onChange={onChange}
                    />
                )}
            />
        </Box>
    );
};

export default HeadingSlideSetting;
