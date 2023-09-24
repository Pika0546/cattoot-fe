import { Box, Typography } from "@mui/material";
import React from "react";

const HeadingSlide = ({ slide, presentation }) => {
    return (
        // <Box 
        // sx={{
        //     display: "flex",
        //     flexDirection: "column",
        //     alignItems: "center",
        //     justifyContent: "space-around"
        // }}>
        //     <Box sx={{
        //         marginTop: 'auto',
        //         marginBottom: 'auto',
        //     }}>
        //     <Typography
        //         component="p"
        //         variant="h1"
        //         align="center"
        //         color="white"
        //         marginTop={1.5}
        //         fontFamily="PatrickHand"
        //         fontSize="3rem"
        //     >
        //         {slide.content.heading}
        //     </Typography>
        //     <Typography
        //         component="p"
        //         variant="h2"
        //         align="center"
        //         color="white"
        //         fontFamily="PatrickHand"
        //         fontSize="1.5rem"
        //         marginTop={1.5}
        //     >
        //         {slide.content.subHeading}
        //     </Typography>
        //     </Box>
            
        // </Box>
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
                component="p"
                variant="h2"
                align="center"
                color="black"
                fontFamily="PatrickHand"
                fontSize="1.5rem"
                marginTop={1.5}
            >
                {slide.content.subHeading}
            </Typography>
            </Box>
            
            
        </Box>
    );
};

export default HeadingSlide;
