import { Modal, FormGroup, Label, Input, Spinner } from "reactstrap";
import { IoMdCloseCircle } from "react-icons/io";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiSearch, FiXCircle } from "react-icons/fi";
import { DatePicker } from "@mui/x-date-pickers";

import { FaTrash } from "react-icons/fa";
import { FaSquarePlus, FaRegImage } from "react-icons/fa6";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { publicRequest } from "../../../requestMehod";
import { toast } from "react-toastify";

function LogCollectionModal({ logmodal, toggle, materialTypeSelection,getCollections }) {
  const token = useSelector((state) => state?.user?.currentUser?.data.token);
  const [agentName, setAgentName] = useState("");
  const [loading, setLoading] = useState(false);
  const balance = useSelector((state) => state?.user?.currentUser?.data.balance);
  const [agentSearchResults, setAgentSearchResults] = useState([]);
  const [agentData, setAgentData] = useState("");
  const [selectedAgent, setSelectedAgent] = useState([]);
  console.log("selected", selectedAgent);
  const [status, setStatus] = useState("idle");
  const [collectionDate, setCollectionDate] = useState("");
  const [prepayment, setPrepayment] = useState("");

  const [materials, setMaterials] = useState([
    { id: 1, type: "", price: "", quantity: "", amount: "" },
  ]);
  const [selectedImages, setSelectedImages] = useState([]);
  console.log("selectedImages", selectedImages);
  const [totalDue, setTotalDue] = useState(0);
  useEffect(() => {
    const total = materials.reduce((acc, item) => {
      const amount = parseFloat(item.amount) || 0; // Ensure valid number
      return acc + amount;
    }, 0);
  
    const parsedPrepayment = parseFloat(prepayment.toString().replace(/[^\d.]/g, "")) || 0; // Remove non-numeric characters
    
    const calculatedTotalDue = parsedPrepayment - total; 
    setTotalDue(calculatedTotalDue);
  }, [materials, prepayment]);
  // const [selectedFiles, setSelectedFiles] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages(files);
  };
  // const handleFileSelect = (event) => {
  //   const files = Array.from(event.target.files);
  //   setSelectedFiles(files);
  // };

  // const handleDrop = (event) => {
  //   event.preventDefault();
  //   const files = Array.from(event.dataTransfer.files);
  //   setSelectedFiles(files);
  // };

  // const handleDragOver = (event) => {
  //   event.preventDefault();
  // };

  const triggerFileInput = () => {
    document.getElementById("fileUpload").click();
  };

  // const triggerFileInput2 = () => {
  //   document.getElementById("fileUpload2").click();
  // };

  const addMaterial = () => {
    setMaterials([
      ...materials,
      {
        id: materials.length + 1,
        type: "",
        price: "",
        quantity: "",
        amount: "",
      },
    ]);
  };

  const removeMaterial = (index) => {
    if (materials.length > 1) {
      setMaterials(materials.filter((_, i) => i !== index));
    }
  };

  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = materials.map((material, i) => {
      if (i === index) {
        return {
          ...material,
          [field]: 
            field === "pricePerKg" || field === "amount" || field === "quantity"
              ? value === "" ? "" : Number(value) // ✅ Keep empty string if input is cleared
              : value,
        };
      }
      return material;
    });
  
    setMaterials(updatedMaterials);
  };
  
  const getAgentName = async () => {
    if (agentName.length < 3) return; // Only search after 3+ characters
    setStatus("loading");

    try {
      const response = await publicRequest.get(
        `/admin_staff/getAgentByName?agentName=${agentName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response?.data?.data || [];
      setAgentSearchResults(data);
      setStatus("success");
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching agents:", error);
      setStatus("error");
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      getAgentName();
    }, 500); // Debounce API call
    return () => clearTimeout(delaySearch);
  }, [agentName]);

  const collectionData = {
    agentName: selectedAgent?.fullName,
    collectionDate: collectionDate, // Ensure correct format
    prepayment: balance?.toString(), // Convert to string if needed
    materials: materials.map((material) => ({
      materialTypeId: material.materialTypeId,
      amount: Number(material.amount), // Convert to number
      quantity: material.quantity.toString(), // Ensure it's a string
      pricePerKg: Number(material.pricePerKg),
    })),
  };

  console.log(collectionData);

  // const logCollection = async (token, collectionData, imageFile) => {
  //   setLoading(true);
  //   try {
  //     const url = `/admin_staff/log-collection`;

  //     const formData = new FormData();
  //     formData.append("agentName", collectionData.agentName);
  //     formData.append("collectionDate", collectionData.collectionDate);
  //     formData.append("prepayment", collectionData.prepayment);

  //     // ✅ Ensure materials are properly stringified
  //     formData.append("materials", JSON.stringify(collectionData.materials));

  //     // ✅ Ensure an image is attached
  //     formData.append("image1", imageFile);

  //     const response = await publicRequest.post(url, formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     setLoading(false);
  //     toast.success("Collection logged successfully!");
  //     return response.data;
  //   } catch (error) {
  //     setLoading(false);
  //     toast.error(error.response?.data?.message || "Failed to log collection.");
  //     throw error;
  //   }
  // };

  const handleSubmit = async () => {
    if (!selectedAgent) {
      toast.error("Please select an agent.");
      return;
    }

    if (!selectedImages || selectedImages.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }

    const collectionData = {
      agentName: selectedAgent?.fullName,
      collectionDate: collectionDate, // Ensure correct format
      prepayment: balance.toString(), // Convert to string if needed
      materials: materials.map((material) => ({
        materialTypeId: material.materialTypeId,
        amount: Number(material.amount), // Convert to number
        quantity: material.quantity.toString(), // Ensure it's a string
        pricePerKg: Number(material.pricePerKg),
      })),
    };

    try {
      const formData = new FormData();
      setLoading(true)

      // ✅ Convert `collectionData` to a JSON string and append as "data"
      formData.append("data", JSON.stringify(collectionData));

      // ✅ Append image as file
      formData.append("image1", selectedImages[0]);

      console.log(
        "FormData before sending:",
        Object.fromEntries(formData.entries())
      );

      const response = await publicRequest.post(
        "/admin_staff/log-collection",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Success:", response);
      setLoading(false)
      toggle();
      toast.success("Collection logged successfully!");
      getCollections();

    } catch (error) {
      setLoading(false)
      console.error("Error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to log collection.");
    }
  };

  const moneyFormat = (value) => {
    if (!value) return "";
    const number = value.toString().replace(/\D/g, ""); // Remove non-numeric characters
    return `₦${new Intl.NumberFormat("en-US").format(number)}`;
  };

  return (
    <div>
      <Modal
        isOpen={logmodal}
        toggle={toggle}
        size="xl"
        className="w-full lg:px-[100px]"
        scrollable
      >
          <>
            <div className="flex items-center justify-center relative pt-[50px] mb-[70px] w-full lg:px-10">
              <span className="text-[24px] lg:text-[30px]">Logging Collection</span>
              <IoMdCloseCircle
                size={20}
                className="absolute lg:right-20 right-5"
                onClick={toggle}
              />
            </div>
            <div className="w-full h-auto  rounded-[10px] px-[50px] py-[22px] mb-[30px] overflow-y-scroll">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-[50px]">
                <FormGroup className="flex flex-col relative">
                  <Label
                    for="agentName"
                    className="font-normal text-[16px] mb-[10px]"
                  >
                    Agent Name
                  </Label>
                  <div className="border-solid border-[1px] border-[#E9E9E9] w-[320px] lg:w-[378px] h-[55px] rounded-[10px] flex items-center pl-[20px] relative">
                    <span className="text-[#8F8F8F] text-[16px]">
                      <FiSearch />
                    </span>
                    <Input
                      id="agentName"
                      name="agentName"
                      placeholder="Search Agent Name"
                      type="text"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      className="w-[378px] h-[55px] rounded-[10px] outline-none ml-[10px]"
                    />
                    <span className="ml-auto absolute right-3">
                      {status === "loading" && (
                        <Spinner className="animate-spin text-gray-500" />
                      )}
                      {status === "success" && (
                        <FiCheckCircle className="text-green-500" />
                      )}
                      {status === "error" && (
                        <FiXCircle className="text-red-500" />
                      )}
                    </span>
                  </div>

                  {/* Dropdown for search results */}
                  {showDropdown && agentSearchResults.length > 0 && (
                    <div className="absolute bottom-[-50px] z-10 mt-1 w-[378px] bg-white border border-gray-300 shadow-md rounded-lg max-h-40 overflow-y-auto">
                      {agentSearchResults.map((agent) => (
                        <div
                          key={agent.id}
                          onClick={() => {
                            setAgentName(agent.fullName);
                            setSelectedAgent(agent);
                            setShowDropdown(false);
                          }}
                          className="p-3 cursor-pointer hover:bg-gray-100"
                        >
                          {agent.fullName}
                        </div>
                      ))}
                    </div>
                  )}
                </FormGroup>

                <FormGroup className="flex flex-col">
                  <Label
                    for="phoneNumber"
                    className="font-normal text-[16px] mb-[10px]"
                  >
                    Date of Collection
                  </Label>
                  <DatePicker
                    className="w-[320px] lg:w-[378px] h-[55px] rounded-[10px] outline-none border-[#E9E9E9]"
                    selected={collectionDate ? new Date(collectionDate) : null}
                    onChange={(date) =>
                      setCollectionDate(date.toISOString().split("T")[0])
                    }
                  />
                </FormGroup>
              </div>
              <div>
                {materials.map((material, index) => (
                  <div key={material.id} className="mt-[40px] relative">
                    {/* First Row: Material Type & Quantity */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-[50px]">
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
                          value={material.materialTypeId} // ✅ Use correct field
                          onChange={
                            (e) =>
                              handleMaterialChange(
                                index,
                                "materialTypeId",
                                Number(e.target.value)
                              ) // ✅ Convert value to number
                          }
                          className="border-solid border-[1px] border-[#E9E9E9] !w-[320px] lg:!w-[378px] h-[55px] rounded-[10px] pl-[10px] bg-white"
                        >
                          <option value="">Select a Material Type</option>
                          {materialTypeSelection?.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>

                      {/* Quantity */}
                      <FormGroup className="flex flex-col !w-[320px] lg:!w-[378px]">
                        <Label
                          htmlFor={`quantity-${index}`}
                          className="font-normal text-[16px] mb-[10px]"
                        >
                          Quantity(KG)
                        </Label>
                        <Input
                          id={`quantity-${index}`}
                          name="quantity"
                          type="text"
                          value={material.quantity}
                          onChange={(e) =>
                            handleMaterialChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="border-solid border-[1px] border-[#E9E9E9] w-full h-[55px] rounded-[10px] bg-white"
                        />
                      </FormGroup>
                    </div>

                    {/* Second Row: Price Per KG & Amount + Trash Icon */}
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-[50px] mt-[20px]">
                      {/* Price Per KG */}
                      <FormGroup className="flex flex-col !w-[320px] lg:!w-[378px]">
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
                          value={material.pricePerKg}
                          onChange={(e) =>
                            handleMaterialChange(index, "pricePerKg", e.target.value)
                          }
                          className="border-solid border-[1px] border-[#E9E9E9] !w-[320px] lg:!w-[378px] h-[55px] rounded-[10px] bg-white"
                        />
                      </FormGroup>

                      {/* Amount */}
                      <FormGroup className="flex flex-col !w-[320px] lg:!w-[378px]">
                        <Label
                          htmlFor={`amount-${index}`}
                          className="font-normal text-[16px] mb-[10px]"
                        >
                          Amount
                        </Label>
                        <Input
                          id={`amount-${index}`}
                          name="amount"
                          type="text"
                          value={material.amount}
                          onChange={(e) =>
                            handleMaterialChange(
                              index,
                              "amount",
                              e.target.value
                            )
                          }
                          className="border-solid border-[1px] border-[#E9E9E9] !w-[320px] lg:!w-[378px] h-[55px] rounded-[10px] bg-white"
                        />
                        <div
                          className="flex items-center justify-start gap-[5px] cursor-pointer mt-[20px]"
                          onClick={addMaterial}
                        >
                          <FaSquarePlus className="fill-[#50CA00] w-[20px] h-[20px]" />
                          <p className="font-medium text-[14px] text-[#50CA00] mb-0">
                            Add Material
                          </p>
                        </div>
                      </FormGroup>

                      {/* Delete Button (Only if more than 1 row) */}
                      {materials.length > 1 && (
                        <FaTrash
                          className="text-red-500 cursor-pointer mt-[25px] absolute right-[-40px] top-[20px]"
                          size={20}
                          onClick={() => removeMaterial(index)}
                        />
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-[50px] mt-[30px]">
                  <FormGroup className="flex flex-col">
                    <Label
                      for="prepayment"
                      className="font-normal text-[16px] mb-[10px]"
                    >
                      Prepayment
                    </Label>

                    <Input
                      id="prepayment"
                      name="prepayment"
                      placeholder=""
                      type="text"
                      value={moneyFormat(prepayment)}
                      className="!w-[320px] lg:!w-[378px] h-[55px] rounded-[10px] outline-none ml-[10px]"
                      onChange={(e) => setPrepayment(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="flex flex-col">
                    <Label
                      for="totalDue"
                      className="font-normal text-[16px] mb-[10px]"
                    >
                      Total Due
                    </Label>

                    <Input
                      id="totalDue"
                      name="totalDue"
                      value={totalDue}
                      readOnly
                      placeholder=""
                      type="emtextail"
                      className="!w-[320px] lg:!w-[378px] h-[55px] rounded-[10px] outline-none ml-[10px]"
                    />
                  </FormGroup>
                </div>
                <div className="flex flex-col mt-[30px]">
                  <label
                    htmlFor="fileUpload"
                    className="font-normal text-[16px] mb-[10px]"
                  >
                    Upload
                  </label>
                  <div className="w-full border-solid border-[1px] border-[#E9E9E9] h-[148px] rounded-[10px] flex flex-col items-center justify-center">
                    <div className="flex items-center gap-3 mb-3">
                      <FaRegImage size={40} className="fill-[#50c100]" />
                      <span>Upload Image</span>
                    </div>
                    <span
                      className="underline cursor-pointer text-black"
                      onClick={triggerFileInput}
                    >
                      Click here to upload multiple images
                    </span>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    id="fileUpload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Preview Selected Images */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {selectedImages.map((image, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt={`Uploaded ${index}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
                <div
                  className="w-full !h-[55px] bg-[#50c100] flex items-center justify-center rounded-md mt-[70px]"
                  onClick={handleSubmit}
                >
                  <p className="mb-0 text-white font-semibold text-[16px]">
                    {loading ? <Spinner/> : "Submit" }
                  </p>
                </div>
              </div>
            </div>
          </>
      </Modal>
    </div>
  );
}
LogCollectionModal.propTypes = {
  logmodal: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default LogCollectionModal;
