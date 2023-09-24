import React, { useCallback, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SlideList from "../Slide/SlideList";
import Slide from "../Slide/Slide";
import SlideSetting from "../Slide/SlideSetting";
import SlideShow from "../Slide/SlideShow";
import CircularProgress from "@mui/material/CircularProgress";
import { FullScreen } from "react-full-screen";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

import { nextSlide } from "../../service/PersentationService";

const PresentationBody = ({
    presentation,
    addSlide,
    changeSlidesOrder,
    selectedSlide,
    changeSelectedSlide,
    updateSelectedSlide,
    handleRemoveSlide,
    newSlideLoading,
    screen,
    changeCurrentSlideID,
    socket,
    // answeredQuestionList, notAnsweredQuestionList,
}) => {
    const handleSlideShowNextSlide = async (slide, callAPI = true) => {
        changeSelectedSlide(slide);

        try {
            if (callAPI) {
                changeCurrentSlideID(slide.slideID);
                const res = await nextSlide({
                    presentationID: presentation.presentationID,
                    slideID: slide.slideID,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    // useEffect(()=>{
    //     if(!screen.active)
    //         console.log("inactive");
    // },[screen])

    return (
        <Grid
            container
            sx={{
                width: "100%",
                flex: "1 1 auto",
            }}
        >
            <Grid
                item
                xs={2}
                sx={{
                    borderRight: "1px solid #fff",
                    position: "relative",
                    padding: "1rem 0.5rem",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Button
                    sx={{
                        margin: "0px 20px 10px 20px",
                        textTransform: "none",
                        fontFamily: "PatrickHand",
                        fontSize: "1.3rem",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#7439db",
                    }}
                    variant="contained"
                    size="small"
                    onClick={addSlide}
                >
                    {newSlideLoading ? (
                        <CircularProgress
                            sx={{ color: "#a7a7a7" }}
                            size={20}
                        ></CircularProgress>
                    ) : (
                        <AddIcon sx={{ marginRight: "0.5rem" }}></AddIcon>
                    )}
                    <p>Thêm slide</p>
                </Button>
                <Box
                    sx={{
                        position: "relative",
                        width: "100%",
                        flex: "1 1 auto",
                        overflow: "auto",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            width: "100%",
                        }}
                    >
                        <SlideList
                            presentation={presentation}
                            slides={presentation.slides}
                            changeSlidesOrder={changeSlidesOrder}
                            changeSelectedSlide={changeSelectedSlide}
                            selectedSlide={selectedSlide}
                            handleRemoveSlide={handleRemoveSlide}
                        ></SlideList>
                    </Box>
                </Box>
            </Grid>

            <Grid
                item
                xs={7}
                sx={{
                    padding: "2rem",
                }}
            >
                <Slide slide={selectedSlide}></Slide>
            </Grid>

            <Grid
                item
                xs={3}
                sx={{
                    borderLeft: "1px solid #fff",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        width: "100%",
                        flex: "1 1 auto",
                        overflow: "auto",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            width: "100%",
                        }}
                    >
                        <SlideSetting
                            slide={selectedSlide}
                            handleChangeSlide={updateSelectedSlide}
                        ></SlideSetting>
                    </Box>
                </Box>
            </Grid>
            <FullScreen handle={screen}>
                {screen.active ? (
                    // <div
                    //     style={{
                    //         display: "flex",
                    //         flexDirection: "row",
                    //         margin: "auto",
                    //         height: "100%",
                    //         width: "100%",
                    //     }}
                    // >
                    //     {selectedSlide.slideOrder - 1 >= 0 ? (
                    //         <Button
                    //             onClick={() => {
                    //                 const leftSlide =
                    //                     presentation.slides[
                    //                         selectedSlide.slideOrder - 1
                    //                     ];
                    //                 handleSlideShowNextSlide(leftSlide);
                    //             }}
                    //         >
                    //             <ArrowCircleLeftIcon
                    //                 sx={{
                    //                     color: "#F69351",
                    //                     fontSize: "2rem",
                    //                 }}
                    //             ></ArrowCircleLeftIcon>
                    //         </Button>
                    //     ) : (
                    //         <Button disabled="true" />
                    //     )}

                    //     <SlideShow
                    //         slide={selectedSlide}
                    //         socket={socket}
                    //         presentation={presentation}
                    //         handleSlideShowNextSlide={handleSlideShowNextSlide}
                    //         // answeredQuestionList={answeredQuestionList}
                    //         // notAnsweredQuestionList={notAnsweredQuestionList}
                    //     ></SlideShow>

                    //     {selectedSlide.slideOrder + 1 <
                    //     presentation.slides.length ? (
                    //         <Button
                    //             onClick={() => {
                    //                 if (
                    //                     selectedSlide.slideOrder + 1 <
                    //                     presentation.slides.length
                    //                 ) {
                    //                     const rightSlide =
                    //                         presentation.slides[
                    //                             selectedSlide.slideOrder + 1
                    //                         ];
                    //                     handleSlideShowNextSlide(
                    //                         rightSlide
                    //                     );
                    //                 }
                    //             }}
                    //         >
                    //             <ArrowCircleRightIcon
                    //                 sx={{
                    //                     color: "#F69351",
                    //                     fontSize: "2rem",
                    //                 }}
                    //             ></ArrowCircleRightIcon>
                    //         </Button>
                    //     ) : (
                    //         <Button disabled="true" />
                    //     )}
                    // </div>
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
        </Grid>
    );
};

export default PresentationBody;
