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
import * as XLSX from "xlsx";
import { Pagination, PaginationItem, PaginationLink, Table } from "reactstrap";
import LogCollectionModal from "../../LogCollectionModal";
import { publicRequest } from "../../../requestMehod";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function LogCollection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [logmodal, setLogModal] = useState(false);
  const [totalPages1, setTotalPages1] = useState("");
  const [collections, setCollections] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const navigate = useNavigate();
  const [materialTypeSelection, setMaterialTypeSelection] = useState([]);
  const token = useSelector((state) => state?.user?.currentUser?.data.token);

  const toggle = () => {
    setLogModal(!logmodal);
  };

  const handleDownload = () => {
    if (!collections || collections.length === 0) {
      alert("No data available to download.");
      return;
    }

    // Table Headers
    const headers = [
      "Agent Name",
      "Date of Collection",
      "Prepayment",
      "Total Due",
    ];

    // Table Data (Extract and Format)
    const tableData = collections.map((collection) => [
      collection.agentName,
      collection.collectionDate,
      moneyFormat(collection.prepayment),
      moneyFormat(collection.totalDue),
    ]);

    // Combine Headers + Data
    const finalData = [headers, ...tableData];

    // Convert to worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(finalData);

    // Create a workbook and append sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Collections");

    // Save file
    XLSX.writeFile(workbook, "collections.xlsx");
  };

  const handleFetch = () => {
    getCollections(fromDate, toDate);
  };

  const getCollections = async (from, to) => {
    try {
      // Construct query parameters dynamically
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;

      const response = await publicRequest.get(`/admin_staff/get-collections`, {
        headers: { Authorization: `Bearer ${token}` },
        params, // Attach params to the request
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
      {logmodal && (
        <LogCollectionModal
          logmodal={logmodal}
          toggle={toggle}
          materialTypeSelection={materialTypeSelection}
          getCollections={getCollections}
        />
      )}
      <div className="px-[15px] lg:px-[30px] py-[40px] w-full">
        <div className="flex flex-col">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-[20px] font-medium lg:!mb-[30px]">
              Collections
            </h1>
            <div
              className="flex items-center justify-center gap-2 bg-[#50CA00] py-[16px] px-[20px] text-white text-[16px] rounded-[10px] cursor-pointer"
              onClick={toggle}
            >
              <FaPlus />
              <span>Log a Collection</span>
            </div>
          </div>
          <div className="flex justify-between  mb-[40px] mt-[20px] w-full">
            <div
              className="flex items-center justify-center w-[250px] gap-2 bg-[#EDEDED] py-[16px] px-[10px] text-black text-[16px] rounded-[10px] cursor-pointer"
              onClick={handleDownload}
            >
              <span className="text-[14px] font-bold">
                Download Collections
              </span>
              <FaDownload />
            </div>
          </div>

          <div className="w-full h-auto border-solid border-[1px] border-[#E9E9E9] rounded-[10px] lg:px-[30px] py-[22px] mb-[30px]">
            <>
              <div className="flex justify-end mb-5 gap-3 lg:pr-5">
                {/* <div className="flex items-center justify-start gap-3 w-[235px] h-[36px] rounded-[10px] border-solid border-[1px] pl-1 border-[#E9E9E9]">
                    <CiSearch className=" text-[#8F8F8F] " size={24} />
                    <input
                      type="text"
                      className="border-none outline-none w-[180px] text-[14px]"
                      placeholder="Search"
                    />
                  </div> */}
                <div className="w-[280px] lg:w-[335px] h-[36px] pl-3 flex items-center rounded-[10px] border-solid border-[1px] border-[#E9E9E9] dateRange">
                  <FaCalendarAlt size={20} className="text-[#50CA00]" />
                  <MobileDatePicker
                    className="w-[200px] text-[14px] cursor-pointer"
                    placeholder="mm/dd/yyyy"
                    onChange={(date) => setFromDate(date)}
                  />
                  <span>-</span>
                  <MobileDatePicker
                    className="cursor-pointer"
                    placeholder="mm/dd/yyyy"
                    onChange={(date) => setToDate(date)}
                  />
                  <button
                    onClick={handleFetch}
                    className="ml-2 bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Fetch
                  </button>
                </div>
              </div>
              <div className="overflow-scroll">
                <Table striped>
                  <thead>
                    <tr>
                      <th className="!text-[#8F8F8F] font-normal whitespace-nowrap">
                        Agent Name
                      </th>
                      <th className="!text-[#8F8F8F] font-normal whitespace-nowrap">
                        Date of Collection
                      </th>
                      <th className="!text-[#8F8F8F] font-normal whitespace-nowrap">
                        Prepayment
                      </th>
                      <th className="!text-[#8F8F8F] font-normal whitespace-nowrap">Total Due</th>
                      <th className="!text-[#8F8F8F] font-normal whitespace-nowrap"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {collections?.map((collection, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap">{collection.agentName}</td>
                        <td className="whitespace-nowrap">{collection.collectionDate}</td>
                        <td className="whitespace-nowrap">{moneyFormat(collection.prepayment)}</td>
                        <td className="whitespace-nowrap">{moneyFormat(collection.totalDue)}</td>
                        <td className="flex gap-[20px] items-center justify-center whitespace-nowrap">
                          {/* ✅ Navigate to collection details page */}
                          <p
                            className="underline mb-0 cursor-pointer text-blue-500 hover:text-blue-700"
                            onClick={() =>
                              navigate(`/log-collection/${collection.id}`)
                            }
                          >
                            View
                          </p>
                          <FaTrash className="fill-red-600 cursor-pointer" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between pl-5">
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

export default LogCollection;
