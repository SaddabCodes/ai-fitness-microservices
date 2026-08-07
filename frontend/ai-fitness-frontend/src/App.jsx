import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LogoutIcon from "@mui/icons-material/Logout";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router";
import ActivityDetail from "./components/ActivityDetail";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import { setCredentials, logout as logoutRedux } from "./store/authSlice";

const ActivityPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 700 }}>
          📝 Log New Activity
        </Typography>
        <ActivityForm onActivitiesAdded={() => window.location.reload()} />
      </Box>

      <Box>
        <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 700 }}>
          📊 Your Activities
        </Typography>
        <ActivityList />
      </Box>
    </Container>
  );
};

const LoginPage = ({ onLogin, error }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Box sx={{ textAlign: "center", color: "white" }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
          🏋️ AI Fitness Tracker
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Track your workouts and get personalized AI recommendations
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            console.log("Login button clicked");
            onLogin();
          }}
          sx={{
            px: 6,
            py: 2,
            fontSize: "1.1rem",
            backgroundColor: "white",
            color: "#667eea",
            fontWeight: 700,
            fontWeight: 700,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#f0f0f0",
              transform: "scale(1.05)",
            },
            "&:active": {
              transform: "scale(0.98)",
            },
          }}
        >
          Login with Keycloak
        </Button>
        {error && (
          <Typography variant="body2" sx={{ mt: 3, color: "#ffcccc" }}>
            ⚠️ Login error: {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default function App() {
  const authContext = useContext(AuthContext);
  const { token, tokenData, logIn, error } = authContext;
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    if (token && tokenData && !isLoggedOut) {
      dispatch(setCredentials({ token, user: tokenData }));
    }
  }, [token, tokenData, dispatch, isLoggedOut]);

  useEffect(() => {
    if (error) {
      console.error("Auth error:", error);
    }
  }, [error]);

  // Monitor token changes
  useEffect(() => {
    if (!token && isLoggingOut) {
      console.log("✅ Token cleared by AuthContext");
      setIsLoggedOut(true);
    }
  }, [token, isLoggingOut]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log("🔓 Logout initiated...");

      // Clear Redux store
      dispatch(logoutRedux());
      console.log("✅ Redux store cleared");

      // Clear all localStorage including auth-related keys
      localStorage.clear();
      console.log("✅ All localStorage cleared");

      // Clear sessionStorage as well
      sessionStorage.clear();
      console.log("✅ sessionStorage cleared");

      // Clear all cookies
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      });
      console.log("✅ All cookies cleared");

      console.log("✅ Logout completed");

      // Redirect to home page which will show login since token is cleared
      setTimeout(() => {
        console.log("🔄 Redirecting to login page...");
        window.location.href = "/";
      }, 500);
    } catch (err) {
      console.error("❌ Logout error:", err);
      setIsLoggingOut(false);
      // Fallback: still redirect to home on error
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  };

  return (
    <Router>
      {!token ? (
        <LoginPage onLogin={logIn} error={error} />
      ) : (
        <>
          <AppBar
            position="sticky"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
                🏋️ AI Fitness Tracker
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {tokenData?.given_name || tokenData?.email || "User"}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {tokenData?.email}
                  </Typography>
                </Box>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  endIcon={<LogoutIcon />}
                  sx={{
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                    "&:disabled": {
                      opacity: 0.6,
                    },
                  }}
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </Box>
            </Toolbar>
          </AppBar>

          <Box sx={{ minHeight: "calc(100vh - 64px)", backgroundColor: "#f5f7fa" }}>
            <Routes>
              <Route path="/activities" element={<ActivityPage />} />
              <Route path="/activities/:id" element={<ActivityDetail />} />
              <Route
                path="/"
                element={<Navigate to="/activities" replace />}
              />
            </Routes>
          </Box>
        </>
      )}
    </Router>
  );
}
