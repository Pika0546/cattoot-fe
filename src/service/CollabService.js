import { HTTP_METHOD } from "../config/common";
import { makeRequest } from "../utilities/api";
const URI = "/presentation/collab";
export const getCollabList = async ({ presentationID }) => {
    return makeRequest(HTTP_METHOD.GET, URI, { presentationID });
};

export const addCollab = async ({ presentationID, accountID }) => {
    return makeRequest(HTTP_METHOD.POST, URI, { presentationID, accountID });
};

export const removeCollab = async ({ presentationID, accountID }) => {
    return makeRequest(HTTP_METHOD.POST, URI + "/remove", {
        presentationID,
        accountID,
    });
};
