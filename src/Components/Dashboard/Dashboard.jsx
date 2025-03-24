import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Overview from "./Overview";
import Sidebar from "./Sidebar";
import OnboardAgent from "./OnboardAgent";
import LogCollection from "./LogCollection";
import Payments from "./Payments";
import { useDispatch, useSelector } from "react-redux";
import { LogOut } from "../../Redux/LoginSlice";
import Pickups from "./Pickups";


function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.currentUser?.data);
  console.log(user.isPasswordSet)


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
              <Route path="/overview" element={<Overview />} />
              <Route path="/onboard-agents" element={<OnboardAgent />} />
              <Route path="/log-collection" element={<LogCollection />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/pickups" element={<Pickups />} />
              <Route path="*" element={<Navigate to="/overview" />} />
            </Routes>
          </div>
        </div>
      </div>
  );
}

export default Dashboard;
