import React, { useEffect, useState, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import {
    Grid,
    Box,
    TextField,
    Typography,
    Stack,
    CardMedia,
    Menu,
    MenuItem,
} from "@mui/material";
import { useFullScreenHandle } from "react-full-screen";

import jpgTemplate from "../../play_presentation.png";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { API_STATUS } from "../../config/common";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hook/useToast";

import {
    groupDetail,
    changeRole,
    removeMember,
    removePresentationFromGroup,
} from "../../service/GroupService";
import InPageLoading from "../PageLoading/InPageLoading";
import InviteGroupDialog from "../InviteGroupDialog/InviteGroupDialog";
import "../../App.css";
import cssStyle from "./GroupDetail.module.css";
import { AppContext } from "../../context/AppContext";
import io from "socket.io-client";
import { SOCKET_URL, SOCKET_TYPE } from "../../config";
import { SECRET_PRESENTATION } from "../../config";
import GroupSlideShowContainer from "./GroupSlideShowContainer";
import Error from "../Error/Error";
const sign = require("jwt-encode");

const socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket"],
});

const theme = createTheme({
    overrides: {
        overrides: {
            MuiTableRow: {
                hover: {
                    "&:hover": {
                        backgroundColor: "rgba(33, 150, 243, 0.25) !important",
                    },
                },
            },
        },
    },
});

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#fff",
    border: "2px solid #7439db",
    boxShadow: 24,
    p: 2,
};

export default function GroupDetail() {
    const { user } = useContext(AppContext);
    const [detail, setDetail] = useState("");
    const [loading, setLoading] = useState(true);

    const [rows, setRow] = useState([]);
    const [inviteGroup, setInviteGroup] = useState(null);
    const [selectedRow, setSelectedRow] = useState("");
    const [presentation, setPresentation] = useState(null);
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState("");
    const [contextMenu, setContextMenu] = useState({
        context: null,
    });
    const [invalid, setInvalid] = useState(false);

    const screen = useFullScreenHandle();

    const navigate = useNavigate();
    const toast = useToast();
    const detailRef = useRef(null);
    detailRef.current = detail;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleOpen = (value) => {
        console.log(user);
        setOpen(true);
        console.log(value);
        setSelectedRow(value);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedRow("");
        setRole("");
    };

    const onSubmit1 = async () => {
        try {
            const updateData = {
                accountID: selectedRow.accountID,
                groupID: detail.groupID,
            };
            console.log(updateData);

            setLoading(true);
            const res = await removeMember(updateData);
            setLoading(false);
            console.log(res);
            if (res.status === API_STATUS.OK) {
                handleClose();
                setDetail(res.data[0]);
                setRow(res.data[0].members);
                // window.location.reload();
                toast.info("Xóa thành viên thành công");
            }
        } catch (err) {
            setLoading(false);
            console.log(err);
        }
    };

    const onSubmit = async (data) => {
        const updateData = {
            ...data,
            accountID: selectedRow.accountID,
            groupID: detail.groupID,
        };
        try {
            console.log(updateData);

            setLoading(true);
            const res = await changeRole(updateData);
            setLoading(false);
            console.log(res);
            if (res.status === API_STATUS.OK) {
                handleClose();
                setDetail(res.data[0]);
                setRow(res.data[0].members);
                // window.location.reload();
            }
        } catch (err) {
            setLoading(false);
            console.log(err);
        }
    };

    const handleClickPresentation = (presentation) => {
        console.log(presentation);
        if (user.accountID === presentation.createdByAccountID) {
            navigate(`/presentation/${presentation.presentationID}`);
        } else {
            detail.members.map((member) => {
                if (member.accountID === user.accountID) {
                    if (member.role === "COOWNER") {
                        screen.enter();
                    } else {
                        const shareCode = presentation
                            ? sign(
                                  presentation.presentationID,
                                  SECRET_PRESENTATION
                              )
                            : "";
                        console.log(shareCode);
                        navigate(`/presentation/join/${shareCode}`);
                    }
                }
            });
        }
    };

    const handleClickRemovePresentation = async () => {
        if (detailRef.current) {
            const groupID = detailRef.current.groupID;
            const presentationID = detailRef.current.sharedPresentationID;
            const result = await removePresentationFromGroup({
                groupID,
                presentationID,
            });
            console.log(result);
        }
    };

    const handleRemoveMemberSocket = (data = {}) => {
        if (detailRef.current) {
            const groupID = data.groupID;
            const accountID = data.accountID;
            if (groupID && accountID && groupID === detailRef.current.groupID) {
                if (accountID == user.accountID) {
                    toast.info("Bạn đã bị xóa khỏi nhóm này !");
                    setTimeout(() => {
                        navigate("/group");
                    }, [2000]);
                }
            }
        }
    };

    const handleStartPresentationSocket = (data = {}) => {
        if (detailRef.current) {
            const groupID = data.groupID;
            const presentation = data.presentation;
            if (groupID === detailRef.current.groupID) {
                if (presentation) {
                    toast.info(
                        "Một bản trình chiếu vừa được thêm vào nhóm này"
                    );
                    setPresentation(presentation);
                } else {
                    toast.info("Bản trình bày đã bị gỡ khỏi nhóm");
                    setPresentation(null);
                }
            }
        }
    };

    const handleGroupDelete = (data = {}) => {
        console.log(data);
        if (detailRef.current) {
            const groupID = data.groupID;
            if (groupID === detailRef.current.groupID) {
                toast.error("Nhóm này đã bị xóa, trở về trang chủ sau 2 giây");
                setTimeout(() => {
                    navigate("/group");
                }, [2000]);
            }
        }
    };

    useEffect(() => {
        const getDetail = async () => {
            // const url = window.location.href;
            const myArray = window.location.href.split("/");
            const groupID = myArray[myArray.length - 1];
            const res = await groupDetail(groupID);
            if (res && res.status === API_STATUS.OK) {
                console.log(res);
                setDetail(res.data[0]);
                if (res.data[0].presentation) {
                    setPresentation(res.data[0].presentation);
                }
                setRow(res.data[0].members);
            } else {
                setInvalid(true);
            }
            setLoading(false);
        };
        getDetail();
    }, []);

    useEffect(() => {
        try {
            if (!socket.connected) {
                socket.connect();
                socket.on(SOCKET_TYPE.REMOVE_MEMBER, handleRemoveMemberSocket);
                socket.on(
                    SOCKET_TYPE.START_PRESENTATION,
                    handleStartPresentationSocket
                );
                socket.on(SOCKET_TYPE.DELETE_GROUP, handleGroupDelete);
            }
        } catch (error) {
            console.log(error);
        }

        return () => {
            socket.disconnect();
        };
    }, []);

    if (loading) {
        return <InPageLoading></InPageLoading>;
    }

    if (invalid) {
        return <Error></Error>;
    }

    const handleInviteDialogClose = () => {
        // setOpenInviteDialog(false);
        setInviteGroup(null);
    };

    const handleContextMenu = (event, slide) => {
        event.preventDefault();
        setContextMenu({
            context:
                contextMenu.context === null
                    ? {
                          mouseX: event.clientX + 2,
                          mouseY: event.clientY - 6,
                      }
                    : null,
            slide,
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu({
            context: null,
        });
    };

    return (
        <Stack
            component="main"
            direction="column"
            spacing={2}
            sx={{ width: "70%" }}
        >
            {/* Hero unit */}
            <Typography
                component="h1"
                variant="h2"
                align="left"
                color="white"
                paddingLeft="0rem"
                marginBottom="0rem"
                fontFamily="PatrickHand"
            >
                Nhóm: {detail.name}
            </Typography>
            <Typography
                component="h1"
                variant="h2"
                align="left"
                color="white"
                padding="0rem"
                fontSize="2rem"
                fontFamily="PatrickHand"
            >
                Mô tả: {detail.description}
            </Typography>
            {presentation ? (
                <>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-start",
                        }}
                    >
                        <Typography
                            component="h1"
                            variant="h2"
                            align="left"
                            color="white"
                            padding="0rem"
                            fontSize="2rem"
                            fontFamily="PatrickHand"
                        >
                            Bản trình bày:
                        </Typography>
                        <Typography
                            component="h1"
                            variant="h2"
                            align="left"
                            color="#F7944D"
                            padding="0rem"
                            fontSize="2rem"
                            fontFamily="Kanit"
                            marginLeft={1}
                        >
                            {presentation.name}
                        </Typography>
                    </Box>
                    <CardMedia alt="random">
                        <Menu
                            open={contextMenu.context !== null}
                            onClose={handleCloseContextMenu}
                            anchorReference="anchorPosition"
                            anchorPosition={
                                contextMenu.context !== null
                                    ? {
                                          top: contextMenu.context.mouseY,
                                          left: contextMenu.context.mouseX,
                                      }
                                    : undefined
                            }
                        >
                            <MenuItem
                                onClick={() => {
                                    handleClickRemovePresentation();
                                    handleCloseContextMenu();
                                }}
                            >
                                Gỡ bản trình bày
                            </MenuItem>
                        </Menu>
                        <Grid
                            container
                            justifyContent="center"
                            sx={{ marginTop: "10px" }}
                        >
                            <Grid
                                lg={4}
                                md={6}
                                sm={8}
                                sx={{
                                    backgroundColor: "white",
                                    cursor: "pointer",
                                    transition: "transform 0.15s ease-in-out",
                                    "&:hover": {
                                        transform: "scale3d(1.05, 1.05, 1)",
                                    },
                                }}
                                onClick={() => {
                                    handleClickPresentation(presentation);
                                }}
                                onContextMenu={(e) => {
                                    if (
                                        user.accountID ===
                                        presentation.createdByAccountID
                                    ) {
                                        handleContextMenu(e);
                                    }
                                }}
                            >
                                <img
                                    src={jpgTemplate}
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                    }}
                                    alt="slide"
                                    draggable="false"
                                />
                            </Grid>
                        </Grid>
                    </CardMedia>
                    <GroupSlideShowContainer
                        presentation={presentation}
                        setPresentation={setPresentation}
                        screen={screen}
                        group={detail}
                    ></GroupSlideShowContainer>
                </>
            ) : (
                <></>
            )}
            <button
                className="btn-hover color-1"
                onClick={() => {
                    // handleClickInviteDialogOpen(
                    //     item.groupID
                    // );
                    setInviteGroup(detail);
                }}
                style={{
                    margin: "15px auto",
                }}
            >
                Gửi lời mời
            </button>
            <InviteGroupDialog
                open={!!inviteGroup}
                setOpen={setInviteGroup}
                onClose={handleInviteDialogClose}
                inviteGroup={inviteGroup}
            ></InviteGroupDialog>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{ minHeight: 450, width: 650 }}>
                    <TableContainer component={Paper}>
                        <Table
                            sx={{
                                minWidth: 650,
                                background: "#202020",
                                border: "1px solid orange",
                            }}
                            size="small"
                            aria-label="a dense table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            fontFamily: "PatrickHand",
                                            fontSize: 18,
                                            fontWeight: 900,
                                            color: "white",
                                        }}
                                    >
                                        TÊN
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontFamily: "PatrickHand",
                                            fontSize: 18,
                                            fontWeight: 900,
                                            color: "white",
                                        }}
                                        align="left"
                                    >
                                        EMAIL
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontFamily: "PatrickHand",
                                            fontSize: 18,
                                            fontWeight: 900,
                                            color: "white",
                                        }}
                                        align="left"
                                    >
                                        VAI TRÒ
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        onClick={() => handleOpen(row)}
                                        selected="true"
                                        key={row.accountID}
                                        sx={{
                                            cursor: "pointer",
                                            "&:last-child td, &:last-child th":
                                                { border: 0 },
                                        }}
                                    >
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            sx={{
                                                fontFamily: "PatrickHand",
                                                fontSize: 18,
                                                color: "white",
                                            }}
                                        >
                                            {row.fullname}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontFamily: "PatrickHand",
                                                fontSize: 18,
                                                color: "white",
                                            }}
                                            align="left"
                                        >
                                            {row.email}
                                        </TableCell>
                                        {row.role === "OWNER" ? (
                                            <TableCell
                                                sx={{
                                                    fontFamily: "PatrickHand",
                                                    fontSize: 18,
                                                    color: "#F7944D",
                                                }}
                                                align="left"
                                            >
                                                {row.role}
                                            </TableCell>
                                        ) : row.role === "COOWNER" ? (
                                            <TableCell
                                                sx={{
                                                    fontFamily: "PatrickHand",
                                                    fontSize: 18,
                                                    color: "#C66FBC",
                                                }}
                                                align="left"
                                            >
                                                {row.role}
                                            </TableCell>
                                        ) : (
                                            <TableCell
                                                sx={{
                                                    fontFamily: "PatrickHand",
                                                    fontSize: 18,
                                                    color: "white",
                                                }}
                                                align="left"
                                            >
                                                {row.role}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </div>

            {user.accountID === detail.createdByAccountID &&
            selectedRow.role !== "OWNER" ? (
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            align="center"
                            fontFamily="PatrickHand"
                            color="black"
                        >
                            {selectedRow.fullname} - {selectedRow.role}
                        </Typography>
                        <form onSubmit={handleSubmit(onSubmit1)}>
                            <Box align="center">
                                <Button
                                    sx={{
                                        margin: "10px",
                                        background: "#7439db",
                                        fontFamily: "PatrickHand",
                                    }}
                                    variant="contained"
                                    size="small"
                                    type="submit"
                                    // onClick={handleClose}
                                >
                                    Xóa khỏi nhóm
                                </Button>
                            </Box>
                        </form>
                        <>
                            <hr className={`${cssStyle["gradient-line"]}`} />
                            <Typography
                                id="modal-modal-description"
                                variant="h6"
                                component="p"
                                align="center"
                                fontFamily="Kanit"
                                padding="10px"
                                color="#F7944D"
                                marginTop="20px"
                            >
                                Đổi vai trò
                            </Typography>
                            <Box align="center">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {/* <input value={selectedRow.accountID} {...register('accountID')} style={display='hidden'}/>
                                        <input value={detail.groupID} {...register('groupID')} style={display='hidden'}/> */}

                                    {selectedRow.role === "MEMBER" ? (
                                        <>
                                            <TextField
                                                select
                                                fullWidth
                                                label="Lựa chọn"
                                                inputProps={register(
                                                    "role",
                                                    {}
                                                )}
                                                onChange={(event) => {
                                                    setRole(event.target.value);
                                                }}
                                                InputLabelProps={{
                                                    style: {
                                                        fontSize: 25,
                                                        fontFamily:
                                                            "PatrickHand",
                                                        color: "black",
                                                    },
                                                }} // font size of input label
                                                sx={{
                                                    "& .MuiSelect-select": {
                                                        fontFamily:
                                                            "PatrickHand",
                                                        color: "#000",
                                                    },
                                                    "& .MuiInputBase-root:hover fieldset":
                                                        {
                                                            borderColor:
                                                                "#F7944D",
                                                        },
                                                }}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value={"COOWNER"}>
                                                    COOWNER
                                                </MenuItem>
                                            </TextField>
                                        </>
                                    ) : (
                                        <>
                                            <TextField
                                                select
                                                fullWidth
                                                label="Lựa chọn"
                                                inputProps={register(
                                                    "role",
                                                    {}
                                                )}
                                                onChange={(event) => {
                                                    setRole(event.target.value);
                                                }}
                                                InputLabelProps={{
                                                    style: {
                                                        fontSize: 25,
                                                        fontFamily:
                                                            "PatrickHand",
                                                        color: "black",
                                                    },
                                                }} // font size of input label
                                                sx={{
                                                    "& .MuiSelect-select": {
                                                        fontFamily:
                                                            "PatrickHand",
                                                        color: "#000",
                                                    },
                                                    "& .MuiInputBase-root:hover fieldset":
                                                        {
                                                            borderColor:
                                                                "#F7944D",
                                                        },
                                                }}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value={"MEMBER"}>
                                                    MEMBER
                                                </MenuItem>
                                            </TextField>
                                        </>
                                    )}

                                    {role === "" ? (
                                        <></>
                                    ) : (
                                        <Box align="center" marginTop="20px">
                                            <Button
                                                sx={{
                                                    margin: "10px",
                                                    background: "#7439db",
                                                    fontFamily: "PatrickHand",
                                                }}
                                                variant="contained"
                                                size="small"
                                                onClick={handleClose}
                                            >
                                                Hủy
                                            </Button>

                                            <Button
                                                sx={{
                                                    margin: "10px",
                                                    background: "#7439db",
                                                    fontFamily: "PatrickHand",
                                                }}
                                                variant="contained"
                                                size="small"
                                                type="submit"
                                            >
                                                Đổi
                                            </Button>
                                        </Box>
                                    )}
                                </form>
                            </Box>
                        </>
                    </Box>
                </Modal>
            ) : (
                <></>
            )}
        </Stack>
    );
}
