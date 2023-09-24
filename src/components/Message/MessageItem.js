import { Stack, Box } from "@mui/material";
import React, { useContext } from "react";
import { getFormattedDate } from "../../utilities/datetime";
import { AppContext } from "../../context/AppContext";

const HostMessageItem = ({ message }) => {
    const { user } = useContext(AppContext);

    return (
        (message.createdBy && message.createdBy.accountID === user.accountID ? (
            <Stack
                direction="column"
                alignItems="flex-end"
                sx={{ width: "100%" }}
            >
                <Box
                    component="p"
                    sx={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        maxWidth: "70%",
                        fontSize: "1rem",
                        ...(!message.createdBy && { color: "#868686" }),
                    }}
                >
                    {message.createdBy ? message.createdBy.fullname : "Ẩn danh"}
                </Box>
                <Stack
                    direction="column"
                    sx={{
                        backgroundColor: "#F5E7DC",
                        padding: "5px",
                        color: "#000",
                        borderRadius: "10px",
                        fontSize: "1.3rem",
                        minWidth: "4rem",
                        maxWidth: "70%",
                        paddingBottom: "2px",
                        wordBreak: "break-word",
                        "& span": {
                            fontSize: ".8rem",
                            lineHeight: ".8rem",
                            color: "#868686",
                            alignSelf: "flex-end",
                        },
                    }}
                >
                    <Box component="p">{message.message}</Box>
                    <Box component="span">
                        {getFormattedDate(new Date(message.createdAt), "HH:MM")}
                    </Box>
                </Stack>
            </Stack>
        ) : (
            <Stack
                direction="column"
                alignItems="flex-start"
                sx={{ width: "100%" }}
            >
                <Box
                    component="p"
                    sx={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        maxWidth: "70%",
                        fontSize: "1rem",
                        ...(!message.createdBy && { color: "#868686" }),
                    }}
                >
                    {message.createdBy ? message.createdBy.fullname : "Ẩn danh"}
                </Box>
                <Stack
                    direction="column"
                    sx={{
                        backgroundColor: "#F5E7DC",
                        padding: "5px",
                        color: "#000",
                        borderRadius: "10px",
                        fontSize: "1.3rem",
                        minWidth: "4rem",
                        maxWidth: "70%",
                        paddingBottom: "2px",
                        wordBreak: "break-word",
                        "& span": {
                            fontSize: ".8rem",
                            lineHeight: ".8rem",
                            color: "#868686",
                            alignSelf: "flex-end",
                        },
                    }}
                >
                    <Box component="p">{message.message}</Box>
                    <Box component="span">
                        {getFormattedDate(new Date(message.createdAt), "HH:MM")}
                    </Box>
                </Stack>
            </Stack >
        ))

    );
};

export default HostMessageItem;
