import axios from "axios";

const BASE_URL = import.meta.env.VITE_STAFF_WEB_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const VERSION = import.meta.env.VITE_VERSION;

// Axios instance with default headers
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    version: VERSION,
  },
});

// Function to set password
export const setNewPassword = async (password) => {
  try {
    const response = await api.post("/staff/set-password", { password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Something went wrong";
  }
};
