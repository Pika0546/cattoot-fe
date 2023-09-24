import React, { useEffect, useState } from "react";
import MultipleChoiceSlideSetting from "./MultipleChoiceSlide/MultipleChoiceSlide.Setting";
import ParagraphSlideSetting from "./ParagraphSlide/ParagraphSlide.Setting";
import HeadingSlideSetting from "./HeadingSlide/HeadingSlide.Setting";
const SlideSetting = ({ slide, handleChangeSlide }) => {
    return (
        <>
            {slide.type === "MULTIPLE_CHOICE" ? (
                <MultipleChoiceSlideSetting
                    slide={slide}
                    handleChangeSlide={handleChangeSlide}
                />
            ) : (slide.type === "PARAGRAPH" ? (
                <ParagraphSlideSetting
                    slide={slide}
                    handleChangeSlide={handleChangeSlide}
                />
            ) : (
                <HeadingSlideSetting
                    slide={slide}
                    handleChangeSlide={handleChangeSlide}
                />
            ))}
        </>
    );
};

export default SlideSetting;
