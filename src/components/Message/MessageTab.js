import { Box } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { SOCKET_TYPE } from "../../config";
import { API_STATUS } from "../../config/common";
import useInfiniteScroll from "../../hook/useInfiniteScroll";
import { useToast } from "../../hook/useToast";
import useUnmountPromise from "../../hook/useUnmountPromise";
import { getMessageList, sendMessage } from "../../service/MessageService";
import CreateMessage from "./CreateMessage";
import HostMessageList from "./MessageList";
import styles from "./Message.module.css";

const HostMessageTab = ({
    socket,
    messages,
    setMessages,
    presentationID,
    handleCloseSidebar,
    openMessageTab: open,
}) => {
    const toast = useToast();

    const unMountPromise = useUnmountPromise();

    const [state, setState] = useState({
        isOver: false,
        total: 0,
    });

    const oldScrollHeightRef = useRef(null);
    const getMessages = async () => {
        const res = await getMessageList({
            presentationID: presentationID,
            lastMessageID: messages[0].messageID,
        });
        return res;
    };

    const fetchMoreData = async () => {
        if (!state.isOver) {
            await unMountPromise(getMessages, {}, (res) => {
                if (res.status === API_STATUS.OK) {
                    setMessages((prev) => [...res.data, ...prev]);
                } else {
                    setState((prev) => ({ ...prev, isOver: true }));
                }
                setIsFetching(false);
            });
        }
    };

    const { isFetching, setIsFetching, setElement } = useInfiniteScroll(
        fetchMoreData,
        "top"
    );
    const listRef = useRef(null);

    const handleRecieveMessageSocket = (data) => {
        console.log(data);
        if (data) {
            const message = data.message;
            if (message) {
                setMessages((prev) => {
                    const copy = [...prev];
                    if (
                        !prev.find(
                            (item) => item.messageID === message.messageID
                        )
                    ) {
                        copy.push(message);
                    }
                    return copy;
                });
            }
        }
    };

    const handleSubmitMessage = async (message) => {
        const res = await sendMessage({
            presentationID: presentationID,
            message: message,
        });

        if (res.status === API_STATUS.OK) {
            setMessages((prev) => {
                const copy = [...prev];
                if (
                    !prev.find(
                        (item) => item.messageID === res.data[0].messageID
                    )
                ) {
                    copy.push(res.data[0]);
                }
                return copy;
            });
            return true;
        } else {
            console.log(res);
            toast.error(res.message);
            return false;
        }
    };

    useEffect(() => {
        setElement(listRef.current);
        if (socket && socket.connected) {
            socket.on(SOCKET_TYPE.SEND_MESSAGE, handleRecieveMessageSocket);
        }
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
            oldScrollHeightRef.current = listRef.current.scrollHeight;
        }
    }, [open]);

    useEffect(() => {
        if (!isFetching) {
            if (oldScrollHeightRef.current !== listRef.current.scrollHeight) {
                listRef.current.scrollTop =
                    listRef.current.scrollHeight - oldScrollHeightRef.current;
                oldScrollHeightRef.current = listRef.current.scrollHeight;
            }
        }
    }, [isFetching]);

    const useOutsideClick = (callback) => {
        const ref = useRef();

        useEffect(() => {
            const handleClick = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    callback();
                }
            };

            document.addEventListener('click', handleClick, true);

            return () => {
                document.removeEventListener('click', handleClick, true);
            };
        }, [ref]);

        return ref;
    };
    const ref = useOutsideClick(() => {
        handleCloseSidebar();
    });
    return (
        <Box
            ref={ref}
            className={`${styles.menuBody}`}
            textAlign="center"
            sx={{
                display: "flex",
                height: "100%",
                width: "100%",
                flexDirection: "column",
                ...(open && {
                    left: "0 !important",
                }),
                fontFamily: "PatrickHand",
                zIndex: 1000,
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
                Tin nhắn
            </Box>
            <Box
                sx={{
                    width: "100%",
                    flex: "1 1 auto",
                    position: "relative",
                    overflow: "auto",
                    backgroundColor: "black",
                }}
                ref={listRef}
            >
                <Box
                    sx={{
                        position: "absolute",
                        width: "100%",
                    }}
                >
                    <HostMessageList
                        messages={messages}
                        isFetching={isFetching}
                        isOver={state.isOver}
                    ></HostMessageList>
                </Box>
            </Box>
            <Box
                sx={{
                    borderTop: "1px solid #fff",
                }}
            >
                <CreateMessage
                    submitMessage={handleSubmitMessage}
                ></CreateMessage>
            </Box>
        </Box>
    );
};

export default HostMessageTab;
