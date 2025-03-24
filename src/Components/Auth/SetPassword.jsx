import { useState } from "react";
import { Button, Form, FormGroup, Input, Label, Spinner } from "reactstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { setNewPassword } from "../../Api/apiCalls";
import { publicRequest } from "../../requestMehod";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetSuccess } from "../../Redux/LoginSlice";

function SetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state?.user?.currentUser?.data.token);

  const setNewPAsswordStaff = async () => {
    try {
      const url = `/staff/set-password`;
      const response = await publicRequest.patch(
        url,
        { password: password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Password successfully updated!");
      setConfirmPassword("");
      dispatch(resetSuccess());
      navigate("/");
    } catch (error) {
      setError(error);
      navigate("/set-password")
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);
    setNewPAsswordStaff();
  };
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <img src="/assets/logo.png" className="mt-[40px]" alt="Logo" />
      <h1 className="mt-[150px] text-[24px] font-medium">Set Password</h1>
      <Form onSubmit={handleSubmit}>
        {/* New Password Field */}
        <FormGroup className="flex flex-col mt-[30px]">
          <Label
            htmlFor="password"
            className="font-normal text-[16px] mb-[10px]"
          >
            New Password
          </Label>
          <div className="relative w-[378px]">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="border-solid border-[1px] border-[#E9E9E9] pl-3 w-full h-[55px] rounded-[10px] pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <Label
            htmlFor="confirmPassword"
            className="font-normal text-[16px] mb-[10px]"
          >
            Confirm New Password
          </Label>
          <div className="relative w-[378px]">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className="border-solid border-[1px] border-[#E9E9E9] pl-3 w-full h-[55px] rounded-[10px] pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <FaEyeSlash size={20} />
              ) : (
                <FaEye size={20} />
              )}
            </button>
          </div>
        </FormGroup>

        {/* Error Message */}
        {error && <p className="text-red-500 text-[14px] mt-2">{error}</p>}

        {/* Submit Button */}
        <Button
          className="w-full h-[55px] !bg-[#50CA00] text-white rounded-[10px] mt-[20px]"
          type="submit"
        >
          {loading ? <Spinner /> : "Set Password"}
        </Button>
      </Form>
    </div>
  );
}

export default SetPassword;
