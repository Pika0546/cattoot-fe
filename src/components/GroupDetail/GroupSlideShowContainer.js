import { Stack } from "@mui/material";
import React, { useMemo, useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Error from "../Error/Error";
import InPageLoading from "../PageLoading/InPageLoading";
import PresentationBody from "../Persentation/PresentationBody";
import PresentationHeader from "../Persentation/PresentationHeader";
import { API_STATUS } from "../../config/common";
import {
    createSlide,
    getPresentationByID,
    autoSave,
    SLIDE_TYPE,
    // getQuestionList,
} from "../../service/PersentationService";
import { SOCKET_TYPE, SOCKET_URL } from "../../config";
import io from "socket.io-client";
import { useToast } from "../../hook/useToast";
import { cloneDeep } from "lodash";
import { AppContext } from "../../context/AppContext";
import GroupSlideShowItem from "./GroupSlideShowItem";
import { Details } from "@mui/icons-material";

const socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket"],
});

const GroupSlideShowContainer = ({presentation, setPresentation, screen, group}) => {

    const [selectedSlideID, setSelectedSlideID] = useState(presentation.currentSlideID);
    const [selectedSlide, setSelectedSlide] = useState(null);

    const toast = useToast();

    useEffect(() => {
        console.log(presentation)
        console.log(presentation.slides)
        if (presentation) {
            presentation.slides.map((item) => {
                if (selectedSlideID && item.slideID === selectedSlideID)
                {
                    console.log(item);
                    setSelectedSlide(item);
                }
            })
        }
        else{
            setSelectedSlide(null);
        }
    }, [presentation, selectedSlideID]);

    const changeCurrentSlideID = (slideID) => {
        if (slideID) {
            setPresentation((prev) => {
                return {
                    ...prev,
                    currentSlideID: slideID,
                };
            });
        }
    };

    const changeSelectedSlide = (slide) => {
        setSelectedSlideID(slide.slideID);
    };

    const handleUserSubmit = (data) => {
        if (data.slide) {
            setPresentation((prev) => {
                const slides = [...prev.slides];
                const slide = data.slide || {};
                const slideID = slide.slideID;
                const n = slides.length;
                for (let i = 0; i < n; i++) {
                    if (slides[i].slideID === slideID) {
                        if (slides[i].type === SLIDE_TYPE.MULTIPLE_CHOICE) {
                            slides[i].content = slide;
                        }
                        break;
                    }
                }
                return {
                    ...prev,
                    slides: [...slides],
                };
            });
        }
    };

    useEffect(() => {
        const save = async () => {
            if (presentation) {
                console.log(presentation);
                const res = await autoSave(presentation);

                // Call save API
                console.log(res);
                console.log("Call save API");
            }
        };
        save();
    }, [presentation]);

    useEffect(() => {
        try {
            socket.connect();

            socket.on(SOCKET_TYPE.SUBMIT_ANSWER, handleUserSubmit);
        } catch (error) {
            console.log(error);
        }

        return () => {
            socket.disconnect();
        };
    }, []);

    


    if (!presentation) {
        return <Error></Error>;
    }

    return (
        <Stack
            direction="column"
            sx={{
                width: "100%",
                flex: "1 1 auto",
            }}
        >
            <GroupSlideShowItem
                selectedSlide={selectedSlide}
                presentation={presentation}
                changeSelectedSlide={changeSelectedSlide}
                screen={screen}
                changeCurrentSlideID={changeCurrentSlideID}
                socket={socket}
                group={group}
            ></GroupSlideShowItem>
        </Stack>

    );
};

export default GroupSlideShowContainer;
