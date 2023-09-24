import React, { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useForm } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import copy from "copy-to-clipboard";
import { HOST_URL, SECRET_GROUP } from "../../config";
import { sendEmailInviteGroup } from "../../service/GroupService";
import { useToast } from "../../hook/useToast";
import { SLIDE_TYPE } from "../../config/common";
import { useEffect } from "react";
import {
    exportExcel,
    removeSheetNameInvalidCharacter,
} from "../../utilities/exel";
const sign = require("jwt-encode");

const ViewResultDialog = ({ open, setOpen, onClose, presentation }) => {
    const toast = useToast();

    const [selectSlide, setSelectSlide] = useState("");

    const [result, setResult] = useState([]);

    const getResult = async (slide) => {
        try {
            if (slide) {
                let res = [];
                const option = slide.content.option;
                const nOption = option.length;
                for (let i = 0; i < nOption; i++) {
                    const viewers = option[i].submitBy;
                    const nViewer = viewers.length;
                    for (let j = 0; j < nViewer; j++) {
                        viewers[j].option = option[i].key;
                        const date = new Date(viewers[j].submitedAt);
                        if (!isNaN(date.getTime())) {
                            let d = date.getDate();
                            let m = date.getMonth() + 1;
                            let y = date.getFullYear();
                            let h = date.getHours();
                            let mi = date.getMinutes();
                            let s = date.getSeconds();
                            viewers[j].submitTime =
                                String(d).padStart(2, "0") +
                                "/" +
                                String(m).padStart(2, "0") +
                                "/" +
                                y +
                                " " +
                                String(h).padStart(2, "0") +
                                ":" +
                                String(mi).padStart(2, "0") +
                                ":" +
                                String(s).padStart(2, "0");
                        }
                        res.push(viewers[j]);
                    }
                }

                res.sort(function (a, b) {
                    var keyA = new Date(a.submitedAt),
                        keyB = new Date(b.submitedAt);
                    // Compare the 2 dates
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) return 1;
                    return 0;
                });
                setResult(res);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (selectSlide) {
            getResult(selectSlide);
        }
    }, [presentation, selectSlide]);

    const handleChange = (event) => {
        setSelectSlide(
            presentation.slides.find(
                (item) => item.slideID === event.target.value
            )
        );
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        //export excel
        const column = [
            {
                id: "id",
                label: "STT",
            },
            {
                id: "submitedBy",
                label: "Thành viên",
            },
            {
                id: "option",
                label: "Lựa chọn",
            },

            {
                id: "submitedAt",
                label: "Thời gian",
            },
        ];
        const sheetName = selectSlide.slideOrder;
        const fileName = presentation.name;
        let excelData = [];
        const nRow = result.length;
        for (let i = 0; i < nRow; i++) {
            let row = {
                id: i + 1,
                submitedBy: result[i].accountID
                    ? result[i].fullname
                    : "Ẩn danh",
                option: result[i].option,
                submitedAt: result[i].submitTime,
            };
            excelData.push(row);
        }
        await exportExcel({
            data: excelData,
            sheetName: removeSheetNameInvalidCharacter(sheetName),
            fileName: fileName,
            columns: column,
        });
        toast.success("Đã xuất Excel thành công");
        setOpen(null);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            {!presentation ? (
                <CircularProgress />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>Kết quả chi tiết bình chọn</DialogTitle>
                    <DialogContent>
                        <FormControl
                            sx={{ margin: "10px 0px 0px 0px" }}
                            fullWidth
                            required
                        >
                            <InputLabel id="select-group-label">
                                Câu hỏi
                            </InputLabel>
                            <Select
                                labelId="select-group-label"
                                id="select-group"
                                value={selectSlide?.slideID || ""}
                                onChange={handleChange}
                                label="Câu hỏi"
                                fullWidth
                                renderValue={(value) => {
                                    return presentation.slides.find(
                                        (item) => item.slideID === value
                                    ).content.question;
                                }}
                            >
                                <MenuItem value={""}>
                                    <em>None</em>
                                </MenuItem>
                                {presentation &&
                                    presentation.slides.map(
                                        (slide) =>
                                            slide.type ===
                                                SLIDE_TYPE.MULTIPLE_CHOICE && (
                                                <MenuItem
                                                    key={slide.slideID}
                                                    value={slide.slideID}
                                                >
                                                    {slide.content.question}
                                                </MenuItem>
                                            )
                                    )}
                            </Select>
                        </FormControl>
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <b>STT</b>
                                        </TableCell>
                                        <TableCell>
                                            <b>Thành viên</b>
                                        </TableCell>
                                        <TableCell>
                                            <b>Bình chọn</b>
                                        </TableCell>
                                        <TableCell>
                                            <b>Thời gian</b>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectSlide &&
                                        result &&
                                        result.map((viewer, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{
                                                    "&:last-child td, &:last-child th":
                                                        { border: 0 },
                                                }}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {viewer.accountID &&
                                                    viewer.accountInfo
                                                        ? viewer.accountInfo
                                                              .fullname
                                                        : "Ẩn danh"}
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {viewer.option}
                                                </TableCell>
                                                <TableCell>
                                                    {viewer.submitTime}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    {result.length === 0 && (
                                        <>Chưa có người trả lời câu hỏi này.</>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit">Xuất Excel</Button>
                        <Button onClick={onClose}>Đóng</Button>
                    </DialogActions>
                </form>
            )}
        </Dialog>
    );
};

export default ViewResultDialog;
