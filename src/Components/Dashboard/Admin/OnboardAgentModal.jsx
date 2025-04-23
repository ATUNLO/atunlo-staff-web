import { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import {
  FormGroup,
  Label,
  Modal,
  Input,
  Spinner,
  Form,
  Button,
  ModalBody,
} from "reactstrap";
import { toast } from "react-toastify";
import { publicRequest } from "../../../requestMehod";
import { FaSquarePlus, FaTrash } from "react-icons/fa6";
import Select from "react-select";

function OnboardAgentModal({ logmodal, toggle, token, getAgents }) {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [stateId, setStateId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountInfo, setAccountInfo] = useState("");
  const [accountInfoLoading, setAccountInfoLoading] = useState(false);
  const [availableStates, setAvailableStates] = useState([]);
  const [materialTypeSelection, setMaterialTypeSelection] = useState([]);
  const [availableBanks, setAvailableBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState({
    bankCode: "",
    bankName: "",
  });
  const handleBankChange = (selectedOption) => {
    if (!selectedOption) {
      setSelectedBank({ bankCode: "", bankName: "" }); // Reset if cleared
      return;
    }

    setSelectedBank({
      bankCode: String(selectedOption.value), // Ensure it's a string
      bankName: selectedOption.label,
    });
  };

  const [materials, setMaterials] = useState([{ id: 1, type: "", price: "" }]);
  const addMaterial = () => {
    setMaterials([
      ...materials,
      { id: materials.length + 1, type: "", price: "" },
    ]);
  };

  const resetForm = () => {
    setFullName("");
    setAddress("");
    setPhone("");
    setStateId("");
    setSelectedBank({ bankCode: "", bankName: "" });
    setAccountNumber("");
    setMaterialTypeSelection([]);
    setMaterials([{ id: 1, type: "", price: "" }]);
  };

  const removeMaterial = (index) => {
    if (materials.length > 1) {
      setMaterials(materials.filter((_, i) => i !== index));
    }
  };

  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = materials.map((material, i) =>
      i === index ? { ...material, [field]: value } : material
    );
    setMaterials(updatedMaterials);
  };

  const formattedMaterials = materials.map((material) => ({
    materialTypeId: material.type,
    price: Number(material.price),
  }));

  const bankOptions = availableBanks?.map((bank) => ({
    value: String(bank.code), // Ensure value is a string
    label: bank.name,
  }));

  const formatPhoneNumberIntl = (phone) => {
    phone = phone.trim(); // Remove spaces

    if (phone.startsWith("+234")) {
      return phone; // Already in correct format
    } else if (phone.startsWith("0")) {
      return "+234" + phone.substring(1); // Remove "0" and add "+234"
    } else if (phone.length === 10 && /^[789]\d{9}$/.test(phone)) {
      return "+234" + phone; // If it's a valid 10-digit Nigerian number
    } else {
      return "Invalid phone number"; // Reject incorrect formats
    }
  };

  const agentData = {
    fullname: fullName,
    address: address,
    phone: formatPhoneNumberIntl(phone),
    stateid: stateId,
    bankCode: selectedBank.bankCode,
    bankName: selectedBank.bankName,
    accountNumber: accountNumber,
    materials: formattedMaterials,
  };

  console.log(agentData);

  const getStates = async () => {
    try {
      const response = await publicRequest.get(`/misc/states`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data?.data;
      setAvailableStates(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getBanks = async () => {
    try {
      const response = await publicRequest.get(`/transactions/banks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data?.data;
      setAvailableBanks(data);
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

      const data = response.data?.data;
      setAccountInfo(data);
      setAccountInfoLoading(false);
      console.log(data);
    } catch (error) {
      setAccountInfoLoading(false);
      console.log(error.response.data);
      setAccountInfo(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getStates();
    getMaterialType();
    getBanks();
  }, []);

  useEffect(() => {
    const isTenDigits = accountNumber?.length === 10;
    const hasBank = !!selectedBank?.bankCode;

    if (isTenDigits && hasBank) {
      getAccountInfo(accountNumber, selectedBank.bankCode);
    }

    if (accountNumber?.length < 10) {
      setAccountInfo({});
    }
  }, [accountNumber, selectedBank]);
  const onboardAgent = async (token, agentData) => {
    setLoading(true);
    try {
      const url = `/admin_staff/onboard-agent`;
      const response = await publicRequest.post(url, agentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);
      toast.success("Agent onboarded successfully!");
      toggle();
      resetForm();
      return response.data;
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to onboard agent.");
      throw error;
    }
  };

  return (
    <Modal
      isOpen={logmodal}
      toggle={toggle}
      size="xl"
      className="!w-full lg:w-[100%] lg:px-[100px] py-[50px]"
      scrollable
    >
      <ModalBody>
        <>
          <div className="flex items-center justify-center relative pt-[50px] mb-[70px] w-full px-10">
            <span className="text-[24px] lg:text-[30px]">Onboard Agent</span>
            <IoMdCloseCircle
              size={20}
              className="absolute lg:right-20 right-5 cursor-pointer"
              onClick={() => toggle()}
            />
          </div>

          <div className="w-full flex items-center justify-start h-auto border-solid border-[1px] border-[#E9E9E9] rounded-[10px]  py-[55px] mb-[30px]">
            <Form className="w-full flex flex-col items-center justify-start mt-[55px]">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-[50px]">
                <FormGroup className="flex flex-col ">
                  <Label
                    for="FullName"
                    className="font-normal text-[16px] mb-[10px]"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="FullName"
                    name="FullName"
                    placeholder=""
                    type="text"
                    value={fullName}
                    className="border-solid border-[1px] border-[#E9E9E9] !w-[310px] lg:w-[390px] h-[55px] rounded-[10px]"
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </FormGroup>
                <FormGroup className="flex flex-col mb-0">
                  <Label
                    for="phoneNumber"
                    className="font-normal text-[16px] mb-[10px]"
                  >
                    Phone Number
                  </Label>
                  <div className="border-solid border-[1px] border-[#E9E9E9] !w-[310px] lg:w-[390px] h-[55px] rounded-[10px] flex items-center pl-[20px]">
                    <span className="text-[#8F8F8F] text-[16px]">+234</span>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder=""
                      value={phone}
                      type="emtextail"
                      className="!w-[310px] lg:w-[390px] h-[55px] rounded-[10px] outline-none ml-[10px]"
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength="10"
                    />
                  </div>
                </FormGroup>
              </div>
              <div className="flex flex-col lg:flex-row items-center justify-center gap-[50px] mt-[40px]">
                <div className="flex flex-col">
                  <Label
                    for="Address"
                    className="font-normal text-[16px] mb-[10px]"
                  >
                    Address
                  </Label>
                  <Input
                    id="Address"
                    name="Address"
                    placeholder=""
                    type="text"
                    value={address}
                    className="border-solid border-[1px] border-[#E9E9E9] !w-[310px] lg:w-[390px] h-[55px] rounded-[10px]"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <FormGroup className="flex flex-col">
                  <Label
                    htmlFor="state"
                    className="font-normal text-[16px] mb-[10px]"
                  >
                    State
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    type="select"
                    value={stateId}
                    onChange={(e) => setStateId(e.target.value)}
                    className="border-solid border-[1px] border-[#E9E9E9] !w-[310px] lg:w-[390px] h-[55px] rounded-[10px] flex items-center pl-[20px]"
                  >
                    <option value="">Select a State</option>
                    {availableStates?.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </div>
              <div className="flex flex-col lg:flex-row items-center justify-center gap-[50px] mt-[40px]">
                <FormGroup className="flex flex-col ">
                  <Label
                    htmlFor="BankName"
                    className="font-normal text-[16px] mb-[10px]"
                  >
                    Bank Name
                  </Label>
                  <Select
                    id="BankName"
                    name="BankName"
                    options={bankOptions}
                    value={
                      bankOptions.find(
                        (option) => option.value === selectedBank?.bankCode
                      ) || null
                    }
                    onChange={handleBankChange}
                    isSearchable
                    isClearable
                    className="border-solid border-[1px] border-[#E9E9E9] !w-[310px] lg:w-[390px] !h-[55px] rounded-[10px]"
                  />
                </FormGroup>
                <div className="flex flex-col relative">
                  <FormGroup className="flex flex-col">
                    <Label
                      htmlFor="AccountNumber"
                      className="font-normal text-[16px] mb-[10px]"
                    >
                      Account Number
                    </Label>
                    <Input
                      id="AccountNumber"
                      name="AccountNumber"
                      placeholder=""
                      type="text"
                      value={accountNumber}
                      className="border-solid border-[1px] border-[#E9E9E9] !w-[310px] lg:w-[390px] h-[55px] rounded-[10px]"
                      onChange={(e) => setAccountNumber(e.target.value)}
                      maxLength={10}
                    />
                  </FormGroup>

                  {accountInfoLoading && (
                    <p className="text-sm text-gray-700 absolute bottom-[-30px] left-0">
                      <Spinner color="black" size="sm" />
                    </p>
                  )}

                  {!accountInfoLoading &&
                    typeof accountInfo === "object" &&
                    accountInfo?.name && (
                      <p className="text-sm text-gray-700 absolute bottom-[-30px] left-0">
                        {accountInfo.name}
                      </p>
                    )}

                  {!accountInfoLoading && typeof accountInfo === "string" && (
                    <p className="text-sm text-red-500 absolute bottom-[-30px] left-0">
                      {accountInfo}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-[#F3F3F3] w-full min-h-[150px] flex flex-col items-center justify-center gap-[20px] mt-[40px] px-[20px] py-[30px]">
                {materials.map((material, index) => (
                  <div
                    key={material.id}
                    className="flex flex-col lg:flex-row items-center justify-center gap-[50px]"
                  >
                    {/* Material Type */}
                    <FormGroup className="flex flex-col">
                      <Label
                        htmlFor={`materialType-${index}`}
                        className="font-normal text-[16px] mb-[10px]"
                      >
                        Material Type
                      </Label>
                      <Input
                        id={`materialType-${index}`}
                        name="materialType"
                        type="select"
                        value={material.type}
                        onChange={(e) =>
                          handleMaterialChange(index, "type", e.target.value)
                        }
                        className="border-solid border-[1px] border-[#E9E9E9] !w-[310px] lg:w-[390px] h-[55px] rounded-[10px] pl-[10px] bg-white"
                      >
                        <option value="">Select a Material Type</option>
                        {materialTypeSelection?.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>

                    {/* Price Per KG + Trash Icon */}
                    <div className="flex items-center gap-[10px] relative">
                      <FormGroup className="flex flex-col">
                        <Label
                          htmlFor={`pricePerKg-${index}`}
                          className="font-normal text-[16px] mb-[10px]"
                        >
                          Price Per KG
                        </Label>
                        <Input
                          id={`pricePerKg-${index}`}
                          name="pricePerKg"
                          type="text"
                          value={material.price}
                          onChange={(e) =>
                            handleMaterialChange(index, "price", e.target.value)
                          }
                          className="border-solid border-[1px] border-[#E9E9E9] !w-[310px] lg:w-[390px] h-[55px] rounded-[10px] bg-white"
                        />
                      </FormGroup>

                      {/* Delete Button (Only if more than 1 row) */}
                      {materials.length > 1 && (
                        <FaTrash
                          className="text-red-500 cursor-pointer mt-[25px]"
                          size={20}
                          onClick={() => removeMaterial(index)}
                        />
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Material Button */}
                <div
                  className="flex items-center justify-center gap-[5px] cursor-pointer mt-[20px]"
                  onClick={addMaterial}
                >
                  <FaSquarePlus className="fill-[#50CA00] !w-[20px] h-[20px]" />
                  <p className="font-medium text-[14px] text-[#50CA00] mb-0">
                    Add Material
                  </p>
                </div>
              </div>
              <Button
                className="!w-[50%] mt-[60px] !bg-[#50cA00] h-[55px] text-white rounded-[10px]"
                onClick={() => onboardAgent(token, agentData)}
              >
                {loading ? <Spinner /> : "Onboard"}
              </Button>
            </Form>
          </div>
        </>
      </ModalBody>
    </Modal>
  );
}

export default OnboardAgentModal;
