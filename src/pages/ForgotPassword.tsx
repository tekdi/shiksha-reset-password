import { useState, ChangeEvent } from "react";
import { Box, Button, Divider, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// import { useNavigate } from "react-router-dom";
import { resetPasswordLink } from "../services/ResetPasswordService";
import CentralizedModal from "../components/CentralizedModal";
import showToastMessage from "../components/showToastMessage";
import LockOpenIcon from "@mui/icons-material/LockOpen";

import Logo from "./../assets/images/Pratham-Logo.png";

// Interface for any API response (adjust based on actual response shape)
interface ResetPasswordResponse {
  result?: {
    email?: string;
  };
}

const ForgotPassword: React.FC = () => {
  const theme = useTheme<any>();
  // const navigate = useNavigate();

  const [inputValue, setInputValue] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [maskEmail, setMaskEmail] = useState<string>("");
  const urlParams = new URLSearchParams(window.location.search);
  const redirectUrl = urlParams.get("redirectUrl") as string;
  // Function to handle input and convert to lowercase
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const lowercaseValue = event.target.value.toLowerCase();
    setInputValue(lowercaseValue);
  };

  const maskEmailFunction = (email: string): string => {
    const [localPart, domain] = email.split("@");
    if (localPart.length > 2) {
      const maskedLocalPart =
        localPart[0] + "*".repeat(localPart.length - 2) + localPart.slice(-1);
      return `${maskedLocalPart}@${domain}`;
    }
    return email;
  };

  const handleSubmit = async () => {
    try {
      const response: ResetPasswordResponse = await resetPasswordLink(
        inputValue
      );
      const email = response?.result?.email;

      if (email) {
        const maskedEmail = maskEmailFunction(email);
        setMaskEmail(maskedEmail);
      }

      setSuccessMessage(true);
    } catch (error: any) {
      showToastMessage(error.response.data.params.err, "error");
    }
  };

  const handlePrimaryButton = () => {
    setSuccessMessage(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        px: "16px",
        alignItems: "center",
        "@media (min-width: 700px)": {
          height: "100vh",
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
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <LockOpenIcon
              sx={{ fontSize: "40px", color: theme.palette.warning["300"] }}
            />
          </Box>
          <Box
            sx={{
              color: theme.palette.warning["300"],
              fontWeight: "400",
              fontSize: "22px",
              textAlign: "center",
            }}
          >
            Trouble logging in?
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
            Enter your username to receive a reset link.
          </Box>

          <Box
            sx={{
              width: "100%",
            }}
            margin={"3.2rem 0 0"}
          >
            <TextField
              id="Email"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                width: "100%",
              }}
              type="text"
              value={inputValue}
              onChange={handleInputChange} // Uses updated function
              className="password"
              label="Enter Username"
            />
          </Box>

          <CentralizedModal
            icon={true}
            subTitle={`We have sent an email to ${maskEmail}`}
            primary={"Okay"}
            modalOpen={successMessage}
            handlePrimaryButton={handlePrimaryButton}
          />

          <Box>
            <Box
              alignContent={"center"}
              textAlign={"center"}
              marginTop={"2.5rem"}
              width={"100%"}
            >
              <Button
                variant="contained"
                type="submit"
                fullWidth={true}
                onClick={handleSubmit}
                disabled={!inputValue}
                sx={{
                  "@media (min-width: 900px)": {
                    width: "50%",
                  },
                }}
              >
                Next
              </Button>
            </Box>
          </Box>

          <Box sx={{ mt: 10 }}>
            <Divider />
          </Box>
          <Box
            sx={{
              mt: 3,
              color: theme.palette.secondary.main,
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer", // Added a pointer cursor to indicate it's clickable
            }}
            onClick={() => {
              window.open(redirectUrl, '_self');
            }}
          >
            Back to login
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
