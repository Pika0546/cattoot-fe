import React from 'react'

import cssStyle from "./democss.module.css"

import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"

const DemoSCSS = () => {
    return (
        <Stack
            sx={{
                width: "100vw",
                height: "100vh",
            }}
            spacing={2}
            direction="row"
        >
            <Box className={`${cssStyle.blue}`}>
                <span className={`${cssStyle["red-text"]}`}>Red Text</span>
                <span className={`${cssStyle["white-text"]}`}>white Text</span>
            </Box>
        </Stack>
    )
}

export default DemoSCSS