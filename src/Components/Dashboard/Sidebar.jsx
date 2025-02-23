import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { RiHome5Fill } from "react-icons/ri";
import { FaSquarePlus } from "react-icons/fa6";
import { IoBook } from "react-icons/io5";
import { TbArrowsExchange2 } from "react-icons/tb";

function Sidebar() {
  const [selectedPage, setSelectedPage] = useState("Overview");
  const navigate = useNavigate(); // Initialize useNavigate

  // Sidebar Menu Items with route paths
  const menuItems = [
    { name: "Overview", icon: RiHome5Fill, path: "/overview" },
    { name: "Onboard Agent", icon: FaSquarePlus, path: "/onboard-agents" },
    { name: "Log Collection", icon: IoBook, path: "/log-collection" },
    { name: "Payments", icon: TbArrowsExchange2, path: "/payments" },
  ];

  return (
    <div className="w-[220px] min-h-[94vh] border-solid border-[1px] border-[#E9E9E9] flex flex-col gap-[40px] items-start pt-[40px] pl-[26px]">
      {menuItems.map((item) => {
        const isSelected = selectedPage === item.name;
        return (
          <div
            key={item.name}
            className="flex items-center gap-[10px] cursor-pointer"
            onClick={() => {
              setSelectedPage(item.name);
              navigate(item.path); // Navigate to the selected route
            }}
          >
            <item.icon size={24} className={isSelected ? "text-[#50CA00]" : "fill-[#8F8F8F]"} />
            <p className={`mb-0 text-[14px] ${isSelected ? "text-[#50CA00]" : "text-[#8F8F8F]"}`}>
              {item.name}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default Sidebar;
