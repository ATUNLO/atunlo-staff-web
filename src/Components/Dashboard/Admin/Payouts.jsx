import { useEffect, useState } from "react";
//import Table from "@mui/material/Table";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  Spinner,
  Table,
} from "reactstrap";
import { CiSearch } from "react-icons/ci";
import { FaCalendarAlt } from "react-icons/fa";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { publicRequest } from "../../../requestMehod";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function PayoutsAdmin() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages1, setTotalPages1] = useState("");
  const [payoutType, setPayoutType] = useState("Pending");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [updatePayout, setUpdatePayout] = useState([]);
  const [reference, setReference] = useState("");
  const token = useSelector((state) => state?.user?.currentUser?.data.token);

  function formatDateTime(isoString) {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  const getTransactions = async (
    reference = "",
    fromDate = null,
    toDate = null
  ) => {
    setLoading(true);
    try {
      const params = {};

      // Add reference if it exists
      if (reference.trim()) {
        params.reference = reference.trim();
      }

      // Add date range if both dates are provided
      if (fromDate && toDate) {
        params.from = fromDate;
        params.to = toDate;
      } else if (!reference.trim()) {
        // If no reference and no date range, add status
        params.status = payoutType === "Pending" ? "initiated" : "all";
      }

      const response = await publicRequest.get(`admin/get/payouts`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      const data = response.data?.data?.result;
      setTransactions(data);
      setTotalPages1(response?.data?.data);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updatePayoutAdmin = async (status, payoutId) => {
    try {
      const url = `/admin/update/payout`;
      const response = await publicRequest.patch(
        url,
        {
          status,
          payoutId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUpdatePayout(response?.data?.message);
      toast.success(response?.data?.message || "Payout updated");
      getTransactions();
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || "Failed to update payout";
      setUpdatePayout(errMsg);
      toast.error(errMsg);
    }
  };

  const handleSearchClick = () => {
    const formattedFromDate = fromDate ? fromDate.toISOString() : null;
    const formattedToDate = toDate ? toDate.toISOString() : null;
    getTransactions(reference.trim(), formattedFromDate, formattedToDate);
  };

  const moneyFormat = (value) => {
    if (value === "" || value === null || value === undefined) return "";

    // Ensure it's a valid number before formatting
    const number = Number(value);
    if (isNaN(number)) return "₦0"; // Prevent NaN issues

    return `₦${number.toLocaleString("en-US")}`;
  };

  useEffect(() => {
    getTransactions();
  }, [payoutType]);

  return (
    <div className="px-[30px] py-[40px] w-full">
      <div className="flex flex-col">
        <h1 className="text-[20px] font-medium mb-[30px]">Payouts</h1>
        <div className="min-w-[100%] h-auto border-solid border-[1px] border-[#E9E9E9] rounded-[10px] py-[55px] mb-[30px]">
          <div className="flex flex-col lg:flex-row justify-end lg:justify-start mb-5 gap-3 lg:pl-5 pr-5">
            {/* Reference Search */}
            <div className="flex items-center justify-start gap-3 w-[235px] lg:min-w-[315px] h-[36px] rounded-[10px] border-solid border-[1px] pl-1 border-[#E9E9E9]">
              <CiSearch className="text-[#8F8F8F]" size={24} />
              <input
                type="text"
                className="border-none outline-none w-[180px] text-[14px]"
                placeholder="Search Transactions"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>

            {/* Date Range Picker */}
            <div className="w-full lg:w-[335px] h-[36px] pl-3 flex items-center rounded-[10px] border-solid border-[1px] border-[#E9E9E9] dateRange">
              <FaCalendarAlt size={20} className="text-[#50CA00]" />
              <MobileDatePicker
                className="w-[200px] text-[14px]"
                placeholder="mm/dd/yyyy"
                value={fromDate}
                onChange={(date) => setFromDate(date)} // Update fromDate
              />
              <span>-</span>
              <MobileDatePicker
                className="w-[200px] text-[14px]"
                value={toDate}
                onChange={(date) => setToDate(date)} // Update toDate
              />
            </div>

            {/* Single Search Button */}
            <button
              onClick={handleSearchClick}
              className="px-3 py-1 bg-[#50c100] text-white text-sm rounded-lg"
            >
              Search
            </button>
          </div>

          <div className="flex justify-between  mb-[40px] mt-[30px] ml-[50px] w-full">
            <div className="flex w-full gap-[20px]">
              <span
                className={`w-[125px] h-[55px] rounded-[10px] flex items-center justify-center cursor-pointer ${
                  payoutType === "Pending"
                    ? "bg-[#50CA00] text-white"
                    : "bg-[#EDEDED] text-black"
                }`}
                onClick={() => setPayoutType("Pending")}
              >
                Pending
              </span>

              <span
                className={`w-[125px] h-[55px] rounded-[10px] flex items-center justify-center cursor-pointer ${
                  payoutType === "Completed"
                    ? "bg-[#50CA00] text-white"
                    : "bg-[#EDEDED] text-black"
                }`}
                onClick={() => setPayoutType("Completed")}
              >
                Completed
              </span>
            </div>
          </div>
          {payoutType === "Pending" && (
            <>
              <div className="w-[100%] overflow-scroll">
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <Spinner color="success" />
                  </div>
                ) : (
                  <Table striped>
                    <thead>
                      <tr className="!text-[#8F8F8F]">
                        <th className="!text-[#8F8F8F] whitespace-nowrap">
                          Recipient
                        </th>
                        <th className="!text-[#8F8F8F] whitespace-nowrap">
                          Reference
                        </th>
                        <th className="!text-[#8F8F8F] whitespace-nowrap">
                          Account Number
                        </th>
                        <th className="!text-[#8F8F8F] whitespace-nowrap">
                          Bank
                        </th>
                        <th className="!text-[#8F8F8F] whitespace-nowrap">
                          Account Number
                        </th>
                        <th className="!text-[#8F8F8F] whitespace-nowrap">
                          Amount
                        </th>
                        <th className="!text-[#8F8F8F] whitespace-nowrap">
                          Transaction Date
                        </th>
                        <th className="!text-[#8F8F8F] whitespace-nowrap">
                          Remarks
                        </th>
                        <th className="!text-[#8F8F8F] whitespace-nowrap">
                          Status
                        </th>
                        <th className="!text-[#8F8F8F] whitespace-nowrap"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions?.map((payment, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap">
                            {payment.AccountName}
                          </td>
                          <td className="whitespace-nowrap">
                            {payment.reference}
                          </td>
                          <td className="whitespace-nowrap">
                            {payment.AccountNumber}
                          </td>
                          <td className="whitespace-nowrap">
                            {payment.recipientBank || "N/A"}
                          </td>
                          <td className="whitespace-nowrap">
                            {payment.AccountNumber || "N/A"}
                          </td>
                          <td className="whitespace-nowrap">
                            {moneyFormat(payment.Amount) || "N/A"}
                          </td>
                          <td className="whitespace-nowrap">
                            {formatDateTime(payment.createdAt) || "N/A"}
                          </td>
                          <td
                            className="whitespace-nowrap"
                            title={payment.remarks}
                          >
                            {payment.remarks
                              ? payment.remarks.length > 20
                                ? `${payment.remarks.slice(0, 20)}...`
                                : payment.remarks
                              : "N/A"}
                          </td>
                          <td
                            className={`
                ${payment.status === "SUCCESSFUL" ? "text-success" : ""}
                ${payment.status === "PENDING" ? "text-warning" : ""}
                ${payment.status === "INITIATED" ? "text-warning" : ""}
                ${payment.status === "PROCESSING" ? "text-warning" : ""}
                ${payment.status === "REVERSED" ? "text-warning" : ""}
                ${payment.status === "REJECTED" ? "text-danger" : ""}
              `}
                          >
                            {payment.status}
                          </td>
                          <td className="whitespace-nowrap">
                            {payment.status === "INITIATED" ? (
                              <div className="flex gap-3">
                                <span
                                  className="bg-green-500 text-white px-3 py-1 rounded-md cursor-pointer"
                                  onClick={() =>
                                    updatePayoutAdmin("approve", payment.id)
                                  }
                                >
                                  Approve
                                </span>
                                <span
                                  className="bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer"
                                  onClick={() =>
                                    updatePayoutAdmin("reject", payment.id)
                                  }
                                >
                                  Deny
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
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
          )}
          {payoutType === "Completed" && (
            <>
              <div className="w-[100%] overflow-scroll">
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <Spinner color="success" />
                  </div>
                ) : (
                  <Table striped>
                    <thead>
                      <tr className="!text-[#8F8F8F]">
                        <th className="!text-[#8F8F8F] whitespace-nowrap">
                          Recipient
                        </th>
                        <th className="!text-[#8F8F8F] whitespace-nowrap">
                          Reference
                        </th>
                        <th className="!text-[#8F8F8F] whitespace-nowrap">
                          Account Number
                        </th>
                        <th className="!text-[#8F8F8F] whitespace-nowrap">
                          Bank
                        </th>
                        <th className="!text-[#8F8F8F] whitespace-nowrap">
                          Account Number
                        </th>
                        <th className="!text-[#8F8F8F] whitespace-nowrap">
                          Amount
                        </th>
                        <th className="!text-[#8F8F8F] whitespace-nowrap">
                          Transaction Date
                        </th>
                        <th className="!text-[#8F8F8F] whitespace-nowrap">
                          Remarks
                        </th>
                        <th className="!text-[#8F8F8F] whitespace-nowrap">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions?.map((payment, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap">
                            {payment.AccountName}
                          </td>
                          <td className="whitespace-nowrap">
                            {payment.reference}
                          </td>
                          <td className="whitespace-nowrap">
                            {payment.AccountNumber}
                          </td>
                          <td className="whitespace-nowrap">
                            {payment.recipientBank || "N/A"}
                          </td>
                          <td className="whitespace-nowrap">
                            {payment.AccountNumber || "N/A"}
                          </td>
                          <td className="whitespace-nowrap">
                            {moneyFormat(payment.Amount) || "N/A"}
                          </td>
                          <td className="whitespace-nowrap">
                            {formatDateTime(payment.createdAt) || "N/A"}
                          </td>
                          <td
                            className="whitespace-nowrap"
                            title={payment.remarks}
                          >
                            {payment.remarks
                              ? payment.remarks.length > 20
                                ? `${payment.remarks.slice(0, 20)}...`
                                : payment.remarks
                              : "N/A"}
                          </td>
                          <td
                            className={`
                ${payment.status === "SUCCESSFUL" ? "text-success" : ""}
                ${payment.status === "PENDING" ? "text-warning" : ""}
                ${payment.status === "INITIATED" ? "text-warning" : ""}
                ${payment.status === "PROCESSING" ? "text-warning" : ""}
                ${payment.status === "REVERSED" ? "text-warning" : ""}
                ${payment.status === "REJECTED" ? "text-danger" : ""}
              `}
                          >
                            {payment.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
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
          )}
        </div>
      </div>
    </div>
  );
}

export default PayoutsAdmin;
