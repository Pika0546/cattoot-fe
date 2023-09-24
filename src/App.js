import "./App.css";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";

import { SnackbarProvider } from "notistack";
import Fade from "@mui/material/Fade";

import Header from "./components/Header/Header";
import CssBaseline from "@mui/material/CssBaseline";

import HomePage from "./pages";
import SignUpPage from "./pages/sigup";
import LoginPage from "./pages/login";
import MePage from "./pages/me";
import GroupListPage from "./pages/group";
import GroupDetailPage from "./pages/group/detail";
import VerificationPage from "./pages/verification";
import GroupCreatePage from "./pages/group/create";
import LoggedPageWrapper from "./components/LoggedPageWrapper";
import PresentationDetailPage from "./pages/presentation/detail";
import Error from "./components/Error/Error";
import JoinGroup from "./components/JoinGroup/JoinGroup";
import PresentationListPage from "./pages/presentation";
import JoiningPage from "./components/Viewer/JoiningPage";
import ForgotPasswordPage from "./pages/forgotPassword";
import ResetPasswordPage from "./pages/resetPassword";
import GroupSlideShowContainer from "./components/GroupDetail/GroupSlideShowContainer";

function App() {
    // const [user, setUser] = useState<ICurrentUser>({
    // 	name: '',
    // 	role: '',
    // 	username: '',
    //   });

    //   useEffect(() => {
    // 	const checkUser = async () => {
    // 	  const token = getCookie('session_token');
    // 	  if (token !== null) {
    // 		const userData = await axios.get(
    // 		  `${process.env.REACT_APP_BACKEND_URL}/account/checkToken`,
    // 		  {
    // 			headers: {
    // 			  Authorization: `Bearer ${token}`,
    // 			},
    // 		  }
    // 		);

    // 		setUser({
    // 		  name: `${userData.data.firstname} ${userData.data.lastname}`,
    // 		  role: userData.data.role,
    // 		  username: userData.data.username,
    // 		});
    // 	  }
    // 	};

    // 	checkUser().catch((err) => console.log(err));
    //   }, []);
    return (
        <SnackbarProvider
            autoHideDuration={3000}
            anchorOrigin={{
                horizontal: "right",
                vertical: "top",
            }}
            TransitionComponent={Fade}
        >
            <CssBaseline />

            <BrowserRouter>
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={
                            <div className="back-ground">
                                <HomePage />
                            </div>
                        }
                    ></Route>
                    <Route
                        exact
                        path="/signup"
                        element={<SignUpPage />}
                    ></Route>
                    <Route exact path="/login" element={<LoginPage />}></Route>
                    <Route
                        exact
                        path="/reset_password"
                        element={<ForgotPasswordPage />}
                    ></Route>
                    <Route
                        exact
                        path="/me"
                        element={
                            <LoggedPageWrapper>
                                <MePage></MePage>
                            </LoggedPageWrapper>
                        }
                    ></Route>
                    <Route
                        exact
                        path="/group"
                        element={
                            <LoggedPageWrapper>
                                <GroupListPage></GroupListPage>
                            </LoggedPageWrapper>
                        }
                    ></Route>
                    <Route
                        exact
                        path="/group/create"
                        element={
                            <LoggedPageWrapper>
                                <GroupCreatePage></GroupCreatePage>
                            </LoggedPageWrapper>
                        }
                    ></Route>
                    <Route
                        exact
                        path="/group/:id"
                        element={
                            <LoggedPageWrapper>
                                <GroupDetailPage></GroupDetailPage>
                            </LoggedPageWrapper>
                        }
                    ></Route>
                    <Route
                        exact
                        path="/group/invite/:inviteCode"
                        element={
                            <LoggedPageWrapper>
                                <JoinGroup></JoinGroup>
                            </LoggedPageWrapper>
                        }
                    ></Route>
                    <Route
                        exact
                        path="/account/:id/verify/:token"
                        element={<VerificationPage></VerificationPage>}
                    ></Route>
                    <Route
                        exact
                        path="/account/:id/reset_password/:token"
                        element={<ResetPasswordPage />}
                    ></Route>
                    <Route
                        exact
                        path="/presentation"
                        element={
                            <LoggedPageWrapper>
                                <PresentationListPage></PresentationListPage>
                            </LoggedPageWrapper>
                        }
                    ></Route>
                    <Route
                        exact
                        path="/presentation/join/:shareCode"
                        element={<JoiningPage></JoiningPage>}
                    ></Route>
                    <Route
                        exact
                        path="/presentation/:id"
                        element={
                            <LoggedPageWrapper>
                                <PresentationDetailPage></PresentationDetailPage>
                            </LoggedPageWrapper>
                        }
                    ></Route>
                    {/* <Route
                        exact
                        path="/group/:id/:presentation_id"
                        element={
                            <LoggedPageWrapper>
                                <GroupSlideShowContainer></GroupSlideShowContainer>
                            </LoggedPageWrapper>
                        }
                    ></Route> */}
                    <Route
                        path="*"
                        element={
                            <div className="back-ground">
                                <Error></Error>
                            </div>
                        }
                    ></Route>
                </Routes>
            </BrowserRouter>
        </SnackbarProvider>
    );
}

export default App;
