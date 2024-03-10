import axios from "axios";

export const createApiClient = () => {
  return axios.create({
    baseURL: import.meta.env["VITE_BACKEND_URL"],
  })
};
