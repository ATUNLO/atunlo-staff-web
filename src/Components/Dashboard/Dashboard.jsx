import Navbar from "../Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import Overview from "./Overview";
import Sidebar from "./Sidebar";
import OnboardAgent from "./OnboardAgent";
import LogCollection from "./LogCollection";
import Payments from "./Payments";

function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="border-solid border-[1px] border-[#E9E9E9] w-full">
        <Routes>
          <Route path="/overview" element={<Overview />} />
          <Route path="/onboard-agents" element={<OnboardAgent />} />
          <Route path="/log-collection" element={<LogCollection />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="*" element={<Navigate to="/overview" />} />
        </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
