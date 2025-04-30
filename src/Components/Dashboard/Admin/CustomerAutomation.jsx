import { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { RiEditFill } from "react-icons/ri";
import { FormGroup, Input, Label, Modal, ModalBody, Pagination, PaginationItem, PaginationLink, Spinner, Table } from "reactstrap";
import { publicRequest } from "../../../requestMehod";
import { useSelector } from "react-redux";
import { IoMdCloseCircle } from "react-icons/io";
import { toast } from "react-toastify";

function CustomerAutomation() {
  const token = useSelector((state) => state?.user?.currentUser?.data.token);
  const [totalPages1, setTotalPages1] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [email,setEmail] = useState("")
  const [loading,setLoading] = useState(false)
  const [addCustomerModal,setAddCustomerModal] = useState(false)
  const [selectedId, setSelectedId] = useState("")
  const [deleteCustomermodal,setDeleteCustomerModal] = useState(false)
  const [automatedStaff, setAutomatedStaff] = useState([]);

  const toggleAddCustomerModal = () => {
    setAddCustomerModal(!addCustomerModal);
  };

  const toggleDeleteCustomer = (id) => {
    setDeleteCustomerModal(!deleteCustomermodal);
    setSelectedId(id);
  };

  const getAutomatedCustomers = async () => {
    try {
      const response = await publicRequest.get(
        `/admin/get/automated-customers`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data?.data?.result;
      setAutomatedStaff(data);
      console.log(data)
      setTotalPages1(response?.data?.data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCustomer = async (selectedId) => {
    setLoading(true);
    try {
      const response = await publicRequest.delete(`/admin/delete/staff/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.status === 200) {
        toast.success(response?.data?.message || "Customer deleted successfully.");
        toggleDeleteCustomer(); // close the modal
        getAutomatedCustomers(); // refresh the staff list
      } else {
        toast.error("Failed to delete Customer. Please try again.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred while deleting."
      );
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (token) => {
    setLoading(true);

    const staffData = {
      emailaddress: email,
    };

    try {
      const url = `/admin/automate/customer`;
      const response = await publicRequest.post(url, staffData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message || "Customer added successfully.");
         toggleAddCustomerModal();
         getAutomatedCustomers();
      } else {
        toast.error("Something went wrong. Please try again.");
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to add Customer.");
    }
  };

  useEffect(() => {
    getAutomatedCustomers();
  }, []);
  return (
    <div className="px-[30px] py-[40px] w-full">
      <div className="flex flex-col">
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between">
          <h1 className="text-[20px] font-medium mb-[30px]">
            Customer Automation
          </h1>
          <div className="flex flex-col lg:flex-row gap-[30px] mb-[20px]">
            <div
              className="flex items-center justify-center gap-2 bg-[#50CA00] py-[16px] px-[20px] text-white text-[16px] rounded-[10px] cursor-pointer"
              onClick={() => toggleAddCustomerModal()}
            >
              <FaPlus />
              <span>Add Customer</span>
            </div>
          </div>
          {addCustomerModal && 
                <Modal
                isOpen={addCustomerModal}
                toggle={toggleAddCustomerModal}
                size="md"
                className="w-full lg:py-[50px]"
                scrollable
              >
                <ModalBody className="flex flex-col items-center justify-center">
                  <>
                    <div className="flex items-center justify-center relative pt-[50px] lg:mb-[70px] w-full px-10">
                      <span className="text-[30px]">Add Customer</span>
                      <IoMdCloseCircle
                        size={20}
                        className="absolute lg:right-20 right-5"
                        onClick={() => toggleAddCustomerModal()}
                      />
                    </div>
                    <div className="flex flex-col lg:flex-row items-start justify-start gap-[50px] mt-[30px] mx-auto">
          
                      {/* Column 2: Email Address */}
                      <div>
                        <FormGroup className="flex flex-col">
                          <Label
                            for="email"
                            className="font-normal text-[16px] mb-[10px]"
                          >
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            placeholder=""
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="!w-[311px] h-[55px] rounded-[10px] outline-none ml-[10px]"
                          />
                        </FormGroup>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div
                        className="w-[300px] !h-[55px] bg-[#50c100] flex items-center justify-center rounded-md mt-[70px] mb-[50px]"
                        onClick={() => addCustomer(token)}
                      >
                        <p className="mb-0 text-white font-semibold text-[16px] cursor-pointer">
                          {loading ? <Spinner /> : "Add Customer"}
                        </p>
                      </div>
                    </div>
                  </>
                </ModalBody>
              </Modal>
          }
          {deleteCustomermodal && (
        <Modal
          isOpen={deleteCustomermodal}
          toggle={toggleDeleteCustomer}
          size="md"
          className="w-full lg:py-[50px]"
          scrollable
        >
          <ModalBody className="flex flex-col items-center justify-center">
            <>
              <div className="flex items-center justify-center relative pt-[50px] lg:mb-[70px] w-full px-10">
                <span className="text-[30px]">Delete Customer</span>
                <IoMdCloseCircle
                  size={20}
                  className="absolute lg:right-20 right-5"
                  onClick={() => toggleDeleteCustomer()}
                />
              </div>
              <div className="flex flex-col lg:flex-row items-start justify-start gap-[50px] mt-[30px] mx-auto">
                <h3 className="text-center">
                  Are you sure you want to delete this Customer from this section?
                </h3>
              </div>
              <div className="flex items-center justify-center gap-5">
                <div
                  className="w-[150px] !h-[55px] bg-[#50c100] flex items-center justify-center rounded-md mt-[70px] mb-[50px]"
                  onClick={() => deleteCustomer(selectedId)}
                >
                  <p className="mb-0 text-white font-semibold text-[16px] cursor-pointer">
                    {loading ? <Spinner /> : "Delete Customer"}
                  </p>
                </div>
                <div
                  className="w-[150px] !h-[55px] bg-white border-[1px] border-solid border-[#50c100] text-black flex items-center justify-center rounded-md mt-[70px] mb-[50px]"
                  onClick={() => toggleDeleteCustomer()}
                >
                  <p className="mb-0 text-black font-semibold text-[16px] cursor-pointer">
                    Keep Customer
                  </p>
                </div>
              </div>
            </>
          </ModalBody>
        </Modal>
      )}
        </div>
        <div className="w-full h-auto border-solid border-[1px] border-[#E9E9E9] rounded-[10px] px-[30px] py-[22px] mb-[30px]">
          <>
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
                  {automatedStaff && automatedStaff.length > 0 ? (
                    automatedStaff.map((staff, index) => (
                      <tr key={index} className="cursor-pointer">
                        <td className="whitespace-nowrap">{staff.user.name}</td>
                        <td className="whitespace-nowrap">
                          {staff.user.emailaddress}
                        </td>
                        <td className="whitespace-nowrap">
                          {staff.user.phone || "N/A"}
                        </td>
                        <td className="whitespace-nowrap">
                          <div className="flex gap-[20px] items-center justify-center">
                            <FaTrash
                              className="fill-red-600 cursor-pointer"
                              onClick={() => toggleDeleteCustomer(staff.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-4 text-gray-500"
                      >
                        No Customer found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            {automatedStaff.length > 0 && (
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
            )}
          </>
        </div>
      </div>
    </div>
  );
}

export default CustomerAutomation;
