import React, { useState, useRef } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
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
import { useToast } from "../../hook/useToast";
import { SLIDE_TYPE } from "../../config/common";
import { useEffect } from "react";
import {
    exportExcel,
    removeSheetNameInvalidCharacter,
} from "../../utilities/exel";
import styles from "./ViewResult.module.css";

const sign = require("jwt-encode");

const ViewResultTab = ({
    handleCloseSidebar,
    openResultTab: open,
    presentation,
    slide,
}) => {
    const toast = useToast();

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
        if (slide) {
            getResult(slide);
        }
    }, [presentation, slide]);

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
        const sheetName = slide.slideOrder;
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
        handleCloseSidebar();
    };

    const useOutsideClick = (callback) => {
        const ref = useRef();

        useEffect(() => {
            const handleClick = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    callback();
                }
            };

            document.addEventListener("click", handleClick, true);

            return () => {
                document.removeEventListener("click", handleClick, true);
            };
        }, [ref]);

        return ref;
    };
    const ref = useOutsideClick(() => {
        handleCloseSidebar();
    });

    return (
        <Box
            ref={ref}
            className={styles.menuBody}
            textAlign="center"
            sx={{
                ...(open && {
                    left: "0 !important",
                }),
                fontFamily: "PatrickHand",
                zIndex: 1000,
            }}
        >
            {/* <Box
                sx={{
                    fontSize: "1.5rem",
                    padding: "0.5rem",
                    borderBottom: "1px solid #bbb",
                    textAlign: "center",
                    backgroundImage:
                        "linear-gradient(to right,#852D91, #A3A1FF)",
                }}
            >
                Kết quả bình chọn
            </Box> */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle
                    sx={{
                        fontFamily: "Kanit",
                        fontSize: "1.5rem",
                    }}
                >
                    Kết quả chi tiết bình chọn
                </DialogTitle>
                <DialogContent
                    sx={{
                        backgroundColor: "white",
                    }}
                >
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
                                {slide &&
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
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button
                        type="submit"
                        sx={{
                            color: "white",
                            fontFamily: "Kanit",
                            fontSize: "1rem",
                        }}
                    >
                        Xuất Excel
                    </Button>
                    <Button
                        sx={{
                            color: "white",
                            fontFamily: "Kanit",
                            fontSize: "1rem",
                        }}
                        onClick={handleCloseSidebar}
                    >
                        Đóng
                    </Button>
                </DialogActions>
            </form>
        </Box>
    );
};

export default ViewResultTab;
