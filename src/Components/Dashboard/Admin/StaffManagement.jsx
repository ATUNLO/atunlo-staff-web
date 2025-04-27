import { MobileDatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
// import { FaSquarePlus } from "react-icons/fa6";
import {
  FaPlus,
  FaDownload,
  FaCalendarAlt,
  FaTrash,
  FaEye,
} from "react-icons/fa";

import { Modal, ModalBody, Pagination, PaginationItem, PaginationLink, Spinner, Table } from "reactstrap";
import { publicRequest } from "../../../requestMehod";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RiEditFill } from "react-icons/ri";
import AddStaffModal from "./AddStaffModal";
import EditStaffModal from "./EditStaffModal";
import { IoMdCloseCircle } from "react-icons/io";
import { toast } from "react-toastify";

function StaffManagement() {
  const [currentPage, setCurrentPage] = useState(1);

  const [addStaffmodal, setAddStaffModal] = useState(false);
  const [editStaffmodal, setEditStaffModal] = useState(false);
  const [deleteStaffmodal, setDeleteStaffModal] = useState(false);
  const [totalPages1, setTotalPages1] = useState("");
  const [loading, setLoading] = useState(false);
  const [staff, setStaffs] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const navigate = useNavigate();
  const token = useSelector((state) => state?.user?.currentUser?.data.token);

  const toggleAddStaff = () => {
    setAddStaffModal(!addStaffmodal);
  };

  const toggleEditStaff = () => {
    setEditStaffModal(!editStaffmodal);
  };

  const toggleDeleteStaff = (id) => {
    setDeleteStaffModal(!deleteStaffmodal);
    setSelectedStaffId(id);
  };

  const handleEditStaff = (id) => {
    setSelectedStaffId(id);
    toggleEditStaff(); 
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

  const deleteStaff = async (id) => {
    setLoading(true);
    try {
      const response = await publicRequest.delete(`/admin/delete/staff/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response?.status === 200) {
        toast.success(response?.data?.message || "Staff deleted successfully.");
        toggleDeleteStaff(); // close the modal
        getStaff(); // refresh the staff list
      } else {
        toast.error("Failed to delete staff. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while deleting.");
    } finally {
      setLoading(false);
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
          handleEditStaff={handleEditStaff}
        />
      )}

      {editStaffmodal && (
        <EditStaffModal
          editStaffmodal={editStaffmodal}
          toggleEditStaff={toggleEditStaff}
          getStaff={getStaff}
          id={selectedStaffId}
        />
      )}

      {deleteStaffmodal && (
          <Modal
          isOpen={deleteStaffmodal}
          toggle={toggleDeleteStaff}
          size="md"
          className="w-full lg:py-[50px]"
          scrollable
        >
          <ModalBody className="flex flex-col items-center justify-center">
            <>
              <div className="flex items-center justify-center relative pt-[50px] lg:mb-[70px] w-full px-10">
                <span className="text-[30px]">Delete Staff</span>
                <IoMdCloseCircle
                  size={20}
                  className="absolute lg:right-20 right-5"
                  onClick={() => toggleDeleteStaff()}
                />
              </div>
              <div className="flex flex-col lg:flex-row items-start justify-start gap-[50px] mt-[30px] mx-auto">
                
               <h3 className="text-center">Are you sure you want to delete this Staff and thier details?</h3>
     
              </div>
              <div className="flex items-center justify-center gap-5">
                <div
                  className="w-[150px] !h-[55px] bg-[#50c100] flex items-center justify-center rounded-md mt-[70px] mb-[50px]"
                  onClick={() => deleteStaff(selectedStaffId)}
                >
                  <p className="mb-0 text-white font-semibold text-[16px] cursor-pointer">
                    {loading ? <Spinner /> : "Delete Staff"}
                  </p>
                </div>
                <div
                  className="w-[150px] !h-[55px] bg-white border-[1px] border-solid border-[#50c100] text-black flex items-center justify-center rounded-md mt-[70px] mb-[50px]"
                  onClick={() => toggleDeleteStaff()}
                >
                  <p className="mb-0 text-black font-semibold text-[16px] cursor-pointer">
                   Keep Staff
                  </p>
                </div>
              </div>
            </>
          </ModalBody>
        </Modal>
      )}
      <div className="px-[30px] py-[40px] w-full">
        <div className="flex flex-col">
          <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <h1 className="text-[20px] font-medium mb-[30px]">
              Staff Management
            </h1>
            <div className="flex flex-col lg:flex-row gap-[30px] mb-[20px]">
              <div className="flex  items-center justify-center gap-2 bg-white py-[16px] px-[20px] text-black text-[16px] rounded-[10px] cursor-pointer border-[1px] border-solid border-black">
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
          <div className="w-full h-auto border-solid border-[1px] border-[#E9E9E9] rounded-[10px] px-[30px] py-[22px] mb-[30px]">
            <>
              <div className="flex flex-col lg:flex-row justify-start lg:justify-end mb-5 gap-3 lg:pr-5">
                <div className="flex items-center justify-start gap-3 w-[235px] h-[36px] rounded-[10px] border-solid border-[1px] pl-1 border-[#E9E9E9]">
                  <CiSearch className=" text-[#8F8F8F] " size={24} />
                  <input
                    type="text"
                    className="border-none outline-none w-[180px] text-[14px]"
                    placeholder="Search"
                  />
                </div>
                <div className="w-[270px] lg:w-[335px] h-[36px] pl-3 flex items-center rounded-[10px] border-solid border-[1px] border-[#E9E9E9] dateRange">
                  <FaCalendarAlt size={20} className="text-[#50CA00]" />
                  <MobileDatePicker
                    className="w-[200px] text-[14px]"
                    placeholder="mm/dd/yyyy"
                  />
                  <span>-</span>
                  <MobileDatePicker className="" />
                </div>
              </div>
              <div className="overflow-scroll">
                <Table striped>
                  <thead>
                    <tr>
                      <th className="!text-[#8F8F8F] font-normal whitespace-nowrap">
                        Name
                      </th>
                      <th className="!text-[#8F8F8F] font-normal whitespace-nowrap">
                        Email
                      </th>
                      <th className="!text-[#8F8F8F] font-normal whitespace-nowrap">
                        Phone Number
                      </th>
                      <th className="!text-[#8F8F8F] font-normal whitespace-nowrap"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff?.map((staff, index) => (
                      <tr key={index} className="cursor-pointer">
                        <td className="whitespace-nowrap">{staff.name}</td>
                        <td className="whitespace-nowrap">
                          {staff.emailaddress}
                        </td>
                        <td className="whitespace-nowrap">
                          {staff.phone || "N/A"}
                        </td>
                        <td className="whitespace-nowrap">
                          <div className="flex gap-[20px] items-center justify-center">
                            <RiEditFill   onClick={() => handleEditStaff(staff.id)}/>
                            <FaTrash className="fill-red-600 cursor-pointer"  onClick={() => toggleDeleteStaff(staff.id)}/>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="flex flex-col lg:flex-row items-center justify-between pl-5">
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
