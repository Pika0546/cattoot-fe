import React from "react";

import Typography from "@mui/material/Typography";

const Error = ({ message = 404 }) => {
    return (
        <Typography
            component="h1"
            variant="h2"
            align="center"
            color="white"
            gutterBottom
            marginTop="4.5rem"
            fontFamily="PatrickHand"
        >
            {message || 404}
        </Typography>
    );
};

export default Error;
