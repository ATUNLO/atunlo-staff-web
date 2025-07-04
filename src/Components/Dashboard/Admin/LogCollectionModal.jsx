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

function LogCollectionModal({
  logmodal,
  toggle,
  materialTypeSelection,
  getCollections,
}) {
  const token = useSelector((state) => state?.user?.currentUser?.data.token);
  const [agentName, setAgentName] = useState("");
  const [loading, setLoading] = useState(false);
  const balance = useSelector(
    (state) => state?.user?.currentUser?.data.balance
  );
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
      const amount = parseFloat(item.amount) || 0;
      return acc + amount;
    }, 0);

    const parsedPrepayment =
      parseFloat(prepayment.toString().replace(/[^\d.]/g, "")) || 0;

    const calculatedTotalDue = parsedPrepayment - total;
    setTotalDue(calculatedTotalDue);
  }, [materials, prepayment]);

  const [showDropdown, setShowDropdown] = useState(false);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };

  const removeImage = (indexToRemove) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const triggerFileInput = () => {
    document.getElementById("fileUpload").click();
  };

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
        const updatedMaterial = {
          ...material,
          [field]:
            field === "pricePerKg" || field === "amount" || field === "quantity"
              ? value === ""
                ? ""
                : Number(value)
              : value,
        };

        // Auto-calculate amount when quantity or pricePerKg changes
        if (field === "quantity" || field === "pricePerKg") {
          const quantity =
            field === "quantity"
              ? value === ""
                ? 0
                : Number(value)
              : material.quantity || 0;
          const pricePerKg =
            field === "pricePerKg"
              ? value === ""
                ? 0
                : Number(value)
              : material.pricePerKg || 0;

          if (quantity && pricePerKg) {
            updatedMaterial.amount = quantity * pricePerKg;
          } else if (!quantity || !pricePerKg) {
            updatedMaterial.amount = "";
          }
        }

        return updatedMaterial;
      }
      return material;
    });

    setMaterials(updatedMaterials);
  };

  const getAgentName = async () => {
    if (agentName.length < 3) return;
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
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [agentName]);

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
      agentId: selectedAgent?.id,
      collectionDate: collectionDate,
      prepayment: balance.toString(),
      materials: materials.map((material) => ({
        materialTypeId: material.materialTypeId,
        amount: Number(material.amount),
        quantity: material.quantity.toString(),
        pricePerKg: Number(material.pricePerKg),
      })),
    };

    try {
      const formData = new FormData();
      setLoading(true);

      formData.append("data", JSON.stringify(collectionData));

      // Append all selected images
      selectedImages.forEach((image, index) => {
        formData.append(`image${index + 1}`, image);
      });

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
      setLoading(false);
      toggle();
      toast.success("Collection logged successfully!");
      getCollections();
    } catch (error) {
      setLoading(false);
      console.error("Error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to log collection.");
    }
  };

  const moneyFormat = (value) => {
    if (!value) return "";
    const number = value.toString().replace(/\D/g, "");
    return `₦${new Intl.NumberFormat("en-US").format(number)}`;
  };

  return (
    <div>
      <Modal
        isOpen={logmodal}
        toggle={toggle}
        size="xl"
        className="w-full max-w-6xl mx-auto"
        scrollable
      >
        <>
          {/* Header - Responsive */}
          <div className="flex items-center justify-center relative pt-4 sm:pt-8 mb-8 w-full px-4 sm:px-6 lg:px-10">
            <span className="text-xl sm:text-2xl lg:text-3xl font-medium text-center">
              Logging Collection
            </span>
            <IoMdCloseCircle
              size={24}
              className="absolute right-4 sm:right-6 lg:right-10 cursor-pointer hover:text-gray-600 transition-colors"
              onClick={toggle}
            />
          </div>

          {/* Main Content - Responsive Container */}
          <div className="w-full h-auto rounded-lg px-4 sm:px-6 lg:px-12 xl:px-16 py-6 mb-8 overflow-y-auto max-h-[80vh]">
            {/* Agent Name and Collection Date - Responsive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-8">
              {/* Agent Name Search */}
              <FormGroup className="flex flex-col relative w-full">
                <Label
                  htmlFor="agentName"
                  className="font-normal text-sm sm:text-base mb-2"
                >
                  Agent Name
                </Label>
                <div className="border border-gray-200 w-full h-14 rounded-lg flex items-center px-4 relative bg-white">
                  <FiSearch className="text-gray-400 text-lg flex-shrink-0" />
                  <Input
                    id="agentName"
                    name="agentName"
                    placeholder="Search Agent Name"
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full h-full border-0 outline-none ml-2 bg-transparent"
                  />
                  <span className="flex-shrink-0">
                    {status === "loading" && (
                      <Spinner size="sm" className="text-gray-500" />
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
                  <div className="absolute top-full left-0 z-50 mt-1 w-full bg-white border border-gray-300 shadow-lg rounded-lg max-h-40 overflow-y-auto">
                    {agentSearchResults.map((agent) => (
                      <div
                        key={agent.id}
                        onClick={() => {
                          setAgentName(agent.fullName);
                          setSelectedAgent(agent);
                          setShowDropdown(false);
                        }}
                        className="p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        {agent.fullName}
                      </div>
                    ))}
                  </div>
                )}
              </FormGroup>

              {/* Collection Date */}
              <FormGroup className="flex flex-col w-full">
                <Label
                  htmlFor="collectionDate"
                  className="font-normal text-sm sm:text-base mb-2"
                >
                  Date of Collection
                </Label>
                <DatePicker
                  className="w-full h-14 rounded-lg border-gray-200"
                  selected={collectionDate ? new Date(collectionDate) : null}
                  onChange={(date) =>
                    setCollectionDate(date.toISOString().split("T")[0])
                  }
                />
              </FormGroup>
            </div>

            {/* Materials Section */}
            <div className="space-y-8">
              {materials.map((material, index) => (
                <div
                  key={material.id}
                  className="relative border border-gray-100 rounded-lg p-4 sm:p-6 bg-gray-50"
                >
                  {/* Material Type and Quantity Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Material Type */}
                    <FormGroup className="flex flex-col w-full">
                      <Label
                        htmlFor={`materialType-${index}`}
                        className="font-normal text-sm sm:text-base mb-2"
                      >
                        Material Type
                      </Label>
                      <Input
                        id={`materialType-${index}`}
                        name="materialType"
                        type="select"
                        value={material.materialTypeId || ""}
                        onChange={(e) =>
                          handleMaterialChange(
                            index,
                            "materialTypeId",
                            Number(e.target.value)
                          )
                        }
                        className="w-full h-14 rounded-lg border-gray-200 bg-white"
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
                    <FormGroup className="flex flex-col w-full">
                      <Label
                        htmlFor={`quantity-${index}`}
                        className="font-normal text-sm sm:text-base mb-2"
                      >
                        Quantity (KG)
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
                        className="w-full h-14 rounded-lg border-gray-200 bg-white"
                        placeholder="Enter quantity"
                      />
                    </FormGroup>
                  </div>

                  {/* Price Per KG and Amount Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Price Per KG */}
                    <FormGroup className="flex flex-col w-full">
                      <Label
                        htmlFor={`pricePerKg-${index}`}
                        className="font-normal text-sm sm:text-base mb-2"
                      >
                        Price Per KG
                      </Label>
                      <Input
                        id={`pricePerKg-${index}`}
                        name="pricePerKg"
                        type="text"
                        value={material.pricePerKg}
                        onChange={(e) =>
                          handleMaterialChange(
                            index,
                            "pricePerKg",
                            e.target.value
                          )
                        }
                        className="w-full h-14 rounded-lg border-gray-200 bg-white"
                        placeholder="Enter price per KG"
                      />
                    </FormGroup>

                    {/* Amount - Auto-calculated and read-only */}
                    <FormGroup className="flex flex-col w-full">
                      <Label
                        htmlFor={`amount-${index}`}
                        className="font-normal text-sm sm:text-base mb-2"
                      >
                        Amount (Auto-calculated)
                      </Label>
                      <Input
                        id={`amount-${index}`}
                        name="amount"
                        type="text"
                        value={material.amount}
                        readOnly
                        className="w-full h-14 rounded-lg border-gray-200 bg-gray-100"
                        placeholder="Calculated automatically"
                      />
                    </FormGroup>
                  </div>

                  {/* Add Material Button */}
                  <div
                    className="flex items-center justify-start gap-2 cursor-pointer mt-4 hover:opacity-80 transition-opacity"
                    onClick={addMaterial}
                  >
                    <FaSquarePlus className="text-green-500 w-5 h-5" />
                    <p className="font-medium text-sm text-green-500 mb-0">
                      Add Material
                    </p>
                  </div>

                  {/* Delete Button */}
                  {materials.length > 1 && (
                    <button
                      type="button"
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors p-2"
                      onClick={() => removeMaterial(index)}
                    >
                      <FaTrash size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Prepayment and Total Due */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Prepayment */}
              <FormGroup className="flex flex-col w-full">
                <Label
                  htmlFor="prepayment"
                  className="font-normal text-sm sm:text-base mb-2"
                >
                  Prepayment
                </Label>
                <Input
                  id="prepayment"
                  name="prepayment"
                  placeholder="Enter prepayment amount"
                  type="text"
                  value={moneyFormat(prepayment)}
                  className="w-full h-14 rounded-lg border-gray-200 bg-white"
                  onChange={(e) => setPrepayment(e.target.value)}
                />
              </FormGroup>

              {/* Total Due */}
              <FormGroup className="flex flex-col w-full">
                <Label
                  htmlFor="totalDue"
                  className="font-normal text-sm sm:text-base mb-2"
                >
                  Total Due
                </Label>
                <Input
                  id="totalDue"
                  name="totalDue"
                  value={totalDue}
                  readOnly
                  placeholder="Calculated automatically"
                  type="text"
                  className="w-full h-14 rounded-lg border-gray-200 bg-gray-100"
                />
              </FormGroup>
            </div>

            {/* Image Upload Section */}
            <div className="flex flex-col mt-8">
              <label
                htmlFor="fileUpload"
                className="font-normal text-sm sm:text-base mb-2"
              >
                Upload Images
              </label>

              {/* Upload Area */}
              <div
                className="w-full border-2 border-dashed border-gray-300 h-32 sm:h-40 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors cursor-pointer"
                onClick={triggerFileInput}
              >
                <div className="flex flex-col sm:flex-row items-center gap-3 mb-3">
                  <FaRegImage size={32} className="text-green-500" />
                  <span className="text-gray-700 text-center">
                    Upload Multiple Images
                  </span>
                </div>
                <span className="underline cursor-pointer text-gray-600 text-sm">
                  Click here to select images
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
              {selectedImages.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium mb-3">
                    Selected Images ({selectedImages.length})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {selectedImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative group hover:bg-gray-50 p-1 rounded-lg transition"
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 sm:h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-opacity opacity-100"
                        >
                          ×
                        </button>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {image.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-semibold text-base rounded-lg mt-8 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Collection"
              )}
            </button>
          </div>
        </>
      </Modal>
    </div>
  );
}

LogCollectionModal.propTypes = {
  logmodal: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  materialTypeSelection: PropTypes.array,
  getCollections: PropTypes.func,
};

export default LogCollectionModal;
