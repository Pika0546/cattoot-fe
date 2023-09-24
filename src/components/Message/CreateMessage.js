import { Box, TextField, Stack, CircularProgress } from "@mui/material";
import React, { useState } from "react";

const CreateMessage = ({ submitMessage }) => {
    const [value, setValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = (newValue) => {
        setValue(newValue);
    };

    const handleSubmit = async () => {
        if (value.length) {
            setIsLoading(true);
            const res = await submitMessage(value);
            setIsLoading(false);
            if (res) {
                setValue("");
            }
        }
    };

    return (
        <Stack
            sx={{
                padding: "0.5rem",
            }}
            direction="column"
            alignContent="center"
        >
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Nhập tin nhắn (tối đa 200 kí tự)"
                sx={{
                    "& input": {
                        color: "#fff",
                    },
                    "& .MuiInputBase-root:hover fieldset": {
                        borderColor: "#fff",
                    },
                    "& .Mui-focused fieldset": {
                        border: "1px solid #852D91",
                        borderColor: "#852D91 !important",
                    },
                    "& fieldset": {
                        border: "1px solid",
                        borderColor: "#fff",
                    },
                }}
                inputProps={{
                    maxLength: 200,
                    style: {
                        fontFamily: "PatrickHand",
                    },

                }}
                value={value}
                onChange={(e) => handleChange(e.target.value)}
            />
            <button
                className="btn-hover color-1"
                style={{
                    fontSize: "1.2rem",
                    margin: "1rem auto",
                    width: "150px",
                    height: "auto",
                    padding: "0.5rem 0",
                    ...(isLoading && { background: "#909090" }),
                }}
                onClick={handleSubmit}
                disabled={isLoading}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={3}
                    sx={{
                        width: "100%",
                    }}
                >
                    {isLoading && (
                        <CircularProgress size={25} sx={{ color: "#fff" }} />
                    )}
                    <div> Gửi tin nhắn</div>
                </Stack>
            </button>
        </Stack>
    );
};

export default CreateMessage;
