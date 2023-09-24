import {
    Box,
    Table,
    TableContainer,
    TableRow,
    TableCell,
    TableHead,
    TableBody,
    Paper,
    IconButton,
    Tooltip,
    Stack,
    Button,
    CircularProgress,
    DialogContentText,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import React from "react";
import AccountSearch from "../../AccountSearch/AccountSearch";
import { useState } from "react";

const Collab = ({ collabs, handleAddCollab, handleRemoveCollab }) => {
    const [inviteLoading, setInviteLoading] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const handleInvite = async () => {
        if (selectedAccount) {
            setInviteLoading(true);
            await handleAddCollab(selectedAccount.accountID);
            setInviteLoading(false);
        }
    };

    const handleAccountSearhChange = (event, value) => {
        console.log(value);
        setSelectedAccount(value);
    };

    return (
        <Box
            sx={{
                padding: "1rem",
            }}
        >
            <Stack
                sx={{
                    marginBottom: "2rem",
                }}
            >
                <DialogContentText>Mời cộng tác:</DialogContentText>
                <AccountSearch
                    onChange={handleAccountSearhChange}
                ></AccountSearch>
                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    sx={{ marginTop: "0.5rem" }}
                >
                    <Button
                        variant="contained"
                        onClick={handleInvite}
                        disabled={!selectedAccount || inviteLoading}
                    >
                        {inviteLoading ? (
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Box>Mời</Box>
                                <CircularProgress size={20} />
                            </Stack>
                        ) : (
                            "Mời"
                        )}
                    </Button>
                </Stack>
            </Stack>
            <DialogContentText>Danh sách người cộng tác:</DialogContentText>
            <TableContainer>
                <Table
                    sx={{
                        border: "1px solid orange",
                    }}
                    size="small"
                    aria-label="a dense table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                            >
                                TÊN
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                                align="left"
                            >
                                EMAIL
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                                align="left"
                            ></TableCell>
                        </TableRow>
                    </TableHead>
                    {collabs && collabs.length ? (
                        <TableBody>
                            {collabs.map((row) => {
                                const account = row.accountInfo;
                                return (
                                    <TableRow
                                        key={account.accountID}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                {
                                                    border: 0,
                                                },
                                        }}
                                    >
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            sx={{
                                                fontSize: 14,
                                            }}
                                        >
                                            {account.fullname}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontSize: 14,
                                            }}
                                            align="left"
                                        >
                                            {account.email}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontSize: 14,
                                            }}
                                            align="right"
                                        >
                                            <Tooltip title="Xóa">
                                                <IconButton
                                                    onClick={() => {
                                                        handleRemoveCollab(
                                                            account.accountID
                                                        );
                                                    }}
                                                    size="small"
                                                >
                                                    <HighlightOffIcon
                                                        sx={{
                                                            color: "#ce3434",
                                                        }}
                                                    ></HighlightOffIcon>
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    ) : (
                        <Box sx={{ padding: "0.5rem" }}>
                            Chưa có người cộng tác nào
                        </Box>
                    )}
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Collab;
