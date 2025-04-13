import { useEffect, useState } from "react";
//import Table from "@mui/material/Table";
import { Pagination, PaginationItem, PaginationLink, Table } from "reactstrap";
import { CiSearch } from "react-icons/ci";
import { FaCalendarAlt } from "react-icons/fa";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { paymentData } from "../../../utils/dataset";
import { publicRequest } from "../../../requestMehod";
import { useSelector } from "react-redux";

function Payments() {
  const totalPages = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages1, setTotalPages1] = useState("");
  const [transactionData, setTransactionData] = useState([]);
  const token = useSelector((state) => state?.user?.currentUser?.data?.token);

  const getTransactions = async () => {
    try {
      const response = await publicRequest.get(`/admin_staff/get-payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data?.data?.result;
      setTransactionData(data);
      setTotalPages1(response?.data?.data);
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
        <h1 className="text-[20px] font-medium mb-[30px]">Payments</h1>
        <div className="w-full h-auto border-solid border-[1px] border-[#E9E9E9] rounded-[10px] py-[55px] mb-[30px]">
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
              <tr className="!text-[#8F8F8F]">
                <th className="!text-[#8F8F8F] nowrap">Name</th>
                <th className="!text-[#8F8F8F] nowrap">Date</th>
                <th className="!text-[#8F8F8F]">Bank</th>
                <th className="!text-[#8F8F8F]">Account No</th>
                <th className="!text-[#8F8F8F]">Total Due</th>
                <th className="!text-[#8F8F8F]">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactionData?.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.name}</td>
                  <td>{payment.collectionDate}</td>
                  <td>{payment.bankName}</td>
                  <td>{payment.accountNo}</td>
                  <td>{moneyFormat(payment.totalDue)}</td>
                  <td
                    className={`
                ${payment.status === "SUCCESSFUL" ? "text-success" : ""}
                ${payment.status === "PENDING" ? "text-warning" : ""}
                ${payment.status === "INITIATED" ? "text-warning" : ""}
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
        </div>
      </div>
    </div>
  );
}

export default Payments;
