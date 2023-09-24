import { HTTP_METHOD } from "../config/common";
import { makeRequest } from "../utilities/api";

const URI = "/presentation/message";
const LIMIT = 20;
export const sendMessage = async ({ message, presentationID }) => {
    return makeRequest(HTTP_METHOD.POST, URI, {
        message,
        presentationID,
    });
};

export const getMessageList = async ({
    presentationID,
    lastMessageID,
    limit,
}) => {
    return makeRequest(HTTP_METHOD.GET, URI, {
        presentationID,
        lastMessageID,
        limit: limit || LIMIT,
    });
};
