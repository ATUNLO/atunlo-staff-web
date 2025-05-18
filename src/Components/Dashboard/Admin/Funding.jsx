import React, { useState, useEffect } from "react";
import { publicRequest } from "../../../requestMehod";
import { useSelector } from "react-redux";
import { FormGroup, Input, Label, Spinner } from "reactstrap";
import Select from "react-select";
import { toast } from "react-toastify"; // if not already imported

function Funding() {
  const [staff, setStaffs] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 500;
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state?.user?.currentUser?.data.token);

  const getStaff = async () => {
    try {
      const response = await publicRequest.get(
        `/admin/list/staff?type=staff&page=${currentPage}&size=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data?.data?.result;
      setStaffs(data);
    } catch (error) {
      console.log(error);
    }
  };

  
  console.log("email",email)
  console.log('amount', amount)

  const handleSubmit = async () => {
    const selectedEmail = selectedStaff?.value;
  
    if (!selectedEmail || !amount) {
      toast.error("Please select a staff and enter an amount.");
      return;
    }
  
    const fundData = {
      emailaddress: selectedEmail,
      amount: parseFloat(amount),
    };
  
    setLoading(true);
    try {
      const url = `/admin/fund/staff`;
      const response = await publicRequest.patch(url, fundData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response?.status === 200) {
        toast.success(response?.data?.message || "Staff funded successfully!");
        setAmount("");
        setSelectedStaff(null);
      } else {
        toast.error("Funding failed. Try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fund staff.");
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    getStaff();
  }, []);

  return (
    <div className="px-[30px] py-[40px] w-full">
      <div className="flex flex-col">
        <h1 className="text-[20px] font-medium mb-[30px]">Fund Staffs</h1>
        <div className="w-full h-auto lg:h-[446px] border-solid border-[1px] border-[#E9E9E9] rounded-[10px] px-[30px] py-[22px] mb-[30px]">
          <h6>Fund Staff</h6>
          <div className="flex flex-col lg:flex-row items-center justify-start lg:gap-[100px] mt-5">
            {/* Staff Select */}
            <FormGroup className="flex flex-col mb-[20px] lg:mb-0">
              <Label
                htmlFor="staffSelect"
                className="font-normal text-[16px] mb-[10px]"
              >
                Staff Name
              </Label>
              <Select
                id="staffSelect"
                name="staffSelect"
                options={staff.map((member) => ({
                  value: member.emailaddress,
                  label: member.name,
                }))}
                value={selectedStaff}
                onChange={(selectedOption) => {
                    setSelectedStaff(selectedOption);
                    setEmail(selectedOption?.value || "");
                  }}
                isSearchable
                isClearable
                className="border-solid border-[1px] border-[#E9E9E9] !w-[310px] lg:w-[390px] !h-[55px] rounded-[10px]"
              />
            </FormGroup>

            {/* Amount Input */}
            <FormGroup className="flex flex-col">
              <Label
                htmlFor="amount"
                className="font-normal text-[16px] mb-[10px]"
              >
                Amount
              </Label>
              <Input
                type="number"
                id="amount"
                name="amount"
                value={amount} // you may want to rename `email` to something like `amount`
                onChange={(e) => setAmount(e.target.value)} // or use setAmount if you rename it
                placeholder="Enter amount"
                className="border-solid border-[1px] border-[#E9E9E9] w-[310px] lg:w-[390px] h-[55px] rounded-[10px] px-[10px]"
              />
            </FormGroup>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 bg-[#50c100] text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? <Spinner size="sm" />  : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Funding;
