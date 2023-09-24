import { useLocation, useNavigate } from "react-router-dom"
import { API_STATUS } from "../config/common";
import {  getMe } from "../service/AccountService";
import { getToken } from "../utilities/cookies";

export const useAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    return async () => {
        try {
            const token = getToken();
            if(token){
                const res = await getMe();
                if(res.status !== API_STATUS.OK){
                    navigate("/login?url=" + escape(location.pathname + location.search));
                }
                return res;
            }
            navigate("/login?url=" + escape(location.pathname + location.search));
        } catch (error) {
            console.log(error);
            navigate("/login?url=" + escape(location.pathname + location.search));
            return null;
        }
        
    }
}

export const useAuthHeader = () => {
    const navigate = useNavigate();
    return async () => {
        try {
            const token = getToken();
            if(token){
                const user = await getMe();
                if(user){
                    return user;
                }
                else{
                    return null;
                }
            }
            return null;
        } catch (error) {
            console.log(error);
            // navigate("/login");
            return null;
        }
        
    }
}