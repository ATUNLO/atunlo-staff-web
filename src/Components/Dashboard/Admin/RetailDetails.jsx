import { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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
  const [agentHistory, setAgentHistory] = useState([]); // ✅ FIXED
  const [retailSection, setRetailSection] = useState("profile");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPagesInfo, setTotalPagesInfo] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
  });
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
      const response = await publicRequest.get(`/admin/retailer-details/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgentDetails(response.data?.data);
    } catch (error) {
      console.error("Error fetching agent details:", error);
    }
  };

  const getAgentHistory = async () => {
    try {
      const response = await publicRequest.get(
        `/admin_staff/get-pickups?retailerId=${id}&page=${currentPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data?.data;
      setAgentHistory(data?.result || []);
      setTotalPagesInfo({
        totalItems: data?.totalItems || 0,
        totalPages: data?.totalPages || 1,
        currentPage: data?.currentPage || 1,
      });
    } catch (error) {
      console.error("Error fetching agent history:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getAgentDetails();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getAgentHistory(); // ✅ refetch history when currentPage changes
    }
  }, [id, currentPage]);

  const moneyFormat = (value) => {
    const number = Number(value);
    if (isNaN(number)) return "₦0";
    return `₦${number.toLocaleString("en-US")}`;
  };

  return (
    <div className="px-[30px] py-[40px] w-full">
      <div className="flex flex-col">
        <div className="flex items-center h-[60px] justify-start gap-5">
          <div
            onClick={handleBack}
            className="w-[88px] h-[40px] flex items-center justify-center gap-1 border border-[#E9E9E9] rounded-md cursor-pointer"
          >
            <BiArrowBack />
            <p className="mb-0">Back</p>
          </div>
          <h4>{agentDetails?.fullName}</h4>
        </div>

        <div className="w-full h-[1px] bg-[#e9e9e9] mt-[20px]"></div>

        <div className="flex justify-between mb-[40px] mt-[30px] w-full">
          <div className="flex w-full gap-[20px]">
            <span
              className={`w-[125px] h-[55px] rounded-[10px] flex items-center justify-center cursor-pointer ${
                retailSection === "profile" ? "bg-[#50CA00] text-white" : "bg-[#EDEDED] text-black"
              }`}
              onClick={() => setRetailSection("profile")}
            >
              Profile
            </span>

            <span
              className={`w-[125px] h-[55px] rounded-[10px] flex items-center justify-center cursor-pointer ${
                retailSection === "history" ? "bg-[#50CA00] text-white" : "bg-[#EDEDED] text-black"
              }`}
              onClick={() => setRetailSection("history")}
            >
              History
            </span>
          </div>
        </div>

        {retailSection === "profile" && agentDetails && (
          <div className="w-full flex flex-col items-center border border-[#E9E9E9] rounded-[10px] py-[55px] mb-[30px]">
            <div className="flex flex-col lg:flex-row gap-[50px] items-center justify-center">
              <FormGroup className="flex flex-col">
                <Label for="FullName">Full Name</Label>
                <Input
                  type="text"
                  id="FullName"
                  value={agentDetails?.name}
                  className="border border-[#E9E9E9] w-[320px] lg:w-[428px] h-[55px] rounded-[10px]"
                  readOnly
                />
              </FormGroup>
              <FormGroup className="flex flex-col">
                <Label for="address">Address</Label>
                <Input
                  type="text"
                  id="address"
                  value={agentDetails?.address}
                  className="border border-[#E9E9E9] w-[320px] lg:w-[428px] h-[55px] rounded-[10px]"
                  readOnly
                />
              </FormGroup>
            </div>

            <div className="flex flex-col lg:flex-row gap-[50px] items-center justify-center mt-[20px]">
              <FormGroup className="flex flex-col">
                <Label for="state">State</Label>
                <Input
                  type="text"
                  id="state"
                  value={agentDetails?.state?.name}
                  className="border border-[#E9E9E9] w-[320px] lg:w-[428px] h-[55px] rounded-[10px]"
                  readOnly
                />
              </FormGroup>
              <FormGroup className="flex flex-col">
                <Label for="phone">Phone Number</Label>
                <Input
                  type="text"
                  id="phone"
                  value={agentDetails?.phone}
                  className="border border-[#E9E9E9] w-[320px] lg:w-[428px] h-[55px] rounded-[10px]"
                  readOnly
                />
              </FormGroup>
            </div>
          </div>
        )}

        {retailSection === "history" && (
          <div className="w-full border border-[#E9E9E9] rounded-[10px] px-[30px] py-[22px] mb-[30px]">
            <div className="flex flex-col lg:flex-row justify-end mb-5 gap-3 pr-5">
              <div className="flex items-center gap-3 w-[235px] h-[36px] border border-[#E9E9E9] rounded-[10px] pl-2">
                <CiSearch className="text-[#8F8F8F]" size={24} />
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

            <div className="overflow-auto"> {/* 🔧 adjusted for visibility */}
              <Table striped>
                <thead>
                  <tr>
                    <th className="text-[#8F8F8F]">ID</th>
                    <th className="text-[#8F8F8F]">Agent</th>
                    <th className="text-[#8F8F8F]">No. of Plastics</th>
                    <th className="text-[#8F8F8F]">Status</th>
                    <th className="text-[#8F8F8F]">Pickup Date</th>
                  </tr>
                </thead>
                <tbody>
                  {agentHistory.map((pickup, idx) => (
                    <tr key={idx}>
                      <td>{pickup?.id}</td>
                      <td>{pickup?.assignedName || "N/A"}</td>
                      <td>{pickup?.numberOfPlastics}</td>
                      <td>{pickup?.status}</td>
                      <td>{pickup?.pickupDate?.slice(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between pl-5 mt-3">
              <p>
                Page ({totalPagesInfo.currentPage} of {totalPagesInfo.totalPages}) -{" "}
                {totalPagesInfo.totalItems} items
              </p>
              <Pagination className="custom-pagination">
                <PaginationItem disabled={totalPagesInfo.currentPage === 1}>
                  <PaginationLink first onClick={() => setCurrentPage(1)} />
                </PaginationItem>
                <PaginationItem disabled={totalPagesInfo.currentPage === 1}>
                  <PaginationLink
                    previous
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  />
                </PaginationItem>

                {[...Array(totalPagesInfo.totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <PaginationItem key={page} active={page === currentPage}>
                      <PaginationLink onClick={() => setCurrentPage(page)}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem disabled={currentPage === totalPagesInfo.totalPages}>
                  <PaginationLink next onClick={() => setCurrentPage((prev) => prev + 1)} />
                </PaginationItem>
                <PaginationItem disabled={currentPage === totalPagesInfo.totalPages}>
                  <PaginationLink last onClick={() => setCurrentPage(totalPagesInfo.totalPages)} />
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
