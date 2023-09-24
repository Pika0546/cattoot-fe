import { Stack, Box, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import MessageItem from "./MessageItem";
import { getMessageList } from "../../../service/MessageService";
import { API_STATUS } from "../../../config/common";
const MessageList = ({ messages, isFetching, isOver, user }) => {
    // if (!messages || !messages.length) {
    //     return "Chưa có tin nhắn";
    // }
    return (
        (!messages || !messages.length ? (
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                <Typography sx={{
                    fontFamily: "PatrickHand"
                }}>
                    Chưa có tin nhắn
                </Typography>
            </Box>
        ) : (
            <Stack
            direction="column"
            spacing={1}
            paddingX={1}
            alignItems="flex-start"
            sx={{
                paddingBottom: "4rem",
                paddingTop: !isOver ? 0 : "1rem",
            }}
        >
            {!isOver && (
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        width: "100%",
                        visibility: isFetching ? "visible" : "hidden",
                        marginY: "1rem",
                    }}
                >
                    <CircularProgress size={20} />
                </Stack>
            )}

            {messages.map((item, index) => {
                return (
                    <MessageItem
                        key={item.messageID}
                        message={item}
                        user={user}
                    ></MessageItem>
                );
            })}
        </Stack>
        ))
        
    );
};

export default MessageList;
