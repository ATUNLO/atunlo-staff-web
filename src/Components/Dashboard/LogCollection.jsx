// import { FormGroup, Input, Label } from "reactstrap";
// import { FiSearch } from "react-icons/fi";
// import { DatePicker } from "@mui/x-date-pickers";
// import { FaTrash } from "react-icons/fa";
// import { materialTypes } from "../../utils/dataset";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
// import { FaSquarePlus } from "react-icons/fa6";
import { FaPlus, FaDownload, FaCalendarAlt, FaTrash } from "react-icons/fa";
import {
  agentCollection,
  paymentData,
  retailCollections,
} from "../../utils/dataset";
import { Pagination, PaginationItem, PaginationLink, Table } from "reactstrap";
import LogCollectionModal from "../LogCollectionModal";
import { publicRequest } from "../../requestMehod";
import { useSelector } from "react-redux";

function LogCollection() {
  const [collectionType, setCollectionType] = useState("Agents");
  const totalPages = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [logmodal, setLogModal] = useState(false);
  const [totalPages1, setTotalPages1] = useState("");
  const [collections,setCollections] = useState([])
  const [materialTypeSelection, setMaterialTypeSelection] = useState([]);
  const token = useSelector((state) => state?.user?.currentUser?.data.token);
  

  const toggle = () => {
    setLogModal(!logmodal);
  };

  const getCollections = async () => {
    try {
      const response = await publicRequest.get(`/admin_staff/get-collections`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data?.data?.result;
      setCollections(data);
      setTotalPages1(response?.data?.data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getMaterialType = async () => {
    try {
      const response = await publicRequest.get(`/misc/material-types`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data?.data;
      setMaterialTypeSelection(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
   getCollections();
   getMaterialType();
  }, []);



  const moneyFormat = (value) => {
    if (value === "" || value === null || value === undefined) return "";
    
    // Ensure it's a valid number before formatting
    const number = Number(value);
    if (isNaN(number)) return "₦0"; // Prevent NaN issues
    
    return `₦${number.toLocaleString("en-US")}`;
  };
  
  


  return (
    <>
      {logmodal && <LogCollectionModal logmodal={logmodal} toggle={toggle} materialTypeSelection={materialTypeSelection}/>}
      <div className="px-[30px] py-[40px] w-full">
        <div className="flex flex-col">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-[20px] font-medium mb-[30px]">Collections</h1>
            <div
              className="flex items-center justify-center gap-2 bg-[#50CA00] py-[16px] px-[20px] text-white text-[16px] rounded-[10px] cursor-pointer"
              onClick={toggle}
            >
              <FaPlus />
              <span>Log a Collection</span>
            </div>
          </div>
          <div className="flex justify-between  mb-[40px] mt-[20px] w-full">
            <div className="flex w-full gap-[20px]">
              <span
                className={`w-[125px] h-[55px] rounded-[10px] flex items-center justify-center cursor-pointer ${
                  collectionType === "Agents"
                    ? "bg-[#50CA00] text-white"
                    : "bg-[#EDEDED] text-black"
                }`}
                onClick={() => setCollectionType("Agents")}
              >
                Agents
              </span>

              <span
                className={`w-[125px] h-[55px] rounded-[10px] flex items-center justify-center cursor-pointer ${
                  collectionType === "Retailers"
                    ? "bg-[#50CA00] text-white"
                    : "bg-[#EDEDED] text-black"
                }`}
                onClick={() => setCollectionType("Retailers")}
              >
                Retailers
              </span>
            </div>

            <div className="flex items-center justify-center w-[250px] gap-2 bg-[#EDEDED] py-[16px] px-[10px] text-black text-[16px] rounded-[10px]">
              <span className="text-[14px] font-bold">Download Collection</span>
              <FaDownload />
            </div>
          </div>

          <div className="w-full h-auto border-solid border-[1px] border-[#E9E9E9] rounded-[10px] px-[30px] py-[22px] mb-[30px]">
            {collectionType === "Agents" && (
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
                      <th className="!text-[#8F8F8F] font-normal">
                        Agent Name
                      </th>
                      <th className="!text-[#8F8F8F] font-normal">
                       Date of Collection
                      </th>
                      <th className="!text-[#8F8F8F] font-normal">
                       Prepayment
                      </th>
                      <th className="!text-[#8F8F8F] font-normal">
                       Total Due
                      </th>
                      <th className="!text-[#8F8F8F] font-normal"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {collections?.map((agents, index) => (
                      <tr key={index}>
                        <td>{agents.agentName}</td>
                        <td>{agents.collectionDate}</td>
                        <td>{moneyFormat(agents.prepayment)}</td>
                        <td>{moneyFormat(agents.totalDue)}</td>
                        <td className="flex gap-[29px] items-center justify-center">
                          <p className="underline mb-0">View</p>
                          <FaTrash className="fill-red-600" />
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
            )}
            {collectionType === "Retailers" && (
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
                      <th className="!text-[#8F8F8F] font-normal">Mobile No</th>
                      <th className="!text-[#8F8F8F] font-normal">Email</th>
                      <th className="!text-[#8F8F8F] font-normal">Location</th>
                      <th className="!text-[#8F8F8F] font-normal">Quantity</th>
                      <th className="!text-[#8F8F8F] font-normal">Status</th>
                      <th className="!text-[#8F8F8F] font-normal"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {retailCollections.map((agents, index) => (
                      <tr key={index}>
                        <td>{agents.name}</td>
                        <td>{agents.Mobile_Number}</td>
                        <td>{agents.Email}</td>
                        <td>{agents.Location}</td>
                        <td>{agents.Quantity}</td>
                        <td
                          className={`
                      ${agents.Status === "Pending" ? "text-warning" : ""}
                      ${agents.Status === "In Progress" ? "text-black" : ""}
                      ${agents.Status === "Completed" ? "text-success" : ""}
                    `}
                        >
                          {agents.Status}
                        </td>

                        <td className="">
                          {agents.Status === "Pending" && (
                            <div className="bg-[#8F8F8F] text-white w-[120px] py-1 rounded-[10px] flex items-center justify-center">
                              Assign to me
                            </div>
                          )}
                          {agents.Status === "In Progress" && (
                            <div className="bg-[#50c100] text-white px-3 py-1 rounded-[10px] w-[120px] flex items-center justify-center">
                              Confirm
                            </div>
                          )}
                          {/* {agents.Status === "Completed" && 
                            <div className="bg-transparent text-transaparent px-3 py-1 w-full h-full rounded-[10px] flex items-center justify-center">
                             
                            </div>
                        } */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="flex items-center justify-between pl-5">
                  <p>
                    Page ({currentPage} of {totalPages}) {paymentData.length}{" "}
                    items
                  </p>
                  <Pagination className="custom-pagination">
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink
                        first
                        href="#"
                        onClick={() => setCurrentPage(1)}
                      />
                    </PaginationItem>
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink
                        previous
                        href="#"
                        onClick={() => setCurrentPage(currentPage - 1)}
                      />
                    </PaginationItem>
                    {[1, 2, 3, 4, 5].map((page) => (
                      <PaginationItem key={page} active={currentPage === page}>
                        <PaginationLink
                          href="#"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem disabled={currentPage === totalPages}>
                      <PaginationLink
                        next
                        href="#"
                        onClick={() => setCurrentPage(currentPage + 1)}
                      />
                    </PaginationItem>
                    <PaginationItem disabled={currentPage === totalPages}>
                      <PaginationLink
                        last
                        href="#"
                        onClick={() => setCurrentPage(totalPages)}
                      />
                    </PaginationItem>
                  </Pagination>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default LogCollection;
