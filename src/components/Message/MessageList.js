import { Stack } from "@mui/material";
import React, { useContext } from "react";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import HostMessageItem from "./MessageItem";

const HostMessageList = ({ messages, isFetching, isOver }) => {
    if (!messages || !messages.length) {
        return "Chưa có tin nhắn";
    }
    return (
        <Stack
            direction="column"
            spacing={1}
            paddingX={1}
            alignItems="flex-start"
            sx={{
                paddingBottom: "4rem",
                paddingTop: !isOver ? 0 : "1rem",
                marginLeft: "0.5rem",
                marginRight: "0.5rem"
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
                    // <Box
                    //     sx={{
                    //         width: '100%',
                    //         display: 'flex',
                    //         flexDirection: 'row',
                    //         justifyContent: 'flex-end !important',
                    //     }}>
                        <HostMessageItem
                            key={item.messageID}
                            message={item}
                        ></HostMessageItem>
                    // </Box>
                );
            })}
        </Stack>
    );
};

export default HostMessageList;
