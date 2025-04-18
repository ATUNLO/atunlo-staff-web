import { MobileDatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
// import { FaSquarePlus } from "react-icons/fa6";
import { FaPlus, FaDownload, FaCalendarAlt, FaTrash, FaEye } from "react-icons/fa";

import { Pagination, PaginationItem, PaginationLink, Table } from "reactstrap";
import { publicRequest } from "../../../requestMehod";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RiEditFill } from "react-icons/ri";
import AddStaffModal from "./AddStaffModal";

function StaffManagement() {
  const [currentPage, setCurrentPage] = useState(1);

  const [addStaffmodal, setAddStaffModal] = useState(false);
  const [editStaffmodal, setEditStaffModal] = useState(false);
  const [totalPages1, setTotalPages1] = useState("");
  const [staff, setStaffs] = useState([]);
  const navigate = useNavigate();
  const token = useSelector((state) => state?.user?.currentUser?.data.token);

 
  const toggleAddStaff = () => {
    setAddStaffModal(!addStaffmodal);
  };


  const getStaff = async () => {
    try {
      const response = await publicRequest.get(`/admin/list/staff?type=staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data?.data?.result;
      setStaffs(data);
      setTotalPages1(response?.data?.data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {
    getStaff();
  }, []);



  return (
    <>
      {addStaffmodal && (
        <AddStaffModal
          addStaffmodal={addStaffmodal}
          toggleAddStaff={toggleAddStaff}
          getStaff={getStaff}
        />
      )}
      <div className="px-[30px] py-[40px] w-full">
        <div className="flex flex-col">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-[20px] font-medium mb-[30px]">
              Staff Management
            </h1>
            <div className="flex gap-[30px]">
            <div
              className="flex items-center justify-center gap-2 bg-white py-[16px] px-[20px] text-black text-[16px] rounded-[10px] cursor-pointer border-[1px] border-solid border-black"
            >
              <span>Add Multiple Staff (CSV)</span>
            </div>
            <div
              className="flex items-center justify-center gap-2 bg-[#50CA00] py-[16px] px-[20px] text-white text-[16px] rounded-[10px] cursor-pointer"
              onClick={toggleAddStaff}
            >
              <FaPlus />
              <span>Add Single Staff</span>
            </div>
            </div>

          </div>
          <div className="flex justify-between  mb-[40px] mt-[20px] w-full">
            <div className="flex items-center justify-center w-[250px] gap-2 bg-white border-solid border-[1px] border-[#e9e9e9] py-[16px] px-[10px] text-[#50CA00] text-[16px] rounded-[10px]">
              <FaDownload />
              <span className="text-[14px] font-bold">
                Download Agent Details
              </span>
            </div>
          </div>

          <div className="w-full h-auto border-solid border-[1px] border-[#E9E9E9] rounded-[10px] px-[30px] py-[22px] mb-[30px]">
            <>
              <div className="flex justify-end mb-5 gap-3 pr-5">
                <div className="flex items-center justify-start gap-3 w-[235px] h-[36px] rounded-[10px] border-solid border-[1px] pl-1 border-[#E9E9E9]">
                  <CiSearch className=" text-[#8F8F8F] " size={24} />
                  <input
                    type="text"
                    className="border-none outline-none w-[180px] text-[14px]"
                    placeholder="Search"
                  />
                </div>
                <div className="w-[335px] h-[36px] pl-3 flex items-center rounded-[10px] border-solid border-[1px] border-[#E9E9E9] dateRange">
                  <FaCalendarAlt size={20} className="text-[#50CA00]" />
                  <MobileDatePicker
                    className="w-[200px] text-[14px]"
                    placeholder="mm/dd/yyyy"
                  />
                  <span>-</span>
                  <MobileDatePicker className="" />
                </div>
              </div>
              <Table striped>
                <thead>
                  <tr>
                    <th className="!text-[#8F8F8F] font-normal">Name</th>
                    <th className="!text-[#8F8F8F] font-normal">Email</th>
                    <th className="!text-[#8F8F8F] font-normal">Phone Number</th>
                    <th className="!text-[#8F8F8F] font-normal"></th>
                  </tr>
                </thead>
                <tbody>
                  {staff?.map((staff, index) => (
                    <tr
                      key={index}
                      className="cursor-pointer"
                      
                    >
                      <td>{staff.name}</td>
                      <td>{staff.emailaddress}</td>
                      <td>{staff.phoneNumber || "N/A"}</td>
                      <td>
                        <div className="flex gap-[20px] items-center justify-center">
                          <RiEditFill />
                          <FaTrash className="fill-red-600 cursor-pointer" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="flex items-center justify-between pl-5">
                <p>
                  Page ({totalPages1?.currentPage} of {totalPages1?.totalPages}){" "}
                  {totalPages1?.totalItems} items
                </p>
                <Pagination className="custom-pagination">
                  {/* First Page */}
                  <PaginationItem disabled={totalPages1?.currentPage === 1}>
                    <PaginationLink
                      first
                      href="#"
                      onClick={() => setCurrentPage(1)}
                    />
                  </PaginationItem>

                  {/* Previous Page */}
                  <PaginationItem disabled={totalPages1?.currentPage === 1}>
                    <PaginationLink
                      previous
                      href="#"
                      onClick={() =>
                        setCurrentPage(totalPages1?.currentPage - 1)
                      }
                    />
                  </PaginationItem>

                  {/* Dynamic Page Numbers */}
                  {[...Array(totalPages1?.totalPages || 1)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <PaginationItem
                        key={page}
                        active={totalPages1?.currentPage === page}
                      >
                        <PaginationLink
                          href="#"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {/* Next Page */}
                  <PaginationItem
                    disabled={
                      totalPages1?.currentPage === totalPages1?.totalPages
                    }
                  >
                    <PaginationLink
                      next
                      href="#"
                      onClick={() =>
                        setCurrentPage(totalPages1?.currentPage + 1)
                      }
                    />
                  </PaginationItem>

                  {/* Last Page */}
                  <PaginationItem
                    disabled={
                      totalPages1?.currentPage === totalPages1?.totalPages
                    }
                  >
                    <PaginationLink
                      last
                      href="#"
                      onClick={() => setCurrentPage(totalPages1?.totalPages)}
                    />
                  </PaginationItem>
                </Pagination>
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
}

export default StaffManagement;
