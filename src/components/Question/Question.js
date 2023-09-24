import React, { useState, useEffect, useRef } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { Typography, Button, Paper } from "@mui/material";
import styles from "./Question.module.css";

import AnsweredQuestionTab from "./AnsweredQuestionTab";
import NotAnsweredQuestionTab from "./NotAnsweredQuestionTab";
import { SOCKET_TYPE } from "../../config";
import { sortQuestions } from "../../utilities/question";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <>{children}</>}
        </div>
    );
}

const QuestionTab = ({
    handleCloseSidebar,
    openQuestionTab: open,
    answeredQuestionList,
    notAnsweredQuestionList,
    setNotAnsweredQuestionList,
    setAnsweredQuestionList,
    socket,
}) => {
    const notQuestionRef = useRef(null);
    const questionRef = useRef(null);
    notQuestionRef.current = notAnsweredQuestionList;
    questionRef.current = answeredQuestionList;
    const useOutsideClick = (callback) => {
        const ref = useRef();

        useEffect(() => {
            const handleClick = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    callback();
                }
            };

            document.addEventListener("click", handleClick, true);

            return () => {
                document.removeEventListener("click", handleClick, true);
            };
        }, []);

        return ref;
    };
    const ref = useOutsideClick(() => {
        handleCloseSidebar();
    });

    const [tabValue, setTabValue] = useState(0);
    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleMarkAnswerQuestionSocket = (data) => {
        console.log(data);
        if (data.question) {
            setAnsweredQuestionList((prev) => {
                const result = sortQuestions([...prev, data.question]);
                console.log(result);
                return result;
            });
            setNotAnsweredQuestionList((prev) => {
                const result = sortQuestions(
                    prev.filter(
                        (item) => item.questionID !== data.question.questionID
                    )
                );
                return result;
            });
        }
    };

    const handleUpvoteQuestionSocket = (data) => {
        console.log(data);
        if (data.question) {
            if (
                (notQuestionRef.current || []).find(
                    (item) => item.questionID === data.question.questionID
                )
            ) {
                setNotAnsweredQuestionList((prev) => {
                    const copy = [...prev].filter(
                        (item) => item.questionID !== data.question.questionID
                    );
                    const result = sortQuestions([...copy, data.question]);
                    console.log(result);
                    return result;
                });
                return;
            }
            if (
                (questionRef.current || []).find(
                    (item) => item.questionID === data.question.questionID
                )
            ) {
                setAnsweredQuestionList((prev) => {
                    const copy = [...prev].filter(
                        (item) => item.questionID !== data.question.questionID
                    );
                    const result = sortQuestions([...copy, data.question]);
                    console.log(result);
                    return result;
                });
                return;
            }
        }
    };

    const handleRecieveQuestionSocket = (data) => {
        console.log(data);
        if (data.question) {
            setNotAnsweredQuestionList((prev) => {
                const copy = [...prev].filter(
                    (item) => item.questionID !== data.question.questionID
                );
                const result = sortQuestions([...copy, data.question]);
                console.log(result);
                return result;
            });
        }
    };

    useEffect(() => {
        if (socket && socket.connected) {
            socket.on(
                SOCKET_TYPE.MARKED_AS_ANWSERED_QUESTION,
                handleMarkAnswerQuestionSocket
            );
            socket.on(SOCKET_TYPE.UPVOTE_QUESTION, handleUpvoteQuestionSocket);
            socket.on(SOCKET_TYPE.SUBMIT_QUESTION, handleRecieveQuestionSocket);
        }
    }, []);

    return (
        <Box
            ref={ref}
            className={styles.menuBody}
            textAlign="center"
            sx={{
                ...(open && {
                    left: "0 !important",
                }),
                fontFamily: "PatrickHand",
                zIndex: 1000,
            }}
        >
            <Typography
                sx={{ fontFamily: "Kanit", fontSize: "1.5rem", marginTop: 2 }}
            >
                Danh sách câu hỏi
            </Typography>

            <Paper
                elevation={0}
                style={{
                    marginTop: "10px",
                    overflow: "auto",
                    height: "84%",
                    backgroundColor: "black",
                    color: "white",
                }}
            >
                <TabPanel value={tabValue} index={1}>
                    <AnsweredQuestionTab questionList={answeredQuestionList} />
                </TabPanel>
                <TabPanel value={tabValue} index={0}>
                    <NotAnsweredQuestionTab
                        questionList={notAnsweredQuestionList}
                        setQuestionList={setNotAnsweredQuestionList}
                    />
                </TabPanel>
            </Paper>
            <Tabs
                value={tabValue}
                onChange={handleChangeTab}
                sx={{
                    flex: "1 1 auto",
                    color: "#fff",
                    border: "1px solid #fff",
                    "& .MuiTab-root": {
                        color: "#bbb",
                        fontFamily: "Kanit",
                        fontSize: "1.2rem",
                        fontWeight: "500",
                        "&.Mui-selected": {
                            color: "#fff",
                        },
                    },
                    "& .MuiTabs-indicator": {
                        display: "none",
                    },
                }}
            >
                <Tab sx={{ minWidth: "50%" }} label="Chưa trả lời"></Tab>
                <Tab sx={{ minWidth: "50%" }} label="Đã trả lời"></Tab>
            </Tabs>
        </Box>
    );
};

export default QuestionTab;
