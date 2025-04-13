import { useNavigate, useLocation } from "react-router-dom";
import { RiHome5Fill } from "react-icons/ri";
import { FaSquarePlus } from "react-icons/fa6";
import { IoBook } from "react-icons/io5";
import { TbArrowsExchange2 } from "react-icons/tb";
import { FaTruckMoving } from "react-icons/fa6";
import { FaUser, FaUserFriends } from "react-icons/fa";
import { useSelector } from "react-redux";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const accountType = useSelector((state) => state?.user?.currentUser?.data.accountType);

  let menuItems;

  if (accountType === 'admin') {
    menuItems = [
      { name: "Overview", icon: RiHome5Fill, path: "/overview" },
      { name: "Agent Management", icon: FaUser, path: "/agent-management" },
      {
        name: "Staff Management",
        icon: FaUserFriends,
        path: "/staff-management",
      },
      {
        name: "Retail Management",
        icon: FaUserFriends,
        path: "/retail-management",
      },
      { name: "Pickups", icon: FaTruckMoving, path: "/pickups" },
      { name: "Collection", icon: IoBook, path: "/collections" },
      { name: "Transactions", icon: TbArrowsExchange2, path: "/transactions" },
    ];
  } else {
    menuItems = [
      { name: "Overview", icon: RiHome5Fill, path: "/overview" },
      { name: "Onboard Agent", icon: FaSquarePlus, path: "/onboard-agents" },
      { name: "Collection", icon: IoBook, path: "/log-collection" },
      { name: "Payments", icon: TbArrowsExchange2, path: "/payments" },
      { name: "Pickups", icon: FaTruckMoving, path: "/pickups" },
    ];
  }

  return (
    <div className="flex flex-col Sidebar z-1 sticky top-0 max-h-[100vh]">
      <div className="w-[220px] flex items-center pl-5 h-[65px]">
        <img src="assets/logo.png" alt="" className="" />
      </div>
      <div className="w-[220px] h-full border-solid border-[1px] border-[#E9E9E9] flex flex-col gap-[40px] items-start pt-[40px] pl-[26px]">
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path; // Check if the current path matches

          return (
            <div
              key={item.name}
              className={`flex items-center gap-[10px] cursor-pointer ${
                isSelected ? "text-[#50CA00] font-bold" : "text-[#8F8F8F]"
              }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon
                size={24}
                className={isSelected ? "text-[#50CA00]" : "fill-[#8F8F8F]"}
              />
              <p
                className={`mb-0 text-[14px] ${
                  isSelected ? "text-[#50CA00]" : "text-[#8F8F8F]"
                }`}
              >
                {item.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
