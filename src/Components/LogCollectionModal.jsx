import { Modal, FormGroup, Label, Input } from "reactstrap";
import { IoMdCloseCircle } from "react-icons/io";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { DatePicker } from "@mui/x-date-pickers";
import { materialTypes } from "../utils/dataset";
import { FaTrash } from "react-icons/fa";
import { FaSquarePlus, FaRegImage } from "react-icons/fa6";

function LogCollectionModal({ logmodal, toggle }) {
  const [materials, setMaterials] = useState([
    { id: 1, type: "", price: "", quantity: "", amount: "" },
  ]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [page, setPage] = useState("Log");

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages(files);
  };
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const triggerFileInput = () => {
    document.getElementById("fileUpload").click();
  };

  const triggerFileInput2 = () => {
    document.getElementById("fileUpload2").click();
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
    const updatedMaterials = materials.map((material, i) =>
      i === index ? { ...material, [field]: value } : material
    );
    setMaterials(updatedMaterials);
  };
  return (
    <div>
      <Modal
        isOpen={logmodal}
        toggle={toggle}
        size="xl"
        className="w-full px-[100px]"
        scrollable
      >
        {page === "Log" && (
          <>
            <div className="flex items-center justify-center relative pt-[50px] mb-[70px] w-full px-10">
              <span className="text-[30px]">Logging Collection</span>
              <IoMdCloseCircle size={20} className="absolute right-20" />
            </div>
            <div className="w-full h-auto  rounded-[10px] px-[50px] py-[22px] mb-[30px] overflow-y-scroll">
              <div className="flex items-center justify-between gap-[50px]">
                <FormGroup className="flex flex-col">
                  <Label
                    for="phoneNumber"
                    className="font-normal text-[16px] mb-[10px]"
                  >
                    Name
                  </Label>
                  <div className="border-solid border-[1px] border-[#E9E9E9] w-[378px] h-[55px] rounded-[10px] flex items-center pl-[20px]">
                    <span className="text-[#8F8F8F] text-[16px]">
                      <FiSearch />
                    </span>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Search Agent Name"
                      type="emtextail"
                      className="w-[378px] h-[55px] rounded-[10px] outline-none ml-[10px]"
                    />
                  </div>
                </FormGroup>
                <FormGroup className="flex flex-col">
                  <Label
                    for="phoneNumber"
                    className="font-normal text-[16px] mb-[10px]"
                  >
                    Date of Collection
                  </Label>
                  <DatePicker className="w-[378px] h-[55px] rounded-[10px] outline-none border-[#E9E9E9]" />
                </FormGroup>
              </div>
              <div>
                {materials.map((material, index) => (
                  <div key={material.id} className="mt-[40px]">
                    {/* First Row: Material Type & Quantity */}
                    <div className="flex items-center justify-between gap-[50px]">
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
                          className="border-solid border-[1px] border-[#E9E9E9] !w-[378px] h-[55px] rounded-[10px] pl-[10px] bg-white"
                        >
                          <option value="">Select a Material Type</option>
                          {materialTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>

                      {/* Quantity */}
                      <FormGroup className="flex flex-col w-[378px]">
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
                    <div className="flex items-start justify-between gap-[50px] mt-[20px]">
                      {/* Price Per KG */}
                      <FormGroup className="flex flex-col w-[378px]">
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
                          className="border-solid border-[1px] border-[#E9E9E9] w-[378px] h-[55px] rounded-[10px] bg-white"
                        />
                      </FormGroup>

                      {/* Amount */}
                      <FormGroup className="flex flex-col w-[378px]">
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
                          className="border-solid border-[1px] border-[#E9E9E9] w-[378px] h-[55px] rounded-[10px] bg-white"
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
                          className="text-red-500 cursor-pointer mt-[25px]"
                          size={20}
                          onClick={() => removeMaterial(index)}
                        />
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-[50px] mt-[30px]">
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
                      type="emtextail"
                      className="!w-[378px] h-[55px] rounded-[10px] outline-none ml-[10px]"
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
                      placeholder=""
                      type="emtextail"
                      className="!w-[378px] h-[55px] rounded-[10px] outline-none ml-[10px]"
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
                  onClick={() => setPage("Confirm")}
                >
                  <p className="mb-0 text-white font-semibold text-[16px]">
                    Submit
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        {page === "Confirm" && (
          <>
            <div className="flex items-center justify-center relative pt-[50px] mb-[70px] w-full px-10">
              <span className="text-[30px]">Confirmation</span>
              <IoMdCloseCircle size={20} className="absolute right-20" />
            </div>
            <div className="w-full h-auto  rounded-[10px] px-[50px] py-[22px] mb-[30px] overflow-y-scroll">
              <div className="flex items-center justify-between gap-[50px] mb-[30px]">
                <FormGroup className="flex flex-col w-[378px]">
                  <Label
                    for="Name"
                    className="font-normal text-[16px] mb-[10px]"
                  >
                    Customer Name
                  </Label>
                  <Input
                    id="Name"
                    name="Name"
                    placeholder="Search Agent Name"
                    type="emtextail"
                    value="Dominoes Truger"
                    readOnly
                    className="!w-[378px] h-[55px] rounded-[10px] outline-none ml-[10px]"
                  />
                </FormGroup>
                <FormGroup className="flex flex-col w-[378px]">
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
                    type="emtextail"
                    value="IDK way, off Admonition road, Ikorodu, Lagos."
                    readOnly
                    className="!w-[378px] h-[55px] rounded-[10px] outline-none ml-[10px]"
                  />
                </FormGroup>
              </div>
              <div className="flex items-center justify-between gap-[50px]">
                <FormGroup className="flex flex-col w-[378px]">
                  <Label
                    for="Date"
                    className="font-normal text-[16px] mb-[10px]"
                  >
                    Date
                  </Label>
                  <Input
                    id="Date"
                    name="Date"
                    placeholder=""
                    type="emtextail"
                    value="24th September 2025"
                    readOnly
                    className="!w-[378px] h-[55px] rounded-[10px] outline-none ml-[10px]"
                  />
                </FormGroup>
                <FormGroup className="flex flex-col w-[378px]">
                  <Label
                    for="PET"
                    className="font-normal text-[16px] mb-[10px]"
                  >
                    PET Amount
                  </Label>
                  <Input
                    id="PET"
                    name="PET"
                    placeholder=""
                    type="emtexttextail"
                    value="50kg"
                    readOnly
                    className="!w-[378px] h-[55px] rounded-[10px] outline-none ml-[10px]"
                  />
                </FormGroup>
              </div>
              <div className="flex items-start justify-between mt-[30px] gap-[50px]">
                <div className="w-[378px]">
                  <p className="text-[16px] mb-5">Retailer&apos;s Image</p>
                  <img
                    src="/assets/recycled.png"
                    alt=""
                    className="object-cover w-[378px] h-[180px]"
                  />
                </div>
                <div className="w-[378px]">
                  <p className="text-[16px] mb-0">Staff image upload</p>
                  <p className="text-[#737373] text-[12px]">
                    Image upload is compulsory for staff
                  </p>
                  <div>
                    {/* Drag & Drop Area */}
                    <div
                      className="w-[378px] bg-[#50CA00] bg-opacity-10 h-[180px] mt-[30px] flex flex-col items-center justify-center border-2 border-dashed border-[#50CA00] cursor-pointer"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onClick={triggerFileInput}
                    >
                      <img
                        src="/assets/document-upload.png"
                        alt="Upload Icon"
                      />
                      <p className="mb-0">
                        Drag and Drop file here or{" "}
                        <span className="text-[#50CA00] underline">
                          Choose file
                        </span>
                      </p>
                      <p className="text-[12px] text-[#737373]">
                        Supported format: PNG | Max size: 10MB
                      </p>
                    </div>

                    {/* Hidden File Input */}
                    <input
                      id="fileUpload2"
                      type="file"
                      multiple
                      accept="image/png"
                      className="hidden"
                      onChange={handleFileSelect}
                    />

                    {/* Preview Uploaded Files */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {selectedFiles.map((file, index) => (
                          <img
                            key={index}
                            src={URL.createObjectURL(file)}
                            alt={`Uploaded ${index}`}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full !h-[55px] bg-[#50c100] flex items-center justify-center rounded-md mt-[70px]">
                <p className="mb-0 text-white font-semibold text-[16px]">
                  Complete
                </p>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export default LogCollectionModal;
