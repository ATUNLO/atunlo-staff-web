import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Overview from "./Staff/Overview";
import OverviewAdmin from "./Admin/Overview";
import Sidebar from "./Sidebar";
import OnboardAgent from "./Staff/OnboardAgent";
import LogCollection from "./Staff/LogCollection";
import Payments from "./Staff/Payments";
import { useDispatch, useSelector } from "react-redux";
import { LogOut } from "../../Redux/LoginSlice";
import Pickups from "./Staff/Pickups";
import CollectionDetails from "./Staff/CollectionDetails";
import CollectionDetailsAdmin from "./Admin/CollectionDetails";
import StaffManagement from "./Admin/StaffManagement";
import RetailManagement from "./Admin/RetailManagement";
import AgentManagement from "./Admin/AgentManagement";
import AgentDetails from "./Admin/AgentDetails";
import RetailDetails from "./Admin/RetailDetails";
import PaymentsAdmin from "./Admin/Payments";
import PickupsAdmin from "./Admin/Pickups";
import LogCollectionAdmin from "./Admin/LogCollection";
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";
import { useState } from "react";
import PayoutsAdmin from "./Admin/Payouts";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
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
      <div className="flex overflow-scroll">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="border-solid border-[1px] border-[#E9E9E9] w-full">
          <div className="flex items-center justify-between w-full border-solid border-[1px] border-[#E9E9E9] h-[65px] px-4 mb-0">
            <div className="block lg:hidden">
              <img src="/assets/menu.png" alt=""onClick={() => setShowSidebar(!showSidebar)} />
            </div>
            <Offcanvas
              isOpen={showSidebar}
              toggle={() => setShowSidebar(!showSidebar)}
              direction="start"
              className="!z-[9999] !w-[250px]"
            >
              <OffcanvasHeader toggle={() => setShowSidebar(!showSidebar)}>
                
              </OffcanvasHeader>
              <OffcanvasBody>
                <Sidebar  toggleSidebar={() => setShowSidebar(!showSidebar)}/>
              </OffcanvasBody>
            </Offcanvas>
            <h1 className="text-[14px] lg:text-[24px] font-extrabold ml-[30px]">
              Welcome, {user?.name}
            </h1>
            <div
              className="flex gap-[2px] lg:gap-[5px] cursor-pointer"
              onClick={LogOutHandler}
            >
              <img src="assets/logout.png" />
              <p className="text-[#FF3B30] mb-0 text-[12px] lg:text-[16px]">
                Log out
              </p>
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
                <Route path="/payouts" element={<PayoutsAdmin />} />
                <Route path="/pickups" element={<PickupsAdmin />} />
                <Route
                  path="/collections/:id"
                  element={<CollectionDetailsAdmin />}
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
