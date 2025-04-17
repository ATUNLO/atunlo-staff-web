import { useState } from "react";
import { Button, Form, FormGroup, Input, Label, Spinner } from "reactstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { publicRequest } from "../../requestMehod"; // Import API request instance
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CreatePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await publicRequest.patch("/auth/reset/password/complete", {
        password,
        token,
      });

      toast.success(response?.data?.message || "Password reset successful!");
      navigate("/"); // Redirect to home page after success
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <img src="/assets/logo.png" className="mt-[40px]" alt="Logo" />
      <h1 className="mt-[100px] text-[24px] font-medium">Create New Password</h1>

      <Form onSubmit={handleSubmit}>
        {/* Token Field */}
        <FormGroup className="flex flex-col mt-[30px]">
          <Label htmlFor="token" className="font-normal text-[16px] mb-[10px]">Token</Label>
          <Input
            id="token"
            name="token"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="border-solid border-[1px] border-[#E9E9E9] pl-3 !w-[300px]] h-[55px] rounded-[10px]"
          />
        </FormGroup>

        {/* New Password Field */}
        <FormGroup className="flex flex-col mt-[30px]">
          <Label htmlFor="password" className="font-normal text-[16px] mb-[10px]">New Password</Label>
          <div className="relative !w-[300px]">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-solid border-[1px] border-[#E9E9E9] pl-3 !w-[300px] h-[55px] rounded-[10px] pr-10"
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
          <Label htmlFor="confirmPassword" className="font-normal text-[16px] mb-[10px]">Confirm New Password</Label>
          <div className="relative !w-[300px]">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          className="w-full h-[55px] !bg-[#50CA00] text-white rounded-[10px] mt-[30px]"
          type="submit"
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : "Create New Password"}
        </Button>

        {/* Back Button */}
        <Button
          className="w-full h-[55px] !bg-gray-400 text-white rounded-[10px] mt-[15px] mb-[30px]"
          type="button"
          onClick={() => navigate("/forgot-password")}
        >
          Go Back
        </Button>
      </Form>
    </div>
  );
}

export default CreatePassword;
