import React, { useEffect, useState } from "react";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getMe } from "../../service/AccountService";
import InPageLoading from "../PageLoading/InPageLoading";
import * as MESSAGE from "../../resource/message";
import ChangeNameForm from './ChangeNameForm';
import ChangePassForm from './ChangePassForm';

import "../../App.css"
import cssStyle from "./PersonalPage.module.css"
import avaTemplate from '../../background.jpg'

const theme = createTheme();

export default function PersonalPage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
   

    const [emailExist, setEmailExist] = useState(false);
    const [msg, setMsg] = useState("");
    const [currentForm, setCurrentForm] = useState('name');

    useEffect(() => {
        const list = async () => {
            const res = await getMe();
            console.log(res);
            if (res) {
                setUser(res.data[0]);
                setName(res.data[0].fullname);
                setEmail(res.data[0].email);
            }
            setLoading(false)
        }
        list();
    }, [])

    if (loading) {
        return (
            <InPageLoading></InPageLoading>
        )
    }

    const toggleForm = (formName) => {
        setCurrentForm(formName);
    }

    return (
        <main>
            <div className={`${cssStyle["form-container"]}`}>
                <h2 className={`${cssStyle["form-title"]}`}>Trang cá nhân</h2>
                <img className={`${cssStyle["ava-img"]}`} src={avaTemplate} alt="Avatar" ></img>
                <h2 className={`${cssStyle["name-text"]}`}>{user.fullname}</h2>
                <p className={`${cssStyle["email-text"]}`}>Email: {user.email}</p>
                {
                    currentForm === "name" ? <ChangeNameForm onFormSwitch={toggleForm} /> : <ChangePassForm onFormSwitch={toggleForm} />
                }
            </div>

        </main>

    );
}