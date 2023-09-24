import React, { Fragment, useEffect, useState } from "react";
import { API_STATUS, HTTP_METHOD } from "../../config/common";
import { makeRequest } from "../../utilities/api";
import { Link, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import Error from "../Error/Error";

const EmailVerify = () => {
    const [loading, setLoading] = useState(true);
    const [validUrl, setValidUrl] = useState(false);
    const param = useParams();

    useEffect(() => {
        const verifyEmailUrl = async () => {
            try {
                //makeRequest
                const VERIFY_URL = `/account/${param.id}/verify/${param.token}`;
                const res = await makeRequest(HTTP_METHOD.GET, VERIFY_URL);
                // console.log(res);
                if (res.status === API_STATUS.NOT_FOUND) {
                    setLoading(false);
                    setValidUrl(false);
                }
                if (res.status === API_STATUS.OK) {
                    setLoading(false);
                    setValidUrl(true);
                }
            } catch (error) {
                console.log(error);
                setLoading(false);
                setValidUrl(false);
            }
        };
        verifyEmailUrl();
    }, [param]);

    return (
        <Fragment>
            {loading ? (
                <div>loading...</div>
            ) : validUrl ? (
                <div>
                    <h1 style={{ fontSize: "50px" }}>
                        Xác minh email tài khoản thành công.
                    </h1>
                    <Link to="/login">
                        <Button color="primary" variant="contained">
                            Đăng nhập
                        </Button>
                    </Link>
                </div>
            ) : (
                <Error></Error>
            )}
        </Fragment>
    );
};

export default EmailVerify;
