import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router";
import ActivityDetail from "./components/ActivityDetail";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import { setCredentials } from "./store/authSlice";

const ActivityPage = () => {
  return (
    <Box sx={{ p: 2, border: "1px dashed grey" }}>
      <ActivityForm onActivitiesAdded={ ()=> window.location.reload} />
      <ActivityList />
    </Box>
  );
};

export default function App() {
  const { token, tokenData, logIn, logout, isAuthenticated } =
    useContext(AuthContext);

  const dispatch = useDispatch();
  const [authRead, setAuthReady] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);
  return (
    <Router>
      {!token ? (
        <Button
          variant="contained"
          onClick={() => {
            logIn();
          }}
        >
          LOGIN
        </Button>
      ) : (
        <div>
          <Box component="section" sx={{ p: 2, border: "1px dashed grey" }}>
            <Button variant="contained" onClick={logout}>
              LOGOUT
            </Button>
          </Box>

          <Routes>
            <Route path="/activities" element={<ActivityPage />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route
              path="/"
              element={
                token ? (
                  <Navigate to="/activities" replace />
                ) : (
                  <div>Welcome! Please login</div>
                )
              }
            />
          </Routes>
        </div>
      )}
    </Router>
  );
}
