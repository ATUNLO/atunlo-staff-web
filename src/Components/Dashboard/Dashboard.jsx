import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Overview from "./Staff/Overview";
import OverviewAdmin from "./Admin/Overview";
import Sidebar from "./Sidebar";
import OnboardAgent from "./Staff/OnboardAgent";
import LogCollection from "./Admin/LogCollection";
import Payments from "./Staff/Payments";
import { useDispatch, useSelector } from "react-redux";
import { LogOut } from "../../Redux/LoginSlice";
import Pickups from "./Staff/Pickups";
import CollectionDetails from "./Staff/CollectionDetails";
import StaffManagement from "./Admin/StaffManagement";
import RetailManagement from "./Admin/RetailManagement";
import AgentManagement from './Admin/AgentManagement'
import AgentDetails from "./Admin/AgentDetails";
import RetailDetails from "./Admin/RetailDetails";
import PaymentsAdmin from "./Admin/Payments";
import PickupsAdmin from "./Admin/Pickups";
import LogCollectionAdmin from "./Admin/LogCollection";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.currentUser?.data);
  const accountType = useSelector(
    (state) => state?.user?.currentUser?.data.accountType
  );

  const LogOutHandler = () => {
    dispatch(LogOut());
    window.localStorage.clear();
    navigate("/");
  };
  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="border-solid border-[1px] border-[#E9E9E9] w-full">
          <div className="flex items-center justify-between w-full border-solid border-[1px] border-[#E9E9E9] h-[65px] px-4 mb-0">
            <h1 className="text-[24px] font-extrabold ml-[30px]">
              Welcome, {user?.name}
            </h1>
            <div
              className="flex gap-[5px] cursor-pointer"
              onClick={LogOutHandler}
            >
              <img src="assets/logout.png" />
              <p className="text-[#FF3B30] mb-0 text-[16px]">Log out</p>
            </div>
          </div>
          <Routes>
            {accountType === "staff" && (
              <>
                <Route path="/overview" element={<Overview />} />
                <Route path="/onboard-agents" element={<OnboardAgent />} />
                <Route path="/log-collection" element={<LogCollection />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/pickups" element={<Pickups />} />
                <Route
                  path="/log-collection/:id"
                  element={<CollectionDetails />}
                />
                <Route path="*" element={<Navigate to="/overview" />} />
              </>
            )}
            {accountType === "admin" && (
              <>
                <Route path="/overview" element={<OverviewAdmin />} />
                <Route path="/onboard-agents" element={<OnboardAgent />} />
                <Route path="/staff-management" element={<StaffManagement />} />
                <Route path="/agent-management" element={<AgentManagement />} />
                <Route
                  path="/retail-management"
                  element={<RetailManagement />}
                />
                <Route path="/collections" element={<LogCollectionAdmin />} />
                <Route path="/transactions" element={<PaymentsAdmin />} />
                <Route path="/pickups" element={<PickupsAdmin />} />
                <Route
                  path="/collections/:id"
                  element={<CollectionDetails />}
                />
                <Route
                  path="/agent-management/:id"
                  element={<AgentDetails />}
                />
                <Route
                  path="/retail-management/:id"
                  element={<RetailDetails />}
                />
                <Route path="*" element={<Navigate to="/overview" />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
