import { MobileDatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaCalendarAlt, FaTrash } from "react-icons/fa";
import { Pagination, PaginationItem, PaginationLink, Table } from "reactstrap";
import { paymentData, retailCollections } from "../../utils/dataset";
import { publicRequest } from "../../requestMehod";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function Pickups() {
  const [pickupType, setPickupType] = useState("Pending");
  const token = useSelector((state) => state?.user?.currentUser?.data.token);
  const [currentPage, setCurrentPage] = useState(1);
  const [pickups, setPickups] = useState([]);
  const [assignToMe, setAssignToMe] = useState([]);
  const [pickupsCompleted, setPickupsCompleted] = useState([]);
  const [totalPages1, setTotalPages1] = useState("");
  const [totalPages2, setTotalPages2] = useState("");
 


  const getPickUps = async () => {
    try {
      const response = await publicRequest.get(
        `/admin_staff/get-pickups?status=initiated_pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response?.data?.data?.result;
      setPickups(data);
      setTotalPages1(response?.data?.data);
      console.log(totalPages1);
    } catch (error) {
      console.log(error);
    }
  };

  const assignPickuptoMe = async (userId) => {
    try {
      const url = `admin_staff/assign-pickup/${userId}`;
      const response = await publicRequest.patch(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssignToMe(response?.data?.message);
      toast.success(assignToMe);
    } catch (error) {
      setAssignToMe(error?.response?.data?.message);
      toast.error(assignToMe);
    }
  };

  const getPickUpsCompleted = async () => {
    try {
      const response = await publicRequest.get(
        `/admin_staff/get-pickups?status=completed`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response?.data?.data?.result;
      setPickupsCompleted(data);
      setTotalPages2(response?.data?.data);
      console.log(totalPages1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPickUps();
    getPickUpsCompleted();
  }, []);
  return (
    <div className="px-[30px] py-[40px] w-full">
      <div className="flex flex-col">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-[20px] font-medium mb-[30px]">Pickups</h1>
        </div>
        <div className="w-full h-[1px] bg-[#E9E9E9]"></div>
        <div className="flex justify-between  mb-[40px] mt-[30px] w-full">
          <div className="flex w-full gap-[20px]">
            <span
              className={`w-[125px] h-[55px] rounded-[10px] flex items-center justify-center cursor-pointer ${
                pickupType === "Pending"
                  ? "bg-[#50CA00] text-white"
                  : "bg-[#EDEDED] text-black"
              }`}
              onClick={() => setPickupType("Pending")}
            >
              Pending
            </span>

            <span
              className={`w-[125px] h-[55px] rounded-[10px] flex items-center justify-center cursor-pointer ${
                pickupType === "Completed"
                  ? "bg-[#50CA00] text-white"
                  : "bg-[#EDEDED] text-black"
              }`}
              onClick={() => setPickupType("Completed")}
            >
              Completed
            </span>
          </div>
        </div>
        <div className="w-full h-auto border-solid border-[1px] border-[#E9E9E9] rounded-[10px] px-[30px] py-[22px] mb-[30px]">
          {pickupType === "Pending" && (
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
                    <th className="!text-[#8F8F8F] font-normal">Quantity</th>
                    <th className="!text-[#8F8F8F] font-normal">
                      Collector Name
                    </th>
                    <th className="!text-[#8F8F8F] font-normal">
                      Pickup Location
                    </th>
                    <th className="!text-[#8F8F8F] font-normal">Status</th>
                    <th className="!text-[#8F8F8F] font-normal">
                      Remarks/Notes
                    </th>
                    <th className="!text-[#8F8F8F] font-normal"></th>
                  </tr>
                </thead>
                <tbody>
                  {pickups?.map((pickup, id) => (
                    <tr key={id}>
                      <td>{pickup.quantity}</td>
                      <td>{pickup.assignedName || "None"}</td>
                      <td>{pickup.address}</td>
                      <td>{pickup.status}</td>
                      <td>{pickup.remarks || "None"}</td>
                      <td
                        className="flex gap-[29px] items-center justify-center cursor-pointer"
                        onClick={() => assignPickuptoMe(pickup.id)}
                      >
                        <span className="bg-[#8F8F8F] text-white px-2 py-1 rounded-[10px]">
                          Assign to me
                        </span>
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
          {pickupType === "Completed" && (
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
                      Material Type
                    </th>
                    <th className="!text-[#8F8F8F] font-normal">Quantity</th>
                    <th className="!text-[#8F8F8F] font-normal">
                      Collector Name
                    </th>
                    <th className="!text-[#8F8F8F] font-normal">
                      Pickup Location
                    </th>
                    <th className="!text-[#8F8F8F] font-normal">Status</th>
                    <th className="!text-[#8F8F8F] font-normal">
                      Remarks/Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pickupsCompleted.map((pickup, id) => (
                    <tr key={id}>
                      <td>{pickup.materials || "Not available"}</td>
                      <td>{pickup.quantity}</td>
                      <td>{pickup.assignedName}</td>
                      <td>{pickup.Location}</td>
                      <td>{pickup.status}</td>
                      <td>{pickup.remarks || "Not available"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {totalPages2?.totalItems > 0 && (
              <div className="flex items-center justify-between pl-5">
                <p>
                  Page ({totalPages2?.currentPage} of {totalPages2?.totalPages}) {totalPages2?.totalItems}{" "}
                  items
                </p>
                <Pagination className="custom-pagination">
                  {/* First Page */}
                  <PaginationItem disabled={totalPages2?.currentPage === 1}>
                    <PaginationLink
                      first
                      href="#"
                      onClick={() => setCurrentPage(1)}
                    />
                  </PaginationItem>

                  {/* Previous Page */}
                  <PaginationItem disabled={totalPages2?.currentPage === 1}>
                    <PaginationLink
                      previous
                      href="#"
                      onClick={() =>
                        setCurrentPage(totalPages2?.currentPage - 1)
                      }
                    />
                  </PaginationItem>

                  {/* Dynamic Page Numbers */}
                  {[...Array(totalPages2?.totalPages || 1)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <PaginationItem
                        key={page}
                        active={totalPages2?.currentPage === page}
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
                      totalPages2?.currentPage === totalPages2?.totalPages
                    }
                  >
                    <PaginationLink
                      next
                      href="#"
                      onClick={() =>
                        setCurrentPage(totalPages2?.currentPage + 1)
                      }
                    />
                  </PaginationItem>

                  {/* Last Page */}
                  <PaginationItem
                    disabled={
                      totalPages2?.currentPage === totalPages2?.totalPages
                    }
                  >
                    <PaginationLink
                      last
                      href="#"
                      onClick={() => setCurrentPage(totalPages2?.totalPages)}
                    />
                  </PaginationItem>
                </Pagination>
              </div>
              )}
            </>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default Pickups;
