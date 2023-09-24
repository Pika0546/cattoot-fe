import { API_STATUS, HTTP_METHOD } from "../config/common";
import { makeRequest } from "../utilities/api";
import { deleteCookie, setCookie } from "../utilities/cookies";

const ACCOUNT_URI = "/account";
export const GROUP_MEMBER_ROLE = {
    OWNER: "OWNER",
    COOWNER: "COOWNER",
    MEMBER: "MEMBER",
};
export const login = async ({ email, password }) => {
    const res = await makeRequest(HTTP_METHOD.POST, ACCOUNT_URI + "/login", {
        email,
        password,
    });
    if (res && res.status === API_STATUS.OK) {
        console.log(res);
        setCookie("session_token", res.data[0].token);
        setCookie("session_refresh_token", res.data[0].refreshToken);
    }
    return res;
};

/* body: {email: "", token:""} */
// accountRoute.post("/google-login", googleLogin);

export const googleLogin = async ({ email, fullname, token }) => {
    const res = await makeRequest(
        HTTP_METHOD.POST,
        ACCOUNT_URI + "/google-login",
        {
            email,
            fullname,
            token,
        }
    );
    if (res && res.status === API_STATUS.OK) {
        console.log(res);
        setCookie("session_token", res.data[0].token);
        setCookie("session_refresh_token", res.data[0].refreshToken);
    }
    return res;
};

export const signup = async ({ password, email, fullname }) => {
    const res = await makeRequest(HTTP_METHOD.POST, ACCOUNT_URI + "/", {
        password,
        email,
        fullname,
    });
    if (res && res.status === API_STATUS.OK) {
        console.log(res);
        setCookie("session_token", res.data[0].token);
        setCookie("session_refresh_token", res.data[0].refreshToken);
    }
    return res;
};

export const googleSignup = async ({ token, email, fullname }) => {
    const res = await makeRequest(
        HTTP_METHOD.POST,
        ACCOUNT_URI + "/google-signup",
        {
            email,
            fullname,
            token,
        }
    );
    if (res && res.status === API_STATUS.OK) {
        console.log(res);
        setCookie("session_token", res.data[0].token);
        setCookie("session_refresh_token", res.data[0].refreshToken);
    }
    return res;
};

export const logout = async () => {
    deleteCookie("session_token");
    deleteCookie("session_refresh_token");
    const res = await makeRequest(
        HTTP_METHOD.POST,
        ACCOUNT_URI + "/logout",
        {}
    );
    return res;
};

export const getMe = () => {
    return makeRequest(HTTP_METHOD.GET, ACCOUNT_URI + "/me", {});
};

export const updateName = ({ fullname }) => {
    return makeRequest(HTTP_METHOD.POST, ACCOUNT_URI + "/me", { fullname });
};

export const updatePassword = ({ password, newPassword }) => {
    console.log(password);
    console.log(newPassword);
    return makeRequest(HTTP_METHOD.POST, ACCOUNT_URI + "/me/change-password", {
        password,
        newPassword,
    });
};

export const forgotPassword = async ({ email }) => {
    const res = await makeRequest(
        HTTP_METHOD.POST,
        ACCOUNT_URI + "/forgot_password",
        {
            email,
        }
    );
    if (res && res.status === API_STATUS.OK) {
        console.log(res);
    }
    return res;
};

export const resetPassword = async ({ accountID, password }) => {
    const res = await makeRequest(
        HTTP_METHOD.POST,
        ACCOUNT_URI + "/reset_password",
        {
            accountID,
            password,
        }
    );
    if (res && res.status === API_STATUS.OK) {
        console.log(res);
    }
    return res;
};

export const searchAccountByEmail = async ({ email }) => {
    return makeRequest(HTTP_METHOD.GET, ACCOUNT_URI, { email });
};
