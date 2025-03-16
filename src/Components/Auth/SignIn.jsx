import { Link, useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label, Spinner } from "reactstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../Redux/apiCalls";

function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [emailaddress, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user);
    const { success, isFetching, error } = user;

    const handleSignIn = async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        await login(dispatch, { emailaddress, password });
        if (success) {
          navigate("/dashboard");
        }
        setLoading(false);
      } catch (error) {
        setLoginError(error?.response?.data?.errors[0]?.message);
        setLoading(false);
      }
    };

    useEffect(() => {
      if (success) {
        navigate("/dashboard");
      }
    }, [navigate, success]);
  return (
    <div className="w-full flex flex-col items-center justify-center py-10">
      <img src="/assets/logo.png" className="mt-[40px]" />
      <h1 className="mt-[50px] text-[24px] font-medium">
        Login to your account
      </h1>
      <div>
        <Form>
          <FormGroup className="flex flex-col mt-[30px]">
            <Label for="email" className="font-normal text-[16px]">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              placeholder=""
              type="email"
              className="border-solid border-[1px] border-[#E9E9E9] w-[378px] h-[55px] rounded-[10px]"
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup className="flex flex-col mt-[30px]">
      <Label htmlFor="password" className="font-normal text-[16px]">
        Password
      </Label>
      <div className="relative w-[378px]">
        <Input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          className="border-solid border-[1px] border-[#E9E9E9] w-full pl-3 h-[55px] rounded-[10px] pr-10"
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
          <div className="flex items-end justify-end">
            <Link to='/forgot-password' className="text-[#50CA00] font-normal">Forgot Password?</Link>
          </div>
          <Button
            className="w-full h-[55px] !bg-[#50CA00] text-white rounded-[10px] mt-[50px]"
            type="submit"
            onClick={handleSignIn}
          >
            {loading ? <Spinner size='sm'/> : "Login"}
          </Button>
          <div className="flex items-center justify-center">
            <p className="text-[14px] mt-[20px]">Don&apos;t have an account? Contact admin</p>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default SignIn;
