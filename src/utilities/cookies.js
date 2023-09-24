import Cookies from 'js-cookie'


export const setCookie = (key, value, expiredIn = 1) => {
    Cookies.set(key, value, {expires: expiredIn});
    return {
        key,
        value,
    }
}

export const getCookie = (key) => {
    return Cookies.get(key)
}

export const deleteCookie = (key) => {
    Cookies.remove(key)
}

export const getToken = () => {
    const token = getCookie("session_token");
    return token;
}