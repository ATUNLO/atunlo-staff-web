import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";

function RetailDetails() {
  return (
    <div className="px-[30px] py-[40px] w-full">
      <div className="flex flex-col">
        <div className="flex items-center h-[60px] justify-start gap-5">
          <Link to="/log-collection" className="text-black no-underline">
            <div className="w-[88px] h-[40px] flex items-center justify-center gap-1 border-[1px] border-solid border-[#E9E9E9] rounded-md">
              <BiArrowBack />
              <p className="mb-0">Back</p>
            </div>
          </Link>
          <h4>Dominos Trigger</h4>
        </div>
        <div className="w-full h-[1px] bg-[#e9e9e9] mt-[20px]"></div>
      </div>
    </div>
  );
}

export default RetailDetails;
