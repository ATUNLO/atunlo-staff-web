import { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { publicRequest } from "../../../requestMehod";
import {
  FormGroup,
  Input,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
} from "reactstrap";
import { CiSearch } from "react-icons/ci";
import { FaCalendarAlt } from "react-icons/fa";
import { MobileDatePicker } from "@mui/x-date-pickers";

function RetailDetails() {
  const { id } = useParams();
  const token = useSelector((state) => state?.user?.currentUser?.data.token);
  const [agentDetails, setAgentDetails] = useState(null);
  const [agentHistory, setAgentHistory] = useState(null);
  const [retailSection, setRetailSection] = useState("profile");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages1, setTotalPages1] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };

  const getAgentDetails = async () => {
    try {
      const response = await publicRequest.get(`/admin/agent-details/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAgentDetails(response.data?.data?.agent);
      setAgentHistory(response.data?.data?.collectionMaterials);
      setTotalPages1(response?.data?.data);
      console.log(response.data?.data); // just for checking
    } catch (error) {
      console.error(error);
    }
  };

  const moneyFormat = (value) => {
    if (value === "" || value === null || value === undefined) return "";

    // Ensure it's a valid number before formatting
    const number = Number(value);
    if (isNaN(number)) return "₦0"; // Prevent NaN issues

    return `₦${number.toLocaleString("en-US")}`;
  };

  useEffect(() => {
    if (id) {
      getAgentDetails();
    }
  }, [id]);
  return (
    <div className="px-[30px] py-[40px] w-full">
      <div className="flex flex-col">
        <div className="flex items-center h-[60px] justify-start gap-5">
          <div
            onClick={handleBack}
            className="w-[88px] h-[40px] flex items-center justify-center gap-1 border-[1px] border-solid border-[#E9E9E9] rounded-md cursor-pointer"
          >
            <BiArrowBack />
            <p className="mb-0">Back</p>
          </div>
          <h4>{agentDetails?.fullName}</h4>
        </div>
        <div className="w-full h-[1px] bg-[#e9e9e9] mt-[20px]"></div>
        <div className="flex justify-between  mb-[40px] mt-[30px] w-full">
          <div className="flex w-full gap-[20px]">
            <span
              className={`w-[125px] h-[55px] rounded-[10px] flex items-center justify-center cursor-pointer ${
                retailSection === "profile"
                  ? "bg-[#50CA00] text-white"
                  : "bg-[#EDEDED] text-black"
              }`}
              onClick={() => setRetailSection("profile")}
            >
              Profile
            </span>

            <span
              className={`w-[125px] h-[55px] rounded-[10px] flex items-center justify-center cursor-pointer ${
                retailSection === "history"
                  ? "bg-[#50CA00] text-white"
                  : "bg-[#EDEDED] text-black"
              }`}
              onClick={() => setRetailSection("history")}
            >
              History
            </span>
          </div>
        </div>
        {retailSection === "profile" && (
          <div className="w-full flex flex-col items-center justify-start h-auto border-solid border-[1px] border-[#E9E9E9] rounded-[10px]  py-[55px] mb-[30px]">
            <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-[50px]">
              <FormGroup className="flex flex-col ">
                <Label for="Name" className="font-normal text-[16px] mb-[10px]">
                  Full Name
                </Label>
                <Input
                  id="FullName"
                  name="FullName"
                  placeholder=""
                  type="text"
                  className="border-solid border-[1px] border-[#E9E9E9] !w-[320px] !lg:w-[428px] h-[55px] rounded-[10px]"
                  value={agentDetails?.fullName}
                />
              </FormGroup>
              <FormGroup className="flex flex-col mb-0">
                <Label
                  for="phoneNumber"
                  className="font-normal text-[16px] mb-[10px]"
                >
                  Address
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder=""
                  value={agentDetails?.address}
                  type="emtextail"
                  className="!w-[320px] !lg:w-[428px] h-[55px] rounded-[10px] outline-none ml-[10px]"
                />
              </FormGroup>
            </div>
            <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-[50px] mt-[20px]">
              <FormGroup className="flex flex-col ">
                <Label for="Name" className="font-normal text-[16px] mb-[10px]">
                  State
                </Label>
                <Input
                  id="FullName"
                  name="FullName"
                  placeholder=""
                  type="text"
                  className="border-solid border-[1px] border-[#E9E9E9] !w-[320px] !lg:w-[428px] h-[55px] rounded-[10px]"
                  value={agentDetails?.state?.name}
                />
              </FormGroup>
              <FormGroup className="flex flex-col mb-0">
                <Label
                  for="phoneNumber"
                  className="font-normal text-[16px] mb-[10px]"
                >
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder=""
                  value={agentDetails?.phoneNumber}
                  type="emtextail"
                  className="!w-[320px] !lg:w-[428px] h-[55px] rounded-[10px] outline-none ml-[10px]"
                />
              </FormGroup>
            </div>
            <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-[50px] mt-[20px]">
              <FormGroup className="flex flex-col ">
                <Label for="Name" className="font-normal text-[16px] mb-[10px]">
                  Bank Name
                </Label>
                <Input
                  id="FullName"
                  name="FullName"
                  placeholder=""
                  type="text"
                  className="border-solid border-[1px] border-[#E9E9E9] !w-[320px] !lg:w-[428px] h-[55px] rounded-[10px]"
                  value={agentDetails?.bankName}
                />
              </FormGroup>
              <FormGroup className="flex flex-col mb-0">
                <Label
                  for="phoneNumber"
                  className="font-normal text-[16px] mb-[10px]"
                >
                  Account Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder=""
                  value={agentDetails?.accountNumber}
                  type="emtextail"
                  className="!w-[320px] !lg:w-[428px] h-[55px] rounded-[10px] outline-none ml-[10px]"
                />
              </FormGroup>
            </div>
          </div>
        )}
        {retailSection === "history" && (
          <div className="w-full h-auto border-solid border-[1px] border-[#E9E9E9] rounded-[10px] px-[30px] py-[22px] mb-[30px]">
            <div className="flex flex-col lg:flex-row justify-end mb-5 gap-3 pr-5">
              <div className="flex items-center justify-start gap-3 w-[235px] h-[36px] rounded-[10px] border-solid border-[1px] pl-1 border-[#E9E9E9]">
                <CiSearch className=" text-[#8F8F8F] " size={24} />
                <input
                  type="text"
                  className="border-none outline-none w-[180px] text-[14px]"
                  placeholder="Search"
                />
              </div>
              <div className="w-full lg:w-[335px] h-[36px] pl-3 flex  items-center rounded-[10px] border-solid border-[1px] border-[#E9E9E9] dateRange">
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
                    <th className="!text-[#8F8F8F] font-normal">
                      Collection ID
                    </th>
                    <th className="!text-[#8F8F8F] font-normal">
                      Material Name
                    </th>
                    <th className="!text-[#8F8F8F] font-normal">Amount</th>
                    <th className="!text-[#8F8F8F] font-normal">
                      Total Amount Disbursed
                    </th>
                    <th className="!text-[#8F8F8F] font-normal">
                      Total Collected Material
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {agentHistory?.map((retailers, id) => (
                    <tr key={id} className="cursor-pointer">
                      <td>{retailers.collectionId}</td>
                      <td>{retailers.materialName}</td>
                      <td>{moneyFormat(retailers.amount)}</td>
                      <td>{moneyFormat(retailers.totalAmountDisbursed)}</td>
                      <td>{retailers.totalCollectedMaterial}</td>
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
                    onClick={() => setCurrentPage(totalPages1?.currentPage - 1)}
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
                    onClick={() => setCurrentPage(totalPages1?.currentPage + 1)}
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
          </div>
        )}
      </div>
    </div>
  );
}

export default RetailDetails;
