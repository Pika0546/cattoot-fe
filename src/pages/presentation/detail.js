import { Stack } from "@mui/material";
import React, { useMemo, useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Error from "../../components/Error/Error";
import InPageLoading from "../../components/PageLoading/InPageLoading";
import PresentationBody from "../../components/Persentation/PresentationBody";
import PresentationHeader from "../../components/Persentation/PresentationHeader";
import { API_STATUS } from "../../config/common";
import {
    createSlide,
    getPresentationByID,
    SLIDE_TYPE,
    autoSave,
    // getQuestionList,
} from "../../service/PersentationService";
import { SOCKET_TYPE, SOCKET_URL } from "../../config";
import io from "socket.io-client";
import { useToast } from "../../hook/useToast";
import { useFullScreenHandle } from "react-full-screen";
import { cloneDeep } from "lodash";
import { AppContext } from "../../context/AppContext";
import { useRef } from "react";

const socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket"],
});

const PresentationDetailPage = () => {
    const { user } = useContext(AppContext);
    const param = useParams();
    const [presentation, setPresentation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSlideID, setSelectedSlideID] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [newSlideLoading, setNewSlideLoading] = useState(false);
    const [autoSaveFlag, setAutoSaveFlag] = useState(null);
    // const [answeredQuestionList, setAnsweredQuestionList] = useState(null);
    // const [notAnsweredQuestionList, setNotAnsweredQuestionList] = useState(null);
    const presentationRef = useRef(null);
    presentationRef.current = presentation;
    const screen = useFullScreenHandle();
    // const [state,set] = useState(true);

    const toast = useToast();

    const changeTitle = (newTitle) => {
        if (newTitle) {
            setPresentation((prev) => {
                return {
                    ...prev,
                    name: newTitle,
                };
            });
            triggerAutoSave();
        }
    };

    const changeCurrentSlideID = (slideID) => {
        if (slideID) {
            setPresentation((prev) => {
                return {
                    ...prev,
                    currentSlideID: slideID,
                };
            });
            // triggerAutoSave();
        }
    };

    const changeSlidesOrder = (slides) => {
        setPresentation((prev) => {
            const result = [...slides];
            const n = result.length;
            for (let i = 0; i < n; i++) {
                result[i].slideOrder = i;
            }
            return {
                ...prev,
                slides: result,
            };
        });
        triggerAutoSave();
    };

    const addSlide = async () => {
        setNewSlideLoading(true);
        const res = await createSlide({
            presentationID: presentation.presentationID,
        });
        if (res.status === API_STATUS.OK) {
            const slide = res.data[0];
            setPresentation((prev) => {
                return {
                    ...prev,
                    slides: [...prev.slides, slide],
                };
            });
            triggerAutoSave();
        } else {
            toast.error("Thêm slide thất bại!");
        }
        setNewSlideLoading(false);
    };

    const changeSelectedSlide = (slide) => {
        setSelectedSlideID(slide.slideID);
    };

    const updateSelectedSlide = (slide) => {
        if (slide) {
            setPresentation((prev) => {
                const result = cloneDeep(prev);
                const slides = [...result.slides];
                const n = slides.length;
                for (let i = 0; i < n; i++) {
                    if (slides[i].slideID === slide.slideID) {
                        slides[i] = slide;
                        break;
                    }
                }
                return {
                    ...result,
                    slides,
                };
            });
            triggerAutoSave();
        }
    };

    const handleUserSubmitSocket = (data) => {
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

    const handleRemoveSlide = (slide) => {
        if (slide) {
            const n = presentation.slides.length;
            let newSelectedID = selectedSlideID;
            if (newSelectedID === slide.slideID) {
                for (let i = 0; i < n; i++) {
                    if (presentation.slides[i].slideID === slide.slideID) {
                        if (i > 0) {
                            newSelectedID = presentation.slides[i - 1].slideID;
                        } else {
                            newSelectedID = presentation.slides[i + 1].slideID;
                        }
                        break;
                    }
                }
            }
            setSelectedSlideID(newSelectedID);
            setPresentation((prev) => {
                const copy = [...prev.slides];
                const n = copy.length;
                let currentSlideID = prev.currentSlideID;

                if (currentSlideID === slide.slideID) {
                    for (let i = 0; i < n; i++) {
                        if (copy[i].slideID === slide.slideID) {
                            if (i > 0) {
                                currentSlideID = copy[i - 1].slideID;
                            } else {
                                currentSlideID = copy[i + 1].slideID;
                            }
                            break;
                        }
                    }
                }

                const slides = [...copy].filter(
                    (item) => item.slideID !== slide.slideID
                );
                const m = slides.length;
                for (let i = 0; i < m; i++) {
                    slides[i].slideOrder = i;
                }
                return {
                    ...prev,
                    slides: [...slides],
                    currentSlideID,
                };
            });
            triggerAutoSave();
        }
    };

    const handleNextSlideSocket = ({ slide, userToken }) => {
        if (
            slide &&
            slide.presentationID === presentationRef.current?.presentationID &&
            user.token !== userToken
        ) {
            console.log("NEXT");
            setPresentation((prev) => {
                const result = cloneDeep(prev);
                return {
                    ...result,
                    currentSlideID: slide.slideID,
                };
            });
        }
    };

    const userRef = useRef(null);
    userRef.current = user;
    const handleChangeSocket = (data) => {
        if (userRef.current && data.userToken !== userRef.current.token) {
            setPresentation(data.presentation);
        }
    };

    const triggerAutoSave = () => {
        setAutoSaveFlag(uuidv4());
    };

    useEffect(() => {
        const getData = async () => {
            const presentationID = param.id;
            const res = await getPresentationByID({ presentationID });
            if (res.status === API_STATUS.OK) {
                console.log(res);
                setPresentation(res.data[0]);
                setSelectedSlideID(res.data[0].slides[0].slideID);
            } else {
                console.log(res);
                setPresentation(null);
            }
            setIsLoading(false);
        };
        getData();
    }, [param]);

    useEffect(() => {
        console.log(autoSaveFlag);
        const save = async () => {
            if (presentationRef.current) {
                console.log(presentationRef.current);
                setIsSaving(true);
                const res = await autoSave(presentationRef.current);

                // Call save API
                console.log(res);
                console.log("Call save API");

                setIsSaving(false);
            }
        };
        if (autoSaveFlag) {
            save();
        }
    }, [autoSaveFlag]);

    useEffect(() => {
        try {
            if (!socket.connected) {
                socket.connect();
                socket.on(SOCKET_TYPE.SUBMIT_ANSWER, handleUserSubmitSocket);
                socket.on(SOCKET_TYPE.NEXT_SLIDE, handleNextSlideSocket);
                socket.on(SOCKET_TYPE.CHANGE_PRESENTATION, handleChangeSocket);
            }
        } catch (error) {
            console.log(error);
        }

        return () => {
            socket.disconnect();
        };
    }, []);

    const selectedSlide = useMemo(() => {
        if (presentation) {
            return {
                ...presentation.slides.find(
                    (item) =>
                        selectedSlideID && item.slideID === selectedSlideID
                ),
            };
        }
        return {};
    }, [presentation, selectedSlideID]);

    if (isLoading) {
        return <InPageLoading></InPageLoading>;
    }

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
            <PresentationHeader
                presentation={presentation}
                changetitle={changeTitle}
                isSaving={isSaving}
                screen={screen}
                changeSelectedSlide={changeSelectedSlide}
            />
            <PresentationBody
                newSlideLoading={newSlideLoading}
                selectedSlide={selectedSlide}
                presentation={presentation}
                changeSlidesOrder={changeSlidesOrder}
                changeSelectedSlide={changeSelectedSlide}
                addSlide={addSlide}
                updateSelectedSlide={updateSelectedSlide}
                handleRemoveSlide={handleRemoveSlide}
                screen={screen}
                changeCurrentSlideID={changeCurrentSlideID}
                socket={socket}
                // answeredQuestionList={answeredQuestionList}
                // notAnsweredQuestionList={notAnsweredQuestionList}
            ></PresentationBody>
        </Stack>
        // (user.accountID === presentation.presentationID ? (

        //     ) : (
        //         <>
        //             its show time
        //         </>
        //     )
        // )
    );
};

export default PresentationDetailPage;
