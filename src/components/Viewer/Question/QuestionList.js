import { IconButton, Stack, Box, Typography, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import {
    AiFillLike,
    AiFillQuestionCircle,
    AiFillCheckCircle,
} from "react-icons/ai";
import { useToast } from "../../../hook/useToast";
import { API_STATUS } from "../../../config/common";
import { upvoteQuestion } from "../../../service/QuestionService";
import { getMe } from "../../../service/AccountService";

const QuestionList = ({ questions }) => {
    // console.log(questions)
    const toast = useToast();
    const [user, setUser] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const res = await getMe();
            if (res && res.status === API_STATUS.OK) {
                setUser(res.data[0]);
            }
        };
        getData();
    }, []);

    const handleVoted = async (data) => {
        console.log(data);
        if (user) {
            const n = data.voted.length;
            for (let i = 0; i < n; i++) {
                if (data.voted[i].accoundID === user.accoundID) {
                    return toast.info("Bạn đã vote câu hỏi này")
                }
            }
        }
        const res = await upvoteQuestion({
            presentationID: data.presentationID,
            questionID: data.questionID,
        });
        console.log(res)
        if (res.status === API_STATUS.OK) {
            // 
            return true;
        } else {
            console.log(res);
            toast.error(res.message);
            return false;
        }
    };

    // if (!questions || !questions.length) {
    //     return "Chưa có câu hỏi nào";
    // }
    return (
        (!questions || !questions.length ? (
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                <Typography sx={{
                    fontFamily: "PatrickHand"
                }}>
                    Chưa có câu hỏi nào
                </Typography>
            </Box>
        ) : (
            <Stack direction="column" padding={1} spacing={1}>
                {questions.map((item, index) => {
                    return (
                        <React.Fragment>
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
                                            color: item.isAnswered
                                                ? "#23bd23"
                                                : "#959595",
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
                                            {item.isAnswered
                                                ? "Đã trả lời"
                                                : "Chưa trả lời"}
                                        </Typography>
                                        {!item.isAnswered ? (
                                            <AiFillQuestionCircle></AiFillQuestionCircle>
                                        ) : (
                                            <AiFillCheckCircle></AiFillCheckCircle>
                                        )}
                                    </Box>
                                </Stack>
                                <Box
                                    sx={{
                                        width: "20%",
                                        color: "#F69351",
                                        display: "flex",
                                        alignItems: "center",
                                        flexDirection: "row",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            transition: ".2s",
                                            cursor: "pointer",
                                            "&:hover": {
                                                transform: "scale(1.5)",
                                            },
                                        }}
                                    >
                                        <AiFillLike
                                            size={25}
                                            onClick={() => { handleVoted(questions[index]) }}
                                        />
                                    </Box>
                                    <Typography
                                        sx={{
                                            fontFamily: "PatrickHand",
                                            fontSize: "1.3rem",
                                            marginLeft: 0.5,
                                        }}
                                    >
                                        {item.totalVoted}
                                    </Typography>
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
                        </React.Fragment>
                    );
                })}
            </Stack>
        ))

    );
};

export default QuestionList;
