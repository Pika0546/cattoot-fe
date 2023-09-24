import React, { useContext, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import cssStyle from "./Header.module.css";
import CottageIcon from "@mui/icons-material/Cottage";
import { AppContext } from "../../context/AppContext";
import { logout } from "../../service/AccountService";
import { useNavigate } from "react-router-dom";
const pages = [
    {
        text: "Nhóm của tôi",
        href: "/group",
    },
    {
        text: "Bản trình bày",
        href: "/presentation",
    },
];
const settings = [
    {
        text: "Thông tin cá nhân",
        href: "/me",
    },
    {
        text: "Đăng xuất",
        href: "/logout",
    },
];

const Header2 = () => {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const { user } = useContext(AppContext);
    const navigate = useNavigate();
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="sticky" className={`${cssStyle.header}`}>
            <Container maxWidth="100%">
                <Toolbar disableGutters>
                    <Box
                        sx={{
                            position: "relative",
                            display: { xs: "none", md: "flex" },
                            mr: 1,
                            width: "50px",
                            height: "50px",
                            overflow: "hidden",
                            transform: "rotate(180deg)",
                        }}
                    >
                        <Box
                            component="img"
                            src={require("../../background.gif")}
                            sx={{
                                width: "80px",
                                height: "80px",
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                            }}
                        ></Box>
                    </Box>
                    <Box
                        className={`${cssStyle.title}`}
                        sx={{
                            display: { xs: "none", md: "flex" },
                            mr: 2,
                        }}
                    >
                        Cattoot
                    </Box>
                    {/* ======= MOBILE HEADER ======== */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem
                                    key={page.href}
                                    onClick={() => {
                                        navigate(page.href);
                                        handleCloseNavMenu();
                                    }}
                                >
                                    <Typography
                                        textAlign="center"
                                        fontFamily="Kanit"
                                    >
                                        {page.text}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box
                        sx={{
                            position: "relative",
                            display: { xs: "flex", md: "none" },
                            mr: 1,
                            width: "50px",
                            height: "50px",
                            overflow: "hidden",
                            transform: "rotate(180deg)",
                        }}
                    >
                        <Box
                            component="img"
                            src={require("../../background.gif")}
                            sx={{
                                width: "80px",
                                height: "80px",
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                            }}
                        ></Box>
                    </Box>
                    <Box
                        className={`${cssStyle.title}`}
                        sx={{
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                        }}
                    >
                        Cattoot
                    </Box>
                    {/* ============================== */}

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                        }}
                    >
                        {pages.map((page) => (
                            <Button
                                key={page.href}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 2,
                                    color: "white",
                                    display: "block",
                                    fontFamily: "Kanit",
                                    fontSize: "20px",
                                }}
                                href={page.href}
                            >
                                {page.text}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Button
                            onClick={handleOpenUserMenu}
                            sx={{
                                p: 0,
                                fontSize: "20px",
                                color: "white",
                                fontFamily: "Kanit",
                            }}
                        >
                            Chào, {user.fullname}
                        </Button>
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem
                                    key={setting.href}
                                    onClick={() => {
                                        handleCloseUserMenu();
                                        if (setting.href === "/logout") {
                                            //Call API logout và redirect về login
                                            logout();
                                            navigate("/login");
                                        }
                                    }}
                                    href={setting.href}
                                >
                                    <Typography textAlign="center">
                                        {setting.href === "/logout" ? (
                                            <>{setting.text}</>
                                        ) : (
                                            <a
                                                href={setting.href}
                                                style={{ color: "black" }}
                                            >
                                                {setting.text}
                                            </a>
                                        )}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header2;
