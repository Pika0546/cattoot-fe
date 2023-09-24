import {
    DialogContent,
    DialogContentText,
    FormControl,
    TextField,
    IconButton,
    DialogActions,
    Button,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import React from "react";

const Viewer = ({
    handleChange,
    checkGroupList,
    inviteLink,
    handleCopyLinkClick,
    onClose,
}) => {
    return (
        <>
            {" "}
            <DialogContent>
                <DialogContentText>
                    Chia sẻ bản trình bày vào nhóm:
                </DialogContentText>
                <FormControl
                    sx={{ margin: "10px 0px 0px 0px" }}
                    fullWidth
                    required
                >
                    {checkGroupList &&
                        checkGroupList.map((group, index) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={group.value}
                                        onChange={handleChange}
                                        value={index}
                                    />
                                }
                                label={
                                    !group.value &&
                                    group.key.sharedPresentationID
                                        ? group.key.name +
                                          " (đang chia sẻ bản trình bày khác)"
                                        : group.key.name
                                }
                            />
                        ))}
                </FormControl>
                <DialogContentText marginTop="1.5rem">
                    Hoặc mời tham gia xem và bình chọn trên bản trình bày thông
                    qua đường liên kết dưới đây:
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
                <Button type="submit">Cập nhật</Button>
            </DialogActions>
        </>
    );
};

export default Viewer;
