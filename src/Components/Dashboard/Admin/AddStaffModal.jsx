import React, { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { FormGroup, Label, Modal, Input, ModalBody, Spinner } from "reactstrap";
import { publicRequest } from "../../../requestMehod";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function AddStaffModal({ toggleAddStaff, addStaffmodal,getStaff }) {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const token = useSelector((state) => state?.user?.currentUser?.data.token);

  const staffData = {
    emailaddress: email,
    name: fullName,
    phone: phone,
  };

  const addStaff = async (token, staffData) => {
    setLoading(true);
    try {
      const url = `/admin/add/staff`;
      const response = await publicRequest.post(url, staffData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);
      toast.success(response?.data?.message);
      toggleAddStaff()
      getStaff();
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to add staff.");
      throw error;
    }
  };
  return (
    <Modal
      isOpen={addStaffmodal}
      toggle={toggleAddStaff}
      size="xl"
      className="w-full px-[100px] py-[50px]"
      scrollable
    >
      <ModalBody className="flex flex-col items-center justify-center">
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
                  onChange={(e) => setFullName(e.target.value)}
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
                  onChange={(e) => setPhone(e.target.value)}
                  className="!w-[311px] h-[55px] rounded-[10px] outline-none ml-[10px]"
                  maxlength={14}
                />
              </FormGroup>
            </div>

            {/* Column 2: Email Address */}
            <div>
              <FormGroup className="flex flex-col">
                <Label
                  for="email"
                  className="font-normal text-[16px] mb-[10px]"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  placeholder=""
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="!w-[311px] h-[55px] rounded-[10px] outline-none ml-[10px]"
                />
              </FormGroup>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-[300px] !h-[55px] bg-[#50c100] flex items-center justify-center rounded-md mt-[70px] mb-[50px]" onClick={() => addStaff(token,staffData)}>
              <p className="mb-0 text-white font-semibold text-[16px]">
                {loading ? <Spinner /> : "Add Staff"}
              </p>
            </div>
          </div>
        </>
      </ModalBody>
    </Modal>
  );
}

export default AddStaffModal;
