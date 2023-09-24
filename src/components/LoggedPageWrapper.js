import React, { useEffect, useState } from "react";
import { API_STATUS } from "../config/common";
import { AppContext } from "../context/AppContext";

import { useAuth } from "../hook/useAuth";
import Header from "./Header/Header";
import Header2 from "./Header/Header2";
import PageLoading from "./PageLoading/PageLoading";

const LoggedPageWrapper = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(false);

    const auth = useAuth();

    useEffect(() => {
        const getData = async () => {
            const res = await auth();
            if (res && res.status === API_STATUS.OK) {
                setUser(res.data[0]);
            }
            setIsLoading(false);
        };
        getData();
    }, []);

    if (isLoading) {
        return <PageLoading></PageLoading>;
    }

    return (
        <AppContext.Provider
            value={{
                user: user,
            }}
        >
            <Header2></Header2>
            <div className='back-ground'>
                {children}
            </div>
        </AppContext.Provider>
    );
};

export default LoggedPageWrapper;
