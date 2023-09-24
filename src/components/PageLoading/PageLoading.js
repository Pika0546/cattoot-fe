import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import classes from "./PageLoading.module.css";
const PageLoading = () => {
    const [dots, setDots] = useState([".", ".", "."]);

    const intervalRef = useRef(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setDots((prev) => {
                if (prev.length >= 3) {
                    return ["."];
                }
                const re = [...prev];
                re.push(".");
                return re;
            });
        }, [500]);

        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <Stack
            sx={{
                width: "100vw",
                height: "100vh",
                position: "fixed",
                zIndex: 100000,
                paddingTop: "10rem",
                background: "rgb(32, 32, 32)",
            }}
            direction="column"
            alignItems="center"
            spacing={2}
        >
            {/* <CircularProgress /> */}
            <img
                src={require("../../background.gif")}
                alt="loading..."
                style={{ height: "220px", width: "220px" }}
            />
            <Box className={`${classes["loading-text"]}`}>
                Đang tải {dots.join(" ")}
            </Box>
        </Stack>
    );
};

export default PageLoading;
