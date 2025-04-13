import React, { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { FormGroup, Label, Modal, Input } from "reactstrap";

function AddStaffModal({toggleAddStaff, addStaffmodal}) {
  const [loading, setLoading] = useState(false);
  return (
    <Modal
      isOpen={addStaffmodal}
      toggle={toggleAddStaff}
      size="xl"
      className="w-full px-[100px] py-[50px]"
      scrollable
    >
      <>
        <div className="flex items-center justify-center relative pt-[50px] mb-[70px] w-full px-10">
          <span className="text-[30px]">Add Staff</span>
          <IoMdCloseCircle
            size={20}
            className="absolute right-20"
            onClick={() => toggleAddStaff()}
          />
        </div>
        <div className="flex items-start justify-start gap-[50px] mt-[30px] mx-auto">
          {/* Column 1: Full Name & Phone Number */}
          <div className="flex flex-col gap-[30px]">
            <FormGroup className="flex flex-col">
              <Label
                for="full_name"
                className="font-normal text-[16px] mb-[10px]"
              >
                Full Name
              </Label>
              <Input
                id="full_name"
                name="full_name"
                placeholder=""
                type="text"
                className="!w-[311px] h-[55px] rounded-[10px] outline-none ml-[10px]"
              />
            </FormGroup>

            <FormGroup className="flex flex-col">
              <Label
                for="phone_number"
                className="font-normal text-[16px] mb-[10px]"
              >
                Phone Number
              </Label>
              <Input
                id="phone_number"
                name="phone_number"
                placeholder=""
                type="text"
                className="!w-[311px] h-[55px] rounded-[10px] outline-none ml-[10px]"
              />
            </FormGroup>
          </div>

          {/* Column 2: Email Address */}
          <div>
            <FormGroup className="flex flex-col">
              <Label for="email" className="font-normal text-[16px] mb-[10px]">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                placeholder=""
                type="email"
                className="!w-[311px] h-[55px] rounded-[10px] outline-none ml-[10px]"
              />
            </FormGroup>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-[80%] !h-[55px] bg-[#50c100] flex items-center justify-center rounded-md mt-[70px] mb-[50px]">
            <p className="mb-0 text-white font-semibold text-[16px]">
              {loading ? <Spinner /> : "Add Staff"}
            </p>
          </div>
        </div>
      </>
    </Modal>
  );
}

export default AddStaffModal;
