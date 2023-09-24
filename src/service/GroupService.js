import { API_STATUS, HTTP_METHOD } from "../config/common";
import { makeRequest } from "../utilities/api";
import { deleteCookie, setCookie } from "../utilities/cookies";

const GROUP_URI = "/group";

export const createGroup = async ({ name, description }) => {
    const res = await makeRequest(HTTP_METHOD.POST, GROUP_URI + "/", {
        name,
        description,
    });
    return res;
};

export const groupList = async () => {
    const res = await makeRequest(HTTP_METHOD.GET, GROUP_URI + "/");
    return res;
};

export const groupDetail = async (groupID) => {
    const res = await makeRequest(HTTP_METHOD.GET, GROUP_URI + "/" + groupID);
    return res;
};

export const sendEmailInviteGroup = async ({
    email,
    groupName,
    inviteLink,
}) => {
    const res = await makeRequest(
        HTTP_METHOD.POST,
        GROUP_URI + "/email-invite",
        {
            email,
            groupName,
            inviteLink,
        }
    );
    return res;
};
export const changeRole = async ({ accountID, role, groupID }) => {
    const res = await makeRequest(
        HTTP_METHOD.POST,
        GROUP_URI + "/role-update",
        { accountID, role, groupID }
    );
    return res;
};

export const removeMember = async ({ accountID, groupID }) => {
    const res = await makeRequest(
        HTTP_METHOD.POST,
        GROUP_URI + "/remove-member",
        { accountID, groupID }
    );
    return res;
};

export const getMyGroupList = async () => {
    const res = await makeRequest(HTTP_METHOD.GET, GROUP_URI + "/my-groups");
    return res;
};

// export const sharePresentationToGroup = async ({ groupID, presentationID }) => {
//     const res = await makeRequest(
//         HTTP_METHOD.POST,
//         GROUP_URI + "/shared_presentation",
//         { groupID, presentationID }
//     );
//     return res;
// };

export const removePresentationFromGroup = async ({
    groupID,
    presentationID,
}) => {
    console.log(groupID);
    const res = await makeRequest(
        HTTP_METHOD.POST,
        GROUP_URI + "/removed_presentation",
        { groupID, presentationID }
    );
    return res;
};

export const deleteGroup = async ({ groupID }) => {
    return await makeRequest(HTTP_METHOD.POST, GROUP_URI + "/delete", {
        groupID,
    });
};

export const shareMultiPresentationToGroup = async ({
    sharedGroup,
    unSharedGroup,
    presentationID,
}) => {
    const res = await makeRequest(
        HTTP_METHOD.POST,
        GROUP_URI + "/shared_presentation",
        { sharedGroup, unSharedGroup, presentationID }
    );
    return res;
};
