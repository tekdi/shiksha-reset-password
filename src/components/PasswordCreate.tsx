import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import { login } from "../services/ResetPasswordService";
import showToastMessage from "../components/showToastMessage";
import { PasswordCreateProps } from "../utils/Interfaces";
// import { useNavigate } from "react-router-dom";

const PasswordCreate: React.FC<PasswordCreateProps> = ({
  handleResetPassword,
  editPassword = false,
}) => {
  const theme = useTheme<any>();
  // const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [samePasswordError, setSamePasswordError] = useState(false);
  const [showValidationMessages, setShowValidationMessages] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEditPassword = window.location.pathname === "/edit-password";

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setShowValidationMessages(!!value);
    validatePassword(value);
    if (samePasswordError) {
      setSamePasswordError(false);
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError(value !== password);
  };

  const validatePassword = (value: string) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValidLength = value.length >= 8;

    const isValid =
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar &&
      isValidLength;
    setPasswordError(!isValid);

    return isValid;
  };

  const isFormValid =
    !passwordError &&
    !confirmPasswordError &&
    !samePasswordError &&
    password &&
    confirmPassword &&
    (!editPassword || (editPassword && oldPassword));

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setSamePasswordError(false);

    if (editPassword) {
      if (oldPassword === password) {
        setSamePasswordError(true);
        return;
      }

      const userIdName = localStorage.getItem("userIdName");
      if (!userIdName) {
        showToastMessage("No username found");
        return;
      }

      setLoading(true);

      try {
        const response = await login({
          username: userIdName,
          password: oldPassword,
        });
        if (response) {
          handleResetPassword(password);
          // const username = localStorage.getItem("userEmail");
        } else {
          setOldPasswordError(true);
        }
      } catch (error) {
        console.error("Error verifying old password", error);
        setOldPasswordError(true);
      } finally {
        setLoading(false);
      }
    } else {
      handleResetPassword(password);
    }
  };

  return (
    <form autoComplete="off" onSubmit={handleFormSubmit}>
      {editPassword && (
        <Box sx={{ width: "100%" }}>
          <TextField
            id="old-password"
            name="old-password-field"
            autoComplete="new-password"
            InputLabelProps={{ shrink: true }}
            type="password"
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
              if (oldPasswordError) {
                setOldPasswordError(false);
              }
            }}
            error={oldPasswordError}
            helperText={oldPasswordError && "Current password is incorrect"}
            label="Old Password"
            fullWidth
            sx={{
              ".MuiFormHelperText-root.Mui-error": {
                color: theme.palette.error.main,
              },
            }}
          />
        </Box>
      )}

      <Box
        sx={{
          width: "100%",
          margin: isEditPassword ? "1.8rem 0 0" : "3.2rem 0 0",
        }}
      >
        <TextField
          id="password"
          name="new-password-field"
          autoComplete="new-password"
          InputLabelProps={{ shrink: true }}
          type="password"
          value={password}
          onChange={handlePasswordChange}
          error={passwordError || samePasswordError}
          helperText={
            (passwordError && "Your password must meet the requirements") ||
            (samePasswordError &&
              "New password cannot be the same as old password")
          }
          label="New Password"
          fullWidth
          sx={{
            ".MuiFormHelperText-root.Mui-error": {
              color: theme.palette.error.main,
            },
          }}
        />
      </Box>

      {showValidationMessages && passwordError && (
        <Box sx={{ mt: 0.8, pl: "16px" }}>
          <Typography
            variant="body2"
            color="error"
            sx={{ fontSize: "12px", fontWeight: "400" }}
          >
            <Box
              sx={{
                color:
                  password.match(/[A-Z]/) && password.match(/[a-z]/)
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <CheckIcon sx={{ fontSize: "15px" }} /> Include both uppercase and
              lowercase letters
            </Box>
            <Box
              sx={{
                color: password.match(/\d/)
                  ? theme.palette.success.main
                  : theme.palette.error.main,
                display: "flex",
                alignItems: "center",
                gap: "5px",
                pt: 0.3,
              }}
            >
              <CheckIcon sx={{ fontSize: "15px" }} /> Include a number
            </Box>
            <Box
              sx={{
                color: password.match(/[!@#$%^&*(),.?":{}|<>]/)
                  ? theme.palette.success.main
                  : theme.palette.error.main,
                display: "flex",
                alignItems: "center",
                gap: "5px",
                pt: 0.3,
              }}
            >
              <CheckIcon sx={{ fontSize: "15px" }} /> Include a special
              character
            </Box>
            <Box
              sx={{
                color:
                  password.length >= 8
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                display: "flex",
                alignItems: "center",
                gap: "5px",
                pt: 0.3,
              }}
            >
              <CheckIcon sx={{ fontSize: "15px" }} /> Must be at least 8
              characters long
            </Box>
          </Typography>
        </Box>
      )}

      <Box sx={{ width: "100%", margin: "2rem 0 0" }}>
        <TextField
          id="confirm-password"
          name="confirm-password-field"
          autoComplete="new-password"
          InputLabelProps={{ shrink: true }}
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={confirmPasswordError}
          helperText={confirmPasswordError && "Passwords do not match"}
          label="Confirm Password"
          fullWidth
          sx={{
            ".MuiFormHelperText-root.Mui-error": {
              color: theme.palette.error.main,
            },
          }}
        />
      </Box>

      <Box
        alignContent="center"
        textAlign="center"
        marginTop="2.5rem"
        width="100%"
      >
        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{ "@media (min-width: 900px)": { width: "50%" } }}
          disabled={!isFormValid || loading}
        >
          Reset Password
        </Button>
      </Box>
    </form>
  );
};

export default PasswordCreate;
