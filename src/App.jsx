import "./App.css";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import SignIn from "./Components/Auth/SignIn";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreatePassword from "./Components/Auth/CreatePassword";
import Dashboard from "./Components/Dashboard/Dashboard";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SetPassword from "./Components/Auth/SetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-password" element={<CreatePassword />} />
          <Route path="/set-password" element={<SetPassword />} />

          <Route exact path="*" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
