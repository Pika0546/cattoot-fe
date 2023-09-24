import {
    Box,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    FormControlLabel,
    Button,
    Stack,
    Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
import { SOCKET_TYPE, SOCKET_URL } from "../../config";
import { submitAnswer } from "../../service/PersentationService";
import WaitingSlide from "../WaitingSlide/WaitingSlide";
import CircularProgress from "@mui/material/CircularProgress";
import { API_STATUS, SLIDE_TYPE } from "../../config/common";
import EndSlide from "../EndSlide/EndSlide";
import { useToast } from "../../hook/useToast";
import MultipleChoiceSlide from "./Slide/MultipleChoiceSlide";
import HeadingSlide from "./Slide/HeadingSlide";
import ParagraphSlide from "./Slide/ParagraphSlide";

// const socket = io(SOCKET_URL, {
//     autoConnect: false,
//     transports: ["websocket"],
// });

const ViewerScreenContent = ({ presentation, socket }) => {
    const [currentSlide, setCurrentSlide] = useState(null);
    const [isWaitingScreen, setIsWaitingScreen] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const toast = useToast();
    const handleChangeSlide = ({ slide }) => {
        if (slide && slide.presentationID === presentation?.presentationID) {
            setCurrentSlide(slide);
            setIsWaitingScreen(false);
            setIsDone(false);
        }
    };

    useEffect(() => {
        console.log("here");
        if (presentation && presentation.slides && presentation.slides.length) {
            if (
                !currentSlide ||
                currentSlide.slideID !== presentation.currentSlideID ||
                true
            ) {
                setCurrentSlide(
                    presentation.slides.find(
                        (item) => item.slideID === presentation.currentSlideID
                    )
                );
            }
        }
    }, [presentation]);

    useEffect(() => {
        try {
            if (socket && socket.connected) {
                socket.on(SOCKET_TYPE.NEXT_SLIDE, handleChangeSlide);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    if (isDone) {
        return <EndSlide></EndSlide>;
    }

    if (isWaitingScreen) {
        return <WaitingSlide></WaitingSlide>;
    }

    return (
        <Box
            sx={{
                width: "100%",
                padding: "2rem",
                background: "#202020",
                flex: "1 1 auto",
            }}
        >
            {currentSlide &&
                currentSlide.type === SLIDE_TYPE.MULTIPLE_CHOICE && (
                    <MultipleChoiceSlide
                        slide={currentSlide}
                        presentation={presentation}
                        setIsDone={setIsDone}
                        isDone={isDone}
                        isWaitingScreen={isWaitingScreen}
                        setIsWaitingScreen={setIsWaitingScreen}
                    ></MultipleChoiceSlide>
                )}
            {currentSlide && currentSlide.type === SLIDE_TYPE.PARAGRAPH && (
                <ParagraphSlide
                    slide={currentSlide}
                    presentation={presentation}
                ></ParagraphSlide>
            )}
            {currentSlide && currentSlide.type === SLIDE_TYPE.HEADING && (
                <HeadingSlide
                    slide={currentSlide}
                    presentation={presentation}
                ></HeadingSlide>
            )}
        </Box>
    );
};

export default ViewerScreenContent;
