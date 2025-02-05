import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import customTheme from "./styles/customTheme";

function App() {
  return (
    <CssVarsProvider theme={customTheme}>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    </CssVarsProvider>
  );
}

export default App;
