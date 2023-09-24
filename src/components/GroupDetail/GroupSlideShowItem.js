import React, { useCallback, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import SlideShow from "../Slide/SlideShow";
import { FullScreen } from "react-full-screen";

import { nextSlide } from "../../service/PersentationService";

import { useNavigate } from "react-router-dom";

const GroupSlideShowItem = ({
    presentation,
    selectedSlide,
    changeSelectedSlide,
    screen,
    changeCurrentSlideID,
    socket,
    group,
}) => {
    useEffect(() => {
        console.log(selectedSlide);
        console.log(presentation);
    }, []);
    const navigate = useNavigate();
    const handleSlideShowNextSlide = async (slide, callAPI = true) => {
        changeSelectedSlide(slide);

        try {
            if (callAPI) {
                const res = await nextSlide({
                    presentationID: presentation.presentationID,
                    slideID: slide.slideID,
                });
            }
            changeCurrentSlideID(slide.slideID);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (screen.active) console.log("active");
    }, [screen]);

    return (
        <FullScreen handle={screen}>
            {screen.active ? (
                <SlideShow
                    slide={selectedSlide}
                    socket={socket}
                    presentation={presentation}
                    handleSlideShowNextSlide={handleSlideShowNextSlide}
                ></SlideShow>
            ) : (
                <></>
            )}
        </FullScreen>
    );
};

export default GroupSlideShowItem;
