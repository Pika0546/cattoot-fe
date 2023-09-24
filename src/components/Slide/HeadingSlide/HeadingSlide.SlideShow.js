import React, { useEffect, useMemo, useReducer, useLayoutEffect } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const HeadingSlideShow = ({ slide }) => {

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
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
                fontSize="4rem"
            >
                {slide.content.heading}
            </Typography>
            <Typography
                component="p"
                variant="h2"
                align="center"
                color="black"
                fontFamily="PatrickHand"
                fontSize="2.5rem"
                marginTop={1.5}
            >
                {slide.content.subHeading}
            </Typography>
            </Box>
            
            
        </Box>
    );
};

export default HeadingSlideShow;
