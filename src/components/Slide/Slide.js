import React, { useEffect, useMemo, useReducer, useLayoutEffect } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MultipleChoiceSlide from "./MultipleChoiceSlide/MultipleChoiceSlide.Slide";
import ParagaraphSlide from "./ParagraphSlide/ParagraphSlide.Slide";
import HeadingSlide from "./HeadingSlide/HeadingSlide.Slide";

const Slide = ({ slide }) => {

    return (
        <>
            {slide.type === "MULTIPLE_CHOICE" ? (
                <MultipleChoiceSlide
                    slide={slide}
                />
            ) : (slide.type === "PARAGRAPH" ? (
                <ParagaraphSlide
                    slide={slide}
                />
            ) : (
                <HeadingSlide
                    slide={slide}
                />
            ))}
        </>
    );
};

export default Slide;
