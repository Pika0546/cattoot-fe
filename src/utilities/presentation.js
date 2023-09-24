export const isMinePresentation = (user, presentation) => {
    return !!(
        user &&
        presentation &&
        user.accountID === presentation.createdByAccountID
    );
};

export const isEditablePresentation = (user, presentation, collabList) => {
    if (user.accountID === presentation.createdByAccountID) {
        return true;
    }
    const r = collabList.find((item) => item.accountID === user.accountID);
    return !!r;
};

export const isSharabledPresentation = (user, presentation) => {
    return (
        (presentation.groups && presentation.groups.length) ||
        user.accountID === presentation.createdByAccountID
    );
};
