import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { API_STATUS } from "../../config/common";
import { AiFillLike } from "react-icons/ai";
import { AiFillCheckCircle } from "react-icons/ai";
import Stack from "@mui/material/Stack";
import { Box, Tab, Tabs } from "@mui/material";
import { Typography, Button, Paper } from "@mui/material";
import styles from "./Question.module.css";

const QuestionItemWrapper = (item) => {
    return (
        <>
            <Stack
                direction="row"
                // sx={{
                //     height: "70px"
                // }}
            >
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
                            color: item.isAnswered ? "#23bd23" : "#959595",
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
                            Đã trả lời{" "}
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
};
const AnsweredQuestionTab = ({ questionList }) => {
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
            {questionList.map((item) => {
                return (
                    <React.Fragment key={item.questionID}>
                        {QuestionItemWrapper(item)}
                    </React.Fragment>
                );
            })}
        </Stack>
    );
};

export default AnsweredQuestionTab;
