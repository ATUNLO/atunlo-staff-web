import { useState } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function CreatePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <img src="/assets/logo.png" className="mt-[40px]" alt="Logo" />
      <h1 className="mt-[150px] text-[24px] font-medium">
        Create New Password
      </h1>
      <Form>
        {/* New Password Field */}
        <FormGroup className="flex flex-col mt-[30px]">
          <Label htmlFor="password" className="font-normal text-[16px] mb-[10px]">
            New Password
          </Label>
          <div className="relative w-[378px]">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="border-solid border-[1px] border-[#E9E9E9] pl-3 w-full h-[55px] rounded-[10px] pr-10"
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        </FormGroup>

        {/* Confirm New Password Field */}
        <FormGroup className="flex flex-col mt-[30px]">
          <Label htmlFor="confirmPassword" className="font-normal text-[16px] mb-[10px]">
            Confirm New Password
          </Label>
          <div className="relative w-[378px]">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className="border-solid border-[1px] border-[#E9E9E9] pl-3 w-full h-[55px] rounded-[10px] pr-10"
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        </FormGroup>

        {/* Submit Button */}
        <Button
          className="w-full h-[55px] !bg-[#50CA00] text-white rounded-[10px] mt-[39px]"
          type="submit"
        >
          Create New Password
        </Button>
      </Form>
    </div>
  );
}

export default CreatePassword;
