import { Button, Form, FormGroup, Input, Label } from "reactstrap";

function ForgotPassword() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <img src="/assets/logo.png" className="mt-[40px]" />
      <h1 className="mt-[150px] text-[24px] font-medium">
        Forgot Password
      </h1>
      <p className="mt-[20px] text-[#8F8F8F]">We&apos;ll send your reset instructions</p>
      <Form>
          <FormGroup className="flex flex-col mt-[60px]">
            <Label for="email" className="font-normal text-[16px] mb-[10px]">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              placeholder=""
              type="email"
              className="border-solid border-[1px] border-[#E9E9E9] w-[378px] h-[55px] rounded-[10px]"
            />
          </FormGroup>
          <Button
            className="w-full h-[55px] bg-[#50CA00] text-white rounded-[10px] mt-[39px]"
            type="submit"
          >
            Reset Password
          </Button>
        </Form>
    </div>
  )
}

export default ForgotPassword
