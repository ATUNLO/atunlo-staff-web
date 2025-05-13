import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import {
  FaPlus,
  FaDownload,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Spinner,
} from "reactstrap";
import { publicRequest } from "../../../requestMehod";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RiEditFill } from "react-icons/ri";
import OnboardAgentModal from "./OnboardAgentModal";
import * as XLSX from "xlsx";
import EditAgentModal from "./EditAgentModal";
import DeleteAgentModal from "./DeleteAgentModal";
import { toast } from "react-toastify";

function AgentManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [logmodal, setLogModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [editAgentModal, setEditAgentModal] = useState(false);
  const [totalPages1, setTotalPages1] = useState("");
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [singleAgent, setSingleAgent] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);
  const navigate = useNavigate();
  const [materialTypeSelection, setMaterialTypeSelection] = useState([]);
  const token = useSelector((state) => state?.user?.currentUser?.data.token);

  const toggle = () => setLogModal(!logmodal);

  const handleDeleteAgent = async () => {
    try {
      await publicRequest.delete(`/admin/delete/agent/${agentToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Agent deleted successfully");
      setDeleteModalOpen(false);
      setAgentToDelete(null);
      getAgents(); // Refresh agent list
    } catch (error) {
      toast.error("Failed to delete agent. Please try again.");
      console.error("Delete error:", error);
    }
  };

  const toggleAgentModal = () => setEditAgentModal(!editAgentModal);

  const handleDownload = () => {
    if (!agents || agents.length === 0) return;

    const formattedData = agents.map((agent) => ({
      Name: agent.fullName || "",
      Location: agent?.state?.name || "",
      Address: agent.address || "",
      "Bank Name": agent.bankName || "",
      "Account Number": agent.accountNumber || "",
      "Phone Number": agent.phoneNumber || "",
      "Assign To": agent.assignTo || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Agents");
    XLSX.writeFile(workbook, "AgentDetails.xlsx");
  };

  const getAgents = async () => {
    setLoading(true);
    try {
      const response = await publicRequest.get(`/admin/list/agents`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data?.data?.result;
      setAgents(data);
      setTotalPages1(response?.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getSingleAgent = async (id) => {
    try {
      const response = await publicRequest.get(`/admin/agent-details/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data?.data?.agent;
      setSingleAgent(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditModal = async (id) => {
    setSelectedAgentId(id);
    getSingleAgent(id);
    toggleAgentModal();
  };

  const getMaterialType = async () => {
    try {
      const response = await publicRequest.get(`/misc/material-types`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data?.data;
      setMaterialTypeSelection(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAgents();
    getMaterialType();
  }, []);

  // Filter agents on search
  useEffect(() => {
    const filtered = agents.filter((agent) =>
      [agent.fullName, agent.phoneNumber, agent.state?.name]
        .some((field) => field?.toLowerCase().includes(searchText.toLowerCase()))
    );
    setFilteredAgents(filtered);
  }, [searchText, agents]);

  return (
    <>
      {logmodal && (
        <OnboardAgentModal
          logmodal={logmodal}
          toggle={toggle}
          getAgents={getAgents}
          token={token}
        />
      )}
      {editAgentModal && (
        <EditAgentModal
          editAgentModal={editAgentModal}
          singleAgent={singleAgent}
          id={selectedAgentId}
          toggleAgentModal={toggleAgentModal}
          getAgents={getAgents}
        />
      )}
      <DeleteAgentModal
        isOpen={deleteModalOpen}
        toggle={() => setDeleteModalOpen(false)}
        onDelete={handleDeleteAgent}
      />

      <div className="px-[15px] lg:px-[30px] py-[40px] w-full">
        <div className="flex flex-col">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-[16px] lg:text-[20px] font-medium lg:mb-[30px]">
              Agent Management
            </h1>
            <div
              className="flex items-center justify-center gap-2 bg-[#50CA00] py-[10px] lg:py-[16px] px-[20px] text-white text-[16px] rounded-[10px] cursor-pointer"
              onClick={toggle}
            >
              <FaPlus />
              <span className="text-[16px]">Onboard Agent</span>
            </div>
          </div>

          <div className="flex justify-between mb-[40px] mt-[20px] w-full">
            <div
              className="flex items-center justify-center w-[250px] gap-2 bg-white border border-[#e9e9e9] py-[10px] lg:py-[16px] lg:px-[10px] text-[#50CA00] text-[16px] rounded-[10px] cursor-pointer"
              onClick={handleDownload}
            >
              <FaDownload />
              <span className="text-[14px] font-bold">Download Agent Details</span>
            </div>
          </div>

          <div className="w-full h-auto border border-[#E9E9E9] rounded-[10px] px-[30px] py-[22px] mb-[30px]">
            <>
              <div className="flex flex-col lg:flex-row justify-end items-start mb-5 gap-3 lg:pr-5">
                <div className="flex items-center gap-3 w-[235px] h-[36px] rounded-[10px] border border-[#E9E9E9] pl-1">
                  <CiSearch className="text-[#8F8F8F]" size={24} />
                  <input
                    type="text"
                    className="border-none outline-none w-full text-[14px]"
                    placeholder="Search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full overflow-x-scroll">
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <Spinner color="success" />
                  </div>
                ) : (
                  <Table striped>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Address</th>
                        <th>Bank Name</th>
                        <th>Account Number</th>
                        <th>Phone Number</th>
                        <th>Assign To</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAgents?.map((agent, index) => (
                        <tr key={index} className="cursor-pointer">
                          <td>{agent.fullName}</td>
                          <td>{agent.state?.name}</td>
                          <td>{agent.address}</td>
                          <td>{agent.bankName}</td>
                          <td>{agent.accountNumber}</td>
                          <td>{agent.phoneNumber}</td>
                          <td>{agent.assignTo || "N/A"}</td>
                          <td>
                            <div className="flex gap-[20px] items-center justify-center">
                              <FaEye
                                onClick={() => navigate(`/agent-management/${agent.id}`)}
                              />
                              <RiEditFill onClick={() => handleEditModal(agent.id)} />
                              <FaTrash
                                className="fill-red-600 cursor-pointer"
                                onClick={() => {
                                  setAgentToDelete(agent.id);
                                  setDeleteModalOpen(true);
                                }}
                              />
                            </div>
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
                  <PaginationItem disabled={totalPages1?.currentPage === 1}>
                    <PaginationLink first href="#" onClick={() => setCurrentPage(1)} />
                  </PaginationItem>
                  <PaginationItem disabled={totalPages1?.currentPage === 1}>
                    <PaginationLink
                      previous
                      href="#"
                      onClick={() => setCurrentPage(totalPages1?.currentPage - 1)}
                    />
                  </PaginationItem>
                  {[...Array(totalPages1?.totalPages || 1)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <PaginationItem
                        key={page}
                        active={totalPages1?.currentPage === page}
                      >
                        <PaginationLink href="#" onClick={() => setCurrentPage(page)}>
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem
                    disabled={totalPages1?.currentPage === totalPages1?.totalPages}
                  >
                    <PaginationLink
                      next
                      href="#"
                      onClick={() => setCurrentPage(totalPages1?.currentPage + 1)}
                    />
                  </PaginationItem>
                  <PaginationItem
                    disabled={totalPages1?.currentPage === totalPages1?.totalPages}
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

export default AgentManagement;
