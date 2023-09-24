import React from "react";
import { Box } from "@mui/material";

const EndSlide = () => {
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
            <h1 style={{ fontSize: "28px" }}>
                Bản trình bày đã kết thúc. Cảm ơn bạn đã tham gia.
            </h1>
        </Box>
    );
};

export default EndSlide;
