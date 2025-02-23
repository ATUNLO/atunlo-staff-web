import "./App.css";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import SignIn from "./Components/Auth/SignIn";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreatePassword from "./Components/Auth/CreatePassword";
import Dashboard from "./Components/Dashboard/Dashboard";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route
          exact
          path="*"
          element={<Dashboard />}
        />
      </Routes>
    </Router>
  );
}

export default App;
