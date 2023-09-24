import { Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { API_STATUS } from "../../config/common";

import { useDebounce } from "../../hook/useDebounce";
import { searchAccountByEmail } from "../../service/AccountService";
const AccountSearch = ({ onChange }) => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const debouncedSearchTerm = useDebounce(search, 500);

    const findAccount = async (email) => {
        const res = await searchAccountByEmail({ email });
        if (res.status === API_STATUS.OK) {
            setData(res.data);
        } else {
            setData([]);
        }
    };

    const handleInputChange = (e) => {
        setSearch(e.target.value);
    };

    const handleClose = () => {
        setData([]);
    };

    useEffect(() => {
        if (
            debouncedSearchTerm !== null &&
            debouncedSearchTerm !== "" &&
            debouncedSearchTerm
        ) {
            setIsSearching(true);
            findAccount(debouncedSearchTerm).then(() => {
                setIsSearching(false);
            });
        } else {
            setData([]);
        }
    }, [debouncedSearchTerm]);

    return (
        <Autocomplete
            onInputChange={handleInputChange}
            onChange={onChange}
            options={data}
            getOptionLabel={(option) => {
                return option.email;
            }}
            size="small"
            onClose={handleClose}
            isOptionEqualToValue={(option, value) =>
                option.accountID === value.accountID
            }
            loading={isSearching}
            loadingText="Đang tìm kiếm..."
            noOptionsText="Không tìm thấy"
            renderInput={(params) => (
                <TextField {...params} placeholder="Nhập email" fullWidth />
            )}
        ></Autocomplete>
    );
};

export default AccountSearch;
