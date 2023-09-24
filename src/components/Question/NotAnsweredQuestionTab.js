import React, { useState, useEffect, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { AiFillLike } from "react-icons/ai";
import { AiFillCheckCircle } from "react-icons/ai";
import Stack from "@mui/material/Stack";
import { Box, Tab, Tabs } from "@mui/material";
import { Typography, Button, Paper } from "@mui/material";

import styles from "./Question.module.css";

import { API_STATUS } from "../../config/common";
import { markAnsweredQuestion } from "../../service/QuestionService";
import { useToast } from "../../hook/useToast";
import { sortQuestions } from "../../utilities/question";
const NotAnsweredQuestionTab = ({ questionList, setQuestionList }) => {
    const toast = useToast();
    const clickAnswer = async (data) => {
        setQuestionList((prev) => {
            const result = [...prev].filter(
                (item) => item.questionID !== data.questionID
            );
            return result;
        });
        console.log(data);
        const res = await markAnsweredQuestion({
            presentationID: data.presentationID,
            questionID: data.questionID,
        });
        console.log(res);
        if (res.status === API_STATUS.OK) {
            toast.success(res.message);
            return true;
        } else {
            console.log(res);
            toast.error(res.message);
            return false;
        }
    };

    if (!questionList || !questionList.length) {
        return "Chưa có câu hỏi nào";
    }
    return (
        <Stack
            direction="column"
            spacing={1}
            sx={{
                paddingY: "1rem",
            }}
        >
            {questionList.map((item, index) => {
                return (
                    <>
                        <Stack direction="row">
                            <Stack
                                direction="column"
                                display="flex"
                                justifyContent="space-between"
                                sx={{
                                    width: "80%",
                                    textAlign: "left",
                                    marginLeft: "10px",
                                }}
                            >
                                <Box fullwidth>
                                    <Typography
                                        sx={{
                                            fontFamily: "PatrickHand",
                                            fontSize: "1.3rem",
                                        }}
                                    >
                                        {" "}
                                        {item.question}{" "}
                                    </Typography>
                                </Box>
                                <Box
                                    fullwidth
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        color: item.isAnswered
                                            ? "#23bd23"
                                            : "#959595",
                                        "&:hover": {
                                            color: "#23bd23",
                                            cursor: "pointer",
                                        },
                                    }}
                                    onClick={() => {
                                        clickAnswer(item);
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: "PatrickHand",
                                            fontSize: "1rem",
                                            marginRight: "5px",
                                        }}
                                    >
                                        {" "}
                                        Đánh dấu đã trả lời{" "}
                                    </Typography>
                                    <AiFillCheckCircle></AiFillCheckCircle>
                                </Box>
                            </Stack>
                            <Box
                                sx={{
                                    width: "30%",
                                }}
                            >
                                <Button sx={{ color: "#F69351" }}>
                                    <AiFillLike></AiFillLike>
                                    <Typography
                                        sx={{
                                            fontFamily: "PatrickHand",
                                            fontSize: "1.3rem",
                                            marginLeft: 0.5,
                                        }}
                                    >
                                        {item.totalVoted}
                                    </Typography>
                                </Button>
                            </Box>
                        </Stack>
                        <hr
                            style={{
                                color: "#F69351",
                                backgroundColor: "#F69351",
                                height: 2,
                                marginLeft: "10px",
                                marginRight: "10px",
                            }}
                        />
                    </>
                );
            })}
        </Stack>
    );
};

export default NotAnsweredQuestionTab;
