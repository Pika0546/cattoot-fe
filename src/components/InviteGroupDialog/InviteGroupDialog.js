import React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm } from "react-hook-form";
import copy from "copy-to-clipboard";
import { HOST_URL, SECRET_GROUP } from "../../config";
import { sendEmailInviteGroup } from "../../service/GroupService";
import { useToast } from "../../hook/useToast";
const sign = require("jwt-encode");

const InviteGroupDialog = ({ open, setOpen, onClose, inviteGroup }) => {
    const inviteCode = inviteGroup
        ? sign(inviteGroup.groupID, SECRET_GROUP)
        : "";
    const inviteLink = HOST_URL + "group/invite/" + inviteCode;

    const toast = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        const email = data.email;
        const groupName = inviteGroup.name;
        sendEmailInviteGroup({ email, groupName, inviteLink });
        toast.success("Đã gửi email mời thành công");
        // setOpen(false);
        setOpen(null);
    };

    const handleCopyLinkClick = () => {
        copy(inviteLink);
        toast.success("Đã sao chép liên kết");
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>
                    Gửi lời mời vào nhóm{" "}
                    <b>{inviteGroup ? inviteGroup.name : ""}</b>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Gửi email chứa đường liên kết mời vào nhóm đến:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="inviteEmail"
                        label="Địa chỉ email"
                        fullWidth
                        variant="standard"
                        required
                        {...register("email", {
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Địa chỉ email không hợp lệ",
                            },
                        })}
                        error={!!errors?.email}
                        helperText={errors?.email ? errors.email.message : null}
                    />
                    <DialogContentText marginTop="1.5rem">
                        Hoặc mời vào nhóm thông qua đường liên kết dưới đây:
                    </DialogContentText>
                    <TextField
                        id="invite-link"
                        defaultValue={inviteLink}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <IconButton onClick={handleCopyLinkClick}>
                                    <ContentCopyIcon />
                                </IconButton>
                            ),
                        }}
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button type="submit">Gửi email</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default InviteGroupDialog;
