import React from "react";
import { Box, Stack } from "@mui/material";

const WaitingSlide = () => {
    return (
        <Box
            sx={{
                width: "100%",
                padding: "4rem",
                background: "#202020",
                flex: "1 1 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Stack direction="column" justifyContent="center">
                <img
                    src={require("../../background.gif")}
                    alt="loading..."
                    style={{
                        height: "270px",
                        width: "270px",
                        margin: "0 auto",
                    }}
                />
                <h1 style={{ fontSize: "25px" }}>
                    Vui lòng chờ người chủ trì chuyển sang slide tiếp theo.
                </h1>
            </Stack>
        </Box>
    );
};

export default WaitingSlide;
