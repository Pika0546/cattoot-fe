import { Box, Typography } from "@mui/material";
import React from "react";

const ParagraphSlide = ({ slide, presentation }) => {
    return (
        <Box
            sx={{
                width: "100%",
                height: "500px",
                background: "#fff",
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                fontFamily: "PatrickHand",
                padding: "20px",
            }}
        >
            <Box>
            <Typography
                component="p"
                variant="h1"
                align="center"
                color="black"
                marginTop={1.5}
                fontFamily="PatrickHand"
                fontSize="3rem"
            >
                {slide.content.heading}
            </Typography>
            <Typography
            aria-multiline
                component="p"
                variant="h2"
                align="center"
                color="black"
                fontFamily="PatrickHand"
                fontSize="1.3rem"
                marginTop={1.5}
            >
                {slide.content.paragraph}
            </Typography>
            </Box>
            
            
        </Box>
    );
};

export default ParagraphSlide;
