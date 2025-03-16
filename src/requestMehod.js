import axios from "axios";
const apiKey = import.meta.env.VITE_API_KEY;
const version = import.meta.env.VITE_VERSION;


const BASE_URL = import.meta.env.VITE_STAFF_WEB_BASE_URL;

console.log(BASE_URL, apiKey, version)

export const publicRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": apiKey,  
    "version": version,  
  },
});
