import React, { Fragment, useEffect, useState } from "react";
import { API_STATUS, HTTP_METHOD } from "../../config/common";
import { makeRequest } from "../../utilities/api";
import { Link, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import InPageLoading from "../PageLoading/InPageLoading";
import { useNavigate } from "react-router-dom";

const JoinGroup = () => {
    const [loading, setLoading] = useState(true);
    const [validUrl, setValidUrl] = useState(false);
    const param = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmailUrl = async () => {
            try {
                //makeRequest
                const JOIN_URL = `/group/invite/${param.inviteCode}`;
                const res = await makeRequest(HTTP_METHOD.GET, JOIN_URL);
                // console.log(res);
                if (res.status === API_STATUS.NOT_FOUND) {
                    setLoading(false);
                    setValidUrl(false);
                }
                if (res.status === API_STATUS.OK) {
                    setLoading(false);
                    setValidUrl(true);
                    console.log(res);
                    navigate(`/group/${res.data[0].groupID}`);
                }
            } catch (error) {
                console.log(error);
                setLoading(false);
                setValidUrl(false);
            }
        };
        verifyEmailUrl();
    }, [param, navigate]);

    return (
        <Fragment>
            {loading || validUrl ? (
                <InPageLoading></InPageLoading>
            ) : (
                <h1>404 Not Found</h1>
            )}
        </Fragment>
    );
};

export default JoinGroup;
