import React, { useState } from "react";
import { padding, Stack } from "@mui/system";
import { Box } from "@mui/material";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import {
    BsFillChatTextFill,
    BsBarChartFill,
    BsFillQuestionCircleFill,
} from "react-icons/bs";

import QuestionTab from "../Question/Question";
import MultipleChoiceSlideShow from "./MultipleChoiceSlide/MultipleChoiceSlide.SlideShow";
import ParagaraphSlideShow from "./ParagraphSlide/ParagraphSlide.SlideShow";
import HeadingSlideShow from "./HeadingSlide/HeadingSlide.SlideShow";
import ViewResultTab from "../ViewResultDialog/ViewResultTab";
import HostMessageTab from "../Message/MessageTab";

import styles from "./Slide.module.css";
import { useEffect } from "react";

import { useParams } from "react-router-dom";
import { API_STATUS } from "../../config/common";
import { SOCKET_TYPE } from "../../config";
import { getQuestionList } from "../../service/QuestionService";
import { sortQuestions } from "../../utilities/question";
import { getMessageList } from "../../service/MessageService";

import ViewResultDialog from "../ViewResultDialog/ViewResultDialog";
import { getMyGroupList } from "../../service/GroupService";

const SlideShow = ({
    slide,
    socket,
    presentation,
    handleSlideShowNextSlide,
}) => {
    useEffect(() => {
        console.log(slide);
        console.log(presentation);
    }, []);
    const [openQuestionTab, setOpenQuestionTab] = useState(false);
    const [openMessageTab, setOpenMessageTab] = useState(false);
    const [openResultTab, setOpenResultTab] = useState(false);

    const handleOpenQuestionTab = () => {
        setOpenQuestionTab(true);
    };

    const [viewResult, setViewResult] = useState(null);

    const handleViewResultDialogClose = () => {
        setViewResult(null);
    };

    const handleCloseQuestionTab = () => {
        setOpenQuestionTab(false);
    };

    const handleOpenMessageTab = () => {
        setOpenMessageTab(true);
    };

    const handleCloseMessageTab = () => {
        setOpenMessageTab(false);
    };

    const handleOpenResultTab = () => {
        setOpenResultTab(true);
    };

    const handleCloseResultTab = () => {
        setOpenResultTab(false);
    };

    const param = useParams();
    const [answeredQuestionList, setAnsweredQuestionList] = useState(null);
    const [notAnsweredQuestionList, setNotAnsweredQuestionList] =
        useState(null);
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const getData = async () => {
            const presentationID = param.id;
            const answeredQuestions = await getQuestionList({
                presentationID: slide.presentationID,
                isAnswered: true,
            });
            const notAnsweredQuestions = await getQuestionList({
                presentationID: slide.presentationID,
                isAnswered: false,
            });

            if (answeredQuestions.status === API_STATUS.OK) {
                console.log(answeredQuestions);
                setAnsweredQuestionList(answeredQuestions.data);
            } else {
                console.log(answeredQuestions);
                setAnsweredQuestionList(null);
            }

            if (answeredQuestions.status === API_STATUS.OK) {
                console.log(notAnsweredQuestions);
                setNotAnsweredQuestionList(notAnsweredQuestions.data);
            } else {
                console.log(notAnsweredQuestions);
                setNotAnsweredQuestionList(null);
            }

            const messageRes = await getMessageList({
                presentationID: slide.presentationID,
                lastMessageID: null,
                limit: 20,
            });
            console.log(messageRes);
            if (messageRes.status === API_STATUS.OK) {
                setMessages(messageRes.data);
            } else {
                setMessages([]);
            }
        };
        getData();
    }, [param]);

    const handleNextSlide = ({ slide }) => {
        if (slide && slide.presentationID === presentation?.presentationID) {
            handleSlideShowNextSlide(slide, false);
        }
    };

    useEffect(() => {
        if (socket && socket.connected) {
            socket.on(SOCKET_TYPE.NEXT_SLIDE, handleNextSlide);
        }
    }, [socket]);

    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    margin: "auto",
                    height: "100%",
                    width: "100%",
                }}
            >
                {slide.slideOrder - 1 >= 0 ? (
                    <Button
                        onClick={() => {
                            const leftSlide =
                                presentation.slides[slide.slideOrder - 1];
                            handleSlideShowNextSlide(leftSlide);
                        }}
                    >
                        <ArrowCircleLeftIcon
                            sx={{
                                color: "#F69351",
                                fontSize: "2rem",
                            }}
                        ></ArrowCircleLeftIcon>
                    </Button>
                ) : (
                    <Button disabled="true" />
                )}

                <Stack
                    direction="column"
                    sx={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#E9E9E9",
                        overflowY: "scroll",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            "&.MuiBox-root": {
                                backgroundColor: "white",
                            },
                        }}
                    >
                        <IconButton
                            size="large"
                            color="inherit"
                            aria-label="menu"
                            className={`${styles.menuBtn}`}
                            onClick={() => {
                                handleOpenMessageTab();
                            }}
                        >
                            <BsFillChatTextFill
                                className={`${styles.menuIcon}`}
                            />
                        </IconButton>
                        <IconButton
                            size="large"
                            color="inherit"
                            aria-label="menu"
                            className={`${styles.menuBtn}`}
                            onClick={() => {
                                handleOpenQuestionTab();
                            }}
                        >
                            <BsFillQuestionCircleFill
                                className={`${styles.menuIcon}`}
                            />
                        </IconButton>
                        {slide.type === "MULTIPLE_CHOICE" ? (
                            <IconButton
                                size="large"
                                color="inherit"
                                aria-label="menu"
                                className={`${styles.menuBtn}`}
                                onClick={() => {
                                    handleOpenResultTab();
                                }}
                            >
                                <BsBarChartFill
                                    className={`${styles.menuIcon}`}
                                />
                            </IconButton>
                        ) : (
                            <></>
                        )}
                    </Box>

                    <QuestionTab
                        presentationID={slide.presentationID}
                        handleCloseSidebar={handleCloseQuestionTab}
                        openQuestionTab={openQuestionTab}
                        socket={socket}
                        answeredQuestionList={answeredQuestionList}
                        notAnsweredQuestionList={notAnsweredQuestionList}
                        setNotAnsweredQuestionList={setNotAnsweredQuestionList}
                        setAnsweredQuestionList={setAnsweredQuestionList}
                    ></QuestionTab>

                    <HostMessageTab
                        presentationID={slide.presentationID}
                        handleCloseSidebar={handleCloseMessageTab}
                        openMessageTab={openMessageTab}
                        socket={socket}
                        messages={messages}
                        setMessages={setMessages}
                    ></HostMessageTab>

                    <ViewResultTab
                        presentation={presentation}
                        handleCloseSidebar={handleCloseResultTab}
                        openResultTab={openResultTab}
                        slide={slide}
                    ></ViewResultTab>

                    {/* <ViewResultDialog
                        open={!!viewResult}
                        setOpen={setViewResult}
                        onClose={handleViewResultDialogClose}
                        presentation={presentation}
                    ></ViewResultDialog> */}

                    {slide.type === "MULTIPLE_CHOICE" ? (
                        <MultipleChoiceSlideShow slide={slide} />
                    ) : slide.type === "PARAGRAPH" ? (
                        <ParagaraphSlideShow slide={slide} />
                    ) : slide.type === "HEADING" ? (
                        <HeadingSlideShow slide={slide} />
                    ) : (
                        <>Không tìm thấy bản trình bày</>
                    )}
                </Stack>

                {slide.slideOrder + 1 < presentation.slides.length ? (
                    <Button
                        onClick={() => {
                            if (
                                slide.slideOrder + 1 <
                                presentation.slides.length
                            ) {
                                const rightSlide =
                                    presentation.slides[slide.slideOrder + 1];
                                handleSlideShowNextSlide(rightSlide);
                            }
                        }}
                    >
                        <ArrowCircleRightIcon
                            sx={{
                                color: "#F69351",
                                fontSize: "2rem",
                            }}
                        ></ArrowCircleRightIcon>
                    </Button>
                ) : (
                    <Button disabled="true" />
                )}
            </div>
        </>
    );
};

export default SlideShow;
