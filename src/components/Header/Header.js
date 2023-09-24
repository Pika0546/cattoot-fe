import React, { useState, useEffect, useContext } from 'react';
import {
  AppBar,
  Button,
  Tab,
  Tabs,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddBusinessRoundedIcon from "@mui/icons-material/AddBusinessRounded";
import DrawerComp from "../DrawerComp/DrawerComp";
import cssStyle from "./Header.module.css"
import { AppContext } from '../../context/AppContext';

// const label = ["Home Page", "Group", "ABout Us", "Contact Us"];
// const path = ["/", "/group", "/", "/"];

const Header = () => {
  const [value, setValue] = useState();
  const {user} = useContext(AppContext)
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <React.Fragment>
      <AppBar className={`${cssStyle.header}`}>
        <Toolbar>
          <AddBusinessRoundedIcon sx={{ transform: "scale(2)" }} />
          {isMatch ? (
            <>
              <h2 className={`${cssStyle.title}`}>
                Cattoot
              </h2>
              <DrawerComp />
            </>
          ) : (
            <>
              <Tabs
                sx={{ marginLeft: "auto" }}
                indicatorColor="secondary"
                textColor="inherit"
                value={value}
                onChange={(e, value) => setValue(value)}
              >
                <Tab label="Nhóm của tôi" href="/group"/>
              </Tabs>
              
              <Button sx={{ marginLeft: "auto", background: "#7439db" }} variant="contained" href="/me">
                {user.fullname}
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );  
  
  
};

export default Header;