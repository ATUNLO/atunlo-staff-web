import { FormGroup, Input, Label } from "reactstrap";
import { FiSearch } from "react-icons/fi";
import { DatePicker } from "@mui/x-date-pickers";
import { FaTrash } from "react-icons/fa";
import { materialTypes } from "../../utils/dataset";
import { useState } from "react";
import { FaSquarePlus } from "react-icons/fa6";

function LogCollection() {
  const [materials, setMaterials] = useState([
    { id: 1, type: "", price: "", quantity: "", amount: "" },
  ]);

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
    <div className="px-[30px] py-[40px] w-full">
      <div className="flex flex-col">
        <h1 className="text-[20px] font-medium mb-[30px]">Log a Collection</h1>
        <div className="flex gap-[20px] mb-[40px]">
          <span className="w-[125px] h-[55px] bg-[#50CA00] rounded-[10px] flex items-center justify-center text-white">
            Agents
          </span>
          <span className="w-[125px] h-[55px] bg-[#EDEDED] rounded-[10px] flex items-center justify-center">
            Retailers
          </span>
        </div>
        <div className="w-full h-auto border-solid border-[1px] border-[#E9E9E9] rounded-[10px] px-[30px] py-[22px] mb-[30px]">
          <div className="flex items-center justify-center gap-[50px]">
            <FormGroup className="flex flex-col">
              <Label
                for="phoneNumber"
                className="font-normal text-[16px] mb-[10px]"
              >
                Name
              </Label>
              <div className="border-solid border-[1px] border-[#E9E9E9] w-[428px] h-[55px] rounded-[10px] flex items-center pl-[20px]">
                <span className="text-[#8F8F8F] text-[16px]">
                  <FiSearch />
                </span>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Search Agent Name"
                  type="emtextail"
                  className="w-[428px] h-[55px] rounded-[10px] outline-none ml-[10px]"
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
              <DatePicker className="w-[428px] h-[55px] rounded-[10px] outline-none border-[#E9E9E9]" />
            </FormGroup>
          </div>
          <div>
            {materials.map((material, index) => (
              <div key={material.id} className="mt-[40px]">
                {/* First Row: Material Type & Quantity */}
                <div className="flex items-center justify-center gap-[50px]">
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
                      className="border-solid border-[1px] border-[#E9E9E9] w-[428px] h-[55px] rounded-[10px] pl-[10px] bg-white"
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
                  <FormGroup className="flex flex-col">
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
                        handleMaterialChange(index, "quantity", e.target.value)
                      }
                      className="border-solid border-[1px] border-[#E9E9E9] w-[428px] h-[55px] rounded-[10px] bg-white"
                    />
                  </FormGroup>
                </div>

                {/* Second Row: Price Per KG & Amount + Trash Icon */}
                <div className="flex items-center justify-center gap-[50px] mt-[20px]">
                  {/* Price Per KG */}
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
                      className="border-solid border-[1px] border-[#E9E9E9] w-[428px] h-[55px] rounded-[10px] bg-white"
                    />
                  </FormGroup>

                  {/* Amount */}
                  <FormGroup className="flex flex-col">
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
                        handleMaterialChange(index, "amount", e.target.value)
                      }
                      className="border-solid border-[1px] border-[#E9E9E9] w-[428px] h-[55px] rounded-[10px] bg-white"
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
              <FaSquarePlus className="fill-[#50CA00] w-[20px] h-[20px]" />
              <p className="font-medium text-[14px] text-[#50CA00]">
                Add Material
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogCollection;
