// import { FormGroup, Input, Label } from "reactstrap";
// import { FiSearch } from "react-icons/fi";
// import { DatePicker } from "@mui/x-date-pickers";
// import { FaTrash } from "react-icons/fa";
// import { materialTypes } from "../../utils/dataset";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
// import { FaSquarePlus } from "react-icons/fa6";
import { FaPlus, FaDownload, FaCalendarAlt, FaTrash } from "react-icons/fa";
import {
  agentCollection,
  paymentData,
  retailCollections,
} from "../../utils/dataset";
import { Pagination, PaginationItem, PaginationLink, Table } from "reactstrap";

function LogCollection() {
  const [collectionType, setCollectionType] = useState("Agents");
  const totalPages = 5;
  const [currentPage, setCurrentPage] = useState(1);
  // const [materials, setMaterials] = useState([
  //   { id: 1, type: "", price: "", quantity: "", amount: "" },
  // ]);

  // const addMaterial = () => {
  //   setMaterials([
  //     ...materials,
  //     {
  //       id: materials.length + 1,
  //       type: "",
  //       price: "",
  //       quantity: "",
  //       amount: "",
  //     },
  //   ]);
  // };

  // const removeMaterial = (index) => {
  //   if (materials.length > 1) {
  //     setMaterials(materials.filter((_, i) => i !== index));
  //   }
  // };
  // const handleMaterialChange = (index, field, value) => {
  //   const updatedMaterials = materials.map((material, i) =>
  //     i === index ? { ...material, [field]: value } : material
  //   );
  //   setMaterials(updatedMaterials);
  // };
  return (
    <div className="px-[30px] py-[40px] w-full">
      <div className="flex flex-col">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-[20px] font-medium mb-[30px]">Collections</h1>
          <div className="flex items-center justify-center gap-2 bg-[#50CA00] py-[16px] px-[20px] text-white text-[16px] rounded-[10px]">
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
                    <th className="!text-[#8F8F8F] font-normal">Agent Name</th>
                    <th className="!text-[#8F8F8F] font-normal">
                      Material Type
                    </th>
                    <th className="!text-[#8F8F8F] font-normal">Assignee</th>
                    <th className="!text-[#8F8F8F] font-normal"></th>
                  </tr>
                </thead>
                <tbody>
                  {agentCollection.map((agents, index) => (
                    <tr key={index}>
                      <td>{agents.name}</td>
                      <td>{agents.material}</td>
                      <td>{agents.Assignee}</td>
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
                        {agents.Status === "Pending" && 
                            <div className="bg-[#8F8F8F] text-white w-[120px] py-1 rounded-[10px] flex items-center justify-center">
                              Assign to me
                            </div>
                        }
                        {agents.Status === "In Progress" && 
                            <div className="bg-[#50c100] text-white px-3 py-1 rounded-[10px] w-[120px] flex items-center justify-center">
                              Confirm
                            </div>
                        }
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
  );
}

export default LogCollection;
