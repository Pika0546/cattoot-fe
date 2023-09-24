import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import copy from "copy-to-clipboard";
import { HOST_URL, SECRET_PRESENTATION } from "../../config";
import { useToast } from "../../hook/useToast";
import { useForm } from "react-hook-form";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { shareMultiPresentationToGroup } from "../../service/GroupService";
import { API_STATUS } from "../../config/common";
import { Box, Tab, Tabs } from "@mui/material";
import Collab from "./Collab/Collab";
import { addCollab, removeCollab } from "../../service/CollabService";
import Viewer from "./Viewer/Viewer";
import { isMinePresentation } from "../../utilities/presentation";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
const sign = require("jwt-encode");

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <>{children}</>}
        </Box>
    );
};

const SharePresentationDialog = ({
    open,
    setOpen,
    onClose,
    sharePresentation,
    checkGroupList,
    setCheckGroupList,
    loadingGroup,
    collabs,
    setCollabs,
}) => {
    const [tabValue, setTabValue] = useState(0);
    const shareCode = sharePresentation
        ? sign(sharePresentation.presentationID, SECRET_PRESENTATION)
        : "";
    const inviteLink = HOST_URL + "presentation/join/" + shareCode;
    const { user } = useContext(AppContext);
    const toast = useToast();

    const handleChange = (event) => {
        const data = checkGroupList.map((group, index) => {
            if (index === parseInt(event.target.value)) {
                return {
                    ...group,
                    value: event.target.checked,
                };
            } else {
                return group;
            }
        });
        setCheckGroupList(data);
    };

    const { handleSubmit } = useForm();

    const onSubmit = async () => {
        const data = checkGroupList;
        const sharedGroup = [];
        const unSharedGroup = [];
        const n = data.length;
        for (let index = 0; index < n; index++) {
            const group = data[index].key;
            if (data[index].value) {
                if (
                    group.sharedPresentationID !==
                    sharePresentation.presentationID
                ) {
                    //update share
                    sharedGroup.push(group.groupID);
                }
            } else {
                if (
                    group.sharedPresentationID ===
                    sharePresentation.presentationID
                ) {
                    //update unshare
                    unSharedGroup.push(group.groupID);
                }
            }
        }

        const res = await shareMultiPresentationToGroup({
            sharedGroup: sharedGroup,
            unSharedGroup: unSharedGroup,
            presentationID: sharePresentation.presentationID,
        });
        if (res.status === API_STATUS.OK) {
            toast.success("Đã cập nhật chia sẻ bản trình bày thành công");
        } else {
            console.log(res);
        }
        setOpen(null);
    };

    const handleCopyLinkClick = () => {
        copy(inviteLink);
        toast.success("Đã sao chép liên kết");
    };

    const handleChangeTabValue = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleAddCollab = async (accountID) => {
        const res = await addCollab({
            presentationID: sharePresentation.presentationID,
            accountID,
        });
        console.log(res);
        if (res.status === API_STATUS.OK) {
            toast.success("Thêm người cộng tác thành công");
            setCollabs((prev) => [res.data[0], ...prev]);
        } else {
            toast.error("Thêm người cộng tác thất bại");
        }
    };

    const handleRemoveCollab = async (accountID) => {
        const res = await removeCollab({
            presentationID: sharePresentation.presentationID,
            accountID,
        });
        console.log(res);
        if (res.status === API_STATUS.OK) {
            toast.success("Xóa người cộng tác thành công");
            setCollabs((prev) =>
                [...prev].filter((item) => item.accountID !== accountID)
            );
        } else {
            toast.error("Xóa người cộng tác thất bại");
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            {loadingGroup ? (
                <CircularProgress />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>
                        Chia sẻ bản trình bày{" "}
                        <b>{sharePresentation ? sharePresentation.name : ""}</b>
                    </DialogTitle>
                    {isMinePresentation(user, sharePresentation) ? (
                        <>
                            <Box
                                sx={{ borderBottom: 1, borderColor: "divider" }}
                            >
                                <Tabs
                                    value={tabValue}
                                    onChange={handleChangeTabValue}
                                >
                                    <Tab label="Tham gia"></Tab>
                                    <Tab label="Cộng tác"></Tab>
                                </Tabs>
                            </Box>

                            <TabPanel value={tabValue} index={0}>
                                <Viewer
                                    handleChange={handleChange}
                                    checkGroupList={checkGroupList}
                                    inviteLink={inviteLink}
                                    handleCopyLinkClick={handleCopyLinkClick}
                                    onClose={onClose}
                                ></Viewer>
                            </TabPanel>
                            <TabPanel value={tabValue} index={1}>
                                <Collab
                                    collabs={collabs}
                                    handleAddCollab={handleAddCollab}
                                    handleRemoveCollab={handleRemoveCollab}
                                ></Collab>
                            </TabPanel>
                        </>
                    ) : (
                        <Viewer
                            handleChange={handleChange}
                            checkGroupList={checkGroupList}
                            inviteLink={inviteLink}
                            handleCopyLinkClick={handleCopyLinkClick}
                            onClose={onClose}
                        ></Viewer>
                    )}
                </form>
            )}
        </Dialog>
    );
};

export default SharePresentationDialog;
