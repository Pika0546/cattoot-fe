import { useCallback, useEffect, useState } from "react";
import { Stack, Box, Grid, Menu, MenuItem } from "@mui/material";
import React from "react";
import CardMedia from "@mui/material/CardMedia";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import jpgTemplate from "../../multichoice.jpg";
import multichoiceTemplate from "../../multichoice.jpg";
import headingTemplate from "../../heading.png";
import paragraphTemplate from "../../paragraph.png";
import { Reorder } from "framer-motion";
import Typography from "@mui/material/Typography";
import { height } from "@mui/system";
import { SLIDE_TYPE } from "../../config/common";

const SlideList = ({
    presentation,
    slides,
    changeSlidesOrder,
    changeSelectedSlide,
    selectedSlide,
    handleRemoveSlide,
}) => {
    const [contextMenu, setContextMenu] = useState({
        context: null,
        slide: null,
    });

    const handleContextMenu = (event, slide) => {
        event.preventDefault();
        setContextMenu({
            context:
                contextMenu.context === null
                    ? {
                          mouseX: event.clientX + 2,
                          mouseY: event.clientY - 6,
                      }
                    : null,
            slide,
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu({
            context: null,
            slide: null,
        });
    };

    return (
        <Stack
            direction="column"
            sx={{
                ul: {
                    padding: 0,
                },
            }}
        >
            <Menu
                open={contextMenu.context !== null}
                onClose={handleCloseContextMenu}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu.context !== null
                        ? {
                              top: contextMenu.context.mouseY,
                              left: contextMenu.context.mouseX,
                          }
                        : undefined
                }
            >
                <MenuItem
                    onClick={() => {
                        handleRemoveSlide(contextMenu.slide);
                        handleCloseContextMenu();
                    }}
                >
                    Xóa slide
                </MenuItem>
            </Menu>
            <Reorder.Group
                axis="y"
                values={slides}
                onReorder={changeSlidesOrder}
            >
                {slides &&
                    slides.map((item, index) => {
                        return (
                            <Reorder.Item key={item.slideID} value={item}>
                                <Grid
                                    container
                                    direction="row"
                                    key={item.slideID}
                                    sx={{
                                        width: "90%",
                                        m: 1,
                                        p: "10px 10px 10px 0px",
                                        background:
                                            item.slideID ===
                                            selectedSlide.slideID
                                                ? "#7439db"
                                                : "transparent",
                                        borderRadius: "4px",
                                        border: "1px solid #7439db",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        if (
                                            item.slideID !==
                                            selectedSlide.slideID
                                        ) {
                                            changeSelectedSlide(item);
                                        }
                                    }}
                                    onContextMenu={(e) => {
                                        if (slides.length >= 2) {
                                            handleContextMenu(e, item);
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: "20%",
                                            color: "#fff",
                                            fontFamily: "PatrickHand",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontSize: "1.4rem",
                                        }}
                                    >
                                        {parseInt(item.slideOrder) + 1}
                                        {presentation.currentSlideID ===
                                            item.slideID && (
                                            <PlayArrowIcon
                                                sx={{
                                                    color: "#F69351",
                                                    fontSize: "2rem",
                                                }}
                                            ></PlayArrowIcon>
                                        )}
                                        {/* <div>{item.slideID}</div> */}
                                    </Box>

                                    <CardMedia
                                        sx={{
                                            width: "80%",
                                            background: "#fff",
                                        }}
                                        alt="random"
                                    >
                                        <Stack
                                            direction="column"
                                            justifyContent="center"
                                            alignItems="center"
                                            padding="10px"
                                            spacing={1}
                                        >
                                            <Typography
                                                component="p"
                                                variant="h2"
                                                align="center"
                                                color="black"
                                                fontFamily="PatrickHand"
                                                fontSize="1rem"
                                                noWrap
                                                sx={{
                                                    width: "100%",
                                                    padding: "0px 5px",
                                                }}
                                            >
                                                {item.type ===
                                                SLIDE_TYPE.MULTIPLE_CHOICE
                                                    ? item.content.question
                                                    : item.type ===
                                                      SLIDE_TYPE.HEADING
                                                    ? item.content.heading
                                                    : item.type ===
                                                      SLIDE_TYPE.PARAGRAPH
                                                    ? item.content.heading
                                                    : ""}
                                            </Typography>
                                            <img
                                                src={
                                                    item.type ===
                                                    SLIDE_TYPE.MULTIPLE_CHOICE
                                                        ? multichoiceTemplate
                                                        : item.type ===
                                                          SLIDE_TYPE.HEADING
                                                        ? headingTemplate
                                                        : item.type ===
                                                          SLIDE_TYPE.PARAGRAPH
                                                        ? paragraphTemplate
                                                        : ""
                                                }
                                                style={{
                                                    height: "40%",
                                                    width: "40%",
                                                }}
                                                alt="slide"
                                                draggable="false"
                                            />
                                        </Stack>
                                    </CardMedia>
                                </Grid>
                            </Reorder.Item>
                        );
                    })}
            </Reorder.Group>
        </Stack>
    );
};

export default SlideList;
