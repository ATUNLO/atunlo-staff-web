import { Button, Form, FormGroup, Input, Label, Spinner } from "reactstrap";
import { publicRequest } from "../../requestMehod";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate()

  const forgotPassword = async () => {
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await publicRequest.patch("/auth/reset/password/start", {
        emailaddress: email, 
      });

      setLoading(false);
      toast.success(response?.data?.message || "Password reset link sent!");
      navigate('/create-password')
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || "Failed to send reset email."
      );
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <img src="/assets/logo.png" className="mt-[40px]" />
      <h1 className="mt-[150px] text-[24px] font-medium">Forgot Password</h1>
      <p className="mt-[20px] text-[#8F8F8F]">
        We&apos;ll send your reset instructions
      </p>

      <Form className="!w-[300px] lg:w-[378px]">
        <FormGroup className="flex flex-col mt-[60px]">
          <Label htmlFor="email" className="font-normal text-[16px] mb-[10px]">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            className="border-solid border-[1px] border-[#E9E9E9] w-full h-[55px] rounded-[10px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>

        <Button
          className="w-full h-[55px] !bg-[#50CA00] text-white rounded-[10px] mt-[39px]"
          type="submit"
          disabled={loading} // ✅ Disable while loading
          onClick={forgotPassword}
        >
          {loading ? <Spinner size="sm" /> : "Reset Password"}
        </Button>
      </Form>
    </div>
  );
}

export default ForgotPassword;
