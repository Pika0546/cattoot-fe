import { Box } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import { SOCKET_TYPE } from "../../../config";
import { API_STATUS } from "../../../config/common";
import { useToast } from "../../../hook/useToast";
import { sendQuestion } from "../../../service/QuestionService";
import { sortQuestions } from "../../../utilities/question";
import CreateQuestion from "./CreateQuestion";
import QuestionList from "./QuestionList";
const QuestionTab = ({ socket, questions, setQuestions, presentation }) => {
    console.log(questions);
    const toast = useToast();

    const handleRecieveQuestionSocket = (data) => {
        console.log(data);
        if (data.question) {
            setQuestions((prev) => {
                const copy = [...prev].filter(
                    (item) => item.questionID !== data.question.questionID
                );
                const result = sortQuestions([...copy, data.question]);
                console.log(result);
                return result;
            });
        }
    };

    const handleUpvoteQuestionSocket = (data) => {
        console.log(data);
        if (data.question) {
            setQuestions((prev) => {
                const copy = [...prev].filter(
                    (item) => item.questionID !== data.question.questionID
                );
                const result = sortQuestions([...copy, data.question]);
                console.log(result);
                return result;
            });
        }
    };

    const handleAnswerQuestionSocket = (data) => {
        console.log(data);
        if (data.question) {
            setQuestions((prev) => {
                const copy = [...prev].filter(
                    (item) => item.questionID !== data.question.questionID
                );
                const result = sortQuestions([...copy, data.question]);
                return result;
            });
        }
    };

    const handleSubmitQuestion = async (question) => {
        console.log("submit: ", question);
        const res = await sendQuestion({
            question,
            presentationID: presentation.presentationID,
        });
        if (res.status === API_STATUS.OK) {
            setQuestions((prev) => {
                const copy = [...prev].filter(
                    (item) => item.questionID !== res.data[0].questionID
                );
                const result = sortQuestions([...copy, res.data[0]]);
                console.log(result);
                return result;
            });
            return true;
        } else {
            console.log(res);
            toast.error(res.message);
            return false;
        }
    };

    useEffect(() => {
        if (socket && socket.connected) {
            socket.on(
                SOCKET_TYPE.MARKED_AS_ANWSERED_QUESTION,
                handleAnswerQuestionSocket
            );
            socket.on(SOCKET_TYPE.UPVOTE_QUESTION, handleUpvoteQuestionSocket);
            socket.on(SOCKET_TYPE.SUBMIT_QUESTION, handleRecieveQuestionSocket);
        }
    }, []);
    return (
        <Box
            sx={{
                display: "flex",
                height: "100%",
                width: "100%",
                flexDirection: "column",
            }}
        >
            <Box
                sx={{
                    fontSize: "1.5rem",
                    padding: "0.5rem",
                    borderBottom: "1px solid #bbb",
                    textAlign: "center",
                    backgroundImage:
                        "linear-gradient(to right,#852D91, #A3A1FF)",
                }}
            >
                Q & A
            </Box>
            <Box
                sx={{
                    width: "100%",
                    flex: "1 1 auto",
                    position: "relative",
                    overflow: "auto",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        width: "100%",
                        marginTop: "5px",
                    }}
                >
                    <QuestionList questions={questions}></QuestionList>
                </Box>
            </Box>
            <Box
                sx={{
                    borderTop: "1px solid #fff",
                }}
            >
                <CreateQuestion
                    submitQuestion={handleSubmitQuestion}
                ></CreateQuestion>
            </Box>
        </Box>
    );
};

export default QuestionTab;
