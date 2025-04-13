import { publicRequest } from "../requestMehod";
import { loginStart,loginSuccess,LoginFailure } from "./LoginSlice";

export const loginStaff = async (dispatch, data) => {
    dispatch(loginStart());
    try {
      const res = await publicRequest.post("/staff/login", data);
      dispatch(loginSuccess(res.data));
    } catch (error) {
      dispatch(LoginFailure(error?.data))
      window.localStorage.setItem("error", error)
      
      throw error
    }
  };

  export const loginAdmin = async (dispatch, data) => {
    dispatch(loginStart());
    try {
      const res = await publicRequest.post("/admin/login", data);
      dispatch(loginSuccess(res.data));
    } catch (error) {
      dispatch(LoginFailure(error?.data))
      window.localStorage.setItem("error", error)
      
      throw error
    }
  };