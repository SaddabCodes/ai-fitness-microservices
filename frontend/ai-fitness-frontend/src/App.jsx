import Button from "@mui/material/Button";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router } from "react-router";
import { setCredentials } from "./store/authSlice";

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
          <pre>{JSON.stringify(tokenData, null, 2)}</pre>
        </div>
      )}
    </Router>
  );
}
