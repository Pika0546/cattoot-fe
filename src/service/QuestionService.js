import { HTTP_METHOD } from "../config/common";
import { makeRequest } from "../utilities/api";

const URI = "/presentation/question";

export const sendQuestion = async ({ question, presentationID }) => {
    return makeRequest(HTTP_METHOD.POST, URI, {
        question,
        presentationID,
    });
};

export const getQuestionList = async ({ presentationID, isAnswered }) => {
    return makeRequest(HTTP_METHOD.GET, URI, {
        presentationID,
        isAnswered,
    });
};

export const markAnsweredQuestion = async ({ presentationID, questionID }) => {
    return makeRequest(HTTP_METHOD.POST, `${URI}/mark-answered`, {
        presentationID,
        questionID,
    });
};

export const upvoteQuestion = async ({ presentationID, questionID }) => {
    return makeRequest(HTTP_METHOD.POST, `${URI}/upvote`, {
        presentationID,
        questionID,
    });
};