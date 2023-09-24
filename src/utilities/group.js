import { GROUP_MEMBER_ROLE } from "../service/AccountService";

export const isGroupOwner = (user, group) => {
    const n = group.members.length;
    for (let i = 0; i < n; i++) {
        if (
            group.members[i].accountID === user.accountID &&
            group.members[i].role === GROUP_MEMBER_ROLE.OWNER
        ) {
            return true;
        }
    }
    return false;
};
