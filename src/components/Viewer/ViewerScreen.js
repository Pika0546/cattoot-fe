import { Grid, Tabs, Tab, Box } from "@mui/material";
import ViewerScreenContent from "./ViewerScreenContent";
import { useState } from "react";
import MessageTab from "./Message/MessageTab";
import QuestionTab from "./Question/QuestionTab";

import { styled } from "@mui/material/styles";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <>{children}</>}
        </div>
    );
}

const ViewerScreen = ({
    presentation,
    socket,
    messages,
    questions,
    setMessages,
    setQuestions,
    user,
}) => {
    const [tabValue, setTabValue] = useState(0);
    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Grid
            container
            sx={{ height: "100%", flex: "1 1 auto", background: "#202020" }}
        >
            <Grid item xs={12} sm={7}>
                <ViewerScreenContent
                    presentation={presentation}
                    socket={socket}
                ></ViewerScreenContent>
            </Grid>
            <Grid item xs={12} sm={5}>
                <Box
                    sx={{
                        margin: "1rem",
                        height: "calc(100% - 2rem)",
                        width: "calc(100% - 5rem)",
                        color: "#fff",
                        border: "1px solid #fff",
                        fontFamily: "PatrickHand",
                        display: "flex",
                        flexDirection: "column",
                        position: "sticky",
                    }}
                >
                    <Tabs
                        value={tabValue}
                        onChange={handleChangeTab}
                        sx={{
                            color: "#fff",
                            border: "1px solid #fff",
                            "& .MuiTab-root": {
                                color: "#bbb",
                                fontFamily: "PatrickHand",
                                fontSize: "1.2rem",
                                fontWeight: "500",
                                "&.Mui-selected": {
                                    color: "#fff",
                                },
                            },
                            "& .MuiTabs-indicator": {
                                display: "none",
                            },
                        }}
                    >
                        <Tab label="Tin nhắn"></Tab>
                        <Tab label="Q & A"></Tab>
                    </Tabs>
                    <TabPanel
                        value={tabValue}
                        index={0}
                        style={{ flex: "1 1 auto" }}
                    >
                        <MessageTab
                            messages={messages}
                            setMessages={setMessages}
                            presentation={presentation}
                            socket={socket}
                            user={user}
                        ></MessageTab>
                    </TabPanel>
                    <TabPanel
                        value={tabValue}
                        index={1}
                        style={{ flex: "1 1 auto" }}
                    >
                        <QuestionTab
                            presentation={presentation}
                            questions={questions}
                            setQuestions={setQuestions}
                            socket={socket}
                        ></QuestionTab>
                    </TabPanel>
                </Box>
            </Grid>
        </Grid>
    );
};

export default ViewerScreen;
