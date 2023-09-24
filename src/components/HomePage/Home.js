import React from "react";
// import { Button } from "@mui/material";
// import { styled } from '@mui/system';

import cssStyle from "./Home.module.css";

const Home = () => {
    return (
        <div>
            <div className={`${cssStyle["title"]}`}>
                <h1>Chào mừng đến với Cattoot</h1>
                <a href="/login">
                    <button className="btn-hover color-1">Đăng nhập</button>
                </a>
                <a href="/signup">
                    <button className="btn-hover color-1">Tạo tài khoản</button>
                </a>
            </div>
        </div>
    );
};

export default Home;
