import { API_STATUS, HTTP_METHOD } from "../config/common";
import queryString from "query-string";
import { getToken } from "./cookies";

export const API_HOST = process.env.REACT_APP_API_HOST;

export const makeRequest = async (method, url, data = null, option = {}) => {
    let res = null;
    if (method === HTTP_METHOD.GET || method === HTTP_METHOD.DELETE) {
        res = await (
            await fetch(`${API_HOST}${url}?${queryString.stringify(data)}`, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + getToken(),
                },
            })
        ).json();
    } else {
        res = await (
            await fetch(`${API_HOST}${url}`, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + getToken(),
                },
                body: JSON.stringify(data || {}),
            })
        ).json();
    }

    // if (res && res.status === API_STATUS.AUTHENTICATE) {
    //     window.location.href = "/login";
    // }
    return res;
};
