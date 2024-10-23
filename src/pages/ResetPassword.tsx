import React, { useEffect, useState } from "react";
import { Box, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PasswordCreate from "../components/PasswordCreate";
import showToastMessage from "../components/showToastMessage";
import { useLocation } from "react-router-dom";
import { forgotPasswordAPI } from "../services/ResetPasswordService";
import CentralizedModal from "../components/CentralizedModal";
import { jwtDecode } from "jwt-decode";
import Logo from "../assets/images/Pratham-Logo.png";

const ResetPassword: React.FC = () => {
  const theme = useTheme<any>();
  // const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(true);

  const getTokenFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("token");
  };

  useEffect(() => {
    const tokenFromUrl = getTokenFromQuery();
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      try {
        const decodedToken: any = jwtDecode(tokenFromUrl);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          setIsTokenValid(false);
          showToastMessage("Link expired", "error");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setIsTokenValid(false);
        showToastMessage("Invalid or expired link", "error");
      }
    }
  }, [location.search]);

  const handleResetPassword = async (newPassword: string) => {
    if (!token || !isTokenValid) {
      showToastMessage("Link expired", "error");
      return;
    }

    try {
      await forgotPasswordAPI(newPassword, token);
      setForgotPassword(true);
    } catch (error: any) {
      console.error("Error resetting password:", error);
      setForgotPassword(false);
      showToastMessage(
        error.response?.data?.params?.err || "Failed to reset password",
        "error"
      );
    }
  };

  const handlePrimaryButton = () => {
    // navigate(`/login`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        px: "16px",
        alignItems: "center",
        "@media (min-width: 700px)": {
          height: "calc(100vh - 140px)",
          overflowY: "auto",
          margin: "70px",
        },
      }}
    >
      <Box
        sx={{
          "@media (min-width: 700px)": {
            width: "50%",
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            marginTop: "0rem",
            borderRadius: "16px",
          },
          width: "100%",
          marginTop: "8rem",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img src={Logo} alt="App Logo" height={100} />
        </Box>
        <Box sx={{ padding: "60px" }}>
          {isTokenValid ? (
            <>
              <Box
                sx={{
                  color: theme.palette.warning["300"],
                  fontWeight: "400",
                  fontSize: "22px",
                  textAlign: "center",
                }}
              >
                Create a strong password
              </Box>
              <Box
                sx={{
                  color: theme.palette.warning["300"],
                  fontWeight: "400",
                  fontSize: "14px",
                  textAlign: "center",
                  mt: 0.5,
                }}
              >
                Create a new password to secure your account
              </Box>
              <PasswordCreate handleResetPassword={handleResetPassword} />
            </>
          ) : (
            <>
              <Box
                sx={{
                  color: theme.palette.error.main,
                  fontWeight: "500",
                  fontSize: "22px",
                  textAlign: "center",
                }}
              >
                Link expired
              </Box>
              <Box sx={{ mt: 3 }}>
                <Divider />
              </Box>
              <Box
                sx={{
                  mt: 2,
                  color: theme.palette.secondary.main,
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
                // onClick={() => {
                //   navigate("/login");
                // }}
              >
                Back to login
              </Box>
            </>
          )}
          <CentralizedModal
            icon={true}
            subTitle="Password reset successfully"
            primary="Okay"
            modalOpen={forgotPassword}
            handlePrimaryButton={handlePrimaryButton}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPassword;
