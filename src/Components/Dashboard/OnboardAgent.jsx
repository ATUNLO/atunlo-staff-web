import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { useState } from "react";
import { FaSquarePlus, FaTrash } from "react-icons/fa6";

const statesOfNigeria = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const banks = ["Access Bank", "First Bank", "GT Bank"];
const materialTypes = ["PET", "PP", "PE", "Metal", "Paper"];

function OnboardAgent() {
  const [selectedState, setSelectedState] = useState("");
  const [materials, setMaterials] = useState([{ id: 1, type: "", price: "" }]);

  const addMaterial = () => {
    setMaterials([
      ...materials,
      { id: materials.length + 1, type: "", price: "" },
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
        <h1 className="text-[20px] font-medium mb-[30px]">Onboard Agents</h1>
        <div className="w-full flex items-center justify-start h-auto border-solid border-[1px] border-[#E9E9E9] rounded-[10px]  py-[55px] mb-[30px]">
          <Form className="w-full flex flex-col items-center justify-start mt-[55px]">
            <div className="flex items-center justify-center gap-[50px]">
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
                  className="border-solid border-[1px] border-[#E9E9E9] !w-[428px] h-[55px] rounded-[10px]"
                />
              </FormGroup>
              <FormGroup className="flex flex-col mb-0">
                <Label
                  for="phoneNumber"
                  className="font-normal text-[16px] mb-[10px]"
                >
                  Phone Number
                </Label>
                <div className="border-solid border-[1px] border-[#E9E9E9] !w-[428px] h-[55px] rounded-[10px] flex items-center pl-[20px]">
                  <span className="text-[#8F8F8F] text-[16px]">+234</span>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder=""
                    type="emtextail"
                    className="!w-[428px] h-[55px] rounded-[10px] outline-none ml-[10px]"
                  />
                </div>
              </FormGroup>
            </div>
            <div className="flex items-center justify-center gap-[50px] mt-[40px]">
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
                  className="border-solid border-[1px] border-[#E9E9E9] !w-[428px] h-[55px] rounded-[10px]"
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
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="border-solid border-[1px] border-[#E9E9E9] !w-[428px] h-[55px] rounded-[10px] flex items-center pl-[20px]"
                >
                  <option value="">Select a State</option>
                  {statesOfNigeria.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </div>
            <div className="flex items-center justify-center gap-[50px] mt-[40px]">
              <FormGroup className="flex flex-col ">
                <Label
                  htmlFor="BankName"
                  className="font-normal text-[16px] mb-[10px]"
                >
                  Bank Name
                </Label>
                <Input
                  id="BankName"
                  name="BankName"
                  type="select"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="border-solid border-[1px] border-[#E9E9E9] !w-[428px] h-[55px] rounded-[10px] pl-[10px]"
                >
                  <option value="">Select a Bank</option>
                  {banks.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup className="flex flex-col">
                <Label
                  for="AccountNumber"
                  className="font-normal text-[16px] mb-[10px]"
                >
                  Account Number
                </Label>
                <Input
                  id="AccountNumber"
                  name="AccountNumber"
                  placeholder=""
                  type="text"
                  className="border-solid border-[1px] border-[#E9E9E9] !w-[428px] h-[55px] rounded-[10px]"
                />
              </FormGroup>
            </div>

            <div className="bg-[#F3F3F3] w-full min-h-[150px] flex flex-col items-center justify-center gap-[20px] mt-[40px] px-[20px] py-[30px]">
              {materials.map((material, index) => (
                <div
                  key={material.id}
                  className="flex items-center justify-center gap-[50px]"
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
                      className="border-solid border-[1px] border-[#E9E9E9] !w-[428px] h-[55px] rounded-[10px] pl-[10px] bg-white"
                    >
                      <option value="">Select a Material Type</option>
                      {materialTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>

                  {/* Price Per KG + Trash Icon */}
                  <div className="flex items-center gap-[10px]">
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
                        className="border-solid border-[1px] border-[#E9E9E9] !w-[428px] h-[55px] rounded-[10px] bg-white"
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
            <Button className="!w-[50%] mt-[60px] bg-[#50cA00] h-[55px] text-white rounded-[10px]">
              Onboard
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default OnboardAgent;
