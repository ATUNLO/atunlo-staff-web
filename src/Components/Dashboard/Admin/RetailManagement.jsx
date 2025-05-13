import { MobileDatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaCalendarAlt } from "react-icons/fa";
import { Pagination, PaginationItem, PaginationLink, Spinner, Table } from "reactstrap";
import { publicRequest } from "../../../requestMehod";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function RetailManagement() {
  const [retailers, setRetailers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPagesInfo, setTotalPagesInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();
  const token = useSelector((state) => state?.user?.currentUser?.data.token);

  const getRetailers = async () => {
    setLoading(true)
    try {
      const response = await publicRequest.get(
        `/admin/list/staff?type=retail&page=${currentPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data?.data?.result;
      setRetailers(data);
      setTotalPagesInfo(response?.data?.data);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching retailers:", error);
      setLoading(false)
    }
  };

  useEffect(() => {
    if (token) {
      getRetailers(currentPage);
    }
  }, [currentPage, token]);

  const filteredRetailers = retailers.filter((staffMember) => {
    const search = searchText.toLowerCase();
    return Object.values(staffMember).some((val) =>
      val?.toString().toLowerCase().includes(search)
    );
  });

  return (
    <div className="px-[30px] py-[40px] w-full">
      <div className="flex flex-col">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-[20px] font-medium mb-[30px]">Retailers</h1>
        </div>
        <div className="w-full h-[1px] bg-[#e9e9e9] mt-[20px]"></div>

        <div className="w-full h-auto border-solid border-[1px] border-[#E9E9E9] rounded-[10px] px-[30px] py-[22px] mb-[30px]">
          <div className="flex flex-col lg:flex-row justify-end mb-5 gap-3 pr-5">
            <div className="flex items-center justify-start gap-3 w-[235px] h-[36px] rounded-[10px] border-solid border-[1px] pl-1 border-[#E9E9E9]">
              <CiSearch className="text-[#8F8F8F]" size={24} />
              <input
                type="text"
                className="border-none outline-none w-[180px] text-[14px]"
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div className="w-full lg:w-[335px] h-[36px] pl-3 flex items-center rounded-[10px] border-solid border-[1px] border-[#E9E9E9] dateRange">
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
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Spinner color="success" />
              </div>
            ) : (
              <Table striped>
                <thead>
                  <tr>
                    <th className="!text-[#8F8F8F] font-normal">Name</th>
                    <th className="!text-[#8F8F8F] font-normal">
                      Mobile Number
                    </th>
                    <th className="!text-[#8F8F8F] font-normal">Email</th>
                    <th className="!text-[#8F8F8F] font-normal">Status</th>
                    <th className="!text-[#8F8F8F] font-normal"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRetailers?.map((retailer, id) => (
                    <tr key={id} className="cursor-pointer">
                      <td>{retailer.name}</td>
                      <td>{retailer.phone}</td>
                      <td>{retailer.emailaddress}</td>
                      <td>{retailer.userStatus}</td>
                      <td>
                        <span
                          className="w-[92px] h-[36px] bg-[#50CA00] text-white py-[7px] px-[30px] rounded-[10px]"
                          onClick={() =>
                            navigate(`/retail-management/${retailer.id}`)
                          }
                        >
                          View
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between pl-5">
            <p>
              Page ({totalPagesInfo?.currentPage} of{" "}
              {totalPagesInfo?.totalPages}) {totalPagesInfo?.totalItems} items
            </p>
            <Pagination className="custom-pagination">
              <PaginationItem disabled={totalPagesInfo?.currentPage === 1}>
                <PaginationLink
                  first
                  href="#"
                  onClick={() => setCurrentPage(1)}
                />
              </PaginationItem>

              <PaginationItem disabled={totalPagesInfo?.currentPage === 1}>
                <PaginationLink
                  previous
                  href="#"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                />
              </PaginationItem>

              {[...Array(totalPagesInfo?.totalPages || 1)].map((_, index) => {
                const page = index + 1;
                return (
                  <PaginationItem
                    key={page}
                    active={totalPagesInfo?.currentPage === page}
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

              <PaginationItem
                disabled={
                  totalPagesInfo?.currentPage === totalPagesInfo?.totalPages
                }
              >
                <PaginationLink
                  next
                  href="#"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPagesInfo?.totalPages)
                    )
                  }
                />
              </PaginationItem>

              <PaginationItem
                disabled={
                  totalPagesInfo?.currentPage === totalPagesInfo?.totalPages
                }
              >
                <PaginationLink
                  last
                  href="#"
                  onClick={() =>
                    setCurrentPage(totalPagesInfo?.totalPages || 1)
                  }
                />
              </PaginationItem>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RetailManagement;
