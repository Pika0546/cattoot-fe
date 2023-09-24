import React, { useMemo, useState, useEffect } from "react";
import {
    Stack,
    Typography,
    FormControl,
    RadioGroup,
    FormControlLabel,
    CircularProgress,
    Box,
    Radio,
} from "@mui/material";
import { submitAnswer } from "../../../service/PersentationService";
import { useToast } from "../../../hook/useToast";
import { API_STATUS } from "../../../config/common";
const MultipleChoiceSlide = ({
    slide,
    presentation,
    setIsDone,
    isDone,
    isWaitingScreen,
    setIsWaitingScreen,
}) => {
    const [value, setValue] = useState(null);
    const [isSubmiting, setIsSubmiting] = useState(false);
    const toast = useToast();

    const slideContent = useMemo(() => {
        if (slide) {
            return slide.content;
        }
    }, [slide]);

    const handleChangeOption = (event) => {
        setValue(event.target.value);
    };

    const handleSubmit = async () => {
        setIsSubmiting(true);
        console.log(value);
        const res = await submitAnswer({
            slideID: slide.slideID,
            option: value,
        });
        if (res.status === API_STATUS.OK) {
            if (res.data[0].isLastSlide) {
                setIsDone(true);
            }
            setIsWaitingScreen(true);
        } else {
            toast.error(res.message);
        }
        setIsSubmiting(false);
    };

    useEffect(() => {
        setIsSubmiting(false);
    }, [presentation, slide]);
    return (
        <Stack
            direction="column"
            spacing={2}
            justifyContent="flex-start"
            sx={{
                maxWidth: "60%",
                margin: "0 auto",
                marginTop: "2rem",
            }}
        >
            <Typography
                component="h4"
                variant="h4"
                color="white"
                fontFamily="PatrickHand"
            >
                {slideContent?.question}
            </Typography>
            <FormControl>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={value}
                    onChange={handleChangeOption}
                >
                    {slideContent?.option.map((item, index) => {
                        return (
                            <Box
                                key={item.key}
                                sx={{
                                    border: "2px solid",
                                    borderImageSlice: 1,
                                    borderWidth: "2px",
                                    borderImageSource:
                                        "linear-gradient(79deg, #7439db, #C66FBC 48%, #F7944D)",
                                    marginY: "1rem",
                                    "& .MuiRadio-root": {
                                        color: "#fff",
                                    },
                                    "& .MuiTypography-root": {
                                        fontFamily: "PatrickHand",
                                        fontSize: "1.5rem",
                                    },
                                    "& .Mui-checked": {
                                        color: "#F59251",
                                    },
                                    color: "#fff",
                                }}
                            >
                                <FormControlLabel
                                    key={index}
                                    value={item.key}
                                    control={
                                        <Radio
                                            sx={{
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: "2rem",
                                                },
                                            }}
                                        />
                                    }
                                    sx={{
                                        display: "flex",
                                        padding: "1rem",
                                    }}
                                    label={item.key}
                                />
                            </Box>
                        );
                    })}
                </RadioGroup>
            </FormControl>
            <button
                onClick={handleSubmit}
                className="btn-hover color-1"
                style={{
                    fontSize: "1.5rem",
                    marginLeft: "auto",
                    marginRight: "auto",
                    ...(isSubmiting && { background: "#909090" }),
                }}
                disabled={isSubmiting}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={3}
                    sx={{
                        width: "100%",
                    }}
                >
                    {isSubmiting && (
                        <CircularProgress size={25} sx={{ color: "#fff" }} />
                    )}
                    <div>Xác nhận</div>
                </Stack>
            </button>
        </Stack>
    );
};

export default MultipleChoiceSlide;
