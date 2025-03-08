import { useState } from "react";
//import Table from "@mui/material/Table";
import { Pagination, PaginationItem, PaginationLink, Table } from "reactstrap";
import { CiSearch } from "react-icons/ci";
import { FaCalendarAlt } from "react-icons/fa";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { paymentData } from "../../utils/dataset";

function Payments() {
  const totalPages = 5;
  const [currentPage, setCurrentPage] = useState(1);
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
          <Table striped >
            <thead>
              <tr className="!text-[#8F8F8F]">
                <th className="!text-[#8F8F8F]">Name</th>
                <th className="!text-[#8F8F8F]">Date</th>
                <th className="!text-[#8F8F8F]">Material</th>
                <th className="!text-[#8F8F8F]">Bank</th>
                <th className="!text-[#8F8F8F]">Account No</th>
                <th className="!text-[#8F8F8F]">Total Due</th>
                <th className="!text-[#8F8F8F]">Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentData.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.name}</td>
                  <td>{payment.date}</td>
                  <td>{payment.material}</td>
                  <td>{payment.bank}</td>
                  <td>{payment.account_no}</td>
                  <td>{payment.total_due}</td>
                  <td
                    className={`
                ${payment.status === "Approved" ? "text-success" : ""}
                ${payment.status === "Pending" ? "text-warning" : ""}
                ${payment.status === "Denied" ? "text-danger" : ""}
              `}
                  >
                    {payment.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="flex items-center justify-between pl-5">
            <p>Page ({currentPage} of {totalPages}) {paymentData.length} items</p>
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
                  <PaginationLink href="#" onClick={() => setCurrentPage(page)}>
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
        </div>
      </div>
    </div>
  );
}

export default Payments;
