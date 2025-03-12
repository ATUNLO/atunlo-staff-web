import { useNavigate, useLocation } from "react-router-dom";
import { RiHome5Fill } from "react-icons/ri";
import { FaSquarePlus } from "react-icons/fa6";
import { IoBook } from "react-icons/io5";
import { TbArrowsExchange2 } from "react-icons/tb";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar Menu Items with route paths
  const menuItems = [
    { name: "Overview", icon: RiHome5Fill, path: "/overview" },
    { name: "Onboard Agent", icon: FaSquarePlus, path: "/onboard-agents" },
    { name: "Collection", icon: IoBook, path: "/log-collection" },
    { name: "Payments", icon: TbArrowsExchange2, path: "/payments" },
  ];

  return (
    <div className="flex flex-col Sidebar z-1 sticky top-0 max-h-[100vh]">
      <div className="w-[220px] flex items-center pl-5 py-3">
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
