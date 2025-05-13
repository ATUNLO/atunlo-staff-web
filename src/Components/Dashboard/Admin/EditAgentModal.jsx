import React, { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import {
  FormGroup,
  Label,
  Modal,
  Input,
  ModalBody,
  Spinner,
} from "reactstrap";
import { publicRequest } from "../../../requestMehod";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function EditAgentModal({
  toggleAgentModal,
  editAgentModal,
  singleAgent,
  getAgents,
  id,
}) {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [bank, setBank] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountInfo, setAccountInfo] = useState("");
  const [accountInfoLoading, setAccountInfoLoading] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [availableBanks, setAvailableBanks] = useState([]);
  const token = useSelector((state) => state?.user?.currentUser?.data.token);

  useEffect(() => {
    if (singleAgent) {
      setFullName(singleAgent?.fullName || "");
      setAddress(singleAgent?.address || "");
      setPhone(singleAgent?.phoneNumber || "");
      setBank(singleAgent?.bankName || "");
      setAccountNumber(singleAgent?.accountNumber || "");

      // Set bankCode based on bankName (needed for account info fetch)
      const bankMatch = availableBanks.find(
        (b) => b.name.toLowerCase() === singleAgent?.bankName?.toLowerCase()
      );
      setBankCode(bankMatch?.code || "");
    }
  }, [singleAgent, availableBanks]);

  const updateAgent = async () => {
    if (!fullName || !phone || !address || !bankCode || !accountNumber) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (accountNumber.length !== 10) {
      toast.error("Account number must be 10 digits.");
      return;
    }

    if (typeof accountInfo === "string") {
      toast.error("Invalid account details. Please verify.");
      return;
    }

    setLoading(true);

    const agentData = {
      agentId: id,
      fullname: fullName,
      phone,
      address,
      bankCode,
      bankName: bank,
      accountNumber,
    };

    try {
      const response = await publicRequest.patch(`/admin/edit/agent`, agentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.status === 200) {
        toast.success(response?.data?.message || "Agent updated successfully.");
        toggleAgentModal();
        getAgents();
      } else {
        toast.error("Update failed. Try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update agent.");
    } finally {
      setLoading(false);
    }
  };

  const getBanks = async () => {
    try {
      const response = await publicRequest.get(`/transactions/banks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableBanks(response.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getAccountInfo = async (accountNumber, bankCode) => {
    setAccountInfoLoading(true);
    try {
      const response = await publicRequest.get(`/transactions/bank/details`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          accountNumber,
          bank: bankCode,
        },
      });
      setAccountInfo(response.data?.data);
    } catch (error) {
      setAccountInfo(error?.response?.data?.message || "Error fetching account info");
    } finally {
      setAccountInfoLoading(false);
    }
  };

  useEffect(() => {
    getBanks();
  }, []);

  useEffect(() => {
    if (accountNumber.length === 10 && bankCode) {
      getAccountInfo(accountNumber, bankCode);
    }
  }, [accountNumber, bankCode]);

  return (
    <Modal
      isOpen={editAgentModal}
      toggle={toggleAgentModal}
      size="xl"
      className="w-full lg:py-[50px]"
      scrollable
    >
      <ModalBody className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center relative pt-[50px] lg:mb-[70px] w-full px-10">
          <span className="text-[30px]">Edit Agent</span>
          <IoMdCloseCircle
            size={20}
            className="absolute lg:right-20 right-5 cursor-pointer"
            onClick={toggleAgentModal}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-[50px] mt-[30px] mx-auto">
          {/* Column 1 */}
          <div className="flex flex-col gap-[30px]">
            <FormGroup>
              <Label for="full_name">Full Name</Label>
              <Input
                id="full_name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="!w-[311px] h-[55px] ml-[10px]"
              />
            </FormGroup>

            <FormGroup>
              <Label for="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                type="text"
                value={phone}
                maxLength={14}
                onChange={(e) => setPhone(e.target.value)}
                className="!w-[311px] h-[55px] ml-[10px]"
              />
            </FormGroup>

            <FormGroup>
              <Label for="account_number">Account Number</Label>
              <Input
                id="account_number"
                type="text"
                value={accountNumber}
                maxLength={10}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="!w-[311px] h-[55px] ml-[10px]"
              />
            </FormGroup>


          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-[30px]">
            <FormGroup>
              <Label for="address">Address</Label>
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="!w-[311px] h-[55px] ml-[10px]"
              />
            </FormGroup>

            <FormGroup className="flex flex-col">
              <Label for="bank">Bank</Label>
              <select
                id="bank"
                value={bankCode}
                onChange={(e) => {
                  const selectedCode = e.target.value;
                  const selectedBank = availableBanks.find(
                    (b) => b.code === selectedCode
                  );
                  setBankCode(selectedCode);
                  setBank(selectedBank?.name || "");
                }}
                className="!w-[311px] h-[55px] ml-[10px] border border-black rounded-[10px] pl-2"
              >
                <option value="" disabled>
                  Select a bank
                </option>
                {availableBanks.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.name}
                  </option>
                ))}
              </select>
            </FormGroup>

            {accountNumber.length === 10 && bankCode && (
              <FormGroup>
                <Label>Account Name</Label>
                <Input
                  type="text"
                  disabled
                  readOnly
                  value={
                    accountInfoLoading
                      ? "Loading..."
                      : typeof accountInfo === "string"
                      ? accountInfo
                      : accountInfo?.name || ""
                  }
                  className="!w-[311px] h-[55px] ml-[10px] bg-gray-100"
                />
              </FormGroup>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div
            className="w-[300px] h-[55px] bg-[#50c100] flex items-center justify-center rounded-md mt-[70px] mb-[50px] cursor-pointer"
            onClick={updateAgent}
          >
            <p className="mb-0 text-white font-semibold text-[16px]">
              {loading ? <Spinner size="sm" /> : "Update Agent Details"}
            </p>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default EditAgentModal;
