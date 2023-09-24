import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { API_STATUS } from "../../config/common";
import { ViewerGetPresentation } from "../../service/PersentationService";
import Error from "../Error/Error";
import PageLoading from "../PageLoading/PageLoading";
import ViewerScreenContent from "./ViewerScreenContent";
import { SOCKET_TYPE, SOCKET_URL } from "../../config";
import io from "socket.io-client";
import { useToast } from "../../hook/useToast";
import ViewerScreen from "./ViewerScreen";
import { getQuestionList } from "../../service/QuestionService";
import { getMessageList } from "../../service/MessageService";
import { Box } from "@mui/material";
import { useNavigate } from "react-router";
import { getMe } from "../../service/AccountService";
import { sortQuestions } from "../../utilities/question";

const socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket"],
});

const JoiningPage = () => {
    const [loading, setLoading] = useState(true);
    const [validUrl, setValidUrl] = useState(false);
    const [presentation, setPresentation] = useState(false);
    const [messages, setMessages] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const param = useParams();

    const toast = useToast();

    const navigate = useNavigate();

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

    const handelChangePresentation = (data) => {
        console.log(data);
        const pre = data.presentation || [];
        setPresentation(pre);
        // toast.info("Người chủ trì đã thay đổi nội dung")
    };

    const handleStartPresentationSocket = (data = {}) => {
        console.log(data);
        const groupID = data.groupID;
        const presentation = data.presentation;
        if (presentation === null) {
            toast.info("Bản trình chiếu đã bị gỡ khỏi nhóm");
            setPresentation(null);
            setTimeout(() => {
                navigate(`/group/${groupID}`);
            }, [2000]);
        }
    };

    useEffect(() => {
        try {
            if (!socket.connected) {
                socket.connect();
                socket.on(
                    SOCKET_TYPE.CHANGE_PRESENTATION,
                    handelChangePresentation
                );
                socket.on(
                    SOCKET_TYPE.START_PRESENTATION,
                    handleStartPresentationSocket
                );
            }
        } catch (error) {
            console.log(error);
        }

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const verifyJoinLink = async () => {
            try {
                console.log("heeee");
                const res = await ViewerGetPresentation({
                    inviteCode: param.shareCode,
                });
                console.log(res);

                // console.log(res);
                if (res.status === API_STATUS.OK) {
                    const pre = res.data[0];
                    const questionRes = await getQuestionList({
                        presentationID: pre.presentationID,
                    });
                    if (questionRes.status === API_STATUS.OK) {
                        setQuestions(sortQuestions(questionRes.data));
                    }
                    if (questionRes.status !== API_STATUS.OK) {
                        setQuestions([]);
                    }
                    const messageRes = await getMessageList({
                        presentationID: pre.presentationID,
                        lastMessageID: null,
                        limit: 20,
                    });
                    if (messageRes.status === API_STATUS.OK) {
                        setMessages(messageRes.data);
                    } else {
                        setMessages([]);
                    }
                    setLoading(false);
                    setValidUrl(true);
                    setPresentation(pre);
                } else {
                    if (res.status === API_STATUS.PERMISSION_DENIED) {
                        setErrorMessage(
                            "Bạn không có quyền tham gia bản trình chiếu này"
                        );
                    }
                    setLoading(false);
                    setValidUrl(false);
                }
            } catch (error) {
                console.log(error);

                setLoading(false);
                setValidUrl(false);
            }
        };
        verifyJoinLink();
    }, [param]);

    if (loading) {
        return <PageLoading></PageLoading>;
    }

    if (!validUrl) {
        return (
            <Box
                sx={{
                    width: "100%",
                    height: "100vh",
                    backgroundColor: "#202020",
                }}
            >
                <Error message={errorMessage}></Error>
            </Box>
        );
    }

    return (
        <ViewerScreen
            socket={socket}
            presentation={presentation}
            messages={messages}
            questions={questions}
            setMessages={setMessages}
            setQuestions={setQuestions}
            user={user}
        ></ViewerScreen>
    );
};

export default JoiningPage;
