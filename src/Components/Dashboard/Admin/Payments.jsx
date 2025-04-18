import { useEffect, useState } from "react";
//import Table from "@mui/material/Table";
import { Pagination, PaginationItem, PaginationLink, Table } from "reactstrap";
import { CiSearch } from "react-icons/ci";
import { FaCalendarAlt } from "react-icons/fa";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { publicRequest } from "../../../requestMehod";
import { useSelector } from "react-redux";

function PaymentsAdmin() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages1, setTotalPages1] = useState("");
  const [transactions, setTransactions] = useState([])
  const token = useSelector((state) => state?.user?.currentUser?.data.token);

  const getTransactions = async () => {
    try {
      const response = await publicRequest.get(`/transactions/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data?.data?.result;
      setTransactions(data);
      setTotalPages1(response?.data?.data)
      console.log(data);
    } catch (error) {
      console.log(error);
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
    getTransactions();
  }, []);

  return (
    <div className="px-[30px] py-[40px] w-full">
      <div className="flex flex-col">
        <h1 className="text-[20px] font-medium mb-[30px]">Transactions</h1>
        <div className="min-w-[100%] h-auto border-solid border-[1px] border-[#E9E9E9] rounded-[10px] py-[55px] mb-[30px]">
          <div className="flex flex-col lg:flex-row justify-end mb-5 gap-3 pr-5">
            <div className="flex items-center justify-start gap-3 w-[235px] h-[36px] rounded-[10px] border-solid border-[1px] pl-1 border-[#E9E9E9]">
              <CiSearch className=" text-[#8F8F8F] " size={24} />
              <input
                type="text"
                className="border-none outline-none w-[180px] text-[14px]"
                placeholder="Search"
              />
            </div>
            <div className="lw-full g:w-[335px] h-[36px] pl-3 flex items-center rounded-[10px] border-solid border-[1px] border-[#E9E9E9] dateRange">
              <FaCalendarAlt size={20} className="text-[#50CA00]" />
              <MobileDatePicker
                className="w-[200px] text-[14px]"
                placeholder="mm/dd/yyyy"
              />
              <span>-</span>
              <MobileDatePicker className="" />
            </div>
          </div>
          <div className="w-[100%] overflow-x-auto">
          <Table striped >
            <thead>
              <tr className="!text-[#8F8F8F]">
                <th className="!text-[#8F8F8F] whitespace-nowrap">Recipient</th>
                <th className="!text-[#8F8F8F] whitespace-nowrap">Activity</th>
                <th className="!text-[#8F8F8F] whitespace-nowrap">Opening Balance</th>
                <th className="!text-[#8F8F8F] whitespace-nowrap">Closing Balance</th>
                <th className="!text-[#8F8F8F] whitespace-nowrap">Bank</th>
                <th className="!text-[#8F8F8F] whitespace-nowrap">Account Number</th>
                <th className="!text-[#8F8F8F] whitespace-nowrap">Currency</th>
                <th className="!text-[#8F8F8F] whitespace-nowrap">Amount</th>
                <th className="!text-[#8F8F8F] whitespace-nowrap">Direction</th>
                <th className="!text-[#8F8F8F] whitespace-nowrap">Remarks</th>
                <th className="!text-[#8F8F8F] whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.map((payment, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap">{payment.Recipient || payment.Name}</td>
                  <td className="whitespace-nowrap">{payment.Activity}</td>
                  <td className="whitespace-nowrap">{moneyFormat(payment.openingBalance)}</td>
                  <td className="whitespace-nowrap">{moneyFormat(payment.closingBalance)}</td>
                  <td className="whitespace-nowrap">{payment.recipientBank || 'N/A'}</td>
                  <td className="whitespace-nowrap">{payment.AccountNumber || 'N/A'}</td>
                  <td className="whitespace-nowrap">{payment.Currency || 'N/A'}</td>
                  <td className="whitespace-nowrap">{moneyFormat(payment.transactionAmount) || 'N/A'}</td>
                  <td className="whitespace-nowrap">{payment.Direction || 'N/A'}</td>
                  <td className="whitespace-nowrap">{payment.remarks || 'N/A'}</td>
                  <td
                    className={`
                ${payment.Status === "SUCCESSFUL" ? "text-success" : ""}
                ${payment.Status === "PENDING" ? "text-warning" : ""}
                ${payment.Status === "PROCESSING" ? "text-warning" : ""}
                ${payment.Status === "REJECTED" ? "text-danger" : ""}
              `}
                  >
                    {payment.Status}
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
        </div>
      </div>
    </div>
  );
}

export default PaymentsAdmin;
