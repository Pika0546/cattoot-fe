import React from "react";
import { useEffect } from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
    Grid,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Box,
    Typography,
    Card,
    Stack,
    Badge,
    Modal,
    TextField,
} from "@mui/material";
// import IconButton from "@mui/material/IconButton";
// import ClearIcon from "@mui/icons-material/Clear";
import jpgTemplate from "../../background.jpg";
import {
    list,
    create,
    deletePresentation,
} from "../../service/PersentationService";
import InPageLoading from "../../components/PageLoading/InPageLoading";
import { AppContext } from "../../context/AppContext";
import { useToast } from "../../hook/useToast";
import "../../App.css";
import { API_STATUS } from "../../config/common";
import { isMinePresentation } from "../../utilities/presentation";

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

const PresentationListPage = () => {
    const toast = useToast();
    const [presentationList, setPresentationList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const { user } = useContext(AppContext);
    const navigate = useNavigate();

    const handleClickCreate = async () => {
        const res = await create();
        console.log(res);

        const id = res.data[0].presentationID;
        navigate("/presentation/" + id);
    };

    const handleDeletePresentation = async (item) => {
        setIsLoading(true);
        const res = await deletePresentation({
            presentationID: item.presentationID,
        });
        if (res.status === API_STATUS.OK) {
            toast.success("Xóa bản trình bài thành công");
            setPresentationList((prev) => {
                return prev.filter(
                    (p) => p.presentationID !== item.presentationID
                );
            });
        } else {
            console.log(res);
            toast.error("Xóa thất bại");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);
            const res = await list();
            console.log(res);
            if (res.status === API_STATUS.OK) {
                for (let i = 0; i < res.data.length; i++) {
                    setPresentationList(() => {
                        return res.data.map((item) => {
                            return {
                                ...item,
                                detailURL:
                                    "/presentation/" + item.presentationID,
                            };
                        });
                    });
                }
            }
            setIsLoading(false);
        };
        getData();
    }, []);

    const handleClickDetail = (url) => {
        navigate(url);
    };

    const handleOpen = () => {
        setOpen(true);
        // toast.normal("Open modal");
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (isLoading) {
        return <InPageLoading></InPageLoading>;
    }

    return (
        <Stack component="main" direction="column" spacing={2}>
            {/* Hero unit */}
            <Typography
                component="h1"
                variant="h2"
                align="center"
                color="white"
                fontFamily="PatrickHand"
            >
                Danh sách bản trình bày
            </Typography>
            <div
                style={{
                    display: "flex",
                    justifyContent: "column",
                    alignSelf: "center",
                    marginBottom: 15,
                }}
            >
                <button
                    className="btn-hover color-1"
                    style={{ margin: "0px 10px" }}
                    onClick={handleClickCreate}
                >
                    Tạo bản trình bày mới
                </button>

                {/* <button className='btn-hover color-1' style={{ margin: "0px 10px" }} onClick={handleOpen}>
                    Tham gia
                </button> */}
            </div>

            {presentationList.length === 0 ? (
                <Typography
                    component="h1"
                    variant="h2"
                    align="center"
                    color="white"
                    gutterBottom
                    marginTop="10px"
                    fontFamily="PatrickHand"
                    fontSize="30px"
                >
                    Bạn chưa có bản trình bày nào (◕︵◕)
                </Typography>
            ) : (
                <Box
                    sx={{
                        maxWidth: "70%",
                        marginX: "auto !important",
                        paddingBottom: "2rem",
                    }}
                >
                    <Grid container spacing={4}>
                        {presentationList.map((item, index) => (
                            <Grid item key={index} xs={12} sm={6} md={4}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        transition:
                                            "transform 0.15s ease-in-out",
                                        "&:hover": {
                                            transform: "scale3d(1.05, 1.05, 1)",
                                        },
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        handleClickDetail(item.detailURL);
                                    }}
                                >
                                    {isMinePresentation(user, item) === true ? (
                                        <Box bgcolor="#F7944D">
                                            <Typography
                                                fontFamily="PatrickHand"
                                                color="white"
                                            >
                                                OWNER
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Box bgcolor="#C66FBC">
                                            <Typography
                                                fontFamily="PatrickHand"
                                                color="white"
                                            >
                                                COLLAB
                                            </Typography>
                                        </Box>
                                    )}

                                    <CardMedia
                                        alt="random"
                                        sx={{ cursor: "pointer" }}
                                    >
                                        <img src={jpgTemplate} />
                                    </CardMedia>

                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography
                                            fontFamily="PatrickHand"
                                            gutterBottom
                                            variant="h5"
                                            component="h2"
                                        >
                                            {item.name}
                                        </Typography>
                                    </CardContent>
                                    <CardActions
                                        style={{ justifyContent: "center" }}
                                    >
                                        {/* <Button
                                            sx={{
                                                margin: "0px 20px 10px 20px",
                                                background: "#7439db",
                                                fontFamily: "PatrickHand",
                                            }}
                                            variant="contained"
                                            size="small"
                                        >
                                            Mời
                                        </Button> */}
                                        {isMinePresentation(user, item) ===
                                            true && (
                                            <Button
                                                sx={{
                                                    margin: "0px 10px 10px 10px",
                                                    background: "#7439db",
                                                    fontFamily: "PatrickHand",
                                                }}
                                                variant="contained"
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeletePresentation(
                                                        item
                                                    );
                                                }}
                                            >
                                                Xóa
                                            </Button>
                                        )}

                                        {/* <InviteGroupDialog
                                        open={!!inviteGroup}
                                        setOpen={setInviteGroup}
                                        onClose={
                                            handleInviteDialogClose
                                        }
                                        inviteGroup={inviteGroup}
                                    ></InviteGroupDialog> */}
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

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
                        Nhập link hoặc code
                    </Typography>
                    <TextField fullWidth />
                </Box>
            </Modal>
        </Stack>
    );
};

export default PresentationListPage;
