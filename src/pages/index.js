import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Home from '../components/HomePage/Home'
import PageLoading from '../components/PageLoading/PageLoading';
import { API_STATUS } from '../config/common';
import { getMe } from '../service/AccountService';
import { getToken } from '../utilities/cookies';
const HomePage = () => {
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
    useEffect(() => {
        const getData = async () => {
            const token = getToken();
            if(token){
                try {
					const res = await getMe();
					if(res.status === API_STATUS.OK){
						navigate("/presentation");
					}
				} catch (error) {
					setIsLoading(false);
				}
            }
            setIsLoading(false);
        };
        getData();
    }, []);

    if (isLoading) {
        return <PageLoading></PageLoading>;
    }
	
	return (
		<Home/>
	)
}

export default HomePage